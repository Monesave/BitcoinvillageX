import { Request, Response, NextFunction } from 'express';
import { lightningService } from '../services/lightning.service';
import { supabase } from '../services/supabase';
import { AppError } from '@bitcoinvillagex/shared';

// Create Lightning invoice
export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { amountSats, memo, correlationId } = req.body;

    // Create invoice via Lightning service (uses Strike API)
    const invoice = await lightningService.createInvoice(amountSats, memo, correlationId);

    // Store invoice in database for tracking
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id: req.user.id,
        transaction_type: 'deposit',
        amount_sats: amountSats,
        commission_sats: 0,
        net_amount_sats: amountSats,
        status: 'pending',
        lightning_invoice: invoice.invoice,
        lightning_payment_hash: invoice.paymentHash,
        description: memo || 'Lightning invoice payment',
        metadata: {
          strike_invoice_id: invoice.invoiceId,
          amount_usd: invoice.amountUsd,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing transaction:', error);
      // Continue even if database storage fails
    }

    res.json({
      success: true,
      data: {
        invoice: invoice.invoice, // Lightning invoice (lnbc...)
        invoiceId: invoice.invoiceId, // Strike invoice ID
        paymentHash: invoice.paymentHash,
        amountSats,
        amountUsd: invoice.amountUsd,
        expiry: invoice.expiry,
        transactionId: transaction?.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Check invoice status
export const checkInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { paymentHash } = req.params;

    // Find transaction by payment hash to get Strike invoice ID
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('lightning_payment_hash', paymentHash)
      .eq('user_id', req.user.id)
      .single();

    if (!transaction || !transaction.metadata?.strike_invoice_id) {
      throw new AppError('Transaction not found', 404, 'TRANSACTION_NOT_FOUND');
    }

    // Check status via Lightning service (Strike API)
    const status = await lightningService.checkInvoiceStatus(transaction.metadata.strike_invoice_id);

    // Update transaction status if paid
    if (status.settled) {

      if (transaction && transaction.status === 'pending') {
        // Update transaction status
        await supabase
          .from('transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', transaction.id);

        // Update wallet balance (handled by trigger, but we can verify)
        const { data: wallet } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', req.user.id)
          .single();

        if (wallet) {
          await supabase
            .from('wallets')
            .update({
              balance_sats: wallet.balance_sats + transaction.amount_sats,
            })
            .eq('user_id', req.user.id);
        }
      }
    }

    res.json({
      success: true,
      data: {
        settled: status.settled,
        state: status.state,
        invoiceId: status.invoiceId,
        amountPaidSats: status.amountPaidSats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Pay Lightning invoice
export const payInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { paymentRequest } = req.body;

    // Decode invoice to get amount
    const decoded = await lightningService.decodeInvoice(paymentRequest);
    const amountSats = decoded.amountSats;

    // Check user has sufficient balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (!wallet || wallet.balance_sats < amountSats) {
      throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    // Note: Users pay invoices directly from their Lightning wallets
    // This endpoint is for tracking payment intents
    // The actual payment happens when user scans/pays the invoice

    res.json({
      success: true,
      message: 'Payment initiated. Please pay the invoice using your Lightning wallet.',
      data: {
        paymentRequest,
        amountSats,
        description: decoded.description,
        paymentHash: decoded.paymentHash,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Decode Lightning invoice
export const decodeInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { paymentRequest } = req.body;

    const decoded = await lightningService.decodeInvoice(paymentRequest);

    res.json({
      success: true,
      data: {
        amountSats: parseInt(decoded.num_satoshis),
        description: decoded.description,
        paymentHash: decoded.payment_hash,
        expiry: parseInt(decoded.expiry),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Withdraw funds
export const withdraw = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
    }

    const { amountSats, lightningAddress, walletType } = req.body;

    if (!amountSats || amountSats <= 0) {
      throw new AppError('Invalid amount', 400, 'VALIDATION_ERROR');
    }

    // Check user has sufficient balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (!wallet || wallet.balance_sats < amountSats) {
      throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
    }

    // For now, we'll create a transaction record
    // Actual withdrawal would be handled by the Lightning service or external wallet API
    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        user_id: req.user.id,
        transaction_type: 'withdrawal',
        amount_sats: amountSats,
        commission_sats: 0,
        net_amount_sats: amountSats,
        status: 'pending',
        description: `Withdrawal to ${walletType || 'external wallet'}`,
        metadata: {
          lightning_address: lightningAddress,
          wallet_type: walletType,
        },
      })
      .select()
      .single();

    // Update wallet balance
    await supabase
      .from('wallets')
      .update({
        balance_sats: wallet.balance_sats - amountSats,
        total_spent_sats: wallet.total_spent_sats + amountSats,
      })
      .eq('user_id', req.user.id);

    res.json({
      success: true,
      message: 'Withdrawal initiated',
      data: {
        transactionId: transaction?.id,
        amountSats,
      },
    });
  } catch (error) {
    next(error);
  }
};


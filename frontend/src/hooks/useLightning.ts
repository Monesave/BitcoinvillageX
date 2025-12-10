import { useState, useCallback } from 'react';
import { lightningAPI, type LightningInvoice, type InvoiceStatus } from '../services/lightning';

export const useLightning = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = useCallback(async (
    amountSats: number,
    memo?: string,
    correlationId?: string
  ): Promise<LightningInvoice | null> => {
    setLoading(true);
    setError(null);
    try {
      const invoice = await lightningAPI.createInvoice(amountSats, memo, correlationId);
      return invoice;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkInvoiceStatus = useCallback(async (
    paymentHash: string
  ): Promise<InvoiceStatus | null> => {
    setLoading(true);
    setError(null);
    try {
      const status = await lightningAPI.checkInvoiceStatus(paymentHash);
      return status;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to check invoice status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const payInvoice = useCallback(async (
    paymentRequest: string
  ): Promise<{ paymentHash: string; transactionId?: string } | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await lightningAPI.payInvoice(paymentRequest);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to pay invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const decodeInvoice = useCallback(async (
    paymentRequest: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const decoded = await lightningAPI.decodeInvoice(paymentRequest);
      return decoded;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to decode invoice');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const withdraw = useCallback(async (
    amountSats: number,
    lightningAddress?: string,
    walletType?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await lightningAPI.withdraw(amountSats, lightningAddress, walletType);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to withdraw');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createInvoice,
    checkInvoiceStatus,
    payInvoice,
    decodeInvoice,
    withdraw,
    loading,
    error,
  };
};


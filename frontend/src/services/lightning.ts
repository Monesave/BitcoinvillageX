import api from './api';

export interface LightningInvoice {
  invoice: string; // Lightning invoice (lnbc...)
  invoiceId: string; // Strike invoice ID
  paymentHash: string;
  amountSats: number;
  amountUsd: number;
  expiry: string;
  transactionId?: string;
}

export interface InvoiceStatus {
  settled: boolean;
  state: 'UNPAID' | 'PAID' | 'CANCELLED';
  invoiceId: string;
  amountPaidSats?: number;
}

export interface DecodedInvoice {
  amountSats: number;
  description: string;
  paymentHash: string;
  expiry: number;
}

export const lightningAPI = {
  /**
   * Create a Lightning invoice (via Strike API)
   */
  createInvoice: async (amountSats: number, memo?: string, correlationId?: string): Promise<LightningInvoice> => {
    const response = await api.post('/payments/lightning/invoice', {
      amountSats,
      memo,
      correlationId,
    });
    return response.data.data;
  },

  /**
   * Check invoice payment status
   */
  checkInvoiceStatus: async (paymentHash: string): Promise<InvoiceStatus> => {
    const response = await api.get(`/payments/lightning/invoice/${paymentHash}`);
    return response.data.data;
  },

  /**
   * Pay a Lightning invoice
   */
  payInvoice: async (paymentRequest: string): Promise<{ paymentHash: string; transactionId?: string }> => {
    const response = await api.post('/payments/lightning/pay', {
      paymentRequest,
    });
    return response.data.data;
  },

  /**
   * Decode a Lightning invoice
   */
  decodeInvoice: async (paymentRequest: string): Promise<DecodedInvoice> => {
    const response = await api.post('/payments/lightning/decode', {
      paymentRequest,
    });
    return response.data.data;
  },

  /**
   * Withdraw funds
   */
  withdraw: async (amountSats: number, lightningAddress?: string, walletType?: string) => {
    const response = await api.post('/payments/withdraw', {
      amountSats,
      lightningAddress,
      walletType,
    });
    return response.data.data;
  },
};


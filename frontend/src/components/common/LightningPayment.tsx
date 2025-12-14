import { useState, useEffect } from 'react';
import { useLightning } from '../../hooks/useLightning';
import { formatSats } from '@shared/utils';

interface LightningPaymentProps {
  amountSats: number;
  memo?: string;
  onSuccess?: (paymentHash: string) => void;
  onError?: (error: string) => void;
}

const LightningPayment = ({ amountSats, memo, onSuccess, onError }: LightningPaymentProps) => {
  const { createInvoice, checkInvoiceStatus, loading, error } = useLightning();
  const [invoice, setInvoice] = useState<string | null>(null);
  const [paymentHash, setPaymentHash] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    if (paymentHash && !isPaid) {
      // Poll for payment status
      const interval = setInterval(async () => {
        setCheckingStatus(true);
        const status = await checkInvoiceStatus(paymentHash);
        if (status?.settled) {
          setIsPaid(true);
          clearInterval(interval);
          onSuccess?.(paymentHash);
        }
        setCheckingStatus(false);
      }, 3000); // Check every 3 seconds

      return () => clearInterval(interval);
    }
  }, [paymentHash, isPaid, checkInvoiceStatus, onSuccess]);

  const handleCreateInvoice = async () => {
    const result = await createInvoice(amountSats, memo);
    if (result) {
      setInvoice(result.invoice);
      setPaymentHash(result.paymentHash);
    } else {
      onError?.(error || 'Failed to create invoice');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Invoice copied to clipboard!');
  };

  if (isPaid) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-green-800 font-semibold">Payment confirmed!</p>
        </div>
      </div>
    );
  }

  if (invoice) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Pay with Lightning</h3>
        <p className="text-gray-600 mb-4">
          Amount: <span className="font-semibold">{formatSats(amountSats)}</span>
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lightning Invoice
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={invoice}
              readOnly
              className="input flex-1 font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(invoice)}
              className="btn btn-secondary"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>How to pay:</strong>
          </p>
          <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
            <li>Copy the invoice above</li>
            <li>Open your Lightning wallet (Strike, Orukka, etc.)</li>
            <li>Paste the invoice and confirm payment</li>
            <li>Payment will be confirmed automatically</li>
          </ol>
        </div>

        {checkingStatus && (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bitcoin"></div>
            <span className="text-sm">Waiting for payment confirmation...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Pay with Lightning</h3>
      <p className="text-gray-600 mb-4">
        Amount: <span className="font-semibold">{formatSats(amountSats)}</span>
      </p>
      
      <button
        onClick={handleCreateInvoice}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Creating Invoice...' : 'Generate Lightning Invoice'}
      </button>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default LightningPayment;


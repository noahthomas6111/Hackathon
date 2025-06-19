import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface UPIPaymentProps {
  amount: number;
  upiId: string;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UPIPayment({ amount, upiId, description, onSuccess, onCancel }: UPIPaymentProps) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=Creator&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Pay with UPI</h3>
      
      <div className="flex justify-center mb-4">
        <QRCodeSVG value={upiUrl} size={200} />
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-600">Scan with any UPI app to pay</p>
        <p className="font-semibold text-lg">₹{amount}</p>
      </div>

      <div className="space-y-2">
        <a
          href={upiUrl}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            setTimeout(() => {
              // In a real app, we would verify the payment status
              onSuccess();
            }, 2000);
          }}
        >
          Pay Now
        </a>
        <button
          onClick={onCancel}
          className="block w-full border border-gray-300 text-gray-700 text-center py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
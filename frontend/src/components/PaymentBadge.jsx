import React from 'react';

export default function PaymentBadge({ paymentStatus }) {
  // Color coding per requirements: Unpaid (red), Partial (amber), Paid (green)
  const styles = {
    Unpaid: 'bg-red-500 text-white',
    Partial: 'bg-amber-500 text-white',
    Paid: 'bg-emerald-600 text-white',
  };

  const badgeStyle = styles[paymentStatus] || 'bg-gray-500 text-white';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}>
      {paymentStatus}
    </span>
  );
}
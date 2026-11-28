import React from 'react';

export default function PaymentBadge({ paymentStatus }) {
  const styles = {
    Paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Partial: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Unpaid: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[paymentStatus] || styles.Unpaid}`}>
      {paymentStatus || 'Unpaid'}
    </span>
  );
}

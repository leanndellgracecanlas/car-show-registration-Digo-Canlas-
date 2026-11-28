import React from 'react';
import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';

export default function RegistrationTable({ items, loading }) {
  const formatPhp = (val) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-400 font-medium animate-pulse">
        Loading registrations...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400 font-medium">
        No registrations match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-stone-300">
        <thead className="text-xs uppercase bg-stone-900/90 text-stone-400 border-b border-stone-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Reg. No.</th>
            <th className="py-3.5 px-4 font-semibold">Date</th>
            <th className="py-3.5 px-4 font-semibold">Participant</th>
            <th className="py-3.5 px-4 font-semibold">Car</th>
            <th className="py-3.5 px-4 font-semibold">Type</th>
            <th className="py-3.5 px-4 font-semibold">Status</th>
            <th className="py-3.5 px-4 font-semibold text-right">Fee / Paid</th>
            <th className="py-3.5 px-4 font-semibold text-center">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800/60">
          {items.map((row) => (
            <tr key={row.id} className="hover:bg-stone-800/40 transition-colors">
              <td className="py-3 px-4 font-mono text-emerald-400 font-medium">
                {row.registrationNumber}
              </td>
              <td className="py-3 px-4 text-stone-400 text-xs">{formatDate(row.registrationDate)}</td>
              <td className="py-3 px-4">
                <div className="font-semibold text-stone-100">{row.participantName}</div>
                <div className="text-xs text-stone-400">{row.contactNumber || row.email}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-stone-200">{row.carMakeModel}</div>
                <div className="text-xs font-mono text-stone-400">{row.plateNumber}</div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2.5 py-1 bg-stone-800 rounded-full text-xs text-stone-300 border border-stone-700">
                  {row.registrationType}
                </span>
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={row.status} />
              </td>
              <td className="py-3 px-4 text-right font-mono">
                <div className="text-stone-200">{formatPhp(row.registrationFee)}</div>
                <div className="text-xs text-stone-400">{formatPhp(row.amountPaid)}</div>
              </td>
              <td className="py-3 px-4 text-center">
                <PaymentBadge paymentStatus={row.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

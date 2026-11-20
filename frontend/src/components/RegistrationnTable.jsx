import React from 'react';
import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';

export default function RegistrationTable({ items = [] }) {
  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(val ?? 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!items.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
        No registrations found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3">Reg. No.</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Participant</th>
            <th className="px-4 py-3">Car</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Fee / Paid</th>
            <th className="px-4 py-3">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((reg) => (
            <tr key={reg.id || reg.registrationNumber} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                {reg.registrationNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {formatDate(reg.registrationDate)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{reg.participantName}</div>
                <div className="text-xs text-gray-500">
                  {reg.contactNumber} • {reg.email}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{reg.carMakeModel}</div>
                <div className="text-xs text-gray-500">{reg.plateNumber}</div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                {reg.registrationType}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={reg.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <div className="font-medium text-gray-900">
                  {formatCurrency(reg.registrationFee)}
                </div>
                <div className="text-xs text-gray-500">
                  Paid: {formatCurrency(reg.amountPaid)}
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <PaymentBadge paymentStatus={reg.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
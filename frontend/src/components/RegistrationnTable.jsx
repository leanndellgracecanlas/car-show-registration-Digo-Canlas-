import React from 'react';
import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function RegistrationTable({ items = [] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Reg. No.</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Participant</th>
            <th className="px-4 py-3 text-left font-semibold">Car</th>
            <th className="px-4 py-3 text-left font-semibold">Type</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Fee / Paid</th>
            <th className="px-4 py-3 text-center font-semibold">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((reg) => (
            <tr key={reg.id || reg.registrationNumber} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-mono font-medium text-gray-900">{reg.registrationNumber}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(reg.registrationDate)}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{reg.participantName}</div>
                <div className="text-xs text-gray-500">{reg.contactNumber} • {reg.email}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{reg.carMakeModel}</div>
                <div className="text-xs font-mono text-gray-500">{reg.plateNumber}</div>
              </td>
              <td className="px-4 py-3 text-gray-700">{reg.registrationType}</td>
              <td className="px-4 py-3">
                <StatusBadge status={reg.status} />
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs">
                <div>{formatCurrency(reg.registrationFee)}</div>
                <div className="text-gray-500">{formatCurrency(reg.amountPaid)}</div>
              </td>
              <td className="px-4 py-3 text-center">
                <PaymentBadge paymentStatus={reg.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

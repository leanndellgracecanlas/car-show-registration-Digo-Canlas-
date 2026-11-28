import React from 'react';
import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function RegistrationTable({ items = [] }) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/40 text-[#C8B98A] uppercase text-[11px] font-mono tracking-wider border-b border-white/10">
            <tr>
              <th className="px-5 py-4">Reg. No.</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Participant</th>
              <th className="px-5 py-4">Car Details</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Fee / Paid</th>
              <th className="px-5 py-4 text-center">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((reg) => (
              <tr key={reg.id || reg.registrationNumber} className="hover:bg-white/5 transition-colors">
                <td className="px-5 py-4 font-mono text-[#E4D8B5] font-semibold">{reg.registrationNumber}</td>
                <td className="px-5 py-4 text-xs text-gray-400">{formatDate(reg.registrationDate)}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-[#F5F2E9]">{reg.participantName}</div>
                  <div className="text-xs text-gray-400">{reg.contactNumber} • {reg.email}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-gray-200">{reg.carMakeModel}</div>
                  <div className="text-xs font-mono text-[#C8B98A]/80">{reg.plateNumber}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-gray-300 font-medium border border-white/10">
                    {reg.registrationType}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={reg.status} />
                </td>
                <td className="px-5 py-4 text-right font-mono text-xs">
                  <div className="text-[#F5F2E9] font-semibold">{formatCurrency(reg.registrationFee)}</div>
                  <div className="text-[#C8B98A]">{formatCurrency(reg.amountPaid)}</div>
                </td>
                <td className="px-5 py-4 text-center">
                  <PaymentBadge paymentStatus={reg.paymentStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

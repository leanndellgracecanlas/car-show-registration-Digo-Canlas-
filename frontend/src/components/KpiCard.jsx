import React from 'react';
import { formatCurrency } from '../utils/formatters';

export default function KpiCard({ title, value, isCurrency = false, icon }) {
  const displayValue = () => {
    if (value === undefined || value === null) return '-';
    if (isCurrency) return formatCurrency(value);
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        {icon && <span className="text-gray-400 text-lg">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-gray-900 font-mono">
        {displayValue()}
      </div>
    </div>
  );
}

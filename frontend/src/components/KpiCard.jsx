import React from 'react';

export default function KpiCard({ title, value, isCurrency = false, icon }) {
  const formatValue = (val) => {
    if (val === undefined || val === null) return '—';
    if (isCurrency) {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        maximumFractionDigits: 0,
      }).format(val);
    }
    return val.toLocaleString();
  };

  return (
    <div>
      <div>
        <span>{title}</span>
        {icon && <span>{icon}</span>}
      </div>
      <div>
        {formatValue(value)}
      </div>
    </div>
  );
}
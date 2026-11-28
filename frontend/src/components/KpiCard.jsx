import React from 'react';

export default function KpiCard({ title, value, isCurrency = false, icon = '📊' }) {
  const formattedValue = isCurrency
    ? `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : Number(value || 0).toLocaleString();

  return (
    <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#C8B98A]/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#C8B98A] uppercase tracking-wider">{title}</span>
        <span className="text-xl bg-white/10 p-2 rounded-xl border border-white/10">{icon}</span>
      </div>
      <div className="text-2xl font-bold font-mono text-[#F5F2E9] tracking-tight mt-1">
        {formattedValue}
      </div>
      <div className="w-full h-1 bg-gradient-to-r from-[#C8B98A]/50 to-transparent rounded-full mt-3 opacity-60" />
    </div>
  );
}

import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    Confirmed: 'bg-[#293522]/90 text-emerald-300 border-[#657052]',
    CheckedIn: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
    Pending: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    Cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Pending}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status || 'Pending'}
    </span>
  );
}

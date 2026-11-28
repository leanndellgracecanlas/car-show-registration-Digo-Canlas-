import React from 'react';
import KpiCard from './KpiCard';

export default function KpiCards({ summary = {} }) {
  const {
    totalRegistrations = 0,
    totalPayments = 0,
    uncollectedPayments = 0,
    confirmed = 0,
    checkedIn = 0,
  } = summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <KpiCard title="Total Registrations" value={totalRegistrations} icon="👥" />
      <KpiCard title="Total Payments" value={totalPayments} isCurrency icon="💳" />
      <KpiCard title="Uncollected Payments" value={uncollectedPayments} isCurrency icon="👛" />
      <KpiCard title="Confirmed" value={confirmed} icon="✅" />
      <KpiCard title="Checked In" value={checkedIn} icon="📥" />
    </div>
  );
}

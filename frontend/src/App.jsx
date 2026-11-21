import React from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import KpiCards from './components/KpiCards';
import RegistrationTable from './components/RegistrationTable';

export default function App() {
  // Compute summary numbers dynamically from sample dataset
  const summary = {
    totalRegistrations: SAMPLE_REGISTRATIONS.length,
    totalPayments: SAMPLE_REGISTRATIONS.reduce(
      (sum, item) => sum + (item.amountPaid || 0),
      0
    ),
    uncollectedPayments: SAMPLE_REGISTRATIONS.reduce(
      (sum, item) => sum + Math.max(0, (item.registrationFee || 0) - (item.amountPaid || 0)),
      0
    ),
    confirmed: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'Confirmed').length,
    checkedIn: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'CheckedIn').length,
  };

  return (
    <div>
      <header>
        <h1>Car Show 2027</h1>
        <p>Registration Dashboard</p>
      </header>
      <main>
        <KpiCards summary={summary} />
        <RegistrationTable items={SAMPLE_REGISTRATIONS} />
      </main>
    </div>
  );
}
import React from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import RegistrationTable from './components/RegistrationTable';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Car Show 2027</h1>
          <p className="text-sm text-gray-600">Registration Dashboard</p>
        </header>

        <main>
          <RegistrationTable items={SAMPLE_REGISTRATIONS} />
        </main>
      </div>
    </div>
  );
}
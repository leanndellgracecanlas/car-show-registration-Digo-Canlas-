import React, { useState } from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import KpiCards from './components/KpiCards';
import RegistrationFilters from './components/RegistrationFilters';
import RegistrationTable from './components/RegistrationTable';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
  };

  // Dynamic client-side filtering
  const filteredRegistrations = SAMPLE_REGISTRATIONS.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carMakeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === '' || item.registrationType === selectedType;
    const matchesStatus = selectedStatus === '' || item.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const summary = {
    totalRegistrations: SAMPLE_REGISTRATIONS.length,
    totalPayments: SAMPLE_REGISTRATIONS.reduce((sum, item) => sum + (item.amountPaid || 0), 0),
    uncollectedPayments: SAMPLE_REGISTRATIONS.reduce(
      (sum, item) => sum + Math.max(0, (item.registrationFee || 0) - (item.amountPaid || 0)),
      0
    ),
    confirmed: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'Confirmed').length,
    checkedIn: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'CheckedIn').length,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Car Show 2027</h1>
          <p className="text-sm text-gray-600">Registration Dashboard</p>
        </header>

        <main className="space-y-6">
          <KpiCards summary={summary} />
          <RegistrationFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onResetFilters={handleResetFilters}
          />
          <RegistrationTable items={filteredRegistrations} />
        </main>
      </div>
    </div>
  );
}
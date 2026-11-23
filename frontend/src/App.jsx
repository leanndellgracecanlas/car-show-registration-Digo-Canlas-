import React, { useState } from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import KpiCards from './components/KpiCards';
import RegistrationFilters from './components/RegistrationFilters';
import RegistrationTable from './components/RegistrationTable';
import Pagination from './components/Pagination';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  // Filter items
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

  // Calculate paginated slice
  const totalCount = filteredRegistrations.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

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
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Car Show 2027</h1>
        <p className="text-sm text-gray-600">Registration Dashboard</p>
      </header>

      <main className="space-y-6">
        <KpiCards summary={summary} />
        <RegistrationFilters
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          selectedType={selectedType}
          setSelectedType={(val) => {
            setSelectedType(val);
            setCurrentPage(1);
          }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(val) => {
            setSelectedStatus(val);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
        />
        <RegistrationTable items={paginatedRegistrations} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </main>
    </div>
  );
}

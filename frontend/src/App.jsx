import React, { useState, useEffect, useCallback } from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import { fetchRegistrations, fetchRegistrationSummary } from './api/registrationsApi';
import KpiCards from './components/KpiCards';
import RegistrationFilters from './components/RegistrationFilters';
import RegistrationTable from './components/RegistrationTable';
import Pagination from './components/Pagination';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ErrorAlert from './components/ErrorAlert';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Fallback calculation using sample-data.js when API is offline
  const handleFallback = useCallback(() => {
    setIsUsingFallback(true);
    const filtered = SAMPLE_REGISTRATIONS.filter((item) => {
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

    setTotalCount(filtered.length);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    setRegistrations(paginated);

    setSummary({
      totalRegistrations: SAMPLE_REGISTRATIONS.length,
      totalPayments: SAMPLE_REGISTRATIONS.reduce((sum, item) => sum + (item.amountPaid || 0), 0),
      uncollectedPayments: SAMPLE_REGISTRATIONS.reduce(
        (sum, item) => sum + Math.max(0, (item.registrationFee || 0) - (item.amountPaid || 0)),
        0
      ),
      confirmed: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'Confirmed').length,
      checkedIn: SAMPLE_REGISTRATIONS.filter((item) => item.status === 'CheckedIn').length,
    });
    setIsLoading(false);
  }, [searchTerm, selectedType, selectedStatus, currentPage, pageSize]);

  // Fetch data from backend API or fall back seamlessly
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [registrationsData, summaryData] = await Promise.all([
        fetchRegistrations({
          search: searchTerm,
          type: selectedType,
          status: selectedStatus,
          page: currentPage,
          pageSize: pageSize,
        }),
        fetchRegistrationSummary(),
      ]);

      setRegistrations(registrationsData.items || registrationsData);
      setTotalCount(registrationsData.totalCount || registrationsData.length || 0);
      setSummary(summaryData);
      setIsUsingFallback(false);
      setIsLoading(false);
    } catch (err) {
      console.warn('Backend API offline. Falling back to local mock data.', err);
      handleFallback();
    }
  }, [searchTerm, selectedType, selectedStatus, currentPage, pageSize, handleFallback]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Car Show 2027</h1>
          <p className="text-sm text-gray-600">Registration Dashboard</p>
        </div>
        {isUsingFallback && (
          <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium border border-amber-300">
            Offline Mode (Mock Data)
          </span>
        )}
      </header>

      <main className="space-y-6">
        <KpiCards summary={summary || {}} />

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

        {isLoading ? (
          <LoadingState />
        ) : errorMessage ? (
          <ErrorAlert message={errorMessage} onRetry={loadData} />
        ) : totalCount === 0 ? (
          <EmptyState onResetFilters={handleResetFilters} />
        ) : (
          <>
            <RegistrationTable items={registrations} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </main>
    </div>
  );
}

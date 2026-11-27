import React, { useState, useEffect, useCallback } from 'react';
import carHero from './assets/car1.png';
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
    <div className="flex min-h-screen p-4 md:p-6 gap-6 max-w-[1650px] mx-auto">
      {/* Left Glass Sidebar matching photoprompt.png */}
      <aside className="hidden lg:flex flex-col justify-between w-64 glass-panel rounded-3xl p-6 text-white shrink-0">
        <div>
          {/* Steering Wheel / Car Logo Emblem */}
          <div className="flex flex-col items-center border-b border-white/10 pb-6 mb-6 text-center">
            <div className="w-16 h-16 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3 bg-emerald-950/40 shadow-lg">
              <span className="text-3xl">🏎️</span>
            </div>
            <h2 className="font-serif text-xl tracking-wider text-amber-100 font-bold">Car Show</h2>
            <span className="text-[11px] text-emerald-400 font-mono tracking-widest uppercase">2027</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30 shadow-inner">
              <span>🎛️</span> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <span>🗓️</span> Registrations
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <span>📊</span> Analytics
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <span>⚙️</span> Settings
            </button>
          </nav>
        </div>

        {/* Footer Motto */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-mono tracking-widest text-emerald-400/80 uppercase">
            DRIVE • SHOW • CELEBRATE
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 overflow-hidden">
        {/* Top Hero Banner */}
        <header className="relative glass-panel rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div
            className="absolute inset-0 z-0 opacity-30 bg-cover bg-center mix-blend-overlay filter brightness-95"
            style={{ backgroundImage: `url(${carHero})` }}
          />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
              Car Show 2027
            </h1>
            <p className="text-xs font-mono tracking-widest uppercase text-emerald-400 mt-1">
              REGISTRATION DASHBOARD
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 text-xs px-4 py-2 rounded-full border border-emerald-500/40 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">Live Event</span>
              <span className="text-emerald-500">•</span>
              <span>Nov 14–16, 2026</span>
            </div>
            {isUsingFallback && (
              <span className="bg-amber-950/80 text-amber-300 text-xs px-3 py-2 rounded-full font-medium border border-amber-500/40">
                Offline Mode (Mock Data)
              </span>
            )}
          </div>
        </header>

        {/* KPI Cards, Filters, Table & Pagination */}
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
    </div>
  );
}

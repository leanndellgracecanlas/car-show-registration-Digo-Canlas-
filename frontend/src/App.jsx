
import React, { useState, useEffect, useCallback } from 'react';
import { SAMPLE_REGISTRATIONS } from './api/sample-data';
import {
  fetchRegistrations,
  fetchRegistrationSummary
} from './api/registrationsApi';

import './App.css';

// ==========================================
// HELPER FUNCTIONS
// ==========================================

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(Number(amount) || 0);
};

const getPaymentStatus = (item) => {
  const paid = Number(item.amountPaid || 0);
  const fee = Number(item.registrationFee || 0);

  if (paid >= fee && fee > 0) return 'Paid';
  if (paid > 0) return 'Partial';
  return 'Unpaid';
};

const getDate = (item) => {
  return (
    item.registrationDate ||
    item.date ||
    item.createdAt ||
    item.registrationDateTime ||
    'Feb 10, 2027'
  );
};

const getParticipant = (item) => {
  return item.participantName || item.name || 'Unknown Participant';
};

const getCar = (item) => {
  return item.carMakeModel || item.carModel || item.car || 'Not specified';
};

const getRegistrationNumber = (item) => {
  return item.registrationNumber || item.regNo || 'N/A';
};

// ==========================================
// MAIN APPLICATION
// ==========================================

export default function App() {

  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [summary, setSummary] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // ========================================
  // CALCULATE MOCK SUMMARY
  // ========================================

  const calculateSummary = (data) => {
    return {
      totalRegistrations: data.length,

      totalPayments: data.reduce(
        (sum, item) => sum + Number(item.amountPaid || 0),
        0
      ),

      uncollectedPayments: data.reduce(
        (sum, item) =>
          sum + Math.max(
            0,
            Number(item.registrationFee || 0) -
            Number(item.amountPaid || 0)
          ),
        0
      ),

      confirmed: data.filter(
        item => item.status === 'Confirmed'
      ).length,

      checkedIn: data.filter(
        item => item.status === 'CheckedIn' ||
                item.status === 'Checked In'
      ).length
    };
  };

  // ========================================
  // FILTER MOCK DATA
  // ========================================

  const getFilteredData = useCallback(() => {
    return SAMPLE_REGISTRATIONS.filter((item) => {

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search ||
        getParticipant(item).toLowerCase().includes(search) ||
        getCar(item).toLowerCase().includes(search) ||
        String(item.plateNumber || '').toLowerCase().includes(search) ||
        getRegistrationNumber(item).toLowerCase().includes(search);

      const matchesType =
        !selectedType ||
        item.registrationType === selectedType;

      const matchesStatus =
        !selectedStatus ||
        item.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  // ========================================
  // LOAD FALLBACK DATA
  // ========================================

  const handleFallback = useCallback(() => {

    const filtered = getFilteredData();

    setIsUsingFallback(true);

    setTotalCount(filtered.length);

    const startIndex = (currentPage - 1) * pageSize;

    setRegistrations(
      filtered.slice(startIndex, startIndex + pageSize)
    );

    setSummary(calculateSummary(SAMPLE_REGISTRATIONS));

    setIsLoading(false);

  }, [getFilteredData, currentPage, pageSize]);

  // ========================================
  // LOAD API DATA
  // ========================================

  const loadData = useCallback(async () => {

    setIsLoading(true);

    try {

      const [registrationData, summaryData] = await Promise.all([
        fetchRegistrations({
          search: searchTerm,
          type: selectedType,
          status: selectedStatus,
          page: currentPage,
          pageSize: pageSize
        }),

        fetchRegistrationSummary()
      ]);

      const items = Array.isArray(registrationData)
        ? registrationData
        : registrationData.items || [];

      setRegistrations(items);

      setTotalCount(
        registrationData.totalCount ?? items.length
      );

      setSummary(summaryData);

      setIsUsingFallback(false);

      setIsLoading(false);

    } catch (error) {

      console.warn(
        'Backend unavailable. Using local sample data.',
        error
      );

      handleFallback();

    }

  }, [
    searchTerm,
    selectedType,
    selectedStatus,
    currentPage,
    pageSize,
    handleFallback
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========================================
  // FILTER HANDLERS
  // ========================================

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  // ========================================
  // KPI CARDS
  // ========================================

  const kpiCards = [
    {
      icon: '👥',
      label: 'Total Registrations',
      value: summary?.totalRegistrations ?? 0
    },
    {
      icon: '💳',
      label: 'Total Payments',
      value: formatCurrency(summary?.totalPayments ?? 0)
    },
    {
      icon: '💰',
      label: 'Uncollected Payments',
      value: formatCurrency(summary?.uncollectedPayments ?? 0)
    },
    {
      icon: '✓',
      label: 'Confirmed',
      value: summary?.confirmed ?? 0
    },
    {
      icon: '📥',
      label: 'Checked In',
      value: summary?.checkedIn ?? 0
    }
  ];

  // ========================================
  // NAVIGATION
  // ========================================

  const navigation = [
    { label: 'Dashboard', icon: '▦' },
    { label: 'Registrations', icon: '▣' },
    { label: 'Analytics', icon: '▥' },
    { label: 'Settings', icon: '⚙' }
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="app-layout">

      {/* BACKGROUND OVERLAY */}
      <div className="background-overlay"></div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ==================================
          SIDEBAR
      ================================== */}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

        <div className="sidebar-top">

          <div className="sidebar-logo">

            <div className="logo-icon">
              🏎️
            </div>

            <h2>Car Show</h2>

            <span>2027</span>

          </div>

          <nav className="sidebar-navigation">

            {navigation.map((item) => (

              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label ? 'active' : ''
                }`}
                onClick={() => handleNavigation(item.label)}
              >

                <span className="nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>

              </button>

            ))}

          </nav>

        </div>

        <div className="sidebar-footer">

          <p>DRIVE • SHOW • CELEBRATE</p>

          <span>🏁</span>

        </div>

      </aside>

      {/* ==================================
          MAIN CONTENT
      ================================== */}

      <main className="main-content">

        {/* HERO HEADER */}

        <header className="hero-section">

          <div className="hero-content">

            <div className="event-badge">

              <span className="live-indicator"></span>

              <span>Live Event</span>

              <span className="badge-divider"></span>

              <span>Nov 14–16, 2026</span>

            </div>

            <div className="hero-title">

              <h1>Car Show 2027</h1>

              <p>REGISTRATION DASHBOARD</p>

              <div className="title-line"></div>

            </div>

          </div>

        </header>

        {/* OFFLINE NOTICE */}

        {isUsingFallback && (
          <div className="offline-notice">
            <span>●</span>
            Offline Mode — Showing Mock Data
          </div>
        )}

        {/* ==================================
            DASHBOARD CONTENT
        ================================== */}

        {activePage === 'Dashboard' || activePage === 'Registrations' ? (

          <>

            {/* KPI CARDS */}

            <section className="kpi-section">

              {kpiCards.map((card) => (

                <div className="kpi-card" key={card.label}>

                  <div className="kpi-icon">
                    {card.icon}
                  </div>

                  <div className="kpi-info">

                    <p>{card.label}</p>

                    <h2>{card.value}</h2>

                  </div>

                </div>

              ))}

            </section>

            {/* REGISTRATION PANEL */}

            <section className="registration-panel">

              <div className="registration-header">

                <div className="registration-title">

                  <span className="registration-icon">🚘</span>

                  <h2>
                    {activePage === 'Dashboard'
                      ? 'Registrations'
                      : 'All Registrations'}
                  </h2>

                </div>

                {/* FILTER TOOLBAR */}

                <div className="registration-filters">

                  <div className="search-box">

                    <span>⌕</span>

                    <input
                      type="text"
                      placeholder="Search participant name..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />

                  </div>

                  <select
                    value={selectedType}
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setCurrentPage(1);
                    }}
                  >

                    <option value="">All Types</option>
                    <option value="Competitor">Competitor</option>
                    <option value="Exhibitor">Exhibitor</option>
                    <option value="VIP">VIP</option>

                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >

                    <option value="">All Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="CheckedIn">Checked In</option>

                  </select>

                  <button
                    className="clear-filter-button"
                    onClick={resetFilters}
                  >
                    ↻ Clear Filters
                  </button>

                </div>

              </div>

              {/* TABLE */}

              <div className="table-container">

                {isLoading ? (

                  <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading registrations...</p>
                  </div>

                ) : registrations.length === 0 ? (

                  <div className="empty-state">

                    <span>🚘</span>

                    <h3>No Registrations Found</h3>

                    <p>
                      No registrations match your current filters.
                    </p>

                    <button onClick={resetFilters}>
                      Clear Filters
                    </button>

                  </div>

                ) : (

                  <table>

                    <thead>

                      <tr>
                        <th>Reg. No.</th>
                        <th>Date</th>
                        <th>Participant</th>
                        <th>Car</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Fee / Paid</th>
                        <th>Payment</th>
                      </tr>

                    </thead>

                    <tbody>

                      {registrations.map((item, index) => {

                        const paymentStatus = getPaymentStatus(item);

                        const statusClass = String(item.status || '')
                          .toLowerCase()
                          .replace(/\s+/g, '-');

                        return (

                          <tr key={item.registrationNumber || item.regNo || index}>

                            <td className="registration-number">
                              {getRegistrationNumber(item)}
                            </td>

                            <td>
                              {getDate(item)}
                            </td>

                            <td>

                              <div className="participant-cell">

                                <strong>
                                  {getParticipant(item)}
                                </strong>

                                <small>
                                  {item.phoneNumber || item.contactNumber || ''}
                                </small>

                              </div>

                            </td>

                            <td>

                              <div className="car-cell">

                                <strong>{getCar(item)}</strong>

                                <small>
                                  {item.plateNumber || 'No plate number'}
                                </small>

                              </div>

                            </td>

                            <td>
                              <span className="type-badge">
                                {item.registrationType || 'Standard'}
                              </span>
                            </td>

                            <td>

                              <span className={`status-badge status-${statusClass}`}>
                                {item.status === 'CheckedIn'
                                  ? 'Checked In'
                                  : item.status || 'Pending'}
                              </span>

                            </td>

                            <td>

                              <div className="payment-cell">

                                <strong>
                                  {formatCurrency(item.registrationFee)}
                                </strong>

                                <small>
                                  {formatCurrency(item.amountPaid)}
                                </small>

                              </div>

                            </td>

                            <td>

                              <span className={`payment-badge payment-${paymentStatus.toLowerCase()}`}>
                                {paymentStatus}
                              </span>

                            </td>

                          </tr>

                        );

                      })}

                    </tbody>

                  </table>

                )}

              </div>

              {/* PAGINATION */}

              {!isLoading && registrations.length > 0 && (

                <div className="pagination">

                  <div className="pagination-buttons">

                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      ‹
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (

                      <button
                        key={page}
                        className={currentPage === page ? 'page-active' : ''}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>

                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      ›
                    </button>

                  </div>

                  <div className="pagination-info">

                    <span>
                      Showing {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                      {'–'}
                      {Math.min(currentPage * pageSize, totalCount)}
                      {' '}of {totalCount}
                    </span>

                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                    </select>

                  </div>

                </div>

              )}

            </section>

          </>

        ) : (

          <section className="registration-panel placeholder-page">

            <span className="placeholder-icon">
              {activePage === 'Analytics' ? '📊' : '⚙️'}
            </span>

            <h2>{activePage}</h2>

            <p>
              This section is ready for your next implementation.
            </p>

          </section>

        )}

        {/* FOOTER */}

        <footer className="dashboard-footer">

          <span>
            © 2027 Car Show Registration System
          </span>

          <span>
            DRIVE • SHOW • CELEBRATE 🏁
          </span>

        </footer>

      </main>

    </div>

  );

}

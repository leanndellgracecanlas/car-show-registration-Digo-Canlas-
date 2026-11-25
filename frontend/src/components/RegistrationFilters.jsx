import React from 'react';

export default function RegistrationFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  onResetFilters,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 md:space-y-0 md:flex md:items-end md:gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Search
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search by participant, car, or plate number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Registration Type Dropdown */}
      <div className="w-full sm:w-1/2 md:w-44">
        <label htmlFor="type-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Type
        </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Competitor">Competitor</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* Status Dropdown */}
      <div className="w-full sm:w-1/2 md:w-44">
        <label htmlFor="status-filter" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Status
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">CheckedIn</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reset Button */}
      <div className="w-full md:w-auto">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

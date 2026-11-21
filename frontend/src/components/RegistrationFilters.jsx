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
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search participant, plate, reg. no..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Registration Type Dropdown */}
      <div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="Standard">Standard</option>
          <option value="Exhibitor">Exhibitor</option>
          <option value="Competitor">Competitor</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* Status Dropdown */}
      <div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="CheckedIn">CheckedIn</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Clear Button */}
      <div>
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
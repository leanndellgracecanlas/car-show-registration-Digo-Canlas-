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
    <div className="glass-panel p-4 rounded-2xl space-y-3 md:space-y-0 md:flex md:items-end md:gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search" className="block text-xs font-semibold text-[#C8B98A] uppercase tracking-wider mb-1">
          Search
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">🔍</span>
          <input
            id="search"
            type="text"
            placeholder="Search participant name, car, or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Registration Type Filter */}
      <div className="w-full sm:w-1/2 md:w-44">
        <label htmlFor="type-filter" className="block text-xs font-semibold text-[#C8B98A] uppercase tracking-wider mb-1">
          Type
        </label>
        <select
          id="type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-[#182218] text-[#F5F2E9]">All Types</option>
          <option value="Standard" className="bg-[#182218] text-[#F5F2E9]">Standard</option>
          <option value="Exhibitor" className="bg-[#182218] text-[#F5F2E9]">Exhibitor</option>
          <option value="Competitor" className="bg-[#182218] text-[#F5F2E9]">Competitor</option>
          <option value="VIP" className="bg-[#182218] text-[#F5F2E9]">VIP</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-1/2 md:w-44">
        <label htmlFor="status-filter" className="block text-xs font-semibold text-[#C8B98A] uppercase tracking-wider mb-1">
          Status
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none cursor-pointer"
        >
          <option value="" className="bg-[#182218] text-[#F5F2E9]">All Statuses</option>
          <option value="Pending" className="bg-[#182218] text-[#F5F2E9]">Pending</option>
          <option value="Confirmed" className="bg-[#182218] text-[#F5F2E9]">Confirmed</option>
          <option value="CheckedIn" className="bg-[#182218] text-[#F5F2E9]">CheckedIn</option>
          <option value="Cancelled" className="bg-[#182218] text-[#F5F2E9]">Cancelled</option>
        </select>
      </div>

      {/* Clear Button */}
      <div className="w-full md:w-auto">
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full md:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-[#F5F2E9] rounded-xl text-sm font-medium transition-all"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

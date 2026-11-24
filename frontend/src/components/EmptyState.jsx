import React from 'react';

export default function EmptyState({ onResetFilters }) {
  return (
    <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
      <div className="text-4xl mb-3">🚗💨</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No Registrations Found</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
        No participants match your current search criteria or filters. Try adjusting your search term or resetting your filters.
      </p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

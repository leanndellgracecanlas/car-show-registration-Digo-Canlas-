import React from 'react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-500 text-3xl mb-2">⚠️</div>
      <h3 className="text-base font-semibold text-red-900 mb-1">Failed to Load Data</h3>
      <p className="text-sm text-red-700 mb-4">{message || 'An unexpected error occurred while fetching registrations.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

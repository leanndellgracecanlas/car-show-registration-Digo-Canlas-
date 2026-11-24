import React from 'react';

export default function LoadingState() {
  return (
    <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
      <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <p className="text-gray-600 font-medium text-sm">Loading registrations...</p>
    </div>
  );
}

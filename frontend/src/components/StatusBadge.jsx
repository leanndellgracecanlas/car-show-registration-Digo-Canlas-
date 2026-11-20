import React from 'react';

export default function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Confirmed: 'bg-green-100 text-green-800 border-green-300',
    CheckedIn: 'bg-blue-100 text-blue-800 border-blue-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const badgeStyle = styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
      {status}
    </span>
  );
}
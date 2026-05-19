import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bg = 'bg-gray-100 text-gray-800';
  let label = status;

  switch (status.toLowerCase()) {
    case 'present':
    case 'paid':
    case 'verified':
    case 'success':
      bg = 'bg-green-100 text-green-800 border border-green-200';
      break;
    case 'late':
    case 'pending':
    case 'permission':
    case 'submitted':
      bg = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      break;
    case 'absent':
    case 'rejected':
    case 'overdue':
    case 'invalid_qr':
    case 'inactive_qr':
    case 'not_in_class':
    case 'unauthorized':
    case 'wrong_schedule':
      bg = 'bg-red-100 text-red-800 border border-red-200';
      break;
    case 'sick':
    case 'already_checked_in':
    case 'already_checked_out':
    case 'duplicate_scan':
    case 'graded':
    case 'unpaid':
      bg = 'bg-blue-100 text-blue-800 border border-blue-200';
      break;
  }

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bg}`}>
      {label.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};

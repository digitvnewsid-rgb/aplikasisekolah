import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon, description, color = 'bg-blue-600' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
      <div className={`p-4 rounded-xl text-white ${color}`}>
        {icon}
      </div>
    </div>
  );
};

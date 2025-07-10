import React from 'react';

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-500',
    text: 'text-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600'
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'bg-amber-500',
    text: 'text-amber-600'
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'bg-rose-500',
    text: 'text-rose-600'
  }
};

export default function StatsCard({ title, value, icon: Icon, color, trend }) {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`${colors.bg} p-3 rounded-lg`}>
          <div className={`${colors.icon} p-2 rounded-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
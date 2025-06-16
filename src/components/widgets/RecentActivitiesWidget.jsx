
// src/components/widgets/RecentActivitiesWidget.jsx
import React from 'react';
import AnimatedCard from './AnimatedCard';
import { mockRecentActivities } from '../../data/mockGlobalData';

const ActivityItem = ({ type, description, timestamp, status }) => {
  let icon = 'ℹ️'; // Info
  let color = 'text-blue-500';

  switch (status.toLowerCase()) {
    case 'critical':
      icon = '🚨'; // Alert
      color = 'text-red-500';
      break;
    case 'warning':
      icon = '⚠️'; // Warning
      color = 'text-yellow-500';
      break;
    case 'resolved':
      icon = '✅'; // Check mark
      color = 'text-green-500';
      break;
    case 'info':
    default:
      icon = 'ℹ️';
      color = 'text-blue-500';
      break;
  }

  return (
    <div className="flex items-start space-x-2 py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <span className={`text-lg ${color}`}>{icon}</span>
      <div className="flex-1">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          <span className="font-semibold capitalize">{type}:</span> {description}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(timestamp).toLocaleString()}</p>
      </div>
    </div>
  );
};

const RecentActivitiesWidget = ({ onClick }) => {
  const displayActivities = mockRecentActivities.slice(0, 5); // Show top 5 for brevity

  return (
    <AnimatedCard
      title="Recent Activities"
      subTitle="Critical Alerts & Updates"
      onClick={onClick}
      className="col-span-1 min-h-64"
    >
      {displayActivities.length > 0 ? (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {displayActivities.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activities to display.</p>
      )}
    </AnimatedCard>
  );
};

export default RecentActivitiesWidget;

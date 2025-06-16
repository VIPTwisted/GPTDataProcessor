
import React, { useState, useEffect } from 'react';
import AnimatedCard from './AnimatedCard';
import { mockGlobalActivityStream, getStatusIcon } from '../../data/mockGlobalData';

const ActivityItem = ({ type, message, timestamp, severity, location }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      case 'Warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deployment': return '🚀';
      case 'Sales Anomaly': return '📊';
      case 'HR Alert': return '👥';
      case 'AI Insight': return '🤖';
      case 'Security Alert': return '🔒';
      case 'Customer Service': return '🎧';
      case 'Live Update': return '⚡';
      default: return '📋';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${getSeverityColor(severity)}`}>
        {getTypeIcon(type)}
      </div>
      <div className="flex-grow">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
          <span className="font-semibold text-gray-800 dark:text-gray-200">{type}:</span> {message}
          {location && <span className="ml-2 text-xs font-medium text-blue-500">@{location}</span>}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTimeAgo(timestamp)}</p>
      </div>
    </div>
  );
};

const GlobalActivityStream = ({ onClick }) => {
  const [activities, setActivities] = useState(mockGlobalActivityStream);
  const [filter, setFilter] = useState('All');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'Live Update',
        message: 'Real-time system health check completed.',
        timestamp: new Date().toISOString(),
        severity: 'Info'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000); // New activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(activity => activity.severity === filter);

  return (
    <AnimatedCard
      title="Global Activity & Anomaly Stream"
      subTitle="Live Feed of Key Business Events"
      onClick={onClick}
      className="col-span-1 lg:col-span-2"
    >
      <div className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto">
          {['All', 'Critical', 'Warning', 'Info'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Activity List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredActivities.slice(0, 8).map((activity) => (
            <ActivityItem key={activity.id} {...activity} />
          ))}
        </div>

        <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => console.log('View Full Activity Log')}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Full Event Log &rarr;
          </button>
        </div>
      </div>
    </AnimatedCard>
  );
};severity === filter);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: 'Live Update',
        message: 'Real-time system health check completed.',
        timestamp: new Date().toISOString(),
        severity: 'Info'
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000); // New activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatedCard title="📡 Global Activity & Anomaly Stream" className="col-span-2">
      <div className="space-y-4">
        {/* Filter Buttons */}
        <div className="flex space-x-2 overflow-x-auto">
          {['All', 'Critical', 'Warning', 'Info'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {/* Activity Stream */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-xl">{getTypeIcon(activity.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    {activity.location && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        📍 {activity.location}
                      </span>
                    )}
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getSeverityColor(activity.severity)}`}>
                      {activity.severity}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {activity.message}
                </p>
                
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live monitoring active</span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GlobalActivityStream;

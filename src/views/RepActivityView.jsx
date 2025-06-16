
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const RepActivityView = () => {
  const [activity, setActivity] = useState([
    { name: 'Jules K.', action: 'Hosting party', since: '3m ago', type: 'party' },
    { name: 'Taylor M.', action: 'Finishing LMS: Objection Handling', since: '8m ago', type: 'training' },
    { name: 'Nico V.', action: 'Launched new campaign', since: 'Just now', type: 'campaign' },
    { name: 'Brielle K.', action: 'Generated AI content', since: '12m ago', type: 'content' },
    { name: 'Tamika R.', action: 'Completed certification', since: '18m ago', type: 'certification' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        name: ['Jules K.', 'Taylor M.', 'Nico V.', 'Brielle K.', 'Tamika R.'][Math.floor(Math.random() * 5)],
        action: [
          'Started new training module',
          'Generated social media post',
          'Completed quiz',
          'Updated profile',
          'Reviewed earnings'
        ][Math.floor(Math.random() * 5)],
        since: 'Just now',
        type: ['training', 'content', 'quiz', 'profile', 'earnings'][Math.floor(Math.random() * 5)]
      };
      
      setActivity(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'party': return '🎉';
      case 'training': return '📚';
      case 'campaign': return '🚀';
      case 'content': return '✍️';
      case 'certification': return '🏆';
      case 'quiz': return '❓';
      case 'profile': return '👤';
      case 'earnings': return '💰';
      default: return '📋';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">📡 Live Rep Activity Feed</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </div>
      
      <AnimatedCard>
        <ul className="space-y-3 text-sm">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getActivityIcon(a.type)}</span>
                <div>
                  <span className="font-medium">{a.name}</span>
                  <span className="text-gray-600 dark:text-gray-300"> — {a.action}</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">{a.since}</span>
            </li>
          ))}
        </ul>
      </AnimatedCard>
    </div>
  );
};

export default RepActivityView;

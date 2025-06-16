
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import XpTracker from '../components/widgets/XpTracker';
import { FaChartLine, FaShoppingCart, FaRobot, FaUserFriends, FaTrophy, FaGraduationCap } from 'react-icons/fa';

const RepDashboardView = () => {
  const [repData, setRepData] = useState({
    stats: {
      totalSales: '$4,220',
      leads: 31,
      partiesHosted: 4,
      openCarts: 6,
      level: 3,
      currentXP: 340,
      nextLevelXP: 500
    },
    recentActivity: [
      { action: 'Completed "Advanced Sales" course', points: 30, time: '2 hours ago' },
      { action: 'Launched Instagram campaign', points: 25, time: '4 hours ago' },
      { action: 'Closed $180 order', points: 50, time: '1 day ago' }
    ],
    badges: [
      { name: 'Product Expert', earned: true },
      { name: 'Party Host Pro', earned: true },
      { name: 'Social Media Guru', earned: false }
    ],
    dailyQuests: [
      { title: '🔥 3-Day Sales Streak', progress: '2/3', status: 'In Progress' },
      { title: '🎉 Host 2 Parties This Week', progress: '1/2', status: 'In Progress' },
      { title: '📚 Complete Training Module', progress: '1/1', status: 'Completed' }
    ]
  });

  const quickActions = [
    { icon: FaRobot, label: 'AI Assistant', path: '/rep/ai-assistant', color: 'bg-purple-500' },
    { icon: FaUserFriends, label: 'Party Builder', path: '/rep/party-builder', color: 'bg-pink-500' },
    { icon: FaChartLine, label: 'Campaign Creator', path: '/rep/campaigns', color: 'bg-blue-500' },
    { icon: FaGraduationCap, label: 'Training Hub', path: '/rep/training', color: 'bg-green-500' }
  ];

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My ToyParty Rep Dashboard</h1>
          <div className="text-sm text-gray-500">
            Welcome back, Brielle! 🌟
          </div>
        </div>

        {/* XP Tracker */}
        <div className="mb-6">
          <XpTracker 
            current={repData.stats.currentXP} 
            level={repData.stats.level}
            nextLevelXP={repData.stats.nextLevelXP}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <AnimatedCard className="text-center">
            <FaChartLine className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{repData.stats.totalSales}</div>
            <div className="text-sm text-gray-500">Total Sales</div>
          </AnimatedCard>
          
          <AnimatedCard className="text-center">
            <FaUserFriends className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{repData.stats.leads}</div>
            <div className="text-sm text-gray-500">Active Leads</div>
          </AnimatedCard>
          
          <AnimatedCard className="text-center">
            <FaShoppingCart className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{repData.stats.openCarts}</div>
            <div className="text-sm text-gray-500">Open Carts</div>
          </AnimatedCard>
          
          <AnimatedCard className="text-center">
            <FaTrophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{repData.stats.partiesHosted}</div>
            <div className="text-sm text-gray-500">Parties Hosted</div>
          </AnimatedCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <AnimatedCard>
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className={`w-full flex items-center p-3 rounded-lg text-white hover:opacity-90 transition-opacity ${action.color}`}
                    onClick={() => window.location.href = action.path}
                  >
                    <action.icon className="w-5 h-5 mr-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </AnimatedCard>

            {/* Daily Quests */}
            <AnimatedCard className="mt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Quests</h2>
              <div className="space-y-3">
                {repData.dailyQuests.map((quest, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{quest.title}</div>
                      <div className="text-xs text-gray-500">{quest.progress}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      quest.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quest.status}
                    </span>
                  </div>
                ))}
              </div>
            </AnimatedCard>
          </div>

          {/* Recent Activity & Badges */}
          <div className="lg:col-span-2">
            <AnimatedCard>
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity & Achievements</h2>
              
              <div className="mb-6">
                <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Recent XP Gains</h3>
                <div className="space-y-2">
                  {repData.recentActivity.map((activity, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                      <span className="text-sm font-bold text-indigo-600">+{activity.points} XP</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Badges & Certifications</h3>
                <div className="grid grid-cols-3 gap-3">
                  {repData.badges.map((badge, i) => (
                    <div key={i} className={`text-center p-3 rounded-lg border ${
                      badge.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}>
                      <div className="text-2xl mb-1">{badge.earned ? '🏆' : '🔒'}</div>
                      <div className="text-xs font-medium">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepDashboardView;

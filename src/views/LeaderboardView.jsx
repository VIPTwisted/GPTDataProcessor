
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { FaTrophy, FaMedal, FaAward, FaCrown } from 'react-icons/fa';

const LeaderboardView = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('overall');
  
  const leaderboardData = {
    weekly: [
      { name: 'Nico V.', level: 4, xp: 460, sales: '$2,340', badges: 8, rank: 1 },
      { name: 'Tamika R.', level: 4, xp: 420, sales: '$2,100', badges: 7, rank: 2 },
      { name: 'Brielle K.', level: 3, xp: 340, sales: '$1,890', badges: 6, rank: 3 },
      { name: 'Alexis D.', level: 3, xp: 320, sales: '$1,650', badges: 5, rank: 4 },
      { name: 'Jordan M.', level: 2, xp: 280, sales: '$1,420', badges: 4, rank: 5 },
      { name: 'Casey L.', level: 2, xp: 260, sales: '$1,200', badges: 4, rank: 6 },
      { name: 'Morgan P.', level: 2, xp: 240, sales: '$980', badges: 3, rank: 7 },
      { name: 'Riley T.', level: 1, xp: 180, sales: '$750', badges: 2, rank: 8 }
    ]
  };

  const currentData = leaderboardData[timeframe] || leaderboardData.weekly;
  
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown className="w-5 h-5 text-yellow-500" />;
      case 2: return <FaTrophy className="w-5 h-5 text-gray-400" />;
      case 3: return <FaMedal className="w-5 h-5 text-amber-600" />;
      default: return <FaAward className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default: return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏆 Rep Leaderboard</h1>
          
          <div className="flex gap-4">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
            </select>
            
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="overall">Overall Performance</option>
              <option value="sales">Sales Volume</option>
              <option value="training">Training Completion</option>
              <option value="social">Social Engagement</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <AnimatedCard>
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">🏆 Top Performers</h2>
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-20 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-lg flex items-end justify-center mb-2">
                  <span className="text-white font-bold text-lg pb-2">2</span>
                </div>
                <div className="font-medium text-sm">{currentData[1]?.name}</div>
                <div className="text-xs text-gray-500">{currentData[1]?.xp} XP</div>
              </div>
              
              {/* 1st Place */}
              <div className="text-center">
                <div className="w-24 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-end justify-center mb-2">
                  <span className="text-white font-bold text-xl pb-2">1</span>
                </div>
                <div className="font-bold text-lg">{currentData[0]?.name}</div>
                <div className="text-sm text-indigo-600 font-medium">{currentData[0]?.xp} XP</div>
              </div>
              
              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-20 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg flex items-end justify-center mb-2">
                  <span className="text-white font-bold text-lg pb-2">3</span>
                </div>
                <div className="font-medium text-sm">{currentData[2]?.name}</div>
                <div className="text-xs text-gray-500">{currentData[2]?.xp} XP</div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* Full Leaderboard */}
        <AnimatedCard>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Full Rankings</h2>
          <div className="space-y-3">
            {currentData.map((rep, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg transition-all duration-200 hover:scale-[1.02] ${getRankColor(rep.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(rep.rank)}
                      <span className="font-bold text-lg">#{rep.rank}</span>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-lg">{rep.name}</div>
                      <div className="text-sm opacity-75">Level {rep.level} • {rep.badges} badges</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">{rep.xp} XP</div>
                    <div className="text-sm opacity-75">{rep.sales} sales</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Achievement Categories */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">🎯 This Week's Challenges</h3>
            <ul className="space-y-2 text-sm">
              <li>• Host 3+ parties: +100 XP</li>
              <li>• Complete advanced training: +75 XP</li>
              <li>• Achieve $1000+ sales: +150 XP</li>
            </ul>
          </AnimatedCard>
          
          <AnimatedCard>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">🏅 Recent Achievements</h3>
            <ul className="space-y-2 text-sm">
              <li>• Nico V. earned "Sales Master"</li>
              <li>• Tamika R. completed certification</li>
              <li>• Brielle K. hit 7-day streak</li>
            </ul>
          </AnimatedCard>
          
          <AnimatedCard>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">⚡ Bonus Multipliers</h3>
            <ul className="space-y-2 text-sm">
              <li>• Weekend sales: 2x XP</li>
              <li>• Team referrals: 3x XP</li>
              <li>• Social shares: 1.5x XP</li>
            </ul>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;

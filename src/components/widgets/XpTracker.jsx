
import React from 'react';

const XpTracker = ({ current = 220, level = 2, nextLevelXP = 300 }) => {
  const progress = Math.min((current / nextLevelXP) * 100, 100);
  const xpToNext = nextLevelXP - current;

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Level {level}</h3>
        <div className="text-sm opacity-90">{current} / {nextLevelXP} XP</div>
      </div>
      
      <div className="relative w-full h-3 bg-white bg-opacity-20 rounded-full mb-2">
        <div
          className="absolute top-0 left-0 h-3 bg-white rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-sm opacity-90">
        <span>{xpToNext > 0 ? `${xpToNext} XP to level ${level + 1}` : 'Level up available!'}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default XpTracker;

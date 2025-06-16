
// src/views/HROverviewView.jsx
import React from 'react';
import {
  mockAttritionRisk,
  mockOnboardingProgress,
  mockSkillMatrix,
  mockCoachingFlags
} from '../data/mockHRData';
import AnimatedCard from '../components/widgets/AnimatedCard';

const SkillBar = ({ level }) => (
  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
    <div className="h-2 bg-indigo-500" style={{ width: `${level * 20}%` }}></div>
  </div>
);

const HROverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🧑‍💼 HR & Workforce Intelligence</h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        AI-powered people insights, coaching alerts, and training progression.
      </p>

      {/* Attrition Risk */}
      <AnimatedCard title="⚠️ Attrition & Absentee Risk Radar" subTitle="AI-forecasted based on behavior patterns" className="mb-8">
        <div className="space-y-4">
          {mockAttritionRisk.map((e) => (
            <div key={e.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{e.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{e.role} - {e.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  e.risk >= 0.7 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' : 
                  e.risk >= 0.6 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200' : 
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                }`}>
                  {(e.risk * 100).toFixed(0)}% Risk
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">⚠️ {e.reason}</p>
              <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                🎯 Schedule Intervention
              </button>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Onboarding Progress */}
      <AnimatedCard title="🏁 Live Onboarding Micro-Tracker" subTitle="For new hires < 90 days" className="mb-8">
        <div className="space-y-4">
          {mockOnboardingProgress.map((n, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{n.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Station: {n.station}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Trainer: {n.trainer}</p>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{n.percent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${n.percent}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Current module completion</p>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Skill Matrix & Coaching Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="🧠 Employee Skill Matrix" subTitle="Multidomain capability profiles">
          <div className="space-y-4">
            {mockSkillMatrix.map((emp, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{emp.name}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Sales</span>
                      <span className="text-xs text-gray-500">{emp.sales}/5</span>
                    </div>
                    <SkillBar level={emp.sales} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Support</span>
                      <span className="text-xs text-gray-500">{emp.support}/5</span>
                    </div>
                    <SkillBar level={emp.support} />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Tech</span>
                      <span className="text-xs text-gray-500">{emp.tech}/5</span>
                    </div>
                    <SkillBar level={emp.tech} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard title="📋 AI Coaching & Compliance Flags" subTitle="Generated from performance signals">
          <div className="space-y-4">
            {mockCoachingFlags.map((f, i) => (
              <div key={i} className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{f.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    f.severity === 'High' ? 'bg-red-600 text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                  }`}>
                    {f.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Issue: {f.issue}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">💡 {f.suggestion}</p>
                <button className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                  🎯 Implement Coaching Plan
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Future Extensions */}
      <AnimatedCard title="🌱 Future HR Extensions" subTitle="Planned AI-powered workforce capabilities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Performance Reviews</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI-generated review insights and goal tracking</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🩺</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Wellness Dashboard</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Employee engagement and burnout detection</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Talent Pipeline</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Succession planning and skills gap analysis</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default HROverviewView;

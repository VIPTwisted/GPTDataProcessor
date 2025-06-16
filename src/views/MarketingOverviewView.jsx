
// src/views/MarketingOverviewView.jsx
import React from 'react';
import {
  mockSEOForecast,
  mockAdCampaignROI,
  mockCompetitorIntel,
  mockAdCopySuggestions
} from '../data/mockMarketingData';
import AnimatedCard from '../components/widgets/AnimatedCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const MarketingOverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Marketing Intelligence</h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Live forecasts, ROI metrics, competitor tracking, and AI content ideas.
      </p>

      {/* SEO Traffic Forecast */}
      <AnimatedCard title="SEO Traffic Forecast" subTitle="AI-projected based on content & backlink patterns" className="mb-8">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={mockSEOForecast}>
            <XAxis dataKey="week" stroke="#6B7280" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="traffic" stroke="#10B981" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </AnimatedCard>

      {/* Campaign ROI */}
      <AnimatedCard title="Campaign ROI Analyzer" subTitle="Ad spend vs returns" className="mb-8">
        <ul className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
          {mockAdCampaignROI.map((c, i) => {
            const roi = ((c.revenue - c.spend) / c.spend) * 100;
            return (
              <li key={i} className="py-3 flex justify-between">
                <span className="font-medium text-gray-800 dark:text-white">{c.campaign}</span>
                <span className={`font-semibold ${roi > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ROI: {roi.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </AnimatedCard>

      {/* Competitor Intelligence */}
      <AnimatedCard title="Competitor Intel Tracker" subTitle="SEO + Ad Strategy Tracking" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {mockCompetitorIntel.map((comp, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 shadow">
              <p className="font-bold text-gray-900 dark:text-white">{comp.name}</p>
              <p className="text-gray-600 dark:text-gray-400">Focus: {comp.focus}</p>
              <p className="text-xs text-gray-500">Est. Budget: {comp.estBudget}</p>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Ad Copy AI Suggestions */}
      <AnimatedCard title="AI-Generated Ad Copy" subTitle="Based on prompt themes">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {mockAdCopySuggestions.map((copy, i) => (
            <li key={i} className="p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow">
              <p className="font-semibold text-indigo-600 dark:text-indigo-400">Prompt: {copy.prompt}</p>
              <p className="mt-1 font-bold text-gray-800 dark:text-white">{copy.headline}</p>
              <p className="text-gray-600 dark:text-gray-400 italic">{copy.subtext}</p>
            </li>
          ))}
        </ul>
      </AnimatedCard>
    </div>
  );
};

export default MarketingOverviewView;

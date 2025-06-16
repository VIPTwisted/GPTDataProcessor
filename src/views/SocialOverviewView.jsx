
// src/views/SocialOverviewView.jsx
import React from 'react';
import {
  mockBrandMentions,
  mockStaffSocialFeed,
  mockInfluencerImpact,
  mockCrisisSignals,
  mockSentimentTrends,
  mockViralityPredictions
} from '../data/mockSocialData';
import AnimatedCard from '../components/widgets/AnimatedCard';

const SentimentBadge = ({ sentiment }) => {
  const colors = {
    'Positive': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
    'Negative': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    'Neutral': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[sentiment]}`}>
      {sentiment}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const colors = {
    'High': 'bg-red-600 text-white',
    'Medium': 'bg-orange-500 text-white',
    'Low': 'bg-yellow-500 text-white'
  };
  
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const SocialOverviewView = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">📣 Social Intelligence Dashboard</h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Real-time brand sentiment, employee advocacy tracking, and AI-powered crisis detection.
      </p>

      {/* Crisis Detection Alerts - Top Priority */}
      <AnimatedCard title="🚨 AI Crisis Detection Signals" subTitle="Auto-flagged anomaly trends requiring immediate attention" className="mb-8">
        <div className="space-y-4">
          {mockCrisisSignals.map((crisis, i) => (
            <div key={i} className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{crisis.type}</h4>
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={crisis.severity} />
                  <span className="text-xs text-gray-500">{crisis.timestamp}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{crisis.detail}</p>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                🚨 Activate Crisis Response Protocol
              </button>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Brand Mentions & Sentiment Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="📡 Real-Time Brand Mentions" subTitle="Live stream from all social platforms">
          <div className="space-y-4">
            {mockBrandMentions.map((mention) => (
              <div key={mention.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{mention.platform}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{mention.user}</span>
                  </div>
                  <SentimentBadge sentiment={mention.sentiment} />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{mention.message}"</p>
                <button className="mt-3 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  View Full Thread →
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard title="📊 Sentiment Trends (24h)" subTitle="Hourly sentiment distribution">
          <div className="space-y-3">
            {mockSentimentTrends.map((trend, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{trend.time}</span>
                <div className="flex-1 mx-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <div className="bg-green-500" style={{ width: `${trend.positive}%` }}></div>
                    <div className="bg-yellow-500" style={{ width: `${trend.neutral}%` }}></div>
                    <div className="bg-red-500" style={{ width: `${trend.negative}%` }}></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex gap-2">
                  <span className="text-green-600">{trend.positive}%</span>
                  <span className="text-yellow-600">{trend.neutral}%</span>
                  <span className="text-red-600">{trend.negative}%</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Employee Advocacy & Influencer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="👥 Employee Advocacy Feed" subTitle="Verified staff social amplification">
          <div className="space-y-4">
            {mockStaffSocialFeed.map((post) => (
              <div key={post.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{post.employee}</h4>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{post.handle}</p>
                  </div>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {post.reach.toLocaleString()} reach
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">"{post.content}"</p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                  🎯 Boost This Post
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard title="💥 Influencer Performance Tracker" subTitle="Ambassador impact metrics">
          <div className="space-y-4">
            {mockInfluencerImpact.map((influencer, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{influencer.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{influencer.platform}</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200 px-2 py-1 rounded">
                    {influencer.engagement} engagement
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Reach</p>
                    <p className="font-bold text-gray-900 dark:text-white">{influencer.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Conversions</p>
                    <p className="font-bold text-green-600 dark:text-green-400">{influencer.conversions}</p>
                  </div>
                </div>
                <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                  📈 View Campaign Details
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Virality Predictions */}
      <AnimatedCard title="🧠 AI Virality Predictions" subTitle="Content optimization recommendations" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockViralityPredictions.map((prediction, i) => (
            <div key={i} className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{prediction.content}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Platform:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{prediction.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Virality Score:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{prediction.viralityScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Predicted Reach:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{prediction.predictedReach}</span>
                </div>
              </div>
              <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors">
                🚀 Schedule Post
              </button>
            </div>
          ))}
        </div>
      </AnimatedCard>

      {/* Future Extensions */}
      <AnimatedCard title="🌱 Future Social Intelligence Extensions" subTitle="Planned AI-powered social capabilities">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🤖</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Auto-Response Bot</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered customer service replies</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">📱</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Content Calendar</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Automated posting schedule optimization</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Audience Insights</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Deep demographic and behavior analysis</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
            <div className="text-2xl mb-2">🔥</div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Trend Detection</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">Early identification of viral opportunities</p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default SocialOverviewView;

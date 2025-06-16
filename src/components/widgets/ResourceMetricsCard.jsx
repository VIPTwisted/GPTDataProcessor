
import React from 'react';
import AnimatedCard from './AnimatedCard';
import { mockResourceMetrics } from '../../data/mockGlobalData';

const ResourceMetricsCard = () => {
  const { cpuUsage, memoryUsage, networkBandwidth, cloudSpendEfficiency } = mockResourceMetrics;

  const getUsageColor = (usage) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 75) return 'bg-yellow-500';
    if (usage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getUsageTextColor = (usage) => {
    if (usage >= 90) return 'text-red-600 dark:text-red-400';
    if (usage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    if (usage >= 50) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  const MetricBar = ({ label, value, icon }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className={`text-sm font-bold ${getUsageTextColor(value)}`}>
          {value}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getUsageColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <AnimatedCard title="⚡ Resource Metrics" className="col-span-2 lg:col-span-1">
      <div className="space-y-6">
        {/* Resource Usage Bars */}
        <div className="space-y-4">
          <MetricBar label="CPU Usage" value={cpuUsage} icon="🔥" />
          <MetricBar label="Memory Usage" value={memoryUsage} icon="🧠" />
          <MetricBar label="Network Bandwidth" value={networkBandwidth} icon="🌐" />
        </div>

        {/* Cloud Spend Efficiency */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cloud Spend Efficiency</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(cloudSpendEfficiency * 100)}%
              </p>
            </div>
            <div className="text-3xl">💎</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
            🔧 Optimize
          </button>
          <button className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs">
            📊 Details
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All systems optimal</span>
          </span>
          <span>Last updated: now</span>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ResourceMetricsCard;
// src/components/widgets/ResourceMetricsCard.jsx
import React from 'react';
import AnimatedCard from './AnimatedCard';
import { mockResourceMetrics } from '../../data/mockGlobalData';

const ResourceMetricsCard = ({ onClick }) => {
  const { cpuUsage, memoryUsage, networkBandwidth, cloudSpendEfficiency, dailyTrend } = mockResourceMetrics;

  const getUsageColor = (usage) => {
    if (usage > 90) return 'text-red-500 dark:text-red-400';
    if (usage > 75) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getProgressBarColor = (usage) => {
    if (usage > 90) return 'bg-red-500';
    if (usage > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const efficiencyColor = cloudSpendEfficiency >= 0.9 ? 'text-green-500' : 'text-yellow-500';

  return (
    <AnimatedCard
      title="Global Resource Metrics"
      subTitle="Cloud & On-Prem Infrastructure"
      onClick={onClick}
      className="col-span-1"
    >
      <div className="space-y-6">
        {/* CPU Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
            <p className={`text-lg font-bold ${getUsageColor(cpuUsage)}`}>{cpuUsage}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(cpuUsage)}`}
              style={{ width: `${cpuUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
            <p className={`text-lg font-bold ${getUsageColor(memoryUsage)}`}>{memoryUsage}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(memoryUsage)}`}
              style={{ width: `${memoryUsage}%` }}
            ></div>
          </div>
        </div>

        {/* Network Bandwidth */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Network I/O</p>
            <p className={`text-lg font-bold ${getUsageColor(networkBandwidth)}`}>{networkBandwidth}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(networkBandwidth)}`}
              style={{ width: `${networkBandwidth}%` }}
            ></div>
          </div>
        </div>

        {/* Cloud Efficiency */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Cloud Efficiency</p>
            <p className={`text-xl font-bold ${efficiencyColor}`}>{(cloudSpendEfficiency * 100).toFixed(0)}%</p>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {cloudSpendEfficiency >= 0.9 ? 'Excellent optimization' : 'Room for improvement'}
          </p>
        </div>

        {/* Mini Trend Visualization */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">24h Trend</p>
          <div className="flex items-end space-x-1 h-12">
            {dailyTrend.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div
                  className="w-full bg-blue-500 opacity-70 rounded-t"
                  style={{ height: `${(item.cpu / 100) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-400 transform rotate-45 origin-left whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ResourceMetricsCard;


// src/components/widgets/PerformanceOverviewWidget.jsx
import React from 'react';
import AnimatedCard from './AnimatedCard';
import { mockPerformanceData } from '../../data/mockGlobalData';

const PerformanceOverviewWidget = ({ onClick }) => {
  const { overallLatency, errorRate, transactionsPerSecond } = mockPerformanceData;

  const getPerformanceStatusColor = (value, goodThreshold, warningThreshold) => {
    if (value <= goodThreshold) return 'text-green-500';
    if (value <= warningThreshold) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getErrorRateStatusColor = (value, goodThreshold, warningThreshold) => {
    if (value <= goodThreshold) return 'text-green-500';
    if (value <= warningThreshold) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AnimatedCard
      title="Performance Overview"
      subTitle="Key System Health Metrics"
      onClick={onClick}
      className="col-span-1 min-h-64"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Latency</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getPerformanceStatusColor(overallLatency, 100, 300)}`}>
              {overallLatency} ms
            </span>
            {/* Simplified indicator based on latency */}
            {overallLatency <= 100 && <span className="text-green-500">↑</span>}
            {overallLatency > 100 && overallLatency <= 300 && <span className="text-yellow-500">~</span>}
            {overallLatency > 300 && <span className="text-red-500">↓</span>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Error Rate</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${getErrorRateStatusColor(errorRate, 0.5, 2)}`}>
              {errorRate}%
            </span>
             {/* Simplified indicator based on error rate */}
             {errorRate <= 0.5 && <span className="text-green-500">✓</span>}
             {errorRate > 0.5 && errorRate <= 2 && <span className="text-yellow-500">!</span>}
             {errorRate > 2 && <span className="text-red-500">✗</span>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions/Sec</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {transactionsPerSecond.toLocaleString()}
            </span>
            {/* Always show a positive trend for high TPS, unless there's a specific "low TPS" threshold */}
            <span className="text-blue-500">→</span>
          </div>
        </div>

        {/* Simple conceptual progress bar for overall health, maybe combining metrics */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Overall Health Score (Conceptual)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-indigo-500"
              style={{ width: `${Math.max(0, 100 - (overallLatency / 5) - (errorRate * 5))}%` }} // Simplified calculation
            ></div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default PerformanceOverviewWidget;

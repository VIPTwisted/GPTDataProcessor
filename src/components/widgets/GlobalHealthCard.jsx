import React, { useState, useEffect } from 'react';
import AnimatedCard from './AnimatedCard';
import SparklineChart from './SparklineChart';
import { mockGlobalHealth, getStatusColor, getStatusIcon } from '../../data/mockGlobalData';
import { useIntelRouter } from '../../hooks/useIntelRouter';

const GlobalHealthCard = ({ onClick }) => {
  const { fetchIntel, loading, error } = useIntelRouter();
  const [healthData, setHealthData] = useState(mockGlobalHealth);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRealTimeHealth = async () => {
    try {
      const opsHealth = await fetchIntel({
        type: 'operations_health',
        params: {}
      });

      // Merge real data with mock structure
      const updatedHealth = {
        ...healthData,
        systemStatus: opsHealth.uptime > 99 ? 'Excellent' : opsHealth.uptime > 95 ? 'Good' : 'Needs Attention',
        uptime: opsHealth.uptime,
        activeSessions: opsHealth.active_sessions,
        responseTime: opsHealth.response_time,
        errorRate: parseFloat(opsHealth.error_rate)
      };

      setHealthData(updatedHealth);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('❌ Failed to fetch real-time health:', err);
    }
  };

  useEffect(() => {
    fetchRealTimeHealth();
    const interval = setInterval(fetchRealTimeHealth, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const { status, description, predictedStatus, predictionConfidence, performanceMetrics, trendData } = healthData;

  const statusColorClass = getStatusColor(status);
  const predictionColorClass = getStatusColor(predictedStatus);

  return (
    <AnimatedCard
      title="Global System Health"
      subTitle="AI-Powered Operational Status"
      onClick={onClick}
      className="col-span-1 lg:col-span-2"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColorClass}`}>
            {getStatusIcon(status)} {status}
          </span>
          <p className="ml-3 text-gray-700 dark:text-gray-300 text-lg font-medium">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Uptime</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{performanceMetrics.uptime}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg. Response Time</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.response_time_avg} ms</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Error Rate</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{performanceMetrics.error_rate}%</p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
          <span className="mr-2">🧠</span> AI Prediction:
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">24-Hour Forecast</p>
            <p className={`text-xl font-bold ${predictionColorClass}`}>
              {getStatusIcon(predictedStatus)} {predictedStatus}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{(predictionConfidence * 100).toFixed(0)}%</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Uptime Trend (Last 7 Days)</p>
          <SparklineChart
            data={trendData}
            dataKey="value"
            strokeColor={status === 'GREEN' ? '#10B981' : (status === 'YELLOW' ? '#F59E0B' : '#EF4444')}
          />
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GlobalHealthCard;
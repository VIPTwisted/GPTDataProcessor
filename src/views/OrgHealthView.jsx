
import React, { useState, useEffect } from 'react';
import AnimatedCard from '../components/widgets/AnimatedCard';

const OrgHealthView = () => {
  const [metrics, setMetrics] = useState({
    revenueMTD: 82400,
    newReps: 58,
    campaignsLaunched: 212,
    avgRepRetention: 89,
    trainingUptake: 67,
    avgXP: 1205,
    totalSales: 247800
  });

  const [alerts, setAlerts] = useState([
    { type: 'warning', message: 'LMS engagement down 12% this week', confidence: 0.85 },
    { type: 'info', message: 'New rep onboarding ahead of schedule', confidence: 0.92 },
    { type: 'critical', message: 'Rep churn risk detected for 3 members', confidence: 0.78 }
  ]);

  const [forecast, setForecast] = useState({
    nextMonthRevenue: 95600,
    expectedNewReps: 72,
    projectedGrowth: 16.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        revenueMTD: prev.revenueMTD + Math.floor(Math.random() * 500),
        campaignsLaunched: prev.campaignsLaunched + Math.floor(Math.random() * 3)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (type) => {
    switch(type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">🌐 Organizational Health Overview</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AnimatedCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${metrics.revenueMTD.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Revenue MTD</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.newReps}</p>
            <p className="text-sm text-gray-500">New Reps</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.campaignsLaunched}</p>
            <p className="text-sm text-gray-500">Campaigns Launched</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.avgRepRetention}%</p>
            <p className="text-sm text-gray-500">Rep Retention</p>
          </div>
        </AnimatedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* AI Alerts */}
        <AnimatedCard>
          <h2 className="text-lg font-semibold mb-4">🚨 AI System Alerts</h2>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <span className="text-xs">
                    {Math.round(alert.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* AI Forecast */}
        <AnimatedCard>
          <h2 className="text-lg font-semibold mb-4">🔮 AI Forecast (Next 30 Days)</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Projected Revenue:</span>
              <span className="font-semibold">${forecast.nextMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expected New Reps:</span>
              <span className="font-semibold">{forecast.expectedNewReps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Growth Rate:</span>
              <span className="font-semibold text-green-600">+{forecast.projectedGrowth}%</span>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard>
          <h3 className="font-semibold mb-2">Training Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{width: `${metrics.trainingUptake}%`}}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">{metrics.trainingUptake}% completion rate</p>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="font-semibold mb-2">Average XP Level</h3>
          <p className="text-2xl font-bold text-purple-600">{metrics.avgXP}</p>
          <p className="text-sm text-gray-500">Across all reps</p>
        </AnimatedCard>

        <AnimatedCard>
          <h3 className="font-semibold mb-2">Total Sales Volume</h3>
          <p className="text-2xl font-bold text-green-600">${metrics.totalSales.toLocaleString()}</p>
          <p className="text-sm text-gray-500">All-time total</p>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default OrgHealthView;

import React, { useState, useEffect } from 'react';
import AnimatedCard from './AnimatedCard';
import SparklineChart from './SparklineChart';
import { mockFinancialPulse, formatCurrency, getStatusColor } from '../../data/mockGlobalData';
import { useIntelRouter } from '../../hooks/useIntelRouter';

const FinancialPulseCard = ({ onClick }) => {
  const { fetchIntel, loading } = useIntelRouter();
  const [financialData, setFinancialData] = useState(mockFinancialPulse);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRealTimeFinancials = async () => {
    setRefreshing(true);
    try {
      const metrics = await fetchIntel({
        type: 'financial_metrics',
        params: {}
      });

      const updatedFinancials = {
        ...financialData,
        revenue: `$${(metrics.revenue / 1000).toFixed(0)}K`,
        profit: `$${((metrics.revenue - metrics.expenses) / 1000).toFixed(0)}K`,
        margins: metrics.profit_margin,
        cashFlow: `$${(metrics.cash_flow / 1000).toFixed(0)}K`
      };

      setFinancialData(updatedFinancials);
    } catch (err) {
      console.error('❌ Failed to fetch financial data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealTimeFinancials();
    const interval = setInterval(fetchRealTimeFinancials, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const { netProfit, cashFlow, budgetAdherenceScore, budgetVariance, trends } = mockFinancialPulse;

  const budgetStatus = budgetAdherenceScore >= 0.98 ? 'GREEN' : (budgetAdherenceScore >= 0.90 ? 'YELLOW' : 'RED');
  const budgetStatusColorClass = getStatusColor(budgetStatus);

  return (
    <AnimatedCard
      title="Unified Financial Pulse"
      subTitle="Real-time Revenue & Liquidity Overview"
      onClick={onClick}
      className="col-span-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Financial Pulse</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRealTimeFinancials}
            disabled={refreshing}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
          >
            {refreshing ? '🔄' : '💰'} Update
          </button>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-600">Live Data</span>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Current Net Profit (This Month)</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{formatCurrency(netProfit)}</p>
        <SparklineChart
          data={trends.netProfit.map(val => ({ value: val }))}
          dataKey="value"
          strokeColor="#10B981"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Cash Flow</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(cashFlow)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Budget Adherence</p>
          <p className={`text-xl font-semibold ${budgetStatusColorClass}`}>
            {(budgetAdherenceScore * 100).toFixed(1)}% {budgetVariance !== 0 && `(${budgetVariance > 0 ? '+' : ''}${(budgetVariance * 100).toFixed(1)}%)`}
          </p>
        </div>
        <div className="md:col-span-2 mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Cash Flow Trend</p>
          <SparklineChart
            data={trends.cashFlow.map(val => ({ value: val }))}
            dataKey="value"
            strokeColor="#3B82F6"
          />
        </div>
      </div>
    </AnimatedCard>
  );
};

export default FinancialPulseCard;

// src/views/FinanceOverviewView.jsx
import React from 'react';
import { mockFinancialReport } from '../data/mockFinancialDeepDive';
import AnimatedCard from '../components/widgets/AnimatedCard';

const CashFlowChart = () => {
  const maxValue = Math.max(
    ...mockFinancialReport.projectedCashFlow.map(d => Math.max(d.inflow, d.outflow))
  );

  return (
    <div className="space-y-3">
      {mockFinancialReport.projectedCashFlow.map((month, i) => {
        const netFlow = month.inflow - month.outflow;
        const isNegative = netFlow < 0;
        
        return (
          <div key={i} className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
              {month.month}
            </span>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-600">↗ ${(month.inflow/1000).toFixed(0)}k</span>
                <span className="text-red-500">↘ ${(month.outflow/1000).toFixed(0)}k</span>
              </div>
              <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-400 rounded-l"
                  style={{ width: `${(month.inflow / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="absolute top-0 right-0 h-full bg-red-400 rounded-r"
                  style={{ width: `${(month.outflow / maxValue) * 100}%` }}
                ></div>
              </div>
              <div className={`text-xs font-semibold ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
                Net: {isNegative ? '-' : '+'}${Math.abs(netFlow/1000).toFixed(0)}k
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FinanceOverviewView = () => {
  const netProfit = mockFinancialReport.netIncome;
  const budgetWarnings = mockFinancialReport.budgetTracking.filter(d => d.actual > d.budget);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        💸 Financial Intelligence Center
      </h1>
      <p className="text-md text-gray-600 dark:text-gray-400 mb-8">
        Real-time budget performance, predictive risk, and AI-powered profitability.
      </p>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AnimatedCard className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Net Income</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${netProfit.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">↗ 12.3% vs last quarter</p>
        </AnimatedCard>

        <AnimatedCard className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Gross Revenue</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${mockFinancialReport.grossRevenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">↗ 8.7% growth rate</p>
        </AnimatedCard>

        <AnimatedCard className="col-span-1">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Operating Expenses</h2>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            ${mockFinancialReport.operatingExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">↘ 3.2% efficiency gain</p>
        </AnimatedCard>
      </div>

      {/* Cash Flow Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnimatedCard title="💰 Cash Flow Forecast (6 Months)" className="col-span-1">
          <CashFlowChart />
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ AI Alert: November shows negative cash flow. Consider accelerating Q4 collections.
            </p>
          </div>
        </AnimatedCard>

        {/* Budget vs Actual */}
        <AnimatedCard title="📊 Budget vs Actual by Department" className="col-span-1">
          <div className="space-y-4">
            {mockFinancialReport.budgetTracking.map((d, i) => {
              const variance = d.actual - d.budget;
              const variancePercent = ((variance / d.budget) * 100).toFixed(1);
              const isOverBudget = variance > 0;
              
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{d.department}</span>
                    <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
                      {isOverBudget ? '+' : ''}{variancePercent}%
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gray-400 rounded"
                      style={{ width: `${(d.budget / 600000) * 100}%` }}
                    ></div>
                    <div 
                      className={`absolute top-0 left-0 h-full rounded ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${(d.actual / 600000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>Budget: ${d.budget.toLocaleString()}</span>
                    <span>Actual: ${d.actual.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {budgetWarnings.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                ⚠️ {budgetWarnings.length} departments exceeded budget targets.
              </p>
            </div>
          )}
        </AnimatedCard>
      </div>

      {/* Profitability Matrix */}
      <AnimatedCard title="🎯 Profitability by Business Unit" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {mockFinancialReport.profitabilityByEntity.map((e, i) => {
            const isProfit = e.profit >= 0;
            const profitMagnitude = Math.abs(e.profit);
            const maxProfit = Math.max(...mockFinancialReport.profitabilityByEntity.map(p => Math.abs(p.profit)));
            const intensity = (profitMagnitude / maxProfit) * 100;
            
            return (
              <div 
                key={i} 
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  isProfit 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
                style={{ 
                  boxShadow: `0 0 ${intensity/2}px ${isProfit ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` 
                }}
              >
                <p className="font-semibold text-gray-700 dark:text-gray-100 text-sm mb-2">{e.name}</p>
                <p className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                  {isProfit ? '+' : '-'}${profitMagnitude.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {((profitMagnitude / mockFinancialReport.grossRevenue) * 100).toFixed(1)}% of revenue
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🧠 AI Insights</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Ecom Platform drives 49% of total profits - consider expansion investment</li>
            <li>• Warehouse Ops showing losses - operational audit recommended</li>
            <li>• MLM Network underperforming - review commission structure</li>
          </ul>
        </div>
      </AnimatedCard>
    </div>
  );
};

export default FinanceOverviewView;

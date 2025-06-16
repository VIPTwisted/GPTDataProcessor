
// src/components/widgets/ComplianceStatusWidget.jsx
import React from 'react';
import AnimatedCard from './AnimatedCard';
import { mockComplianceData } from '../../data/mockGlobalData';

const ComplianceItem = ({ standard, status, progress }) => {
  let icon = '';
  let color = '';
  let statusText = '';

  switch (status.toLowerCase()) {
    case 'compliant':
      icon = '✅';
      color = 'text-green-500';
      statusText = 'Compliant';
      break;
    case 'non-compliant':
      icon = '❌';
      color = 'text-red-500';
      statusText = 'Non-Compliant';
      break;
    case 'auditing':
      icon = '⏳';
      color = 'text-yellow-500';
      statusText = 'Auditing';
      break;
    case 'partially-compliant':
      icon = '⚠️';
      color = 'text-orange-500';
      statusText = 'Partially Compliant';
      break;
    default:
      icon = 'ℹ️';
      color = 'text-gray-500';
      statusText = 'Unknown';
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-2">
        <span className={`text-lg ${color}`}>{icon}</span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{standard}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-semibold ${color}`}>{statusText}</span>
        {progress !== undefined && progress !== null && (
          <span className="text-xs text-gray-500 dark:text-gray-400">({progress}%)</span>
        )}
      </div>
    </div>
  );
};

const ComplianceStatusWidget = ({ onClick }) => {
  const { overallStatus, standards } = mockComplianceData;

  const getOverallStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'fully compliant':
        return 'text-green-600';
      case 'partial compliance':
        return 'text-orange-500';
      case 'at risk':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <AnimatedCard
      title="Compliance Status"
      subTitle="Regulatory & Policy Adherence"
      onClick={onClick}
      className="col-span-1 min-h-64"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-300 dark:border-gray-600">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Status:</span>
          <span className={`text-lg font-bold ${getOverallStatusColor(overallStatus)}`}>
            {overallStatus}
          </span>
        </div>

        <div className="space-y-2">
          {standards.map((item, index) => (
            <ComplianceItem key={index} {...item} />
          ))}
        </div>

        {/* Simple conceptual compliance score/progress bar */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compliance Score (Weighted)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="h-2.5 rounded-full bg-purple-500"
              style={{ width: `${mockComplianceData.overallScore}%` }}
            ></div>
          </div>
          <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">{mockComplianceData.overallScore}% Achieved</p>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ComplianceStatusWidget;

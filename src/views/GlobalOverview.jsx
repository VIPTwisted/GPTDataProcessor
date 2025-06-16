import React from 'react';
import { useBrandConfig } from '../hooks/useBrandConfig';
import ExecutiveSummaryWidget from '../components/widgets/ExecutiveSummaryWidget';
import GlobalHealthCard from '../components/widgets/GlobalHealthCard';
import FinancialPulseCard from '../components/widgets/FinancialPulseCard';
import ResourceMetricsCard from '../components/widgets/ResourceMetricsCard';
import RecentActivitiesWidget from '../components/widgets/RecentActivitiesWidget';
import PerformanceOverviewWidget from '../components/widgets/PerformanceOverviewWidget';
import GeospatialMapWidget from '../components/widgets/GeospatialMapWidget';
import GlobalActivityStream from '../components/widgets/GlobalActivityStream';
import AIPrescriptiveActions from '../components/widgets/AIPrescriptiveActions';
import AuditTrailWidget from '../components/widgets/AuditTrailWidget';
import ComplianceStatusWidget from '../components/widgets/ComplianceStatusWidget';
import PrioritizedActionQueue from '../components/actions/PrioritizedActionQueue';

const GlobalOverview = ({ brandId = 'toyparty' }) => {
  const { config: brand, loading } = useBrandConfig(brandId);

  const handleCardClick = (moduleName) => {
    // In a real app, this would navigate to a detailed view for each module
    console.log(`Deep dive into: ${moduleName}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading {brandId} dashboard...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Brand Not Found</h1>
          <p className="text-gray-600">Could not load configuration for brand: {brandId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Brand Header */}
      <header className="mb-8" style={{ borderLeftColor: brand.primaryColor, borderLeftWidth: '6px', paddingLeft: '1rem' }}>
        <div className="flex items-center space-x-4 mb-4">
          {brand.logo && (
            <img src={brand.logo} alt={brand.displayName} className="h-8 w-8" onError={(e) => e.target.style.display = 'none'} />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight" style={{ color: brand.primaryColor }}>
            🌍 {brand.displayName} Global Overview
          </h1>
        </div>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-1">
          AI-driven command center for unified business operations.
        </p>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Brand: {brand.brandId}</span>
          <span>•</span>
          <span>AI Tone: {brand.gptPersona.tone}</span>
          <span>•</span>
          <span>Active Modules: {Object.keys(brand.modules).filter(m => brand.modules[m]).length}</span>
        </div>
      </header>

      {/* Main Grid for Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Full-width Geospatial Map */}
        <div className="md:col-span-2 lg:col-span-4">
          <GeospatialMapWidget onClick={() => handleCardClick('Geospatial')} />
        </div>

        {/* Top Row - Critical Overview */}
        <div className="lg:col-span-2">
          <GlobalHealthCard onClick={() => handleCardClick('System Health')} />
        </div>

        <div className="lg:col-span-2">
          <PrioritizedActionQueue onClick={() => handleCardClick('Action Queue')} />
        </div>

        {/* Second Row - Activity & Performance */}
        <div className="lg:col-span-2">
          <GlobalActivityStream onClick={() => handleCardClick('Activity Log')} />
        </div>

        <div className="lg:col-span-2">
          <AIPrescriptiveActions onClick={() => handleCardClick('AI Actions')} />
        </div>

        {/* Third Row - Performance & Infrastructure */}
        <div className="lg:col-span-1">
          <PerformanceOverviewWidget onClick={() => handleCardClick('Performance')} />
        </div>

        <div className="lg:col-span-1">
          <ResourceMetricsCard onClick={() => handleCardClick('Infrastructure')} />
        </div>

        {/* Fourth Row - Business Intelligence */}
        <div className="lg:col-span-1">
          <FinancialPulseCard onClick={() => handleCardClick('Financials')} />
        </div>

        <div className="lg:col-span-1">
          <ComplianceStatusWidget onClick={() => handleCardClick('Compliance')} />
        </div>

        <div className="lg:col-span-2">
          <RecentActivitiesWidget onClick={() => handleCardClick('Recent Activities')} />
        </div>
      </div>

      <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Unified Operations Platform | Project: "Kitchen Sink"</p>
      </footer>
    </div>
  );
};

export default GlobalOverview;
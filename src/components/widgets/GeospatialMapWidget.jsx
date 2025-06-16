// src/components/widgets/GeospatialMapWidget.jsx
import React, { useState } from 'react';
import AnimatedCard from './AnimatedCard';
import {
  mockGeospatialData,
  mockOverlayLayers,
  getStatusColor,
  getStatusIcon
} from '../../data/mockGlobalData';

const GeospatialMapWidget = ({ onClick }) => {
  const [activeOverlay, setActiveOverlay] = useState('none');

  const getOverlayIntensity = (locationId) => {
    if (activeOverlay === 'salesHeat') {
      const found = mockOverlayLayers.salesHeat.data.find((d) => d.id === locationId);
      return found ? found.intensity : 0;
    }
    return 0;
  };

  const getOverlayRisk = (locationId) => {
    if (activeOverlay === 'predictiveRisk') {
      return mockOverlayLayers.predictiveRisk.data.find((r) => r.id === locationId);
    }
    return null;
  };

  return (
    <AnimatedCard
      title="🌍 Geospatial Intelligence"
      subTitle="Heatmaps & Predictive Risk Layers"
      onClick={onClick}
      className="col-span-1 lg:col-span-3 h-96 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800 rounded-lg p-4">
        {/* Background Map Visual */}
        <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20">
          <path fill="#a5b4fc" d="M400 0 C150 100 150 300 400 400 C650 300 650 100 400 0 Z" />
          <circle cx="200" cy="150" r="30" fill="#60a5fa" opacity="0.3" />
          <circle cx="600" cy="250" r="25" fill="#34d399" opacity="0.3" />
          <rect x="300" y="200" width="200" height="100" fill="#f59e0b" opacity="0.2" rx="10" />
        </svg>

        {/* Overlay Toggle Controls */}
        <div className="absolute top-2 right-4 z-20 bg-white dark:bg-gray-900/90 rounded-lg shadow-md flex gap-2 px-4 py-2 text-xs font-medium">
          <button
            className={`px-3 py-1 rounded transition-all ${
              activeOverlay === 'none' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setActiveOverlay('none')}
          >
            📍 Base
          </button>
          <button
            className={`px-3 py-1 rounded transition-all ${
              activeOverlay === 'salesHeat' 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setActiveOverlay('salesHeat')}
          >
            🔥 Sales Heat
          </button>
          <button
            className={`px-3 py-1 rounded transition-all ${
              activeOverlay === 'predictiveRisk' 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => setActiveOverlay('predictiveRisk')}
          >
            ⚠️ Risk
          </button>
        </div>

        {/* Active Overlay Legend */}
        {activeOverlay !== 'none' && (
          <div className="absolute bottom-4 left-4 z-20 bg-white dark:bg-gray-900/90 rounded-lg shadow-md px-3 py-2 text-xs">
            <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
              {mockOverlayLayers[activeOverlay]?.label}
            </div>
            {activeOverlay === 'salesHeat' && (
              <div className="text-gray-600 dark:text-gray-400">
                Size = Revenue Intensity
              </div>
            )}
            {activeOverlay === 'predictiveRisk' && (
              <div className="text-gray-600 dark:text-gray-400">
                Risk Level & Disruption Type
              </div>
            )}
          </div>
        )}

        {/* Location Pins with Dynamic Overlays */}
        {mockGeospatialData.map((loc) => {
          const positions = {
            hartford: { top: '30%', left: '42%' },
            orange: { top: '68%', left: '32%' },
            manchester: { top: '38%', left: '63%' },
            southington: { top: '55%', left: '41%' },
            warehouse: { top: '48%', left: '48%' },
            'cloud-east': { top: '38%', left: '80%' },
            'cloud-west': { top: '64%', left: '8%' }
          };

          const pos = positions[loc.id] || { top: '50%', left: '50%' };
          const statusClass = getStatusColor(loc.status);
          const intensity = getOverlayIntensity(loc.id);
          const risk = getOverlayRisk(loc.id);

          return (
            <div
              key={loc.id}
              className="absolute flex flex-col items-center z-10"
              style={{ 
                top: pos.top, 
                left: pos.left, 
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Sales Heat Overlay - Expanding Rings */}
              {intensity > 0 && (
                <>
                  <div
                    className="absolute rounded-full opacity-30 animate-ping"
                    style={{
                      width: `${30 + intensity * 60}px`,
                      height: `${30 + intensity * 60}px`,
                      backgroundColor: 'rgba(255, 102, 0, 0.6)',
                      animationDuration: '2s'
                    }}
                  />
                  <div
                    className="absolute rounded-full opacity-20"
                    style={{
                      width: `${20 + intensity * 40}px`,
                      height: `${20 + intensity * 40}px`,
                      backgroundColor: 'rgba(255, 102, 0, 0.8)'
                    }}
                  />
                </>
              )}

              {/* Risk Overlay - Warning Badge */}
              {risk && (
                <div className="absolute -top-12 bg-red-600 text-white px-2 py-1 text-[10px] rounded-md shadow-lg z-20 animate-pulse">
                  <div className="font-bold">⚠️ {risk.reason}</div>
                  <div className="text-red-200">{Math.round(risk.risk * 100)}% Risk</div>
                </div>
              )}

              {/* Main Location Pin */}
              <div className="relative">
                <span className={`text-2xl ${statusClass} drop-shadow-md transition-all hover:scale-110`}>
                  {getStatusIcon(loc.status)}
                </span>
                {/* Pulse effect for active overlays */}
                {(intensity > 0 || risk) && (
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <span className={`text-2xl ${statusClass}`}>
                      {getStatusIcon(loc.status)}
                    </span>
                  </div>
                )}
              </div>

              {/* Location Label */}
              <div className="mt-1 text-center">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm">
                  {loc.name}
                </span>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {loc.type}
                </div>
              </div>
            </div>
          );
        })}

        {/* Real-time Data Indicators */}
        <div className="absolute top-16 right-4 z-10 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/80 rounded-md px-2 py-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Data Stream
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default GeospatialMapWidget;
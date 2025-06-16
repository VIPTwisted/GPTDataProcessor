
// src/components/ai/SelfTuningPanel.jsx
import React, { useState, useEffect } from 'react';
import { useSelfTuner } from '../../hooks/useSelfTuner';
import AnimatedCard from '../widgets/AnimatedCard';
import { FaBrain, FaChartLine, FaCog, FaRocket, FaShieldAlt } from 'react-icons/fa';

const SelfTuningPanel = () => {
  const { tuningData, loading, error, runTuning, getAIConfig } = useSelfTuner();
  const [aiConfig, setAiConfig] = useState(null);
  const [autoTune, setAutoTune] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await getAIConfig();
      if (config) {
        setAiConfig(config);
      }
    };
    loadConfig();
  }, [getAIConfig, tuningData]);

  useEffect(() => {
    if (autoTune) {
      const interval = setInterval(() => {
        runTuning();
      }, 300000); // Auto-tune every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoTune, runTuning]);

  const handleTuneNow = async () => {
    try {
      await runTuning();
    } catch (err) {
      console.error('Manual tuning failed:', err);
    }
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAggressivenessIcon = (level) => {
    if (level >= 0.8) return <FaRocket className="text-red-500" />;
    if (level >= 0.6) return <FaChartLine className="text-yellow-500" />;
    return <FaShieldAlt className="text-green-500" />;
  };

  return (
    <AnimatedCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaBrain className="text-blue-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Self-Tuning System
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoTune}
                onChange={(e) => setAutoTune(e.target.checked)}
                className="rounded"
              />
              Auto-Tune
            </label>
            <button
              onClick={handleTuneNow}
              disabled={loading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:bg-gray-400"
            >
              {loading ? <FaCog className="animate-spin" /> : 'Tune Now'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            Error: {error}
          </div>
        )}

        {/* Current AI Configuration */}
        {aiConfig && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Confidence Threshold
                </span>
                <FaShieldAlt className="text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(aiConfig.confidenceThreshold * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Success Rate
                </span>
                <FaChartLine className={getPerformanceColor(aiConfig.successRate)} />
              </div>
              <div className={`text-2xl font-bold ${getPerformanceColor(aiConfig.successRate)}`}>
                {(aiConfig.successRate * 100).toFixed(0)}%
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Aggressiveness
                </span>
                {getAggressivenessIcon(aiConfig.aggressiveness)}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(aiConfig.aggressiveness * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        )}

        {/* Latest Tuning Results */}
        {tuningData && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
              Latest Tuning Results
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Logs Scanned:</span>
                <span className="ml-2 font-medium">{tuningData.logsScanned}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Decisions:</span>
                <span className="ml-2 font-medium">{tuningData.validDecisions}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                <span className="ml-2 font-medium text-green-600">{tuningData.successRate}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">New Threshold:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {(tuningData.newThreshold * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            {tuningData.tuningReason && (
              <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
                <strong>Tuning Reason:</strong> {tuningData.tuningReason}
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full ${aiConfig ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span>
            {aiConfig ? 'AI Brain Active' : 'Loading Configuration...'}
          </span>
          {aiConfig?.lastTuned && (
            <span className="ml-4">
              Last tuned: {new Date(aiConfig.lastTuned).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </AnimatedCard>
  );
};

export default SelfTuningPanel;

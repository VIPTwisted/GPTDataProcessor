
// src/components/widgets/ExecutiveSummaryWidget.jsx
import React, { useEffect, useState } from 'react';
import AnimatedCard from './AnimatedCard';
import { mockGlobalHealth, mockAIPrescriptiveActions, mockGlobalActivityStream } from '../../data/mockGlobalData';
import { FaMicrophone, FaVolumeUp, FaPause, FaPlay } from 'react-icons/fa';

const generateExecutiveSummary = () => {
  const criticalEvents = mockGlobalActivityStream.filter(e => e.severity === 'Critical');
  const pendingActions = mockAIPrescriptiveActions.filter(a => a.status === 'Pending Approval');
  const prediction = mockGlobalHealth.predictedStatus;
  const confidence = (mockGlobalHealth.predictionConfidence * 100).toFixed(1);

  return `Current system status is "${mockGlobalHealth.status}" (${mockGlobalHealth.description}).
${criticalEvents.length > 0 ? `There are ${criticalEvents.length} critical anomalies requiring attention.` : 'No critical events detected.'}
AI forecasts the system will remain "${prediction}" with ${confidence}% confidence.
${pendingActions.length > 0 ? `${pendingActions.length} high-priority AI actions are awaiting approval.` : 'All AI actions are under control.'}`;
};

const speakSummary = (summary) => {
  const utterance = new SpeechSynthesisUtterance(summary);
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 0.9;
  utterance.volume = 0.8;
  window.speechSynthesis.speak(utterance);
  return utterance;
};

const ExecutiveSummaryWidget = () => {
  const [summary, setSummary] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommand, setVoiceCommand] = useState('');

  useEffect(() => {
    const newSummary = generateExecutiveSummary();
    setSummary(newSummary);
  }, []);

  useEffect(() => {
    // Voice command listener
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        setVoiceCommand(command);
        
        if (command.includes('hey orchestrator') || command.includes('summary')) {
          handleSpeak();
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      window.voiceRecognition = recognition;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = speakSummary(summary);
      setIsSpeaking(true);
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
    }
  };

  const handleVoiceCommand = () => {
    if (!window.voiceRecognition) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      window.voiceRecognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      window.voiceRecognition.start();
    }
  };

  const refreshSummary = () => {
    const newSummary = generateExecutiveSummary();
    setSummary(newSummary);
    setVoiceCommand('');
  };

  return (
    <AnimatedCard
      title="🧠 Executive AI Summary"
      subTitle="Voice-enabled natural language overview"
      className="col-span-1 lg:col-span-2"
    >
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line text-sm leading-relaxed">
            {summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleSpeak}
              disabled={!summary}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSpeaking
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <FaPause /> Stop Speaking
                </>
              ) : (
                <>
                  <FaVolumeUp /> Speak Summary
                </>
              )}
            </button>

            <button
              onClick={handleVoiceCommand}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isListening
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <FaMicrophone />
              {isListening ? 'Listening...' : 'Voice Command'}
            </button>

            <button
              onClick={refreshSummary}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Say "Hey Orchestrator" or "Summary" for voice activation
          </div>
        </div>

        {voiceCommand && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Last Voice Command:</div>
            <div className="text-sm text-blue-800 dark:text-blue-300">"{voiceCommand}"</div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-3">
          <div className="flex justify-between">
            <span>🤖 AI Cognitive Analysis</span>
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default ExecutiveSummaryWidget;

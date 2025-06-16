// src/components/system/VoiceCommandEngine.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getSpeechRecognition = () => {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const parseCommandIntent = (text) => {
  const cleaned = text.toLowerCase();

  if (/summary|what('|')s.*health/.test(cleaned)) return 'EXECUTIVE_SUMMARY';
  if (/show.*actions|ai queue|prescriptive/.test(cleaned)) return 'ACTIONS_VIEW';
  if (/finance|financial|budget|cash flow|profit/.test(cleaned)) return 'FINANCE_VIEW';
  if (/operations|infrastructure|system.*health|topology/.test(cleaned)) return 'OPERATIONS_VIEW';
  if (/ecommerce|sales|funnel|churn|mlm/.test(cleaned)) return 'ECOMMERCE_VIEW';
  if (/support|customer.*service|tickets|sentiment|agents/.test(cleaned)) return 'SUPPORT_VIEW';
  if (/marketing|seo|campaigns|ads|competitor/.test(cleaned)) return 'MARKETING_VIEW';
  if (/hr|human.*resources|employees|staff|attrition|onboarding/.test(cleaned)) return 'HR_VIEW';
  if (/social|social media|brand mentions|influencer|sentiment|advocacy/.test(cleaned)) return 'SOCIAL_VIEW';
  if (/go.*dashboard|overview/.test(cleaned)) return 'DASHBOARD';
  if (/dark mode|light mode/.test(cleaned)) return 'TOGGLE_THEME';
  if (/refresh/.test(cleaned)) return 'REFRESH_VIEW';
if (/supply chain|inventory|supplier|route optimization/.test(cleaned)) return 'SUPPLY_CHAIN_VIEW';

  return null;
};

const VoiceCommandEngine = ({ onToggleTheme, onTriggerSummary }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (err) => {
      console.warn('Voice recognition error:', err);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setLastCommand(transcript);
      const intent = parseCommandIntent(transcript);

      switch (intent) {
        case 'EXECUTIVE_SUMMARY':
          onTriggerSummary?.();
          break;
        case 'ACTIONS_VIEW':
          navigate('/actions');
          break;
        case 'FINANCE_VIEW':
          navigate('/finance');
          break;
        case 'OPERATIONS_VIEW':
          navigate('/operations');
          break;
        case 'ECOMMERCE_VIEW':
          navigate('/ecommerce');
          break;
        case 'SUPPORT_VIEW':
          navigate('/support');
          break;
        case 'MARKETING_VIEW':
          navigate('/marketing');
          break;
        case 'HR_VIEW':
          navigate('/hr');
          break;
        case 'SOCIAL_VIEW':
          navigate('/social');
          break;
        case 'DASHBOARD':
          navigate('/');
          break;
        case 'TOGGLE_THEME':
          onToggleTheme?.();
          break;
        case 'REFRESH_VIEW':
          window.location.reload();
          break;
	      case 'SUPPLY_CHAIN_VIEW':
          navigate('/supply-chain');
          break;
        default:
          console.log('No matching voice intent.');
      }
    };

    recognition.start();

    return () => recognition.stop();
  }, [navigate, onToggleTheme, onTriggerSummary]);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full shadow-lg text-xs text-gray-700 dark:text-gray-300 flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-ping' : 'bg-gray-400'}`}></span>
      <span>Voice {isListening ? 'Listening' : 'Idle'}: </span>
      <span className="italic truncate max-w-[200px]">{lastCommand || 'Say something...'}</span>
    </div>
  );
};

export default VoiceCommandEngine;
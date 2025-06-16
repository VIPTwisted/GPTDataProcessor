
import React from 'react';

const LanguageSelector = ({ language, setLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  return (
    <div className="flex items-center text-sm">
      <span className="text-gray-600 dark:text-gray-400 mr-2">🌐 Language:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="ml-2 border border-gray-300 dark:border-gray-600 p-1 rounded 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;

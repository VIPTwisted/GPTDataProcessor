
import React, { createContext, useState, useContext } from 'react';

const AutopilotContext = createContext();

export const AutopilotProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(true); // Default ON

  return (
    <AutopilotContext.Provider value={{ enabled, toggle: () => setEnabled(prev => !prev) }}>
      {children}
    </AutopilotContext.Provider>
  );
}
export const useAutopilot = () => useContext(AutopilotContext);

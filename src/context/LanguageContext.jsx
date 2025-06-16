
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check localStorage first, then browser locale, default to English
    const savedLang = localStorage.getItem('gemini-language');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language.slice(0, 2);
    const supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ru'];
    return supportedLangs.includes(browserLang) ? browserLang : 'en';
  });

  const updateLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('gemini-language', newLang);
  };

  const t = (key, fallback = key) => {
    // Simple translation function - can be expanded with full i18n library
    const translations = {
      en: {
        'dashboard': 'Dashboard',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'profile': 'Profile',
        'logout': 'Logout',
        'loading': 'Loading...',
        'error': 'Error',
        'success': 'Success',
        'save': 'Save',
        'cancel': 'Cancel',
        'delete': 'Delete',
        'edit': 'Edit',
        'add': 'Add',
        'search': 'Search',
        'filter': 'Filter',
        'export': 'Export'
      },
      es: {
        'dashboard': 'Panel de Control',
        'analytics': 'Analíticas',
        'settings': 'Configuración',
        'profile': 'Perfil',
        'logout': 'Cerrar Sesión',
        'loading': 'Cargando...',
        'error': 'Error',
        'success': 'Éxito',
        'save': 'Guardar',
        'cancel': 'Cancelar',
        'delete': 'Eliminar',
        'edit': 'Editar',
        'add': 'Agregar',
        'search': 'Buscar',
        'filter': 'Filtrar',
        'export': 'Exportar'
      },
      fr: {
        'dashboard': 'Tableau de Bord',
        'analytics': 'Analyses',
        'settings': 'Paramètres',
        'profile': 'Profil',
        'logout': 'Déconnexion',
        'loading': 'Chargement...',
        'error': 'Erreur',
        'success': 'Succès',
        'save': 'Enregistrer',
        'cancel': 'Annuler',
        'delete': 'Supprimer',
        'edit': 'Modifier',
        'add': 'Ajouter',
        'search': 'Rechercher',
        'filter': 'Filtrer',
        'export': 'Exporter'
      },
      de: {
        'dashboard': 'Dashboard',
        'analytics': 'Analytik',
        'settings': 'Einstellungen',
        'profile': 'Profil',
        'logout': 'Abmelden',
        'loading': 'Laden...',
        'error': 'Fehler',
        'success': 'Erfolg',
        'save': 'Speichern',
        'cancel': 'Abbrechen',
        'delete': 'Löschen',
        'edit': 'Bearbeiten',
        'add': 'Hinzufügen',
        'search': 'Suchen',
        'filter': 'Filter',
        'export': 'Exportieren'
      }
    };

    return translations[language]?.[key] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: updateLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

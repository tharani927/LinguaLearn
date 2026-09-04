import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi } from '../services/api';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('lingualearn_theme') || 'ocean');
  const [appearance, setAppearance] = useState(localStorage.getItem('lingualearn_appearance') || 'system');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('lingualearn_theme', theme);

    const applyDarkMode = () => {
      if (appearance === 'dark') {
        root.classList.add('dark');
      } else if (appearance === 'light') {
        root.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };

    applyDarkMode();
    localStorage.setItem('lingualearn_appearance', appearance);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (appearance === 'system') applyDarkMode();
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, appearance]);

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      if (localStorage.getItem('lingualearn_token')) {
        await userApi.updateTheme({ theme: newTheme, appearance });
      }
    } catch (err) {
      console.warn('Could not sync theme to server:', err.message);
    }
  };

  const changeAppearance = async (newAppearance) => {
    setAppearance(newAppearance);
    try {
      if (localStorage.getItem('lingualearn_token')) {
        await userApi.updateTheme({ theme, appearance: newAppearance });
      }
    } catch (err) {
      console.warn('Could not sync appearance to server:', err.message);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, appearance, changeTheme, changeAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

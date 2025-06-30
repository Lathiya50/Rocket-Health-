import { STORAGE_KEYS } from '../config/constants.js';

/**
 * Local storage utility functions
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.warn('Error copying to clipboard:', error);
    return false;
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

export const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const countCharacters = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.length;
};

/**
 * Download text as file
 */
export const downloadAsFile = (text, filename, mimeType = 'text/plain') => {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Auto-save functionality
 */
export const autoSave = {
  saveSessionNotes: (notes) => {
    storage.set(STORAGE_KEYS.SESSION_NOTES, notes);
  },

  loadSessionNotes: () => {
    return storage.get(STORAGE_KEYS.SESSION_NOTES, '');
  },

  savePreferences: (preferences) => {
    storage.set(STORAGE_KEYS.PREFERENCES, preferences);
  },

  loadPreferences: () => {
    return storage.get(STORAGE_KEYS.PREFERENCES, {});
  },

  saveLastSummary: (summary) => {
    storage.set(STORAGE_KEYS.LAST_SUMMARY, summary);
  },

  loadLastSummary: () => {
    return storage.get(STORAGE_KEYS.LAST_SUMMARY, null);
  }
};

import { jsPDF } from 'jspdf';
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
 * Convert markdown to plain text
 */
export const markdownToPlainText = (markdown) => {
  if (!markdown) return '';
  return markdown
    // Remove headers
    .replace(/^#+\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks but keep content
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code but keep content
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Convert list items to plain text with newlines
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text, asPlainText = true) => {
  try {
    const contentToCopy = asPlainText ? markdownToPlainText(text) : text;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(contentToCopy);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = contentToCopy;
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
export const downloadAsFile = (text, filename, format = 'pdf') => {
  try {
    if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Convert to plain text for PDF
      const plainText = markdownToPlainText(text);
      
      // PDF configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 7;
      const fontSize = 12;
      const maxWidth = pageWidth - (margin * 2);
      
      // Set font configuration
      doc.setFont('helvetica');
      doc.setFontSize(fontSize);
      
      // Add title
      const title = filename.replace(/consultation-summary-/, 'Consultation Summary - ').replace(/-/g, ':');
      doc.setFontSize(16);
      doc.text(title, margin, margin + 5);
      
      // Reset font size for content
      doc.setFontSize(fontSize);
      
      // Split text into lines that fit the page width
      const textLines = doc.splitTextToSize(plainText, maxWidth);
      
      // Calculate lines per page
      const linesPerPage = Math.floor((pageHeight - (margin * 2) - 20) / lineHeight);
      
      // Add text page by page
      let currentLine = 0;
      while (currentLine < textLines.length) {
        if (currentLine > 0) {
          doc.addPage();
        }
        
        // Add page number
        const pageNum = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Page ${pageNum}`, pageWidth - margin - 15, pageHeight - margin);
        doc.setFontSize(fontSize);
        
        // Calculate remaining lines for this page
        const remainingLines = textLines.slice(currentLine, currentLine + linesPerPage);
        
        // Add text for this page
        doc.text(remainingLines, margin, currentLine === 0 ? margin + 20 : margin + 10);
        
        // Update current line
        currentLine += linesPerPage;
      }
      
      // Save PDF
      doc.save(filename.replace(/\.[^/.]+$/, '.pdf'));
    } else {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    return true;
  } catch (error) {
    console.error('Error downloading file:', error);
    return false;
  }
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

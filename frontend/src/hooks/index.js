import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/apiService.js';
import { autoSave, debounce } from '../utils/helpers.js';
import { SUMMARY_OPTIONS } from '../config/constants.js';

export const useSummaryGenerator = () => {
  const [state, setState] = useState({
    sessionNotes: '',
    preferences: {
      tone: SUMMARY_OPTIONS.TONE.NEUTRAL,
      includeActionItems: true,
      anonymizeData: false,
      sessionType: SUMMARY_OPTIONS.SESSION_TYPE.THERAPY,
      summaryLength: SUMMARY_OPTIONS.SUMMARY_LENGTH.MEDIUM
    },
    summary: null,
    isLoading: false,
    error: null,
    isGenerating: false
  });

  useEffect(() => {
    const savedNotes = autoSave.loadSessionNotes();
    const savedPreferences = autoSave.loadPreferences();
    const lastSummary = autoSave.loadLastSummary();

    setState(prev => ({
      ...prev,
      sessionNotes: savedNotes,
      preferences: { ...prev.preferences, ...savedPreferences },
      summary: lastSummary
    }));
  }, []);

  const debouncedSaveNotes = useMemo(
    () => debounce((notes) => {
      autoSave.saveSessionNotes(notes);
    }, 1000),
    []
  );

  const savePreferences = useCallback((preferences) => {
    autoSave.savePreferences(preferences);
  }, []);

  const updateSessionNotes = useCallback((notes) => {
    setState(prev => ({ ...prev, sessionNotes: notes, error: null }));
    debouncedSaveNotes(notes);
  }, [debouncedSaveNotes]);

  const updatePreferences = useCallback((newPreferences) => {
    setState(prev => {
      const updatedPreferences = { ...prev.preferences, ...newPreferences };
      savePreferences(updatedPreferences);
      return { ...prev, preferences: updatedPreferences, error: null };
    });
  }, [savePreferences]);

  const generateSummary = useCallback(async () => {
    if (!state.sessionNotes.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter session notes before generating a summary.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, isGenerating: true, error: null }));

    try {
      const response = await apiService.generateSummary({
        sessionNotes: state.sessionNotes,
        preferences: state.preferences
      });

      if (response.success) {
        const summaryData = {
          ...response.data,
          generatedAt: new Date().toISOString()
        };
        
        setState(prev => ({ 
          ...prev, 
          summary: summaryData,
          isLoading: false,
          isGenerating: false,
          error: null 
        }));
        
        autoSave.saveLastSummary(summaryData);
      } else {
        throw new Error(response.message || 'Failed to generate summary');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        isGenerating: false,
        error: error.message || 'Failed to generate summary. Please try again.' 
      }));
    }
  }, [state.sessionNotes, state.preferences]);

  const updateSummary = useCallback((newSummaryContent) => {
    setState(prev => {
      if (!prev.summary) return prev;
      
      const updatedSummary = {
        ...prev.summary,
        summary: newSummaryContent
      };
      
      autoSave.saveLastSummary(updatedSummary);
      return { ...prev, summary: updatedSummary };
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSummary = useCallback(() => {
    setState(prev => ({ ...prev, summary: null }));
    autoSave.saveLastSummary(null);
  }, []);

  const resetAll = useCallback(() => {
    setState({
      sessionNotes: '',
      preferences: {
        tone: SUMMARY_OPTIONS.TONE.NEUTRAL,
        includeActionItems: true,
        anonymizeData: false,
        sessionType: SUMMARY_OPTIONS.SESSION_TYPE.THERAPY,
        summaryLength: SUMMARY_OPTIONS.SUMMARY_LENGTH.MEDIUM
      },
      summary: null,
      isLoading: false,
      error: null,
      isGenerating: false
    });
    autoSave.saveSessionNotes('');
    autoSave.savePreferences({});
    autoSave.saveLastSummary(null);
  }, []);

  return {
    sessionNotes: state.sessionNotes,
    preferences: state.preferences,
    summary: state.summary,
    isLoading: state.isLoading,
    isGenerating: state.isGenerating,
    error: state.error,
    updateSessionNotes,
    updatePreferences,
    updateSummary,
    generateSummary,
    clearError,
    clearSummary,
    resetAll
  };
};

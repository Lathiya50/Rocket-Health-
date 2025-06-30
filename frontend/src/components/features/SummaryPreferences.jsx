import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card.jsx';
import { Select } from '../ui/Input.jsx';
import { SUMMARY_OPTIONS } from '../../config/constants.js';

const Toggle = ({ label, checked = false, onChange, disabled = false, helperText }) => {
  const toggleId = `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {label && (
          <label htmlFor={toggleId} className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
        {helperText && (
          <p className="text-xs text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
      <button
        type="button"
        id={toggleId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};

export const SummaryPreferences = ({ 
  preferences, 
  onPreferenceChange, 
  disabled = false 
}) => {
  const toneOptions = [
    { 
      value: SUMMARY_OPTIONS.TONE.CLINICAL, 
      label: 'Clinical',
      description: 'Professional medical terminology, objective tone'
    },
    { 
      value: SUMMARY_OPTIONS.TONE.EMPATHETIC, 
      label: 'Empathetic',
      description: 'Warm, understanding language while maintaining professionalism'
    },
    { 
      value: SUMMARY_OPTIONS.TONE.NEUTRAL, 
      label: 'Neutral',
      description: 'Balanced, clear professional language'
    }
  ];

  const sessionTypeOptions = [
    { 
      value: SUMMARY_OPTIONS.SESSION_TYPE.THERAPY, 
      label: 'Individual Therapy',
      description: 'Focus on therapeutic goals and individual progress'
    },
    { 
      value: SUMMARY_OPTIONS.SESSION_TYPE.PSYCHIATRY, 
      label: 'Psychiatry',
      description: 'Emphasize mental status and medication considerations'
    },
    { 
      value: SUMMARY_OPTIONS.SESSION_TYPE.COUPLES, 
      label: 'Couples Therapy',
      description: 'Address relationship dynamics and joint goals'
    },
    { 
      value: SUMMARY_OPTIONS.SESSION_TYPE.SEXUAL_HEALTH, 
      label: 'Sexual Health',
      description: 'Focus on sexual health concerns with sensitivity'
    }
  ];

  const lengthOptions = [
    { 
      value: SUMMARY_OPTIONS.SUMMARY_LENGTH.SHORT, 
      label: 'Short (2-3 paragraphs)',
      description: 'Concise summary with key points only'
    },
    { 
      value: SUMMARY_OPTIONS.SUMMARY_LENGTH.MEDIUM, 
      label: 'Medium (4-6 paragraphs)',
      description: 'Comprehensive summary with detailed coverage'
    },
    { 
      value: SUMMARY_OPTIONS.SUMMARY_LENGTH.DETAILED, 
      label: 'Detailed (7+ paragraphs)',
      description: 'Extensive summary with thorough analysis'
    }
  ];

  const handleChange = (key, value) => {
    onPreferenceChange({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Summary Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Customize how your consultation summary will be generated
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tone Selection */}
        <div>
          <Select
            label="Tone"
            value={preferences.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
            options={toneOptions.map(option => ({
              value: option.value,
              label: option.label
            }))}
            disabled={disabled}
            helperText="Choose the writing style for your summary"
          />
          <div className="mt-2 text-xs text-gray-500">
            {toneOptions.find(option => option.value === preferences.tone)?.description}
          </div>
        </div>

        {/* Session Type Selection */}
        <div>
          <Select
            label="Session Type"
            value={preferences.sessionType}
            onChange={(e) => handleChange('sessionType', e.target.value)}
            options={sessionTypeOptions.map(option => ({
              value: option.value,
              label: option.label
            }))}
            disabled={disabled}
            helperText="Select the type of session to optimize summary focus"
          />
          <div className="mt-2 text-xs text-gray-500">
            {sessionTypeOptions.find(option => option.value === preferences.sessionType)?.description}
          </div>
        </div>

        {/* Summary Length Selection */}
        <div>
          <Select
            label="Summary Length"
            value={preferences.summaryLength}
            onChange={(e) => handleChange('summaryLength', e.target.value)}
            options={lengthOptions.map(option => ({
              value: option.value,
              label: option.label
            }))}
            disabled={disabled}
            helperText="Choose the desired length of your summary"
          />
          <div className="mt-2 text-xs text-gray-500">
            {lengthOptions.find(option => option.value === preferences.summaryLength)?.description}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <Toggle
            label="Include Action Items"
            checked={preferences.includeActionItems}
            onChange={(value) => handleChange('includeActionItems', value)}
            disabled={disabled}
            helperText="Add a section for homework assignments and follow-up tasks"
          />

          <Toggle
            label="Anonymize Patient Data"
            checked={preferences.anonymizeData}
            onChange={(value) => handleChange('anonymizeData', value)}
            disabled={disabled}
            helperText="Remove or mask personal identifying information (PII) from the summary"
          />
        </div>

        {preferences.anonymizeData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Privacy Protection Enabled</p>
                <p className="text-xs text-blue-700 mt-1">
                  Names, contact information, and other identifying details will be replaced with placeholders.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
 
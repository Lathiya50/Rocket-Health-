import React from 'react';
import { Textarea } from '../ui/Input.jsx';
import { countWords, countCharacters } from '../../utils/helpers.js';
import { VALIDATION } from '../../config/constants.js';

export const SessionNotesInput = ({ 
  value, 
  onChange, 
  error, 
  disabled = false 
}) => {
  const wordCount = countWords(value);
  const charCount = countCharacters(value);
  const isOverLimit = charCount > VALIDATION.SESSION_NOTES.MAX_LENGTH;
  const isNearLimit = charCount > VALIDATION.SESSION_NOTES.MAX_LENGTH * 0.8;

  return (
    <div className="space-y-2">
      <Textarea
        label="Session Notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your session notes here... Include patient interactions, observations, progress notes, and any relevant details from the consultation."
        rows={12}
        error={error}
        disabled={disabled}
        required
        className="min-h-[300px]"
      />
      
      {/* Word and Character Counter */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <span className="text-gray-600">
            Words: <span className="font-medium">{wordCount.toLocaleString()}</span>
          </span>
          <span className={`${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-gray-600'}`}>
            Characters: <span className="font-medium">{charCount.toLocaleString()}</span>
            <span className="text-gray-400">/{VALIDATION.SESSION_NOTES.MAX_LENGTH.toLocaleString()}</span>
          </span>
        </div>
        
        {/* Auto-save indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-500 text-xs">Auto-saved</span>
        </div>
      </div>
      
      {/* Character limit warning */}
      {isOverLimit && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
          ⚠️ Character limit exceeded. Please reduce the length of your notes.
        </p>
      )}
      
      {isNearLimit && !isOverLimit && (
        <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
          ⚠️ Approaching character limit. Consider summarizing some content.
        </p>
      )}
      
      {/* Helper text */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>Tips for better summaries:</strong>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          <li>Include key patient statements and observations</li>
          <li>Note therapeutic interventions and patient responses</li>
          <li>Document progress toward treatment goals</li>
          <li>Mention any homework or follow-up items discussed</li>
        </ul>
      </div>
    </div>
  );
};

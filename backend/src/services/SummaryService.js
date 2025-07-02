import OpenAI from 'openai';
import { PIIDetector } from '../utils/PIIDetector.js';
import { PromptBuilder } from '../utils/PromptBuilder.js';
import { ApiError } from '../utils/ApiError.js';


export class SummaryService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new ApiError(500, 'OpenAI API key not configured');
    }

    const config = {
      apiKey: process.env.OPENAI_API_KEY,
    };

    if (process.env.AI_BASE_URL) {
      config.baseURL = process.env.AI_BASE_URL;
      config.defaultHeaders = {
        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
        "X-Title": "Rocket Health Consultation Summary Generator",
      };
    }

    this.openai = new OpenAI(config);

    this.piiDetector = new PIIDetector();
    this.promptBuilder = new PromptBuilder();
  }

  /**
   * Generates a consultation summary based on session notes and preferences
   * @param {Object} data - The request data
   * @param {string} data.sessionNotes - The session notes
   * @param {Object} data.preferences - Summary preferences
   * @returns {Promise<Object>} The generated summary and metadata
   */
  async generateSummary({ sessionNotes, preferences }) {
    try {
      // Step 1: Detect and optionally anonymize PII
      const processedNotes = preferences.anonymizeData
        ? this.piiDetector.anonymize(sessionNotes)
        : sessionNotes;

      const piiDetected = this.piiDetector.detect(sessionNotes);

      // Step 2: Build the prompt
      const prompt = this.promptBuilder.buildPrompt(processedNotes, preferences);

      // Step 3: Generate summary using OpenAI/OpenRouter
      const completion = await this.openai.chat.completions.create({
        model: process.env.AI_MODEL || 'openai/gpt-4o-mini',
        messages: prompt,
        max_tokens: this._getMaxTokens(preferences.summaryLength),
        temperature: this._getTemperature(preferences.tone),
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      if (!completion.choices || completion.choices.length === 0) {
        throw new ApiError(500, 'Failed to generate summary');
      }

      const generatedSummary = completion.choices[0].message.content;

      // Step 4: Return structured response
      return {
        summary: generatedSummary,
        metadata: {
          wordCount: generatedSummary.split(' ').length,
          characterCount: generatedSummary.length,
          piiDetected: piiDetected.length > 0,
          piiTypes: piiDetected,
          anonymized: preferences.anonymizeData,
          preferences,
          generatedAt: new Date().toISOString(),
          tokens: completion.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error.status === 401) {
        throw new ApiError(500, 'Invalid API key or authentication failed');
      }

      if (error.status === 429) {
        throw new ApiError(429, 'API rate limit exceeded. Please try again later.');
      }

      if (error.status === 400) {
        throw new ApiError(400, 'Invalid request to AI API');
      }

      if (error.status === 402) {
        throw new ApiError(402, 'Insufficient credits. Please check your OpenRouter balance.');
      }

      if (error.status === 403) {
        throw new ApiError(403, 'Access denied. Please check your API permissions.');
      }

      console.error('AI API Error:', error);
      throw new ApiError(500, 'Failed to generate summary due to AI service error');
    }
  }

  /**
   * Get max tokens based on summary length preference
   * @param {string} length - Summary length preference
   * @returns {number} Max tokens
   */
  _getMaxTokens(length) {
    const model = process.env.AI_MODEL || 'openai/gpt-4o-mini';

    if (model.includes('deepseek')) {
      const tokenMap = {
        short: 300,
        medium: 800,
        detailed: 1500
      };
      return tokenMap[length] || 800;
    }


    const tokenMap = {
      short: 200,
      medium: 500,
      detailed: 1000
    };
    return tokenMap[length] || 500;
  }

  /**
   * Get temperature based on tone preference
   * @param {string} tone - Tone preference
   * @returns {number} Temperature value
   */
  _getTemperature(tone) {
    const model = process.env.AI_MODEL || 'openai/gpt-4o-mini';


    if (model.includes('deepseek')) {
      const temperatureMap = {
        clinical: 0.1,
        neutral: 0.3,
        empathetic: 0.5
      };
      return temperatureMap[tone] || 0.3;
    }

    const temperatureMap = {
      clinical: 0.2,
      neutral: 0.4,
      empathetic: 0.6
    };
    return temperatureMap[tone] || 0.4;
  }
}

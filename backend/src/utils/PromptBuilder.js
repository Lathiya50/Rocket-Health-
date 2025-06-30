export class PromptBuilder {
  /**
   * Builds a structured prompt for OpenAI based on session notes and preferences
   * @param {string} sessionNotes - The processed session notes
   * @param {Object} preferences - User preferences for summary generation
   * @returns {Array} Array of messages for OpenAI chat completion
   */
  buildPrompt(sessionNotes, preferences) {
    const systemPrompt = this._buildSystemPrompt(preferences);
    const userPrompt = this._buildUserPrompt(sessionNotes, preferences);

    return [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];
  }

  /**
   * Builds the system prompt that defines the AI's role and behavior
   * @param {Object} preferences - User preferences
   * @returns {string} System prompt
   */
  _buildSystemPrompt(preferences) {
    const { tone, sessionType, summaryLength } = preferences;

    const basePrompt = `You are a professional healthcare documentation assistant specializing in ${sessionType} session summaries.`;
    
    const toneInstructions = {
      clinical: 'Use precise, clinical language with medical terminology. Be objective and professional.',
      empathetic: 'Use warm, understanding language while maintaining professionalism. Show empathy and compassion.',
      neutral: 'Use clear, professional language that is neither overly clinical nor emotional.'
    };

    const lengthInstructions = {
      short: 'Provide a concise summary in 2-3 paragraphs focusing on key points only.',
      medium: 'Provide a comprehensive summary in 4-6 paragraphs covering all important aspects.',
      detailed: 'Provide an extensive summary with thorough analysis and detailed observations.'
    };

    const sessionTypeInstructions = {
      therapy: 'Focus on therapeutic goals, client insights, emotional progress, and therapeutic interventions.',
      psychiatry: 'Emphasize mental status, symptoms, medication effects, and clinical observations.',
      couples: 'Address relationship dynamics, communication patterns, conflicts, and joint therapeutic goals.',
      'sexual-health': 'Focus on sexual health concerns, treatment progress, and relevant therapeutic interventions while maintaining sensitivity.'
    };

    return `${basePrompt}

IMPORTANT: This is a standalone request. Do not reference any previous conversations, summaries, or context. Base your response ONLY on the session notes provided in this current request.

TONE: ${toneInstructions[tone]}

SUMMARY LENGTH: ${lengthInstructions[summaryLength]}

SESSION TYPE FOCUS: ${sessionTypeInstructions[sessionType]}

GENERAL GUIDELINES:
- Maintain strict patient confidentiality
- Use professional healthcare terminology appropriately
- Structure the summary logically with clear sections
- Focus on therapeutically relevant information
- Avoid speculation; only summarize what was documented
- Use present tense for current status and past tense for historical information
- Do not reference or build upon any previous sessions, summaries, or conversations
- Treat each summary request as completely independent`;
  }

  /**
   * Builds the user prompt with session notes and specific instructions
   * @param {string} sessionNotes - The session notes to summarize
   * @param {Object} preferences - User preferences
   * @returns {string} User prompt
   */
  _buildUserPrompt(sessionNotes, preferences) {
    let prompt = `Please create a professional consultation summary based ONLY on the following session notes. Do not use any previous context or conversations:\n\n${sessionNotes}\n\n`;

    prompt += 'SUMMARY STRUCTURE:\n';
    prompt += '1. Session Overview (date, duration, session type)\n';
    prompt += '2. Presenting Concerns/Issues Discussed\n';
    prompt += '3. Key Observations and Clinical Notes\n';
    prompt += '4. Progress and Insights\n';
    prompt += '5. Therapeutic Interventions Used\n';

    if (preferences.includeActionItems) {
      prompt += '6. Action Items and Recommendations\n';
      prompt += '7. Follow-up Plans\n';
    }

    prompt += '\nPlease ensure the summary is:\n';
    prompt += '- Based ONLY on the current session notes provided above\n';
    prompt += '- Professionally written and well-organized\n';
    prompt += '- Clinically accurate and relevant\n';
    prompt += '- Appropriate for healthcare documentation\n';
    prompt += '- Suitable for sharing with other healthcare professionals\n';
    prompt += '- Independent of any previous sessions or conversations\n';

    if (preferences.anonymizeData) {
      prompt += '- Free of any personal identifying information\n';
    }

    return prompt;
  }
}

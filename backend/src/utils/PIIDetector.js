export class PIIDetector {
  constructor() {
    // Regex patterns for common PII
    this.patterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone: /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
      ssn: /\b(?:\d{3}-?\d{2}-?\d{4})\b/g,
      creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
      ipAddress: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
      zipCode: /\b\d{5}(?:-\d{4})?\b/g,
      // Names (simplified - looks for capitalized words that could be names)
      names: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g,
      // Dates in various formats
      dates: /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g,
      // Medical record numbers (simplified)
      medicalRecordNumber: /\b(?:MRN|MR|Patient ID|ID)[:\s]+[A-Z0-9-]+\b/gi,
      // Insurance numbers
      insuranceNumber: /\b(?:Insurance|Policy|Member)[:\s#]+[A-Z0-9-]+\b/gi
    };

    // Replacement patterns for anonymization
    this.replacements = {
      email: '[EMAIL_REDACTED]',
      phone: '[PHONE_REDACTED]',
      ssn: '[SSN_REDACTED]',
      creditCard: '[CREDIT_CARD_REDACTED]',
      ipAddress: '[IP_ADDRESS_REDACTED]',
      zipCode: '[ZIP_CODE_REDACTED]',
      names: '[NAME_REDACTED]',
      dates: '[DATE_REDACTED]',
      medicalRecordNumber: '[MEDICAL_RECORD_REDACTED]',
      insuranceNumber: '[INSURANCE_NUMBER_REDACTED]'
    };
  }

  /**
   * Detects PII in the given text
   * @param {string} text - Text to scan for PII
   * @returns {Array} Array of PII types found
   */
  detect(text) {
    const detected = [];
    
    for (const [type, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(text)) {
        detected.push(type);
      }
    }
    
    return detected;
  }

  /**
   * Anonymizes PII in the given text
   * @param {string} text - Text to anonymize
   * @returns {string} Text with PII replaced
   */
  anonymize(text) {
    let anonymizedText = text;
    
    for (const [type, pattern] of Object.entries(this.patterns)) {
      anonymizedText = anonymizedText.replace(pattern, this.replacements[type]);
    }
    
    return anonymizedText;
  }

  /**
   * Gets detailed information about PII found in text
   * @param {string} text - Text to analyze
   * @returns {Object} Detailed PII analysis
   */
  analyze(text) {
    const analysis = {
      hasPII: false,
      types: [],
      details: {}
    };

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        analysis.hasPII = true;
        analysis.types.push(type);
        analysis.details[type] = {
          count: matches.length,
          examples: matches.slice(0, 3) // Show first 3 examples
        };
      }
    }

    return analysis;
  }

  /**
   * Validates if text is safe (no PII detected)
   * @param {string} text - Text to validate
   * @returns {boolean} True if no PII detected
   */
  isSafe(text) {
    return this.detect(text).length === 0;
  }
}

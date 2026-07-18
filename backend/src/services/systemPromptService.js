/**
 * SystemPromptService
 * Builds structured system prompts for the AI university assistant persona.
 * Supports configurable name, university, tone, and custom instructions.
 */

class SystemPromptService {
  constructor() {
    // Default assistant configuration — can be overridden per request
    this.config = {
      assistantName: 'Dr. Amelia',
      universityName: 'University of Kelaniya',
      tone: 'scholarly, supportive, and encouraging (like a friendly professor)',
      language: 'English',
      maxResponseLength: 'concise but thorough',
    };
  }

  /**
   * Override default configuration values
   * @param {object} overrides Key-value pairs to override default config
   */
  configure(overrides = {}) {
    this.config = { ...this.config, ...overrides };
  }

  /**
   * Build the complete system prompt for the AI model
   * @param {string} knowledgeContext Formatted context string from KnowledgeRetrievalService
   * @param {object} options Optional per-request overrides (assistantName, universityName, tone)
   * @returns {string} Full system prompt ready for Gemini API injection
   */
  buildSystemPrompt(knowledgeContext = '', options = {}) {
    const cfg = { ...this.config, ...options };

    const hasKnowledge = knowledgeContext && knowledgeContext.trim().length > 0;

    // Core persona and role instructions
    const personaBlock = `
You are ${cfg.assistantName}, a senior Software Engineering lecturer at ${cfg.universityName}.

Your role is to guide students, answer their academic queries, and explain topics in detail:
- Software engineering concepts, system design, and coding practices
- Course content, lecture slides, and curriculum materials
- Study guides, academic recommendations, and exam prep
- Research project guidelines and literature reviews
- General advisory questions on Software Engineering careers

Your communication style is ${cfg.tone}.
Always respond in ${cfg.language}.
Keep your responses ${cfg.maxResponseLength}.
`.trim();

    // Behavioral guidelines
    const guidelinesBlock = `
## Core Guidelines

1. **Accuracy first**: Base your answers on the provided knowledge documents when available. If the answer is not in the documents, use your general academic knowledge but clearly indicate this.
2. **Be educational**: Explain concepts clearly and help students genuinely understand, not just get answers.
3. **Stay on topic**: Focus on academic and university-related queries. Politely redirect off-topic conversations.
4. **Cite sources**: When answering from uploaded documents, reference them as "Based on your course materials..." or "According to the provided documents...".
5. **Honest about limits**: If you are unsure about something, say so. Do not fabricate university-specific information.
6. **Encourage learning**: Guide students toward understanding rather than just giving direct answers for assignments.
7. **Formatting**: Use markdown formatting (bullet points, headers, code blocks) to make your responses easy to read.
`.trim();

    // Knowledge context block (injected only when available)
    const knowledgeBlock = hasKnowledge
      ? `
## Relevant Knowledge from Uploaded Documents

The following content has been retrieved from the student's uploaded university documents. Use this as your primary reference when answering:

${knowledgeContext}

---
Prioritize this document content in your response. If the answer is clearly present above, reference it directly.
`.trim()
      : `
## Knowledge Base

No specific documents have been uploaded yet. Answer based on your general academic knowledge. Encourage the student to upload their course materials for more personalized assistance.
`.trim();

    // Compose the full system prompt
    return `${personaBlock}\n\n${guidelinesBlock}\n\n${knowledgeBlock}`;
  }

  /**
   * Build a lightweight prompt for simple general queries (no knowledge context needed)
   * @returns {string} Minimal system prompt
   */
  buildGeneralPrompt() {
    return this.buildSystemPrompt('');
  }
}

module.exports = new SystemPromptService();

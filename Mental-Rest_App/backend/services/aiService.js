const axios = require('axios');

class AIService {
  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    this.model = process.env.OLLAMA_MODEL || 'gemma:2b';
    this.timeout = 30000; // 30 seconds timeout
  }

  // Check if Ollama server is running
  async checkServerHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, {
        timeout: 5000
      });
      return {
        isRunning: true,
        models: response.data.models || []
      };
    } catch (error) {
      console.error('Ollama server health check failed:', error.message);
      return {
        isRunning: false,
        error: error.message
      };
    }
  }

  // Analyze sentiment of journal entry
  async analyzeSentiment(text) {
    try {
      const prompt = `Analyze the emotional sentiment of the following journal entry. Respond with a JSON object containing:
      - sentiment: "positive", "negative", or "neutral"
      - confidence: a number between 0 and 1
      - keywords: an array of 3-5 key emotional words
      - summary: a brief 1-2 sentence summary
      - suggestions: an array of 2-3 helpful suggestions for mental wellness

      Journal entry: "${text}"

      Respond only with valid JSON:`;

      const response = await this.generateResponse(prompt);
      
      // Try to parse JSON response
      try {
        const analysis = JSON.parse(response);
        return {
          sentiment: analysis.sentiment || 'neutral',
          confidence: Math.min(Math.max(analysis.confidence || 0.5, 0), 1),
          keywords: analysis.keywords || [],
          summary: analysis.summary || 'No summary available',
          suggestions: analysis.suggestions || []
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return this.parseFallbackSentiment(response);
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error.message);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        keywords: [],
        summary: 'Unable to analyze sentiment at this time',
        suggestions: ['Consider taking a moment to reflect on your feelings', 'Try some deep breathing exercises']
      };
    }
  }

  // Generate wellness tips based on mood patterns
  async generateWellnessTips(moodData, userPreferences = {}, category = 'general') {
    try {
      const categoryPrompts = {
        general: 'general wellness and self-care',
        stress: 'stress management and relaxation techniques',
        motivation: 'motivation, goal-setting, and personal growth',
        mindfulness: 'mindfulness, meditation, and present-moment awareness',
        social: 'social connection, relationships, and community building',
        physical: 'physical health, exercise, and body wellness',
        sleep: 'sleep hygiene, rest, and recovery',
        gratitude: 'gratitude practice and positive thinking'
      };

      const categoryContext = categoryPrompts[category] || categoryPrompts.general;
      
      const prompt = `Based on the following mood data and user preferences, generate personalized wellness tips focused on ${categoryContext}. Respond with a JSON object containing:
      - tips: an array of 5 specific, actionable wellness tips tailored to ${categoryContext}
      - focus: the main area to focus on (e.g., "${categoryContext}")
      - encouragement: a motivational message specific to ${categoryContext}

      Mood data: ${JSON.stringify(moodData)}
      User preferences: ${JSON.stringify(userPreferences)}
      Requested category: ${category}
      Request ID: ${userPreferences.requestId || Date.now()}
      User ID: ${userPreferences.userId || 'anonymous'}
      Timestamp: ${userPreferences.timestamp || Date.now()}
      Seed: ${userPreferences.seed || Math.random()}

      IMPORTANT: Make the tips specific, actionable, and varied. Avoid repeating the same suggestions. 
      Use the timestamp and seed to ensure variety. Focus on ${categoryContext}.
      Each request should generate different tips even for the same category.

      Respond only with valid JSON:`;

      const response = await this.generateResponse(prompt);
      
      try {
        const tips = JSON.parse(response);
        return {
          tips: tips.tips || this.getDefaultTipsForCategory(category),
          focus: tips.focus || categoryContext,
          encouragement: tips.encouragement || this.getDefaultEncouragementForCategory(category)
        };
      } catch (parseError) {
        return this.parseFallbackTips(response, category);
      }
    } catch (error) {
      console.error('Wellness tips generation error:', error.message);
      return {
        tips: this.getDefaultTipsForCategory(category),
        focus: this.getDefaultFocusForCategory(category),
        encouragement: this.getDefaultEncouragementForCategory(category)
      };
    }
  }

  // Generate guided journal prompts
  async generateJournalPrompts(category = 'general', userMood = 'neutral') {
    try {
      const prompt = `Generate 3 creative journal prompts for ${category} category, considering the user's current mood: ${userMood}. 
      Respond with a JSON object containing:
      - prompts: an array of 3 prompt objects, each with "title" and "content"
      - difficulty: "beginner", "intermediate", or "advanced"
      - estimatedTime: time in minutes

      Respond only with valid JSON:`;

      const response = await this.generateResponse(prompt);
      
      try {
        const prompts = JSON.parse(response);
        return {
          prompts: prompts.prompts || this.getDefaultPrompts(category),
          difficulty: prompts.difficulty || 'beginner',
          estimatedTime: prompts.estimatedTime || 5
        };
      } catch (parseError) {
        return {
          prompts: this.getDefaultPrompts(category),
          difficulty: 'beginner',
          estimatedTime: 5
        };
      }
    } catch (error) {
      console.error('Prompt generation error:', error.message);
      return {
        prompts: this.getDefaultPrompts(category),
        difficulty: 'beginner',
        estimatedTime: 5
      };
    }
  }

  // Core method to generate responses from Ollama
  async generateResponse(prompt) {
    try {
      const response = await axios.post(`${this.baseURL}/api/generate`, {
        model: this.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      }, {
        timeout: this.timeout
      });

      return response.data.response || '';
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Ollama server is not running. Please start it with: ollama serve');
      }
      throw error;
    }
  }

  // Fallback sentiment parsing when JSON parsing fails
  parseFallbackSentiment(response) {
    const sentiment = response.toLowerCase().includes('positive') ? 'positive' :
                     response.toLowerCase().includes('negative') ? 'negative' : 'neutral';
    
    return {
      sentiment,
      confidence: 0.6,
      keywords: ['emotional', 'reflection'],
      summary: response.substring(0, 100) + '...',
      suggestions: ['Consider your emotional state', 'Take time for self-reflection']
    };
  }

  // Fallback tips parsing when JSON parsing fails
  parseFallbackTips(response, category = 'general') {
    return {
      tips: this.getDefaultTipsForCategory(category),
      focus: this.getDefaultFocusForCategory(category),
      encouragement: this.getDefaultEncouragementForCategory(category)
    };
  }

  // Get default tips for specific category
  getDefaultTipsForCategory(category) {
    const categoryTips = {
      general: [
        'Take a 5-minute break to breathe deeply and center yourself',
        'Write down three things you\'re grateful for today',
        'Go for a short walk outside and notice your surroundings',
        'Listen to calming music or nature sounds',
        'Practice mindfulness meditation for 10 minutes'
      ],
      stress: [
        'Try the 4-7-8 breathing technique: inhale 4, hold 7, exhale 8',
        'Progressive muscle relaxation - tense and release each muscle group',
        'Take a warm bath or shower to relax your body',
        'Write down your worries and then let them go',
        'Practice grounding techniques: name 5 things you can see, hear, touch'
      ],
      motivation: [
        'Set one small, achievable goal for today',
        'Create a vision board or write down your dreams',
        'Celebrate your recent accomplishments, no matter how small',
        'Surround yourself with positive, inspiring content',
        'Break down big tasks into smaller, manageable steps'
      ],
      mindfulness: [
        'Practice mindful eating - savor each bite without distractions',
        'Do a body scan meditation to check in with yourself',
        'Practice mindful walking - focus on each step and breath',
        'Try the RAIN technique: Recognize, Allow, Investigate, Nurture',
        'Spend 5 minutes observing your thoughts without judgment'
      ],
      social: [
        'Reach out to a friend or family member you haven\'t talked to recently',
        'Join a community group or club that interests you',
        'Practice active listening in your conversations today',
        'Share something positive or funny with someone you care about',
        'Volunteer for a cause that matters to you'
      ],
      physical: [
        'Take a 10-minute walk or do some gentle stretching',
        'Drink a glass of water and stay hydrated throughout the day',
        'Try some light yoga or tai chi movements',
        'Get some fresh air and natural sunlight',
        'Practice good posture and take breaks from sitting'
      ],
      sleep: [
        'Create a relaxing bedtime routine and stick to it',
        'Avoid screens 1 hour before bedtime',
        'Keep your bedroom cool, dark, and quiet',
        'Try relaxation techniques like deep breathing before sleep',
        'Write down any worries in a journal to clear your mind'
      ],
      gratitude: [
        'Write down three specific things you\'re grateful for today',
        'Send a thank you message to someone who made a difference',
        'Notice and appreciate the small moments of joy',
        'Keep a gratitude jar and add one thing daily',
        'Practice gratitude meditation or reflection'
      ]
    };
    
    return categoryTips[category] || categoryTips.general;
  }

  // Get default focus for specific category
  getDefaultFocusForCategory(category) {
    const focusMap = {
      general: 'general wellness and self-care',
      stress: 'stress management and relaxation',
      motivation: 'motivation and goal-setting',
      mindfulness: 'mindfulness and present-moment awareness',
      social: 'social connection and community',
      physical: 'physical wellness and movement',
      sleep: 'sleep hygiene and rest',
      gratitude: 'gratitude and appreciation'
    };
    
    return focusMap[category] || focusMap.general;
  }

  // Get default encouragement for specific category
  getDefaultEncouragementForCategory(category) {
    const encouragementMap = {
      general: 'Remember to be kind to yourself. Small steps lead to big changes.',
      stress: 'You\'re stronger than your stress. Take it one breath at a time.',
      motivation: 'You have the power to create positive change. Start with one small step!',
      mindfulness: 'The present moment is where life happens. Embrace it with curiosity.',
      social: 'Connection is the foundation of well-being. Reach out and let others in.',
      physical: 'Your body is your home. Treat it with love and care.',
      sleep: 'Quality sleep is essential for your well-being. Prioritize your rest.',
      gratitude: 'Gratitude transforms what we have into enough. Count your blessings.'
    };
    
    return encouragementMap[category] || encouragementMap.general;
  }

  // Default prompts when AI generation fails
  getDefaultPrompts(category) {
    const defaultPrompts = {
      gratitude: [
        { title: 'Three Good Things', content: 'Write about three good things that happened today, no matter how small.' },
        { title: 'Grateful Person', content: 'Think of someone you\'re grateful for and write about why they mean so much to you.' },
        { title: 'Simple Pleasures', content: 'What simple pleasures brought you joy today?' }
      ],
      reflection: [
        { title: 'Today\'s Learning', content: 'What did you learn about yourself today?' },
        { title: 'Growth Moment', content: 'Describe a moment today when you felt you grew or improved.' },
        { title: 'Challenges Overcome', content: 'What challenge did you face today and how did you handle it?' }
      ],
      mindfulness: [
        { title: 'Present Moment', content: 'Describe what you\'re experiencing right now using all your senses.' },
        { title: 'Breath Awareness', content: 'Write about your breathing and how it feels in this moment.' },
        { title: 'Body Scan', content: 'Notice how your body feels right now and write about any sensations.' }
      ],
      general: [
        { title: 'Free Write', content: 'Write whatever comes to mind. Don\'t worry about structure or grammar.' },
        { title: 'Emotional Check-in', content: 'How are you feeling right now? What emotions are present?' },
        { title: 'Day Summary', content: 'Summarize your day in a few sentences. What stood out?' }
      ]
    };

    return defaultPrompts[category] || defaultPrompts.general;
  }

  // Batch analyze multiple entries
  async batchAnalyzeSentiment(entries) {
    try {
      const results = [];
      
      for (const entry of entries) {
        const analysis = await this.analyzeSentiment(entry.content);
        results.push({
          entryId: entry._id,
          analysis
        });
      }
      
      return results;
    } catch (error) {
      console.error('Batch sentiment analysis error:', error.message);
      return [];
    }
  }
}

module.exports = new AIService();

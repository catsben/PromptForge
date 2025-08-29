// Mock entity class for local storage
export class Prompt {
  static async list(sortBy = '-created_date', limit = 100) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    
    // Sort prompts
    if (sortBy === '-created_date') {
      prompts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === 'title') {
      prompts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === '-rating') {
      prompts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === '-usage_count') {
      prompts.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0));
    }
    
    return prompts.slice(0, limit);
  }

  static async create(data) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const newPrompt = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      created_by: 'user@example.com' // Mock user
    };
    prompts.push(newPrompt);
    localStorage.setItem('prompts', JSON.stringify(prompts));
    return newPrompt;
  }

  static async update(id, data) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const index = prompts.findIndex(p => p.id === id);
    if (index !== -1) {
      prompts[index] = { 
        ...prompts[index], 
        ...data, 
        updated_date: new Date().toISOString() 
      };
      localStorage.setItem('prompts', JSON.stringify(prompts));
      return prompts[index];
    }
    throw new Error('Prompt not found');
  }

  static async delete(id) {
    const prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    const filtered = prompts.filter(p => p.id !== id);
    localStorage.setItem('prompts', JSON.stringify(filtered));
    return true;
  }

  static async filter(conditions, sortBy = '-created_date', limit = 100) {
    let prompts = JSON.parse(localStorage.getItem('prompts') || '[]');
    
    // Apply filters
    Object.entries(conditions).forEach(([key, value]) => {
      prompts = prompts.filter(prompt => prompt[key] === value);
    });
    
    // Sort
    if (sortBy === '-created_date') {
      prompts.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === 'title') {
      prompts.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return prompts.slice(0, limit);
  }

  static schema() {
    return {
      "name": "Prompt",
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "description": "Title of the prompt"
        },
        "content": {
          "type": "string",
          "description": "The actual prompt text"
        },
        "category": {
          "type": "string",
          "enum": ["writing", "coding", "productivity", "creative", "analysis", "education", "business", "other"],
          "default": "other",
          "description": "Category of the prompt"
        },
        "rating": {
          "type": "number",
          "minimum": 1,
          "maximum": 5,
          "description": "User rating from 1-5 stars"
        },
        "notes": {
          "type": "string",
          "description": "Additional notes about the prompt"
        },
        "provider": {
          "type": "string",
          "enum": ["openai", "anthropic", "google", "deepseek", "mistral"],
          "default": "openai",
          "description": "AI provider used for this prompt"
        },
        "model": {
          "type": "string",
          "description": "Specific model name (e.g., gpt-4, claude-3-5-sonnet)"
        },
        "temperature": {
          "type": "number",
          "minimum": 0,
          "maximum": 2,
          "default": 0.7,
          "description": "Temperature setting for AI responses"
        },
        "max_tokens": {
          "type": "number",
          "minimum": 1,
          "maximum": 8000,
          "default": 2000,
          "description": "Maximum tokens in response"
        },
        "last_response": {
          "type": "string",
          "description": "Last AI response received for this prompt"
        },
        "usage_count": {
          "type": "number",
          "default": 0,
          "description": "Number of times this prompt has been tested"
        },
        "average_response_time": {
          "type": "number",
          "description": "Average response time in milliseconds"
        }
      },
      "required": ["title", "content", "category", "provider", "model"]
    };
  }
}

export const createPageUrl = (pageName) => {
  const pageMap = {
    'Dashboard': '/dashboard',
    'Library': '/library'
  };
  return pageMap[pageName] || '/';
};

export const cn = (...inputs) => {
  return inputs.filter(Boolean).join(' ');
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatResponseTime = (ms) => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
};

export const exportToJson = (data, filename) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = filename || `promptforge-export-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const validateApiKey = (provider, key) => {
  if (!key) return false;
  
  const validations = {
    openai: key.startsWith('sk-'),
    anthropic: key.startsWith('sk-ant-'),
    google: key.startsWith('AI'),
    deepseek: key.startsWith('sk-'),
    mistral: key.startsWith('MR-') || key.startsWith('sk-')
  };
  
  return validations[provider] || false;
};

export const getProviderConfig = (provider) => {
  const configs = {
    openai: { 
      name: "OpenAI", 
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      docs: "https://platform.openai.com/api-keys"
    },
    anthropic: { 
      name: "Anthropic", 
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      docs: "https://console.anthropic.com/"
    },
    google: { 
      name: "Google AI", 
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      docs: "https://makersuite.google.com/app/apikey"
    },
    deepseek: { 
      name: "DeepSeek", 
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      docs: "https://platform.deepseek.com/api_keys"
    },
    mistral: { 
      name: "Mistral AI", 
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      docs: "https://console.mistral.ai/api-keys/"
    }
  };
  return configs[provider] || configs.openai;
};

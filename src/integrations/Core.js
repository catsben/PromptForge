// Multi-provider AI integration
export const InvokeLLM = async ({ 
  prompt, 
  provider = 'openai', 
  model = 'gpt-4', 
  temperature = 0.7, 
  max_tokens = 2000,
  add_context_from_internet = false 
}) => {
  const apiKey = localStorage.getItem(`${provider}_api_key`);
  
  if (!apiKey) {
    throw new Error(`No API key found for ${provider}. Please configure your API key first.`);
  }

  const startTime = Date.now();

  try {
    let response;
    
    switch (provider) {
      case 'openai':
        response = await callOpenAI(prompt, model, temperature, max_tokens, apiKey);
        break;
      case 'anthropic':
        response = await callAnthropic(prompt, model, temperature, max_tokens, apiKey);
        break;
      case 'google':
        response = await callGoogle(prompt, model, temperature, max_tokens, apiKey);
        break;
      case 'deepseek':
        response = await callDeepSeek(prompt, model, temperature, max_tokens, apiKey);
        break;
      case 'mistral':
        response = await callMistral(prompt, model, temperature, max_tokens, apiKey);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return response;
  } catch (error) {
    throw new Error(`Failed to get response from ${provider}: ${error.message}`);
  }
};

const callOpenAI = async (prompt, model, temperature, max_tokens, apiKey) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      max_tokens: max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
};

const callAnthropic = async (prompt, model, temperature, max_tokens, apiKey) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: max_tokens,
      temperature: temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API error');
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response received';
};

const callGoogle = async (prompt, model, temperature, max_tokens, apiKey) => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: max_tokens,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Google AI API error');
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || 'No response received';
};

const callDeepSeek = async (prompt, model, temperature, max_tokens, apiKey) => {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      max_tokens: max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'DeepSeek API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
};

const callMistral = async (prompt, model, temperature, max_tokens, apiKey) => {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature,
      max_tokens: max_tokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Mistral API error');
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
};

// Mock email sending function
export const SendEmail = async ({ to, subject, body, from_name }) => {
  console.log('Mock email sent:', { to, subject, body, from_name });
  return { success: true };
};

// Mock file upload function
export const UploadFile = async ({ file }) => {
  // In a real implementation, this would upload to a cloud service
  const url = URL.createObjectURL(file);
  return { file_url: url };
};

// Mock image generation function
export const GenerateImage = async ({ prompt }) => {
  // In a real implementation, this would call an image generation service
  return { 
    url: `https://picsum.photos/512/512?random=${Date.now()}` 
  };
};

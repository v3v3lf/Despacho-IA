/**
 * Módulo Centralizado de Provedores de Inteligência Artificial
 * Suporte a: Google Gemini, OpenAI, Anthropic Claude, Groq, OpenRouter, Mistral AI, Cohere e Cerebras.
 */

const AI_PROVIDERS_CONFIG = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '🌐',
    badgeText: 'Gemini',
    apiKeyUrl: 'https://aistudio.google.com/apikey',
    keyPlaceholder: 'Cole sua chave de API do Google AI Studio (AIzaSy...)',
    defaultModel: 'gemini-2.5-flash',
    supportsGrounding: true,
    modelGroups: [
      {
        label: '⚡ Ultra-Rápidos / Econômicos',
        models: [
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (⚡ Recomendado / Inteligente)' },
          { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (⚡⚡ Alta Performance)' },
          { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (⚡⚡⚡ Ultra Rápido)' },
          { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (⚡ Leve)' },
          { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash 002 (Estável / Free Tier)' }
        ]
      },
      {
        label: '🧠 Raciocínio Avançado / Pro',
        models: [
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (🧠 Alta Precisão Policial / SISP)' },
          { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (🧠 Estado da Arte)' }
        ]
      }
    ]
  },

  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: '🟢',
    badgeText: 'OpenAI',
    apiKeyUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'Cole sua chave de API da OpenAI (sk-...)',
    defaultModel: 'gpt-4o-mini',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '⚡ Rápidos & Equilibrados',
        models: [
          { id: 'gpt-4o-mini', name: 'GPT-4o Mini (⚡ Rápido e Econômico)' },
          { id: 'gpt-4o', name: 'GPT-4o (🧠 Modelo Flagship Multimodal)' },
          { id: 'gpt-4-turbo', name: 'GPT-4 Turbo (Estável / Contexto Amplo)' }
        ]
      },
      {
        label: '🧠 Raciocínio Profundo (o-Series)',
        models: [
          { id: 'o3-mini', name: 'o3-mini (🧠 Raciocínio Ágil)' },
          { id: 'o1', name: 'o1 (🧠 Raciocínio Complexo Avançado)' }
        ]
      }
    ]
  },

  anthropic: {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    icon: '🟣',
    badgeText: 'Claude',
    apiKeyUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'Cole sua chave de API Anthropic (sk-ant-...)',
    defaultModel: 'claude-3-5-haiku-20241022',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '⚡ Claude 3.5 & 3.7 Series',
        models: [
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (⚡ Ultra Rápido)' },
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (🧠 Excelente Redação Policial)' },
          { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet (🧠 Híbrido Raciocínio / Velocidade)' }
        ]
      },
      {
        label: '💎 Modelos Claude Clássicos',
        models: [
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (🧠 Alta Capacidade Analítica)' }
        ]
      }
    ]
  },

  groq: {
    id: 'groq',
    name: 'Groq (LPUs Ultrarrápidas)',
    icon: '⚡',
    badgeText: 'Groq',
    apiKeyUrl: 'https://console.groq.com/keys',
    keyPlaceholder: 'Cole sua chave de API da Groq (gsk_...)',
    defaultModel: 'llama-3.3-70b-versatile',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '🚀 Inferência em Alta Velocidade',
        models: [
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile (⚡ Recomendado)' },
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant (⚡⚡ Instantâneo ~800 t/s)' },
          { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B (⚡ Contexto 32k)' }
        ]
      }
    ]
  },

  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter (Agregador)',
    icon: '🔀',
    badgeText: 'OpenRouter',
    apiKeyUrl: 'https://openrouter.ai/keys',
    keyPlaceholder: 'Cole sua chave do OpenRouter (sk-or-...)',
    defaultModel: 'openrouter/auto',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '🔀 Roteamento Inteligente & Modelos Populares',
        models: [
          { id: 'openrouter/auto', name: 'Auto Router (Melhor Custo / Benefício)' },
          { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet (via OpenRouter)' },
          { id: 'openai/gpt-4o', name: 'GPT-4o (via OpenRouter)' },
          { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct (via OpenRouter)' },
          { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash (via OpenRouter)' }
        ]
      }
    ]
  },

  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌪️',
    badgeText: 'Mistral',
    apiKeyUrl: 'https://console.mistral.ai/api-keys/',
    keyPlaceholder: 'Cole sua chave de API Mistral',
    defaultModel: 'mistral-small-latest',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '🌪️ Modelos Mistral Homologados',
        models: [
          { id: 'mistral-small-latest', name: 'Mistral Small (⚡ Rápido e Eficiente)' },
          { id: 'mistral-large-latest', name: 'Mistral Large (🧠 Raciocínio de Alto Nível)' },
          { id: 'ministral-8b-latest', name: 'Ministral 8B (⚡ Compacto)' },
          { id: 'codestral-latest', name: 'Codestral (Estruturação e Lógica)' },
          { id: 'open-mixtral-8x22b', name: 'Open Mixtral 8x22B (MoE Balanceado)' }
        ]
      }
    ]
  },

  cohere: {
    id: 'cohere',
    name: 'Cohere',
    icon: '🌊',
    badgeText: 'Cohere',
    apiKeyUrl: 'https://dashboard.cohere.com/api-keys',
    keyPlaceholder: 'Cole sua chave de API Cohere',
    defaultModel: 'command-r-08-2024',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '🌊 Linha Command-R (RAG & Síntese)',
        models: [
          { id: 'command-r-08-2024', name: 'Command R (⚡ Síntese e Resumo)' },
          { id: 'command-r-plus-08-2024', name: 'Command R+ (🧠 Análise Policial Complexa)' },
          { id: 'command-r7b-12-2024', name: 'Command R 7B (⚡ Ultraleve)' },
          { id: 'command-light', name: 'Command Light (Econômico)' }
        ]
      }
    ]
  },

  cerebras: {
    id: 'cerebras',
    name: 'Cerebras (Velocidade Extrema)',
    icon: '🚀',
    badgeText: 'Cerebras',
    apiKeyUrl: 'https://cloud.cerebras.ai/',
    keyPlaceholder: 'Cole sua chave de API Cerebras (csk-...)',
    defaultModel: 'llama3.3-70b',
    supportsGrounding: false,
    modelGroups: [
      {
        label: '🚀 Inferência Ultra-Acelerada (~1500 tokens/s)',
        models: [
          { id: 'llama3.3-70b', name: 'Llama 3.3 70B (⚡⚡ Velocidade Extrema)' },
          { id: 'llama3.1-8b', name: 'Llama 3.1 8B (⚡⚡ Instantâneo)' },
          { id: 'llama-3.1-70b', name: 'Llama 3.1 70B (Ultra-Rápido)' }
        ]
      }
    ]
  }
};

/**
 * Retorna as configurações de um provedor pelo ID.
 */
function getProviderConfig(providerId) {
  return AI_PROVIDERS_CONFIG[providerId] || AI_PROVIDERS_CONFIG.gemini;
}

/**
 * Retorna a lista completa de provedores configurados.
 */
function getAllProviders() {
  return Object.values(AI_PROVIDERS_CONFIG);
}

/**
 * Verifica se um erro HTTP/Network é passível de retry automático.
 */
function isRetryableAIError(status, message) {
  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    /rate|quota|limit|overloaded|timeout|temporarily|unavailable|internal/i.test(message || '')
  );
}

/**
 * Limpa e formata o texto retornado pela IA:
 * 1. Remove blocos de raciocínio de modelos thinking (<think>...</think>).
 * 2. Extrai blocos após RESUMO: se existirem.
 * 3. Remove prefixos redundantes.
 */
function cleanAIResponseText(rawText) {
  if (!rawText) return '';
  let text = String(rawText);

  // 1. Remove tags de raciocínio interno (<think>...</think> ou [THINK]...[/THINK])
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/\[THINK\][\s\S]*?\[\/THINK\]/gi, '').trim();

  // 2. Extrai conteúdo após tag "RESUMO:"
  const resumoMatch = text.match(/RESUMO:?\s*([\s\S]+)/i);
  if (resumoMatch) {
    text = resumoMatch[1].trim();
  }

  // 3. Remove prefixos repetitivos
  text = text.replace(/^(Resumo do Relato Individual|Resumo do BO|Resumo|Análise do BO|Síntese dos Fatos):?\s*/i, '').trim();

  return text;
}

/**
 * Normaliza mensagens de erro em português claro com link de suporte.
 */
function formatAIErrorMessage(providerId, status, rawMessage) {
  const provider = getProviderConfig(providerId);
  const msg = rawMessage || '';

  if (status === 401 || status === 403 || /unauthorized|invalid api key|forbidden|auth/i.test(msg)) {
    return `Chave de API do ${provider.name} inválida ou expirada. Verifique ou gere uma nova chave em: ${provider.apiKeyUrl}`;
  }
  if (status === 429 || /rate limit|quota|resource exhausted/i.test(msg)) {
    return `Limite de requisições excedido ou cota esgotada no ${provider.name}. Aguarde alguns instantes ou tente outro provedor/modelo.`;
  }
  if (status === 404 || /not found|model/i.test(msg)) {
    return `Modelo de IA não encontrado no ${provider.name} (${msg}). Selecione outro modelo nas configurações.`;
  }
  if (status >= 500) {
    return `O serviço do ${provider.name} está temporariamente instável (HTTP ${status}). Tente novamente em instantes.`;
  }
  return `Erro na chamada ao ${provider.name} (${msg || 'Falha de comunicação'}).`;
}

/**
 * Executa uma chamada à API do Gemini (REST v1beta).
 */
async function executeGeminiCall({ model, apiKey, prompt, systemInstruction, enableWebSearch, temperature, maxTokens }) {
  const cleanModel = (model || 'gemini-2.5-flash').replace(/^models\//, '');
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cleanModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const bodyPayload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: typeof temperature === 'number' ? temperature : 0.1,
      maxOutputTokens: maxTokens || 1200
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  if (systemInstruction) {
    bodyPayload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  // Suporte a Google Search Grounding nativo
  if (enableWebSearch) {
    bodyPayload.tools = [{ google_search: {} }];
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyPayload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.retryable = isRetryableAIError(response.status, errorMsg);
    throw err;
  }

  const candidate = (data.candidates || [])[0] || {};
  const text = (candidate.content || {}).parts
    ? candidate.content.parts.map(p => p.text || '').join('\n').trim()
    : '';

  return {
    rawText: text,
    groundingMetadata: candidate.groundingMetadata || null,
    usage: data.usageMetadata || null
  };
}

/**
 * Executa chamadas para provedores com endpoint compatível com OpenAI Chat Completions
 * (OpenAI, Groq, OpenRouter, Mistral, Cerebras).
 */
async function executeOpenAICompatibleCall({
  providerId,
  endpoint,
  model,
  apiKey,
  prompt,
  systemInstruction,
  extraHeaders = {},
  temperature,
  maxTokens
}) {
  const messages = [];
  if (systemInstruction) {
    // Modelos o1/o3-mini na OpenAI preferem role 'developer' ou 'system'
    const systemRole = (providerId === 'openai' && (model.startsWith('o1') || model.startsWith('o3'))) ? 'developer' : 'system';
    messages.push({ role: systemRole, content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const bodyPayload = {
    model: model,
    messages: messages,
    temperature: (model.startsWith('o1') || model.startsWith('o3')) ? undefined : (typeof temperature === 'number' ? temperature : 0.1)
  };

  // Tratamento de max_tokens vs max_completion_tokens
  if (model.startsWith('o1') || model.startsWith('o3')) {
    bodyPayload.max_completion_tokens = maxTokens || 1500;
  } else {
    bodyPayload.max_tokens = maxTokens || 1200;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey.trim()}`,
    ...extraHeaders
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(bodyPayload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || data?.message || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.retryable = isRetryableAIError(response.status, errorMsg);
    throw err;
  }

  const choice = (data.choices || [])[0] || {};
  const text = choice.message?.content || choice.text || '';

  return {
    rawText: text,
    usage: data.usage || null
  };
}

/**
 * Executa chamada à API da Anthropic Claude (/v1/messages).
 */
async function executeAnthropicCall({ model, apiKey, prompt, systemInstruction, temperature, maxTokens }) {
  const endpoint = 'https://api.anthropic.com/v1/messages';

  const bodyPayload = {
    model: model || 'claude-3-5-haiku-20241022',
    max_tokens: maxTokens || 1200,
    temperature: typeof temperature === 'number' ? temperature : 0.1,
    messages: [{ role: 'user', content: prompt }]
  };

  if (systemInstruction) {
    bodyPayload.system = systemInstruction;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true'
    },
    body: JSON.stringify(bodyPayload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.retryable = isRetryableAIError(response.status, errorMsg);
    throw err;
  }

  const contentParts = data.content || [];
  const text = contentParts
    .filter(part => part.type === 'text')
    .map(part => part.text)
    .join('\n')
    .trim();

  return {
    rawText: text,
    usage: data.usage || null
  };
}

/**
 * Executa chamada à API Cohere (/v2/chat).
 */
async function executeCohereCall({ model, apiKey, prompt, systemInstruction, temperature, maxTokens }) {
  const endpoint = 'https://api.cohere.com/v2/chat';

  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const bodyPayload = {
    model: model || 'command-r-08-2024',
    messages: messages,
    temperature: typeof temperature === 'number' ? temperature : 0.1,
    max_tokens: maxTokens || 1200
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify(bodyPayload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.retryable = isRetryableAIError(response.status, errorMsg);
    throw err;
  }

  let text = '';
  if (data.message && Array.isArray(data.message.content)) {
    text = data.message.content.map(c => c.text || '').join('\n').trim();
  } else if (data.text) {
    text = data.text;
  }

  return {
    rawText: text,
    usage: data.usage || null
  };
}

/**
 * Função Unificada para invocar qualquer um dos 8 Provedores de IA com Retry e Backoff.
 * 
 * @param {Object} options
 * @param {string} options.provider - ID do provedor ('gemini', 'openai', 'anthropic', 'groq', 'openrouter', 'mistral', 'cohere', 'cerebras')
 * @param {string} options.model - Modelo selecionado
 * @param {string} options.apiKey - Chave de API correspondente
 * @param {string} options.prompt - Prompt do usuário com o conteúdo do BO
 * @param {string} [options.systemInstruction] - Instrução de sistema para estruturação
 * @param {boolean} [options.enableWebSearch] - Ativa busca web / grounding
 * @param {number} [options.temperature] - Temperatura de amostragem
 * @param {number} [options.maxTokens] - Limite de tokens de saída
 * @param {function} [options.onRetry] - Callback informativo para retries: (attempt, maxAttempts, delay, err) => void
 * @returns {Promise<{ ok: boolean, text: string, rawText: string, provider: string, model: string, usage?: object, groundingMetadata?: object }>}
 */
async function callAIProvider(options) {
  const {
    provider = 'gemini',
    model,
    apiKey,
    prompt,
    systemInstruction = '',
    enableWebSearch = false,
    temperature = 0.1,
    maxTokens = 1200,
    onRetry = null
  } = options;

  const providerConfig = getProviderConfig(provider);

  if (!apiKey || !apiKey.trim()) {
    const err = new Error(`Chave de API não informada para ${providerConfig.name}.`);
    err.formattedMessage = `Configure a chave de API do ${providerConfig.name} nas configurações. Obtenha em: ${providerConfig.apiKeyUrl}`;
    err.providerId = provider;
    throw err;
  }

  const selectedModel = model || providerConfig.defaultModel;
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let callResult = null;

      switch (provider) {
        case 'gemini':
          callResult = await executeGeminiCall({
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            enableWebSearch,
            temperature,
            maxTokens
          });
          break;

        case 'openai':
          callResult = await executeOpenAICompatibleCall({
            providerId: 'openai',
            endpoint: 'https://api.openai.com/v1/chat/completions',
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        case 'anthropic':
          callResult = await executeAnthropicCall({
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        case 'groq':
          callResult = await executeOpenAICompatibleCall({
            providerId: 'groq',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        case 'openrouter':
          callResult = await executeOpenAICompatibleCall({
            providerId: 'openrouter',
            endpoint: 'https://openrouter.ai/api/v1/chat/completions',
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            extraHeaders: {
              'HTTP-Referer': 'https://sisp.ciasc.sc.gov.br',
              'X-Title': 'EPROC Despacho IA'
            },
            temperature,
            maxTokens
          });
          break;

        case 'mistral':
          callResult = await executeOpenAICompatibleCall({
            providerId: 'mistral',
            endpoint: 'https://api.mistral.ai/v1/chat/completions',
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        case 'cohere':
          callResult = await executeCohereCall({
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        case 'cerebras':
          callResult = await executeOpenAICompatibleCall({
            providerId: 'cerebras',
            endpoint: 'https://api.cerebras.ai/v1/chat/completions',
            model: selectedModel,
            apiKey,
            prompt,
            systemInstruction,
            temperature,
            maxTokens
          });
          break;

        default:
          throw new Error(`Provedor de IA desconhecido: "${provider}"`);
      }

      const cleanedText = cleanAIResponseText(callResult.rawText);
      if (!cleanedText) {
        throw new Error(`O provedor ${providerConfig.name} retornou uma resposta em branco.`);
      }

      return {
        ok: true,
        text: cleanedText,
        rawText: callResult.rawText,
        provider: provider,
        model: selectedModel,
        usage: callResult.usage || null,
        groundingMetadata: callResult.groundingMetadata || null
      };

    } catch (err) {
      lastError = err;
      const isRetryable = err.retryable || isRetryableAIError(err.status, err.message);

      if (isRetryable && attempt < maxAttempts) {
        // Backoff exponencial: 1000ms, 2000ms com jitter
        const baseDelay = 1000 * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 300);
        const delay = baseDelay + jitter;

        if (typeof onRetry === 'function') {
          onRetry(attempt, maxAttempts, delay, err);
        }

        await new Promise(res => setTimeout(res, delay));
        continue;
      }

      // Se não for passível de retry ou esgotou as tentativas, interrompe
      break;
    }
  }

  // Se chegou aqui, ocorreu erro após as tentativas
  const friendlyMsg = formatAIErrorMessage(provider, lastError?.status, lastError?.message);
  const errorObj = new Error(friendlyMsg);
  errorObj.originalError = lastError;
  errorObj.providerId = provider;
  errorObj.status = lastError?.status;
  throw errorObj;
}

// Exporta para escopo global do browser / extension
if (typeof window !== 'undefined') {
  window.AI_PROVIDERS_CONFIG = AI_PROVIDERS_CONFIG;
  window.getProviderConfig = getProviderConfig;
  window.getAllProviders = getAllProviders;
  window.callAIProvider = callAIProvider;
  window.cleanAIResponseText = cleanAIResponseText;
  window.formatAIErrorMessage = formatAIErrorMessage;
}

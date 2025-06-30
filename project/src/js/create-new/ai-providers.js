/**
 * AI Provider Abstraction Layer
 * Supports multiple LLM providers with unified interface
 */

class AIProviderManager {
    constructor() {
        this.providers = new Map();
        this.currentProvider = null;
        this.fallbackProviders = [];
        this.config = {
            defaultProvider: 'openai-compatible',
            fallbackEnabled: true,
            costOptimization: true,
            maxRetries: 3
        };
        
        this.initializeProviders();
    }

    initializeProviders() {
        // Register all available providers
        this.registerProvider('openai', new OpenAIProvider());
        this.registerProvider('openai-compatible', new OpenAIProvider()); // Register openai-compatible as alias
        this.registerProvider('claude', new ClaudeProvider());
        this.registerProvider('gemini', new GeminiProvider());
        this.registerProvider('ollama', new OllamaProvider());
        
        // Set default provider
        this.setProvider(this.config.defaultProvider);
        
        console.log('🤖 AI Provider Manager initialized with providers:', Array.from(this.providers.keys()));
    }

    registerProvider(name, provider) {
        this.providers.set(name, provider);
    }

    setProvider(providerName) {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }
        
        this.currentProvider = provider;
        console.log(`🔄 Switched to provider: ${providerName}`);
        return true;
    }

    async generateResponse(prompt, context = {}, options = {}) {
        const provider = this.currentProvider;
        if (!provider) {
            throw new Error('No AI provider configured');
        }

        try {
            const response = await provider.generateResponse(prompt, context, options);
            // Extract text content from the response object
            return this.extractTextContent(response, provider.name);
        } catch (error) {
            console.error('Provider error:', error);
            
            if (this.config.fallbackEnabled) {
                return await this.tryFallbackProviders(prompt, context, options);
            }
            
            throw error;
        }
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        const provider = this.currentProvider;
        if (!provider) {
            throw new Error('No AI provider configured');
        }

        try {
            return await provider.streamResponse(prompt, context, callback, options);
        } catch (error) {
            console.error('Streaming error:', error);
            throw error;
        }
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        const provider = this.currentProvider;
        if (!provider || !provider.supportsFunctionCalling()) {
            throw new Error('Current provider does not support function calling');
        }

        try {
            return await provider.getFunctionCall(prompt, availableFunctions, context);
        } catch (error) {
            console.error('Function calling error:', error);
            throw error;
        }
    }

    async tryFallbackProviders(prompt, context, options) {
        for (const fallbackName of this.fallbackProviders) {
            const fallbackProvider = this.providers.get(fallbackName);
            if (fallbackProvider && fallbackProvider !== this.currentProvider) {
                try {
                    console.log(`🔄 Trying fallback provider: ${fallbackName}`);
                    const response = await fallbackProvider.generateResponse(prompt, context, options);
                    // Extract text content from the fallback response object
                    return this.extractTextContent(response, fallbackProvider.name);
                } catch (error) {
                    console.error(`Fallback provider ${fallbackName} failed:`, error);
                    continue;
                }
            }
        }
        
        throw new Error('All providers failed');
    }

    extractTextContent(response, providerName) {
        // If response is already a string, return it
        if (typeof response === 'string') {
            return response;
        }

        // Extract content based on provider response format
        switch (providerName) {
            case 'openai':
                return response?.choices?.[0]?.message?.content || '';
            
            case 'claude':
                if (response?.content) {
                    // Claude returns content as an array of objects
                    const textContent = response.content.find(item => item.type === 'text');
                    return textContent?.text || '';
                }
                return '';
            
            case 'gemini':
                return response?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            
            case 'ollama':
                return response?.message?.content || '';
            
            default:
                // Try common response patterns
                return response?.choices?.[0]?.message?.content || 
                       response?.content || 
                       response?.text || 
                       response?.message?.content || 
                       '';
        }
    }

    getProviderCapabilities() {
        return this.currentProvider?.getCapabilities() || {};
    }

    estimateCost(prompt, expectedResponseLength = 1000) {
        return this.currentProvider?.estimateCost(prompt, expectedResponseLength) || 0;
    }

    getAvailableProviders() {
        return Array.from(this.providers.keys());
    }

    setFallbackProviders(providers) {
        this.fallbackProviders = providers;
    }
}

/**
 * Base AI Provider Interface
 */
class BaseAIProvider {
    constructor(name) {
        this.name = name;
        this.apiKey = null;
        this.baseURL = null;
        this.model = null;
        this.capabilities = {
            functionCalling: false,
            streaming: false,
            multimodal: false,
            maxTokens: 4096
        };
    }

    async generateResponse(prompt, context = {}, options = {}) {
        throw new Error('generateResponse must be implemented by provider');
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        throw new Error('streamResponse must be implemented by provider');
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        throw new Error('getFunctionCall must be implemented by provider');
    }

    getCapabilities() {
        return this.capabilities;
    }

    supportsFunctionCalling() {
        return this.capabilities.functionCalling;
    }

    supportsStreaming() {
        return this.capabilities.streaming;
    }

    estimateCost(prompt, expectedResponseLength) {
        return 0; // Override in specific providers
    }

    async configure(config) {
        console.log(`🔧 Configuring provider ${this.name} with:`, config);

        if (config.apiKey) {
            this.apiKey = config.apiKey;
        }
        if (config.baseURL) {
            this.baseURL = config.baseURL;
        }
        if (config.model) {
            this.model = config.model;
        }

        // Always use proxy mode for security
        this.useProxy = true;

        console.log(`🔧 Provider ${this.name} configured:`, {
            baseURL: this.baseURL,
            model: this.model,
            hasApiKey: !!this.apiKey,
            useProxy: this.useProxy
        });

        // Check if proxy server is available
        const proxyAvailable = await this.checkProxyHealth();
        console.log(`🔍 Proxy health check result: ${proxyAvailable}`);

        if (!proxyAvailable) {
            console.warn('⚠️ Proxy server not available, AI functionality may be limited');
            throw new Error('AI proxy server is not available. Please ensure the server is running.');
        }
    }

    async checkProxyHealth() {
        try {
            console.log('🔍 Making health check request to /api/ai/health');
            const response = await fetch('/api/ai/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(`🔍 Health check response status: ${response.status}`);

            if (response.ok) {
                const health = await response.json();
                console.log('✅ Proxy server health check passed:', health.service);
                return true;
            } else {
                console.warn('⚠️ Proxy server health check failed:', response.status);
                return false;
            }
        } catch (error) {
            console.warn('⚠️ Proxy server health check error:', error.message);
            return false;
        }
    }

    async configureProxyServer(config) {
        try {
            const sessionId = this.getSessionId();
            const configData = {
                sessionId,
                provider: this.name === 'openai' && config.baseURL && config.baseURL !== 'https://api.openai.com/v1'
                    ? 'openai-compatible'
                    : this.name,
                apiKey: config.apiKey,
                baseUrl: config.baseURL || this.baseURL,
                model: config.model || this.model
            };

            console.log(`📡 Configuring proxy server for session ${sessionId}`);

            // Add retry logic for proxy configuration
            let retries = 3;
            let lastError;

            while (retries > 0) {
                try {
                    const response = await fetch('/api/ai/configure', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(configData)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        let errorData;
                        try {
                            errorData = JSON.parse(errorText);
                        } catch {
                            errorData = { error: `HTTP ${response.status}: ${errorText}` };
                        }
                        throw new Error(`Proxy configuration failed: ${errorData.error}`);
                    }

                    const result = await response.json();
                    console.log('✅ Proxy server configured successfully:', result.config);
                    return; // Success, exit function

                } catch (error) {
                    lastError = error;
                    retries--;

                    if (retries > 0) {
                        console.warn(`⚠️ Proxy configuration attempt failed, retrying... (${retries} attempts left)`, error.message);
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                    }
                }
            }

            throw lastError; // All retries failed

        } catch (error) {
            console.error('❌ Failed to configure proxy server after retries:', error);
            throw error;
        }
    }

    getSessionId() {
        // Generate or retrieve session ID for this browser session
        if (!window.meenoeAISessionId) {
            window.meenoeAISessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        }
        return window.meenoeAISessionId;
    }
}

/**
 * OpenAI Provider Implementation
 */
class OpenAIProvider extends BaseAIProvider {
    constructor() {
        super('openai');
        this.capabilities = {
            functionCalling: true,
            streaming: true,
            multimodal: true,
            maxTokens: 128000
        };
        this.model = 'gpt-4o';
        this.baseURL = 'https://api.openai.com/v1';
    }

    async generateResponse(prompt, context = {}, options = {}) {
        const messages = this.buildMessages(prompt, context);
        
        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
            ...options.openaiOptions
        };

        return await this.makeProxyRequest('/chat/completions', requestBody);
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        const messages = this.buildMessages(prompt, context);
        
        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
            stream: true,
            ...options.openaiOptions
        };

        return await this.makeProxyStreamRequest('/chat/completions', requestBody, callback);
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        const messages = this.buildMessages(prompt, context);
        
        const requestBody = {
            model: this.model,
            messages: messages,
            functions: availableFunctions,
            function_call: 'auto'
        };

        const response = await this.makeProxyRequest('/chat/completions', requestBody);
        return response.choices[0].message.function_call;
    }

    buildMessages(prompt, context) {
        const messages = [];
        
        if (context.systemPrompt) {
            messages.push({ role: 'system', content: context.systemPrompt });
        }
        
        if (context.conversationHistory) {
            messages.push(...context.conversationHistory);
        }
        
        messages.push({ role: 'user', content: prompt });
        
        return messages;
    }

    async makeProxyRequest(endpoint, body) {
        const sessionId = this.getSessionId();
        console.log(`🔄 Making proxy request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error(`❌ Proxy request failed: ${response.status} ${response.statusText}`);
            throw new Error(`Proxy API error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        return await response.json();
    }

    async makeProxyStreamRequest(endpoint, body, callback) {
        const sessionId = this.getSessionId();
        console.log(`🌊 Making proxy stream request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy stream error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            if (content) {
                                callback(content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    estimateCost(prompt, expectedResponseLength) {
        const inputTokens = Math.ceil(prompt.length / 4); // Rough estimation
        const outputTokens = Math.ceil(expectedResponseLength / 4);

        // GPT-4 pricing (approximate)
        const inputCost = (inputTokens / 1000) * 0.03;
        const outputCost = (outputTokens / 1000) * 0.06;

        return inputCost + outputCost;
    }
}

/**
 * Claude Provider Implementation
 */
class ClaudeProvider extends BaseAIProvider {
    constructor() {
        super('claude');
        this.capabilities = {
            functionCalling: true,
            streaming: true,
            multimodal: true,
            maxTokens: 200000
        };
        this.model = 'claude-3-5-sonnet-20241022';
        this.baseURL = 'https://api.anthropic.com/v1';
    }

    async generateResponse(prompt, context = {}, options = {}) {
        const messages = this.buildMessages(prompt, context);

        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
            ...options.claudeOptions
        };

        if (context.systemPrompt) {
            requestBody.system = context.systemPrompt;
        }

        return await this.makeProxyRequest('/messages', requestBody);
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        const messages = this.buildMessages(prompt, context);

        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
            stream: true,
            ...options.claudeOptions
        };

        if (context.systemPrompt) {
            requestBody.system = context.systemPrompt;
        }

        return await this.makeProxyStreamRequest('/messages', requestBody, callback);
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        const messages = this.buildMessages(prompt, context);

        const requestBody = {
            model: this.model,
            messages: messages,
            tools: availableFunctions.map(func => ({
                name: func.name,
                description: func.description,
                input_schema: func.parameters
            }))
        };

        if (context.systemPrompt) {
            requestBody.system = context.systemPrompt;
        }

        const response = await this.makeProxyRequest('/messages', requestBody);

        // Find tool use in response
        const toolUse = response.content.find(item => item.type === 'tool_use');
        if (toolUse) {
            return {
                name: toolUse.name,
                arguments: JSON.stringify(toolUse.input)
            };
        }

        return null;
    }

    buildMessages(prompt, context) {
        const messages = [];

        if (context.conversationHistory) {
            messages.push(...context.conversationHistory);
        }

        messages.push({ role: 'user', content: prompt });

        return messages;
    }

    async makeProxyRequest(endpoint, body) {
        const sessionId = this.getSessionId();
        console.log(`🔄 Making proxy request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy API error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        return await response.json();
    }

    async makeProxyStreamRequest(endpoint, body, callback) {
        const sessionId = this.getSessionId();
        console.log(`🌊 Making proxy stream request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy stream error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.type === 'content_block_delta') {
                                const content = parsed.delta?.text;
                                if (content) {
                                    callback(content);
                                }
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    estimateCost(prompt, expectedResponseLength) {
        const inputTokens = Math.ceil(prompt.length / 4);
        const outputTokens = Math.ceil(expectedResponseLength / 4);

        // Claude pricing (approximate)
        const inputCost = (inputTokens / 1000) * 0.015;
        const outputCost = (outputTokens / 1000) * 0.075;

        return inputCost + outputCost;
    }
}

/**
 * Gemini Provider Implementation
 */
class GeminiProvider extends BaseAIProvider {
    constructor() {
        super('gemini');
        this.capabilities = {
            functionCalling: true,
            streaming: true,
            multimodal: true,
            maxTokens: 32768
        };
        this.model = 'gemini-1.5-pro';
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    }

    async generateResponse(prompt, context = {}, options = {}) {
        const contents = this.buildContents(prompt, context);

        const requestBody = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.maxTokens || 1000,
                temperature: options.temperature || 0.7,
                ...options.geminiOptions
            }
        };

        if (context.systemPrompt) {
            requestBody.systemInstruction = {
                parts: [{ text: context.systemPrompt }]
            };
        }

        return await this.makeProxyRequest(`/models/${this.model}:generateContent`, requestBody);
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        const contents = this.buildContents(prompt, context);

        const requestBody = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.maxTokens || 1000,
                temperature: options.temperature || 0.7,
                ...options.geminiOptions
            }
        };

        if (context.systemPrompt) {
            requestBody.systemInstruction = {
                parts: [{ text: context.systemPrompt }]
            };
        }

        return await this.makeProxyStreamRequest(`/models/${this.model}:streamGenerateContent`, requestBody, callback);
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        const contents = this.buildContents(prompt, context);

        const requestBody = {
            contents: contents,
            tools: [{
                functionDeclarations: availableFunctions.map(func => ({
                    name: func.name,
                    description: func.description,
                    parameters: func.parameters
                }))
            }]
        };

        if (context.systemPrompt) {
            requestBody.systemInstruction = {
                parts: [{ text: context.systemPrompt }]
            };
        }

        const response = await this.makeProxyRequest(`/models/${this.model}:generateContent`, requestBody);

        const functionCall = response.candidates[0].content.parts.find(part => part.functionCall);
        if (functionCall) {
            return {
                name: functionCall.functionCall.name,
                arguments: JSON.stringify(functionCall.functionCall.args)
            };
        }

        return null;
    }

    buildContents(prompt, context) {
        const contents = [];

        if (context.conversationHistory) {
            for (const message of context.conversationHistory) {
                contents.push({
                    role: message.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: message.content }]
                });
            }
        }

        contents.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        return contents;
    }

    async makeProxyRequest(endpoint, body) {
        const sessionId = this.getSessionId();
        console.log(`🔄 Making proxy request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy API error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        return await response.json();
    }

    async makeProxyStreamRequest(endpoint, body, callback) {
        const sessionId = this.getSessionId();
        console.log(`🌊 Making proxy stream request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy stream error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim() && line.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(line);
                            const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (content) {
                                callback(content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    estimateCost(prompt, expectedResponseLength) {
        const inputTokens = Math.ceil(prompt.length / 4);
        const outputTokens = Math.ceil(expectedResponseLength / 4);

        // Gemini pricing (approximate)
        const inputCost = (inputTokens / 1000) * 0.00125;
        const outputCost = (outputTokens / 1000) * 0.00375;

        return inputCost + outputCost;
    }
}

/**
 * Ollama Provider Implementation (Local/Self-hosted)
 */
class OllamaProvider extends BaseAIProvider {
    constructor() {
        super('ollama');
        this.capabilities = {
            functionCalling: false, // Limited function calling support
            streaming: true,
            multimodal: false,
            maxTokens: 8192
        };
        this.model = 'llama3.1';
        this.baseURL = 'http://localhost:11434';
    }

    async generateResponse(prompt, context = {}, options = {}) {
        const messages = this.buildMessages(prompt, context);

        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            stream: false,
            options: {
                temperature: options.temperature || 0.7,
                num_predict: options.maxTokens || 1000,
                ...options.ollamaOptions
            }
        };

        return await this.makeProxyRequest('/api/chat', requestBody);
    }

    async streamResponse(prompt, context = {}, callback, options = {}) {
        const messages = this.buildMessages(prompt, context);

        const requestBody = {
            model: options.model || this.model,
            messages: messages,
            stream: true,
            options: {
                temperature: options.temperature || 0.7,
                num_predict: options.maxTokens || 1000,
                ...options.ollamaOptions
            }
        };

        return await this.makeProxyStreamRequest('/api/chat', requestBody, callback);
    }

    async getFunctionCall(prompt, availableFunctions, context = {}) {
        // Ollama has limited function calling support
        // We'll use a prompt-based approach
        const functionPrompt = this.buildFunctionPrompt(prompt, availableFunctions);
        const response = await this.generateResponse(functionPrompt, context);

        // Parse the response for function calls
        return this.parseFunctionCall(response, availableFunctions);
    }

    buildMessages(prompt, context) {
        const messages = [];

        if (context.systemPrompt) {
            messages.push({ role: 'system', content: context.systemPrompt });
        }

        if (context.conversationHistory) {
            messages.push(...context.conversationHistory);
        }

        messages.push({ role: 'user', content: prompt });

        return messages;
    }

    buildFunctionPrompt(prompt, availableFunctions) {
        const functionsDesc = availableFunctions.map(func =>
            `${func.name}: ${func.description}`
        ).join('\n');

        return `${prompt}

Available functions:
${functionsDesc}

If you need to call a function, respond with: FUNCTION_CALL: function_name(parameters)`;
    }

    parseFunctionCall(response, availableFunctions) {
        const match = response.match(/FUNCTION_CALL:\s*(\w+)\((.*?)\)/);
        if (match) {
            const [, functionName, params] = match;
            const func = availableFunctions.find(f => f.name === functionName);
            if (func) {
                return {
                    name: functionName,
                    arguments: params
                };
            }
        }
        return null;
    }

    async makeProxyRequest(endpoint, body) {
        const sessionId = this.getSessionId();
        console.log(`🔄 Making proxy request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy API error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        return await response.json();
    }

    async makeProxyStreamRequest(endpoint, body, callback) {
        const sessionId = this.getSessionId();
        console.log(`🌊 Making proxy stream request via /api/ai${endpoint}`);

        const response = await fetch(`/api/ai${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Session-Id': sessionId
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(`Proxy stream error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const parsed = JSON.parse(line);
                            const content = parsed.message?.content;
                            if (content) {
                                callback(content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    estimateCost(prompt, expectedResponseLength) {
        return 0; // Local model, no cost
    }
}

// Initialize with default configuration from server
async function initializeDefaultAIConfig() {
    try {
        const response = await fetch('/api/ai/default-config');
        if (response.ok) {
            const defaultConfig = await response.json();
            console.log('🔄 Loaded default AI configuration from server:', defaultConfig);
            
            // Create a session ID if not exists
            if (!window.meenoeAISessionId) {
                window.meenoeAISessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            }
            
            // Configure the AI provider with default settings
            if (window.AIProviderManager) {
                const manager = new window.AIProviderManager();
                
                // Map 'openai-compatible' to 'openai' for provider selection
                let providerName = defaultConfig.provider;
                if (providerName === 'openai-compatible') {
                    providerName = 'openai';
                }
                
                // Set the provider
                if (providerName) {
                    manager.setProvider(providerName);
                }
                
                // Configure the provider
                if (manager.currentProvider) {
                    await manager.currentProvider.configureProxyServer({
                        baseURL: defaultConfig.baseUrl,
                        model: defaultConfig.model
                    });
                    
                    console.log('✅ AI provider configured with default settings');
                }
            }
        } else {
            console.warn('⚠️ Failed to load default AI configuration from server');
        }
    } catch (error) {
        console.error('❌ Error initializing default AI configuration:', error);
    }
}

// Export classes for use in other modules
if (typeof window !== 'undefined') {
    window.AIProviderManager = AIProviderManager;
    window.BaseAIProvider = BaseAIProvider;
    window.OpenAIProvider = OpenAIProvider;
    window.ClaudeProvider = ClaudeProvider;
    window.GeminiProvider = GeminiProvider;
    window.OllamaProvider = OllamaProvider;
    
    // Initialize default configuration
    document.addEventListener('DOMContentLoaded', initializeDefaultAIConfig);
}
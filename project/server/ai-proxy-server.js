import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Default AI configuration from environment variables
const DEFAULT_AI_CONFIG = {
  provider: process.env.AI_PROVIDER || 'openai-compatible',
  baseUrl: process.env.AI_BASE_URL || 'https://api.kluster.ai/v1',
  apiKey: process.env.AI_API_KEY || '364e67fb-3aef-49c9-90de-411f8e205d4e',
  model: process.env.AI_MODEL || 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8'
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Store for user-specific AI configurations (in production, use a proper database)
const userConfigurations = new Map();

// Health check endpoints
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Meenoe AI Proxy Server'
    });
});

app.get('/api/ai/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Meenoe AI Proxy Server'
    });
});

// Configuration endpoint
app.post('/api/ai/configure', (req, res) => {
    try {
        const { sessionId, provider, apiKey, baseUrl, model } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ 
                error: 'Missing required field: sessionId' 
            });
        }

        // If user is providing their own configuration
        if (provider && apiKey) {
            // Store user-specific configuration
            userConfigurations.set(sessionId, {
                provider,
                apiKey,
                baseUrl: baseUrl || getDefaultBaseUrl(provider),
                model: model || getDefaultModel(provider),
                timestamp: new Date().toISOString(),
                isCustom: true
            });

            console.log(`🔧 Custom AI configuration stored for session ${sessionId}:`, {
                provider,
                baseUrl: baseUrl || getDefaultBaseUrl(provider),
                model: model || getDefaultModel(provider),
                hasApiKey: true,
                isCustom: true
            });
        } else {
            // Use default configuration from environment variables
            userConfigurations.set(sessionId, {
                provider: DEFAULT_AI_CONFIG.provider,
                apiKey: DEFAULT_AI_CONFIG.apiKey,
                baseUrl: DEFAULT_AI_CONFIG.baseUrl,
                model: DEFAULT_AI_CONFIG.model,
                timestamp: new Date().toISOString(),
                isCustom: false
            });

            console.log(`🔧 Default AI configuration used for session ${sessionId}:`, {
                provider: DEFAULT_AI_CONFIG.provider,
                baseUrl: DEFAULT_AI_CONFIG.baseUrl,
                model: DEFAULT_AI_CONFIG.model,
                isCustom: false
            });
        }

        const config = userConfigurations.get(sessionId);
        
        res.json({ 
            success: true, 
            message: 'Configuration stored successfully',
            config: {
                provider: config.provider,
                baseUrl: config.baseUrl,
                model: config.model,
                isCustom: config.isCustom
            }
        });
    } catch (error) {
        console.error('Configuration error:', error);
        res.status(500).json({ error: 'Failed to store configuration' });
    }
});

// AI Chat Completions Proxy
app.post('/api/ai/chat/completions', async (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'];
        
        // Get user configuration or use default if not found
        let config = userConfigurations.get(sessionId);
        
        if (!config) {
            // Auto-configure with default settings
            config = {
                provider: DEFAULT_AI_CONFIG.provider,
                apiKey: DEFAULT_AI_CONFIG.apiKey,
                baseUrl: DEFAULT_AI_CONFIG.baseUrl,
                model: DEFAULT_AI_CONFIG.model,
                isCustom: false
            };
            
            userConfigurations.set(sessionId, {
                ...config,
                timestamp: new Date().toISOString()
            });
            
            console.log(`🔄 Auto-configured session ${sessionId} with default settings`);
        }

        const { apiKey, baseUrl } = config;
        const requestBody = req.body;

        // Use model from config if not specified in request
        if (!requestBody.model && config.model) {
            requestBody.model = config.model;
        }

        console.log(`🌐 Proxying request to: ${baseUrl}/chat/completions`);
        console.log(`📝 Model: ${requestBody.model}`);
        console.log(`🔑 Using ${config.isCustom ? 'custom' : 'default'} API key`);

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Meenoe-AI-Assistant/1.0'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API request failed: ${response.status} ${response.statusText}`);
            console.error('Error details:', errorText);
            
            return res.status(response.status).json({
                error: `AI API error: ${response.status} ${response.statusText}`,
                details: errorText
            });
        }

        // Handle streaming responses
        if (requestBody.stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            
            response.body.pipe(res);
        } else {
            const data = await response.json();
            res.json(data);
        }

    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            error: 'Proxy server error', 
            message: error.message 
        });
    }
});

// Get default configuration endpoint (for frontend to know what's available)
app.get('/api/ai/default-config', (req, res) => {
    res.json({
        provider: DEFAULT_AI_CONFIG.provider,
        baseUrl: DEFAULT_AI_CONFIG.baseUrl,
        model: DEFAULT_AI_CONFIG.model,
        // Never expose the API key
    });
});

// Helper functions
function getDefaultBaseUrl(provider) {
    const baseUrls = {
        'openai': 'https://api.openai.com/v1',
        'claude': 'https://api.anthropic.com/v1',
        'gemini': 'https://generativelanguage.googleapis.com/v1beta',
        'ollama': 'http://localhost:11434/v1',
        'openai-compatible': 'https://api.kluster.ai/v1' // Updated default
    };
    return baseUrls[provider] || baseUrls['openai-compatible'];
}

function getDefaultModel(provider) {
    const models = {
        'openai': 'gpt-4o',
        'claude': 'claude-3-5-sonnet-20241022',
        'gemini': 'gemini-pro',
        'ollama': 'llama3.1',
        'openai-compatible': 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8' // Updated default
    };
    return models[provider] || models['openai-compatible'];
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Meenoe AI Proxy Server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🔧 Default AI provider: ${DEFAULT_AI_CONFIG.provider}`);
    console.log(`🔧 Default AI model: ${DEFAULT_AI_CONFIG.model}`);
    console.log(`🔧 Default AI base URL: ${DEFAULT_AI_CONFIG.baseUrl}`);
});

export default app;
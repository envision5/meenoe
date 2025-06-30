/**
 * AI Security & Performance Module
 * Implements security measures, performance optimization, and production readiness features
 */

class AISecurityManager {
    constructor() {
        this.rateLimiter = new RateLimiter();
        this.inputValidator = new InputValidator();
        this.outputSanitizer = new OutputSanitizer();
        this.auditLogger = new AuditLogger();
        
        this.setupSecurityPolicies();
        console.log('🔒 AI Security Manager initialized');
    }

    setupSecurityPolicies() {
        // Content Security Policy for AI operations
        this.csp = {
            allowedDomains: [
                'api.openai.com',
                'api.anthropic.com', 
                'generativelanguage.googleapis.com',
                'localhost'
            ],
            maxRequestSize: 1024 * 1024, // 1MB
            maxResponseSize: 2 * 1024 * 1024, // 2MB
            timeoutMs: 30000 // 30 seconds
        };
    }

    async validateRequest(request) {
        // Rate limiting
        if (!this.rateLimiter.checkLimit(request.userId || 'anonymous')) {
            throw new Error('Rate limit exceeded. Please wait before making another request.');
        }

        // Input validation
        const validationResult = this.inputValidator.validate(request);
        if (!validationResult.isValid) {
            throw new Error(`Invalid input: ${validationResult.errors.join(', ')}`);
        }

        // Size validation
        const requestSize = JSON.stringify(request).length;
        if (requestSize > this.csp.maxRequestSize) {
            throw new Error('Request too large');
        }

        // Log the request
        this.auditLogger.logRequest(request);

        return true;
    }

    async sanitizeResponse(response) {
        // Sanitize output
        const sanitized = this.outputSanitizer.sanitize(response);
        
        // Size check
        const responseSize = JSON.stringify(sanitized).length;
        if (responseSize > this.csp.maxResponseSize) {
            console.warn('Response size exceeds limit, truncating');
            return this.truncateResponse(sanitized);
        }

        // Log the response
        this.auditLogger.logResponse(sanitized);

        return sanitized;
    }

    truncateResponse(response) {
        if (typeof response === 'string') {
            return response.substring(0, 1000) + '... [Response truncated for security]';
        }
        return response;
    }

    validateApiKey(apiKey, provider) {
        if (!apiKey || typeof apiKey !== 'string') {
            return false;
        }

        // Basic format validation for different providers
        const patterns = {
            openai: /^sk-[a-zA-Z0-9]{48,}$/,
            claude: /^sk-ant-[a-zA-Z0-9-]{95,}$/,
            gemini: /^[a-zA-Z0-9_-]{39}$/
        };

        const pattern = patterns[provider];
        return pattern ? pattern.test(apiKey) : apiKey.length > 10;
    }

    encryptApiKey(apiKey) {
        // Simple encryption for local storage (not cryptographically secure)
        const key = 'meenoe_ai_key_salt';
        let encrypted = '';
        for (let i = 0; i < apiKey.length; i++) {
            encrypted += String.fromCharCode(
                apiKey.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return btoa(encrypted);
    }

    decryptApiKey(encryptedKey) {
        try {
            const key = 'meenoe_ai_key_salt';
            const encrypted = atob(encryptedKey);
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                decrypted += String.fromCharCode(
                    encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
                );
            }
            return decrypted;
        } catch (error) {
            console.error('Failed to decrypt API key:', error);
            return null;
        }
    }
}

class RateLimiter {
    constructor() {
        this.requests = new Map();
        this.limits = {
            perMinute: 20,
            perHour: 100,
            perDay: 500
        };
    }

    checkLimit(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        
        // Clean old requests
        const validRequests = userRequests.filter(timestamp => 
            now - timestamp < 24 * 60 * 60 * 1000 // 24 hours
        );

        // Check limits
        const lastMinute = validRequests.filter(t => now - t < 60 * 1000).length;
        const lastHour = validRequests.filter(t => now - t < 60 * 60 * 1000).length;
        const lastDay = validRequests.length;

        if (lastMinute >= this.limits.perMinute ||
            lastHour >= this.limits.perHour ||
            lastDay >= this.limits.perDay) {
            return false;
        }

        // Add current request
        validRequests.push(now);
        this.requests.set(userId, validRequests);
        
        return true;
    }

    getRemainingRequests(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        
        const lastMinute = userRequests.filter(t => now - t < 60 * 1000).length;
        const lastHour = userRequests.filter(t => now - t < 60 * 60 * 1000).length;
        const lastDay = userRequests.filter(t => now - t < 24 * 60 * 60 * 1000).length;

        return {
            perMinute: Math.max(0, this.limits.perMinute - lastMinute),
            perHour: Math.max(0, this.limits.perHour - lastHour),
            perDay: Math.max(0, this.limits.perDay - lastDay)
        };
    }
}

class InputValidator {
    constructor() {
        this.maxLength = 10000;
        this.forbiddenPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];
    }

    validate(input) {
        const errors = [];

        if (typeof input === 'string') {
            // Length check
            if (input.length > this.maxLength) {
                errors.push(`Input too long (max ${this.maxLength} characters)`);
            }

            // Pattern checks
            for (const pattern of this.forbiddenPatterns) {
                if (pattern.test(input)) {
                    errors.push('Input contains forbidden content');
                    break;
                }
            }
        } else if (typeof input === 'object') {
            // Recursively validate object properties
            for (const [key, value] of Object.entries(input)) {
                if (typeof value === 'string') {
                    const result = this.validate(value);
                    if (!result.isValid) {
                        errors.push(`Invalid ${key}: ${result.errors.join(', ')}`);
                    }
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

class OutputSanitizer {
    constructor() {
        this.allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre'];
    }

    sanitize(output) {
        if (typeof output === 'string') {
            return this.sanitizeString(output);
        } else if (typeof output === 'object') {
            return this.sanitizeObject(output);
        }
        return output;
    }

    sanitizeString(str) {
        // Remove potentially dangerous HTML
        let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        sanitized = sanitized.replace(/javascript:/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        
        // Allow only specific HTML tags
        sanitized = sanitized.replace(/<(?!\/?(?:p|br|strong|em|ul|ol|li|code|pre)\b)[^>]*>/gi, '');
        
        return sanitized;
    }

    sanitizeObject(obj) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = this.sanitizeString(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = this.sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
}

class AuditLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    logRequest(request) {
        this.addLog('request', {
            timestamp: new Date().toISOString(),
            type: request.type || 'unknown',
            userId: request.userId || 'anonymous',
            size: JSON.stringify(request).length,
            userAgent: navigator.userAgent
        });
    }

    logResponse(response) {
        this.addLog('response', {
            timestamp: new Date().toISOString(),
            size: JSON.stringify(response).length,
            type: typeof response
        });
    }

    logError(error, context = {}) {
        this.addLog('error', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack,
            context: context
        });
    }

    addLog(type, data) {
        this.logs.push({ type, ...data });
        
        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
    }

    getLogs(type = null, limit = 100) {
        let filteredLogs = type ? this.logs.filter(log => log.type === type) : this.logs;
        return filteredLogs.slice(-limit);
    }

    exportLogs() {
        return {
            timestamp: new Date().toISOString(),
            logs: this.logs,
            summary: this.getLogSummary()
        };
    }

    getLogSummary() {
        const summary = {};
        for (const log of this.logs) {
            summary[log.type] = (summary[log.type] || 0) + 1;
        }
        return summary;
    }
}

class AIPerformanceOptimizer {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.requestQueue = [];
        this.isProcessing = false;
        
        console.log('⚡ AI Performance Optimizer initialized');
    }

    async optimizeRequest(request, handler) {
        // Check cache first
        const cacheKey = this.generateCacheKey(request);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            console.log('📦 Cache hit for request');
            return cached;
        }

        // Add to queue for batch processing
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                request,
                handler,
                cacheKey,
                resolve,
                reject,
                timestamp: Date.now()
            });

            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        try {
            // Process requests in batches
            const batchSize = 3;
            const batch = this.requestQueue.splice(0, batchSize);

            const promises = batch.map(async (item) => {
                try {
                    const startTime = performance.now();
                    const result = await item.handler(item.request);
                    const endTime = performance.now();

                    // Cache the result
                    this.addToCache(item.cacheKey, result);

                    // Track performance
                    if (window.trackAIPerformance) {
                        window.trackAIPerformance('ai_request', startTime, endTime, {
                            cached: false,
                            requestType: item.request.type
                        });
                    }

                    item.resolve(result);
                } catch (error) {
                    item.reject(error);
                }
            });

            await Promise.all(promises);

        } finally {
            this.isProcessing = false;
            
            // Process remaining queue
            if (this.requestQueue.length > 0) {
                setTimeout(() => this.processQueue(), 100);
            }
        }
    }

    generateCacheKey(request) {
        // Generate a cache key based on request content
        const keyData = {
            type: request.type,
            content: request.content || request.message,
            provider: request.provider
        };
        
        return btoa(JSON.stringify(keyData)).substring(0, 32);
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        
        if (cached) {
            this.cache.delete(key); // Remove expired cache
        }
        
        return null;
    }

    addToCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });

        // Limit cache size
        if (this.cache.size > 100) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    clearCache() {
        this.cache.clear();
        console.log('🗑️ AI cache cleared');
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: 100,
            timeout: this.cacheTimeout
        };
    }
}

// Export classes
if (typeof window !== 'undefined') {
    window.AISecurityManager = AISecurityManager;
    window.AIPerformanceOptimizer = AIPerformanceOptimizer;
    window.RateLimiter = RateLimiter;
    window.InputValidator = InputValidator;
    window.OutputSanitizer = OutputSanitizer;
    window.AuditLogger = AuditLogger;
}

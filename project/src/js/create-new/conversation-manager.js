/**
 * Enhanced Conversation Manager
 * Provides streamlined responses with intelligent progress updates
 */

class ConversationManager {
    constructor(aiProvider, meenoeIntegration, agenticEngine) {
        this.aiProvider = aiProvider;
        this.meenoeIntegration = meenoeIntegration;
        this.agenticEngine = agenticEngine;

        this.conversationHistory = [];
        this.intentClassifier = new IntentClassifier();
        this.commandProcessor = new CommandProcessor(meenoeIntegration);
        this.contextManager = new ConversationContextManager();
        this.responseOptimizer = new ResponseOptimizer();

        // Initialize the unified function calling system
        this.functionCaller = new UnifiedFunctionCaller(aiProvider, meenoeIntegration);

        this.systemPrompt = this.buildSystemPrompt();

        console.log('💬 Enhanced Conversation Manager initialized');
    }

    buildSystemPrompt() {
        return `You are an elite AI assistant for Meenoe, a sophisticated meeting management platform. You excel at providing concise, actionable responses with intelligent progress updates.

CORE PRINCIPLES:
- Provide immediate value with every response
- Use progress updates to guide user understanding
- Be proactive yet concise
- Focus on actionable outcomes

RESPONSE METHODOLOGY:
1. **Immediate Recognition**: Acknowledge what the user wants instantly
2. **Smart Progress**: Show meaningful progress steps, not busy work
3. **Streamlined Results**: Deliver outcomes concisely with next steps
4. **Context Awareness**: Leverage current state for relevant suggestions

PROGRESS UPDATE STRATEGY:
- Start with clear intent recognition
- Show key execution steps (max 3-4 updates)
- Highlight important discoveries or insights
- End with concrete results and recommendations

COMMUNICATION STYLE:
- Direct and professional
- Use active voice
- Highlight key information
- Provide specific next steps
- Avoid redundant explanations

QUALITY METRICS:
- Speed to value delivery
- Clarity of progress indication
- Relevance of suggestions
- Actionability of outcomes`;
    }

    async processMessage(userMessage, context = {}) {
        try {
            console.log('💬 Processing:', userMessage);
            
            this.addToHistory('user', userMessage);

            const enhancedContext = {
                ...context,
                conversationHistory: this.getRecentHistory(5), // Reduced for efficiency
                currentMeenoeState: this.meenoeIntegration.getCurrentMeenoeState(),
                agentContext: this.agenticEngine?.getContextSummary()
            };

            // Classify intent early for better routing
            const intent = await this.intentClassifier.classifyIntent(userMessage, enhancedContext);
            
            // Route to optimized processor based on intent
            const result = await this.routeToOptimizedProcessor(userMessage, intent, enhancedContext);

            // Only add non-streaming responses to history
            if (result.type !== 'agentic_stream') {
                this.addToHistory('assistant', result.message);
            }

            return result;

        } catch (error) {
            console.error('Processing error:', error);
            return this.createErrorResponse(error.message);
        }
    }

    async routeToOptimizedProcessor(userMessage, intent, context) {
        // Handle commands directly for speed
        if (this.commandProcessor.isCommand(userMessage)) {
            return await this.commandProcessor.processCommand(userMessage);
        }

        // Route based on intent complexity
        if (intent.requiresFunctionCall && intent.confidence > 0.7) {
            return await this.processActionIntent(userMessage, intent, context);
        } else {
            return await this.processConversationalIntent(userMessage, intent, context);
        }
    }

    async processActionIntent(userMessage, intent, context) {
        const progressTracker = new ProgressTracker();
        
        try {
            // Immediate acknowledgment
            progressTracker.update("🎯 Understanding your request...");
            
            const functionCall = await this.aiProvider.getFunctionCall(
                userMessage,
                this.meenoeIntegration.getFunctionDefinitions(),
                context
            );

            if (!functionCall) {
                return await this.processConversationalIntent(userMessage, intent, context);
            }

            progressTracker.update(`⚡ Executing: ${this.getFriendlyFunctionName(functionCall.name)}`);

            const functionResult = await this.meenoeIntegration.executeFunction(
                functionCall.name,
                JSON.parse(functionCall.arguments)
            );

            progressTracker.update("✨ Generating response...");

            const response = await this.generateOptimizedActionResponse(
                userMessage, 
                functionCall, 
                functionResult, 
                context
            );

            const finalResult = {
                message: response.message,
                type: 'optimized_action',
                functionCall: functionCall,
                functionResult: functionResult,
                intent: intent,
                progressUpdates: progressTracker.getUpdates(),
                suggestions: response.suggestions
            };

            this.addToHistory('assistant', response.message);
            return finalResult;

        } catch (error) {
            console.error('Action processing error:', error);
            return this.createErrorResponse(error.message, intent);
        }
    }

    async processConversationalIntent(userMessage, intent, context) {
        const optimizedContext = this.responseOptimizer.optimizeContext(context, intent);
        
        const response = await this.aiProvider.generateResponse(
            userMessage,
            optimizedContext,
            {
                temperature: 0.7,
                maxTokens: 400 // Increased slightly for better responses
            }
        );

        // Add contextual suggestions
        const suggestions = this.generateContextualSuggestions(intent, context);

        return {
            message: response,
            type: 'conversational',
            intent: intent,
            suggestions: suggestions
        };
    }

    async streamResponse(userMessage, context = {}, onChunk) {
        try {
            console.log('🌊 Starting optimized stream for:', userMessage);
            
            this.addToHistory('user', userMessage);
            
            const enhancedContext = {
                ...context,
                conversationHistory: this.getRecentHistory(5),
                currentMeenoeState: this.meenoeIntegration.getCurrentMeenoeState(),
                agentContext: this.agenticEngine?.getContextSummary()
            };

            let accumulatedResponse = '';
            const progressTracker = new ProgressTracker();

            // Streamlined progress callback
            const streamlinedProgressCallback = (message) => {
                const optimizedMessage = this.responseOptimizer.optimizeProgressMessage(message);
                onChunk(optimizedMessage + '\n\n');
                accumulatedResponse += optimizedMessage + '\n\n';
                progressTracker.add(optimizedMessage);
            };

            // Initial progress
            streamlinedProgressCallback("🎯 Analyzing your request...");

            // Classify intent
            const intent = await this.intentClassifier.classifyIntent(userMessage, enhancedContext);
            streamlinedProgressCallback(`⚡ ${this.getIntentDescription(intent)}`);

            // Process with unified function caller
            const result = await this.functionCaller.processRequest(
                userMessage,
                enhancedContext,
                streamlinedProgressCallback
            );

            // Final summary (only if actions were taken)
            if (result.summary && result.functionResults?.length > 0) {
                const optimizedSummary = this.responseOptimizer.createConciseSummary(result);
                streamlinedProgressCallback(`✅ ${optimizedSummary}`);
            }

            this.addToHistory('assistant', accumulatedResponse);

            return {
                ...result,
                message: accumulatedResponse,
                type: 'agentic_stream',
                progressUpdates: progressTracker.getUpdates()
            };

        } catch (error) {
            console.error('Stream error:', error);
            const errorMessage = 'Unable to process request. Please try rephrasing.';
            onChunk(errorMessage);
            this.addToHistory('assistant', errorMessage);
            
            return {
                message: errorMessage,
                type: 'stream_error',
                error: error.message
            };
        }
    }

    async generateOptimizedActionResponse(userMessage, functionCall, functionResult, context) {
        const prompt = `User request: "${userMessage}"
Action taken: ${functionCall.name}
Result: ${JSON.stringify(functionResult)}

Generate a concise response that:
1. Confirms what was accomplished
2. Highlights key outcomes
3. Suggests 1-2 relevant next steps
4. Stays under 150 words

Focus on value and actionability.`;

        const message = await this.aiProvider.generateResponse(prompt, context, {
            temperature: 0.6,
            maxTokens: 200
        });

        const suggestions = this.generatePostActionSuggestions(functionCall, functionResult, context);

        return { message, suggestions };
    }

    generateContextualSuggestions(intent, context) {
        const state = context.currentMeenoeState;
        const suggestions = [];

        if (intent.intent === 'greeting' || intent.intent === 'help') {
            if (state?.counters.agendaPoints === 0) {
                suggestions.push("Create your first agenda item");
            }
            if (state?.counters.actions === 0) {
                suggestions.push("Add action items for better tracking");
            }
            suggestions.push("Analyze current meeting structure");
        }

        return suggestions.slice(0, 3); // Limit to 3 suggestions
    }

    generatePostActionSuggestions(functionCall, functionResult, context) {
        const suggestions = [];
        const state = context.currentMeenoeState;

        switch (functionCall.name) {
            case 'createAgendaPoint':
                suggestions.push("Add time estimates to agenda items");
                suggestions.push("Assign presenters to agenda items");
                break;
            case 'createAction':
                suggestions.push("Set due dates for action items");
                suggestions.push("Assign responsible parties");
                break;
            default:
                if (state?.counters.agendaPoints > 0 && state?.counters.actions === 0) {
                    suggestions.push("Create action items for follow-up");
                }
        }

        return suggestions.slice(0, 2);
    }

    getFriendlyFunctionName(functionName) {
        const friendlyNames = {
            'createAgendaPoint': 'Creating agenda item',
            'createAction': 'Adding action item',
            'updateItem': 'Updating item',
            'deleteItem': 'Removing item',
            'analyzeMeeting': 'Analyzing meeting'
        };
        return friendlyNames[functionName] || functionName;
    }

    getIntentDescription(intent) {
        const descriptions = {
            'create_agenda': 'Creating agenda item',
            'create_action': 'Adding action item',
            'update_item': 'Updating content',
            'analyze_meeting': 'Analyzing meeting structure',
            'help': 'Providing assistance',
            'greeting': 'Ready to help'
        };
        return descriptions[intent.intent] || 'Processing request';
    }

    createErrorResponse(errorMessage, intent = null) {
        return {
            message: "I encountered an issue processing your request. Could you please rephrase or try a different approach?",
            type: 'error',
            error: errorMessage,
            intent: intent,
            suggestions: ["Try using simpler language", "Check if all required information is provided"]
        };
    }

    addToHistory(role, content) {
        this.conversationHistory.push({
            role: role,
            content: content,
            timestamp: new Date().toISOString()
        });

        // Keep only recent history for performance
        if (this.conversationHistory.length > 15) {
            this.conversationHistory = this.conversationHistory.slice(-15);
        }
    }

    getRecentHistory(count = 8) {
        return this.conversationHistory.slice(-count);
    }

    clearHistory() {
        this.conversationHistory = [];
    }
}

/**
 * Progress Tracker
 * Manages progress updates efficiently
 */
class ProgressTracker {
    constructor() {
        this.updates = [];
        this.startTime = Date.now();
    }

    update(message) {
        this.add(message);
    }

    add(message) {
        this.updates.push({
            message: message,
            timestamp: Date.now() - this.startTime
        });
    }

    getUpdates() {
        return this.updates;
    }

    getLastUpdate() {
        return this.updates[this.updates.length - 1]?.message;
    }
}

/**
 * Response Optimizer
 * Optimizes responses and progress messages
 */
class ResponseOptimizer {
    optimizeContext(context, intent) {
        // Return only essential context for conversational responses
        return {
            systemPrompt: context.systemPrompt,
            currentMeenoeState: this.summarizeState(context.currentMeenoeState),
            recentHistory: context.conversationHistory?.slice(-3), // Only last 3 for efficiency
            intent: intent
        };
    }

    optimizeProgressMessage(message) {
        // Remove redundant phrases and optimize for clarity
        return message
            .replace(/^(Processing|Executing|Running)\s+/i, '')
            .replace(/\.\.\.$/, '')
            .trim();
    }

    createConciseSummary(result) {
        if (!result.functionResults?.length) return null;

        const actionCount = result.functionResults.length;
        const actionType = this.getActionType(result.functionResults[0]);
        
        return `Completed ${actionCount} ${actionType}${actionCount > 1 ? 's' : ''}`;
    }

    summarizeState(state) {
        if (!state) return null;
        
        return {
            name: state.name,
            counters: state.counters,
            hasContent: state.counters.agendaPoints > 0 || state.counters.actions > 0
        };
    }

    getActionType(functionResult) {
        // Infer action type from function result structure
        if (functionResult.agendaPoint) return 'agenda item';
        if (functionResult.action) return 'action item';
        if (functionResult.analysis) return 'analysis';
        return 'action';
    }
}

/**
 * Enhanced Intent Classifier
 * Faster, more accurate intent classification
 */
class IntentClassifier {
    constructor() {
        this.intentPatterns = this.initializeOptimizedPatterns();
        this.cache = new Map();
    }

    initializeOptimizedPatterns() {
        return {
            create_agenda: {
                patterns: [
                    /(?:create|add|new).*agenda/i,
                    /agenda.*(?:item|point)/i
                ],
                keywords: ['agenda', 'create', 'add', 'new'],
                requiresFunctionCall: true,
                confidence: 0.85
            },
            
            create_action: {
                patterns: [
                    /(?:create|add|new).*(?:action|task|todo)/i,
                    /(?:action|task).*item/i
                ],
                keywords: ['action', 'task', 'todo', 'create', 'add'],
                requiresFunctionCall: true,
                confidence: 0.85
            },
            
            analyze_meeting: {
                patterns: [
                    /analyz|review|status|summary|how.*doing/i
                ],
                keywords: ['analyze', 'review', 'status', 'summary'],
                requiresFunctionCall: true,
                confidence: 0.75
            },
            
            help: {
                patterns: [
                    /help|what.*can.*do|how.*work/i
                ],
                keywords: ['help', 'can', 'do', 'work'],
                requiresFunctionCall: false,
                confidence: 0.9
            }
        };
    }

    async classifyIntent(message, context = {}) {
        // Check cache first
        const cacheKey = message.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const normalizedMessage = message.toLowerCase();
        let bestMatch = { intent: 'general', confidence: 0.3, requiresFunctionCall: false };

        // Quick keyword matching first
        for (const [intentName, intentData] of Object.entries(this.intentPatterns)) {
            const keywordScore = this.calculateKeywordScore(normalizedMessage, intentData.keywords);
            
            if (keywordScore > 0.5) {
                // Then check patterns for confirmation
                const patternMatch = intentData.patterns.some(pattern => pattern.test(normalizedMessage));
                
                if (patternMatch) {
                    const confidence = Math.min(0.95, intentData.confidence + keywordScore * 0.1);
                    if (confidence > bestMatch.confidence) {
                        bestMatch = {
                            intent: intentName,
                            confidence: confidence,
                            requiresFunctionCall: intentData.requiresFunctionCall
                        };
                    }
                }
            }
        }

        // Context adjustments
        bestMatch = this.adjustWithContext(bestMatch, message, context);

        // Cache result
        this.cache.set(cacheKey, bestMatch);
        
        return bestMatch;
    }

    calculateKeywordScore(message, keywords) {
        const messageWords = message.split(/\s+/);
        const matchCount = keywords.filter(keyword => 
            messageWords.some(word => word.includes(keyword))
        ).length;
        
        return matchCount / keywords.length;
    }

    adjustWithContext(intent, message, context) {
        // Quick context boosts
        if (context.currentMeenoeState) {
            const state = context.currentMeenoeState;
            
            if (state.counters.agendaPoints === 0 && intent.intent === 'create_agenda') {
                intent.confidence = Math.min(0.95, intent.confidence + 0.1);
            }
        }

        return intent;
    }
}

/**
 * Enhanced Command Processor
 * Streamlined command handling
 */
class CommandProcessor {
    constructor(meenoeIntegration) {
        this.meenoeIntegration = meenoeIntegration;
        this.commands = {
            '/agenda': this.handleCreateAgenda.bind(this),
            '/action': this.handleCreateAction.bind(this),
            '/status': this.handleShowStatus.bind(this),
            '/analyze': this.handleAnalyzeMeeting.bind(this),
            '/help': this.handleShowHelp.bind(this)
        };
    }

    isCommand(message) {
        return message.trim().startsWith('/');
    }

    async processCommand(message) {
        const [command, ...args] = message.trim().split(' ');
        const handler = this.commands[command.toLowerCase()];
        
        if (handler) {
            return await handler(args.join(' '));
        }
        
        return {
            message: `Unknown command: ${command}. Use /help for available commands.`,
            type: 'command_error'
        };
    }

    async handleCreateAgenda(args) {
        if (!args.trim()) {
            return { message: 'Usage: /agenda <title>', type: 'command_help' };
        }

        try {
            const result = await this.meenoeIntegration.createAgendaPoint(args.trim());
            return {
                message: `✅ Created agenda: "${args.trim()}"`,
                type: 'command_success',
                result: result
            };
        } catch (error) {
            return { message: `❌ Error: ${error.message}`, type: 'command_error' };
        }
    }

    async handleCreateAction(args) {
        if (!args.trim()) {
            return { message: 'Usage: /action <title>', type: 'command_help' };
        }

        try {
            const result = await this.meenoeIntegration.createAction(args.trim());
            return {
                message: `✅ Created action: "${args.trim()}"`,
                type: 'command_success',
                result: result
            };
        } catch (error) {
            return { message: `❌ Error: ${error.message}`, type: 'command_error' };
        }
    }

    async handleShowStatus() {
        try {
            const state = this.meenoeIntegration.getCurrentMeenoeState();
            return {
                message: `📊 **${state.name}**\n` +
                        `👥 ${state.counters.users} participants\n` +
                        `📋 ${state.counters.agendaPoints} agenda items\n` +
                        `✅ ${state.counters.actions} actions\n` +
                        `📎 ${state.counters.files} files`,
                type: 'command_success'
            };
        } catch (error) {
            return { message: `❌ Error: ${error.message}`, type: 'command_error' };
        }
    }

    async handleAnalyzeMeeting() {
        try {
            const analysis = this.meenoeIntegration.analyzeMeetingStructure();
            return {
                message: `📈 **Analysis Results**\n` +
                        `Completeness: ${analysis.overall.completeness}%\n` +
                        `Balance: ${analysis.overall.balance}%\n` +
                        `Recommendations: ${analysis.recommendations.length}`,
                type: 'command_success',
                result: analysis
            };
        } catch (error) {
            return { message: `❌ Error: ${error.message}`, type: 'command_error' };
        }
    }

    handleShowHelp() {
        return {
            message: `**Available Commands:**\n` +
                    `/agenda <title> - Create agenda item\n` +
                    `/action <title> - Create action item\n` +
                    `/status - Show meeting status\n` +
                    `/analyze - Analyze meeting\n` +
                    `/help - Show this help`,
            type: 'command_help'
        };
    }
}

/**
 * Conversation Context Manager
 * Lightweight context management
 */
class ConversationContextManager {
    constructor() {
        this.context = {};
        this.references = new Map();
    }

    updateContext(newContext) {
        this.context = { ...this.context, ...newContext };
    }

    getContext() {
        return this.context;
    }

    addReference(key, value) {
        this.references.set(key.toLowerCase(), value);
    }

    resolveReference(key) {
        return this.references.get(key.toLowerCase());
    }
}

// Export classes
if (typeof window !== 'undefined') {
    window.ConversationManager = ConversationManager;
    window.IntentClassifier = IntentClassifier;
    window.CommandProcessor = CommandProcessor;
    window.ConversationContextManager = ConversationContextManager;
    window.ProgressTracker = ProgressTracker;
    window.ResponseOptimizer = ResponseOptimizer;
}
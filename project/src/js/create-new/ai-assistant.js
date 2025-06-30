/**
 * Comprehensive Agentic AI Assistant System for Meenoe
 * Production-ready intelligent meeting management assistant
 *
 * Features:
 * - Multi-LLM provider support (OpenAI, Claude, Gemini, Ollama)
 * - Deep Meenoe system integration
 * - Context-aware agentic workflows
 * - Natural language interface
 * - Proactive assistance
 */
(function() {
    'use strict';

    // Core system state
    let isAssistantVisible = false;
    let aiButton = null;
    let isInitialized = false;

    // AI System components
    let aiProviderManager = null;
    let meenoeIntegration = null;
    let agenticEngine = null;
    let conversationManager = null;
    let securityManager = null;
    let performanceOptimizer = null;

    // Configuration
    let aiConfig = {
        provider: 'openai-compatible', // Default provider
        apiKey: null,
        model: null,
        enableProactiveAssistance: true,
        enableStreaming: true
    };
    
    // Initialize the AI Assistant functionality
    function initializeAIAssistant() {
        if (isInitialized) return;

        console.log('🤖 Initializing Comprehensive AI Assistant...');

        // Initialize AI system components
        initializeAIComponents();

        // Set up event delegation first (works immediately)
        setupEventDelegation();

        // Try to find the button immediately
        aiButton = document.getElementById('aiAssistantButton');

        if (aiButton) {
            console.log('✅ AI Assistant button found immediately');
            setupButtonFeatures(aiButton);
            isInitialized = true;
        } else {
            console.log('⏳ AI Assistant button not found, setting up observer...');
            // Set up MutationObserver as fallback
            setupMutationObserver();
        }
    }

    // Expose initialization function globally for the loader
    window.initializeAIAssistant = initializeAIAssistant;

    // Initialize AI system components
    function initializeAIComponents() {
        try {
            // Initialize Security Manager
            if (window.AISecurityManager) {
                securityManager = new window.AISecurityManager();
                console.log('✅ AI Security Manager initialized');
            }

            // Initialize Performance Optimizer
            if (window.AIPerformanceOptimizer) {
                performanceOptimizer = new window.AIPerformanceOptimizer();
                console.log('✅ AI Performance Optimizer initialized');
            }

            // Initialize AI Provider Manager
            if (window.AIProviderManager) {
                aiProviderManager = new window.AIProviderManager();
                console.log('✅ AI Provider Manager initialized');
            }

            // Initialize Meenoe Integration
            if (window.MeenoeAIIntegration) {
                meenoeIntegration = new window.MeenoeAIIntegration();
                console.log('✅ Meenoe AI Integration initialized');
            }

            // Initialize Agentic Engine
            if (window.AgenticEngine && aiProviderManager && meenoeIntegration) {
                try {
                    agenticEngine = new window.AgenticEngine(aiProviderManager, meenoeIntegration);
                    console.log('✅ Agentic Engine initialized');
                } catch (agenticError) {
                    console.warn('⚠️ Agentic Engine failed to initialize:', agenticError.message);
                    agenticEngine = null;
                }
            }

            // Initialize Conversation Manager
            if (window.ConversationManager && aiProviderManager && meenoeIntegration && agenticEngine) {
                conversationManager = new window.ConversationManager(aiProviderManager, meenoeIntegration, agenticEngine);
                console.log('✅ Conversation Manager initialized');
            }

            // Set up configuration from localStorage or defaults
            loadAIConfiguration();

            // Start agentic engine if enabled (with delay to ensure Meenoe systems are ready)
            if (agenticEngine && aiConfig.enableProactiveAssistance) {
                setTimeout(() => {
                    try {
                        agenticEngine.start();
                        console.log('✅ Agentic Engine started');
                    } catch (startError) {
                        console.warn('⚠️ Agentic Engine failed to start:', startError.message);
                    }
                }, 2000); // 2 second delay
            }

        } catch (error) {
            console.error('Error initializing AI components:', error);
        }
    }

    // Load AI configuration
    function loadAIConfiguration() {
        try {
            // First try to load from localStorage (user preferences)
            const savedConfig = localStorage.getItem('meenoe_ai_config');
            if (savedConfig) {
                aiConfig = { ...aiConfig, ...JSON.parse(savedConfig) };
                console.log('🔧 Loaded user AI configuration from localStorage');
            } else {
                // If no user config, fetch default from server
                fetchDefaultConfig();
            }

            // Apply configuration using the same logic as the chat integration
            if (aiConfig.provider && aiProviderManager) {
                applyAIConfigurationFromAssistant(aiConfig);
            }

            console.log('🔧 AI Configuration loaded:', {
                provider: aiConfig.provider,
                hasApiKey: !!aiConfig.apiKey,
                proactiveAssistance: aiConfig.enableProactiveAssistance
            });
        } catch (error) {
            console.error('Error loading AI configuration:', error);
            // If error, try to fetch default config
            fetchDefaultConfig();
        }
    }

    // Fetch default configuration from server
    async function fetchDefaultConfig() {
        try {
            const response = await fetch('/api/ai/default-config');
            if (response.ok) {
                const defaultConfig = await response.json();
                console.log('🔧 Loaded default AI configuration from server:', defaultConfig);
                
                // Update config with server defaults
                aiConfig = { 
                    ...aiConfig, 
                    provider: defaultConfig.provider || aiConfig.provider,
                    model: defaultConfig.model || aiConfig.model,
                    baseUrl: defaultConfig.baseUrl || aiConfig.baseUrl
                };
                
                // Apply the configuration
                if (aiProviderManager) {
                    applyAIConfigurationFromAssistant(aiConfig);
                }
            } else {
                console.warn('⚠️ Failed to load default AI configuration from server');
            }
        } catch (error) {
            console.error('❌ Error fetching default AI configuration:', error);
        }
    }

    // Apply AI configuration (same logic as chat integration)
    function applyAIConfigurationFromAssistant(config) {
        try {
            console.log('🔧 Applying AI configuration from assistant:', config);

            // Handle OpenAI-compatible providers specially
            if (config.provider === 'openai-compatible') {
                // Use OpenAI provider but configure it with custom base URL
                aiProviderManager.setProvider('openai');

                if (aiProviderManager.currentProvider) {
                    const providerConfig = {
                        apiKey: config.apiKey,
                        baseURL: config.baseUrl,
                        model: config.model
                    };

                    aiProviderManager.currentProvider.configure(providerConfig);
                    console.log('🔧 Configured OpenAI-compatible provider from assistant:', {
                        baseURL: config.baseUrl,
                        model: config.model,
                        hasApiKey: !!config.apiKey
                    });
                }
            } else {
                // Switch to the specified provider
                if (config.provider && aiProviderManager.setProvider) {
                    aiProviderManager.setProvider(config.provider);
                }

                // Configure provider with API key and settings
                if (aiProviderManager.currentProvider) {
                    const providerConfig = {
                        apiKey: config.apiKey,
                        baseURL: config.baseUrl,
                        model: config.model
                    };

                    aiProviderManager.currentProvider.configure(providerConfig);
                }
            }

            console.log('✅ AI configuration applied from assistant successfully');

        } catch (error) {
            console.error('Error applying AI configuration from assistant:', error);
        }
    }
    
    // Set up event delegation on document body
    function setupEventDelegation() {
        console.log('🎯 Setting up event delegation...');
        
        document.body.addEventListener('click', function(e) {
            const clickedButton = e.target.closest('#aiAssistantButton');
            if (clickedButton) {
                e.preventDefault();
                console.log('🖱️ AI Assistant button clicked via delegation');
                
                // Ensure button reference is current
                aiButton = clickedButton;
                
                // Remove pulse on first interaction
                removePulse();
                
                // Toggle assistant panel
                toggleAssistantPanel();
            }
        });
        
        // Handle mouseenter for pulse removal
        document.body.addEventListener('mouseenter', function(e) {
            const hoveredButton = e.target.closest('#aiAssistantButton');
            if (hoveredButton) {
                console.log('🖱️ AI Assistant button hovered via delegation');
                aiButton = hoveredButton;
                removePulse();
            }
        }, true); // Use capture phase for better detection
        
        // Handle Enter key press when button is focused
        document.body.addEventListener('keydown', function(e) {
            const focusedButton = e.target.closest('#aiAssistantButton');
            if (focusedButton && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                aiButton = focusedButton;
                removePulse();
                toggleAssistantPanel();
            }
        });
    }
    
    // Set up MutationObserver to watch for button creation
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is the button or contains the button
                        const foundButton = node.id === 'aiAssistantButton' ? node : node.querySelector && node.querySelector('#aiAssistantButton');
                        
                        if (foundButton) {
                            console.log('✅ AI Assistant button detected via MutationObserver');
                            aiButton = foundButton;
                            setupButtonFeatures(aiButton);
                            observer.disconnect();
                            isInitialized = true;
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 MutationObserver active, watching for button...');
    }
    
    // Set up button-specific features like pulse animation
    function setupButtonFeatures(button) {
        if (!button) return;
        
        console.log('⚡ Setting up button features...');
        
        // Add pulse animation
        button.classList.add('pulse');
        
        // Add accessibility attributes if missing
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', 'AI Assistant');
        }
        
        if (!button.getAttribute('role')) {
            button.setAttribute('role', 'button');
        }
        
        // Make focusable if not already
        if (!button.getAttribute('tabindex')) {
            button.setAttribute('tabindex', '0');
        }
    }
    
    // Remove pulse animation
    function removePulse() {
        if (aiButton && aiButton.classList.contains('pulse')) {
            console.log('✨ Removing pulse animation');
            aiButton.classList.remove('pulse');
        }
    }
    
    // Toggle AI Assistant Panel
    function toggleAssistantPanel() {
        isAssistantVisible = !isAssistantVisible;
        console.log(`${isAssistantVisible ? '🔓' : '🔒'} Toggling assistant panel: ${isAssistantVisible ? 'SHOW' : 'HIDE'}`);
        
        if (isAssistantVisible) {
            showAssistantPanel();
        } else {
            hideAssistantPanel();
        }
    }
    
    function showAssistantPanel() {
        console.log('👁️ Opening AI Assistant off-canvas...');

        // Use Bootstrap's off-canvas API
        const offcanvas = document.getElementById('aiChatOffcanvas');
        if (offcanvas) {
            const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
            bsOffcanvas.show();
            isAssistantVisible = true;
        }
    }
    
    function hideAssistantPanel() {
        console.log('👁️ Closing AI Assistant off-canvas...');

        const offcanvas = document.getElementById('aiChatOffcanvas');
        if (offcanvas) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
            isAssistantVisible = false;
        }
    }
    
    // Panel creation removed - using off-canvas instead
    
    // Event listeners now handled by ai-chat-integration.js
    
    // Message handling now done by ai-chat-integration.js
    
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.ai-typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Process user message with AI system
    async function processUserMessage(message) {
        const startTime = performance.now();

        try {
            if (!conversationManager) {
                throw new Error('AI system not properly initialized');
            }

            // Security validation
            if (securityManager) {
                const request = {
                    type: 'user_message',
                    content: message,
                    userId: 'current_user',
                    timestamp: new Date().toISOString()
                };

                try {
                    await securityManager.validateRequest(request);
                } catch (securityError) {
                    hideTypingIndicator();
                    if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                        window.AIChatIntegration.addMessage('assistant', `Security validation failed: ${securityError.message}`);
                    }
                    return;
                }
            }

            // Check if it's a command
            if (conversationManager.commandProcessor.isCommand(message)) {
                const response = await conversationManager.commandProcessor.processCommand(message);
                hideTypingIndicator();
                if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                    window.AIChatIntegration.addMessage('assistant', response.message);
                }

                // Track performance
                const endTime = performance.now();
                if (window.trackAIPerformance) {
                    window.trackAIPerformance('command_processing', startTime, endTime, {
                        command: message.split(' ')[0]
                    });
                }
                return;
            }

            // Get current context
            const context = agenticEngine ? agenticEngine.getContextSummary() : {};

            // Use performance optimizer if available
            if (performanceOptimizer) {
                const optimizedHandler = async (msg) => {
                    if (aiConfig.enableStreaming && aiProviderManager.currentProvider.supportsStreaming()) {
                        return await processStreamingMessage(msg, context);
                    } else {
                        return await processRegularMessage(msg, context);
                    }
                };

                await performanceOptimizer.optimizeRequest(
                    { type: 'conversation', message: message, context: context },
                    optimizedHandler
                );
            } else {
                // Process with streaming if enabled
                if (aiConfig.enableStreaming && aiProviderManager.currentProvider.supportsStreaming()) {
                    await processStreamingMessage(message, context);
                } else {
                    await processRegularMessage(message, context);
                }
            }

            // Track overall performance
            const endTime = performance.now();
            if (window.trackAIPerformance) {
                window.trackAIPerformance('message_processing', startTime, endTime, {
                    messageLength: message.length,
                    streaming: aiConfig.enableStreaming
                });
            }

        } catch (error) {
            console.error('Error in processUserMessage:', error);
            hideTypingIndicator();

            // Log security errors
            if (securityManager && securityManager.auditLogger) {
                securityManager.auditLogger.logError(error, { message: message });
            }

            if (error.message.includes('Rate limit')) {
                if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                    window.AIChatIntegration.addMessage('assistant', 'You\'re sending messages too quickly. Please wait a moment before trying again.');
                }
            } else if (error.message.includes('API key') || error.message.includes('not configured')) {
                if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                    window.AIChatIntegration.addMessage('assistant', 'It looks like the AI system needs to be configured. Please set up your API key in the settings.');
                }
                showConfigurationPrompt();
            } else {
                if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                    window.AIChatIntegration.addMessage('assistant', 'I encountered an error processing your message. Please try again.');
                }
            }
        }
    }

    async function processStreamingMessage(message, context) {
        hideTypingIndicator();

        // Add bot message container for streaming
        let messageContainer = null;
        let contentElement = null;

        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            messageContainer = window.AIChatIntegration.addMessage('assistant', '', true); // true for streaming
            contentElement = messageContainer?.querySelector('.ai-message-content p');
        }

        let fullResponse = '';

        try {
            await conversationManager.streamResponse(
                message,
                context,
                (chunk) => {
                    fullResponse += chunk;
                    contentElement.textContent = fullResponse;

                    // Scroll to bottom
                    const messagesContainer = document.querySelector('.ai-messages');
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }
            );
        } catch (error) {
            console.error('Streaming error:', error);
            contentElement.textContent = 'I encountered an error while responding. Please try again.';
        }
    }

    async function processRegularMessage(message, context) {
        try {
            const response = await conversationManager.processMessage(message, context);

            hideTypingIndicator();

            // Add response message
            if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                window.AIChatIntegration.addMessage('assistant', response.message);
            }

            // Handle special response types
            if (response.type === 'function_call' && response.functionResult) {
                handleFunctionCallResult(response.functionResult);
            }

        } catch (error) {
            console.error('Regular message processing error:', error);
            hideTypingIndicator();
            if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
                window.AIChatIntegration.addMessage('assistant', 'I encountered an error processing your request. Please try again.');
            }
        }
    }

    function handleFunctionCallResult(result) {
        // Handle specific function call results
        if (result.success) {
            // Trigger UI updates if needed
            if (window.meenoeState) {
                window.meenoeState.refreshAllCounters();
            }

            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('aiActionCompleted', {
                detail: result
            }));
        }
    }

    function showConfigurationPrompt() {
        // Show a configuration modal or prompt
        const configMessage = `
            <div class="ai-config-prompt">
                <p>To use the AI assistant, please configure your API settings:</p>
                <button class="btn btn-primary btn-sm" onclick="window.AIAssistant.showConfig()">
                    Configure AI Settings
                </button>
            </div>
        `;

        const messagesContainer = document.querySelector('.ai-messages');
        if (messagesContainer) {
            const configDiv = document.createElement('div');
            configDiv.className = 'ai-message ai-message-system';
            configDiv.innerHTML = `
                <div class="ai-avatar">⚙️</div>
                <div class="ai-message-content">${configMessage}</div>
            `;
            messagesContainer.appendChild(configDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    // Utility function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Initialize when DOM is ready or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAIAssistant);
    } else {
        // DOM is already ready
        initializeAIAssistant();
    }
    
    // Configuration functions
    function showConfigurationModal() {
        // Create configuration modal
        const modal = document.createElement('div');
        modal.className = 'ai-config-modal';
        modal.innerHTML = `
            <div class="ai-config-modal-content">
                <div class="ai-config-header">
                    <h5>AI Assistant Configuration</h5>
                    <button class="btn-close" onclick="this.closest('.ai-config-modal').remove()"></button>
                </div>
                <div class="ai-config-body">
                    <div class="mb-3">
                        <label class="form-label">AI Provider</label>
                        <select class="form-control" id="ai-provider-select">
                            <option value="openai">OpenAI (GPT-4)</option>
                            <option value="claude">Claude (Anthropic)</option>
                            <option value="gemini">Gemini (Google)</option>
                            <option value="ollama">Ollama (Local)</option>
                            <option value="openai-compatible" selected>OpenAI Compatible</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">API Key</label>
                        <input type="password" class="form-control" id="ai-api-key" placeholder="Enter your API key">
                        <small class="form-text text-muted">Your API key is stored locally and never shared.</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Base URL (Optional)</label>
                        <input type="text" class="form-control" id="ai-base-url" placeholder="Leave blank for default">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Model (Optional)</label>
                        <input type="text" class="form-control" id="ai-model" placeholder="Leave blank for default">
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="enable-proactive" checked>
                            <label class="form-check-label" for="enable-proactive">
                                Enable Proactive Assistance
                            </label>
                        </div>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="enable-streaming" checked>
                            <label class="form-check-label" for="enable-streaming">
                                Enable Streaming Responses
                            </label>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <i class="ti ti-info-circle me-2"></i>
                        <small>If you don't have your own API key, the system will use the default configuration.</small>
                    </div>
                </div>
                <div class="ai-config-footer">
                    <button class="btn btn-secondary" onclick="this.closest('.ai-config-modal').remove()">Cancel</button>
                    <button class="btn btn-primary" onclick="window.AIAssistant.saveConfig()">Save Configuration</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Load current configuration
        loadConfigurationIntoModal();
    }

    function loadConfigurationIntoModal() {
        document.getElementById('ai-provider-select').value = aiConfig.provider || 'openai-compatible';
        document.getElementById('ai-api-key').value = aiConfig.apiKey || '';
        document.getElementById('ai-base-url').value = aiConfig.baseUrl || '';
        document.getElementById('ai-model').value = aiConfig.model || '';
        document.getElementById('enable-proactive').checked = aiConfig.enableProactiveAssistance !== false;
        document.getElementById('enable-streaming').checked = aiConfig.enableStreaming !== false;
    }

    function saveConfiguration() {
        const newConfig = {
            provider: document.getElementById('ai-provider-select').value,
            apiKey: document.getElementById('ai-api-key').value,
            baseUrl: document.getElementById('ai-base-url').value,
            model: document.getElementById('ai-model').value,
            enableProactiveAssistance: document.getElementById('enable-proactive').checked,
            enableStreaming: document.getElementById('enable-streaming').checked
        };

        // Validate API key format if provided
        if (newConfig.apiKey && securityManager) {
            if (!securityManager.validateApiKey(newConfig.apiKey, newConfig.provider)) {
                alert('Invalid API key format for the selected provider. Please check your API key.');
                return;
            }

            // Encrypt API key for storage
            newConfig.apiKey = securityManager.encryptApiKey(newConfig.apiKey);
        }

        // Update configuration
        aiConfig = { ...aiConfig, ...newConfig };

        // Save to localStorage (with encrypted API key)
        localStorage.setItem('meenoe_ai_config', JSON.stringify(aiConfig));

        // Apply configuration
        applyConfiguration();

        // Close modal
        document.querySelector('.ai-config-modal')?.remove();

        // Show success message
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', 'Configuration saved successfully! The AI assistant is now ready to help you.');
        }

        console.log('✅ AI Configuration saved and applied');
    }

    function applyConfiguration() {
        try {
            // Use the same configuration logic as the assistant
            applyAIConfigurationFromAssistant(aiConfig);

            // Update agentic engine
            if (agenticEngine) {
                if (aiConfig.enableProactiveAssistance) {
                    agenticEngine.start();
                } else {
                    agenticEngine.stop();
                }
            }

        } catch (error) {
            console.error('Error applying configuration:', error);
        }
    }

    // Listen for agentic suggestions
    function setupAgenticListeners() {
        window.addEventListener('agenticSuggestion', (event) => {
            const { type, data } = event.detail;
            handleAgenticSuggestion(type, data);
        });
    }

    function handleAgenticSuggestion(type, data) {
        // Handle different types of agentic suggestions
        switch (type) {
            case 'suggestions':
                showProactiveSuggestions(data);
                break;
            case 'balance_alert':
                showBalanceAlert(data);
                break;
            case 'urgency_recommendations':
                showUrgencyRecommendations(data);
                break;
            case 'next_steps':
                showNextSteps(data);
                break;
            case 'workflow_suggestion':
                showWorkflowSuggestion(data);
                break;
        }
    }

    function showProactiveSuggestions(suggestions) {
        if (!Array.isArray(suggestions) || suggestions.length === 0) return;

        const suggestionText = suggestions.map(s => `• ${s.title}: ${s.description}`).join('\n');
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', `💡 I noticed some opportunities to improve your meeting:\n\n${suggestionText}\n\nWould you like me to help implement any of these suggestions?`);
        }
    }

    function showBalanceAlert(recommendation) {
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', `⚖️ Meeting Balance Alert: ${recommendation.message}\n\nWould you like me to help optimize your meeting structure?`);
        }
    }

    function showUrgencyRecommendations(adjustments) {
        if (!Array.isArray(adjustments) || adjustments.length === 0) return;

        const adjustmentText = adjustments.map(a => `• ${a.message}`).join('\n');
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', `🎯 Urgency Recommendations:\n\n${adjustmentText}\n\nShould I help you adjust these priorities?`);
        }
    }

    function showNextSteps(steps) {
        if (!Array.isArray(steps) || steps.length === 0) return;

        const stepText = steps.map(s => `• ${s.message}`).join('\n');

        // Use the proper addMessage function from AIChatIntegration
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', `📋 Suggested Next Steps:\n\n${stepText}\n\nWould you like me to help with any of these?`);
        }
    }

    function showWorkflowSuggestion(workflow) {
        // Use the proper addMessage function from AIChatIntegration
        if (window.AIChatIntegration && window.AIChatIntegration.addMessage) {
            window.AIChatIntegration.addMessage('assistant', `🔄 Workflow Suggestion: ${workflow.reason}\n\nI can run the "${workflow.workflow}" workflow to help optimize your meeting. Would you like me to proceed?`);
        }
    }

    // Set up agentic listeners
    setupAgenticListeners();

    // Expose comprehensive API globally
    window.AIAssistant = {
        // Basic controls
        isVisible: () => isAssistantVisible,
        toggle: toggleAssistantPanel,
        show: showAssistantPanel,
        hide: hideAssistantPanel,
        getButton: () => aiButton,
        isInitialized: () => isInitialized,

        // Configuration
        showConfig: showConfigurationModal,
        saveConfig: saveConfiguration,
        getConfig: () => ({ ...aiConfig }),

        // AI System access
        getProviderManager: () => aiProviderManager,
        getMeenoeIntegration: () => meenoeIntegration,
        getAgenticEngine: () => agenticEngine,
        getConversationManager: () => conversationManager,

        // Direct messaging
        sendMessage: (message) => {
            if (conversationManager) {
                return processUserMessage(message);
            }
        },

        // Workflow execution
        executeWorkflow: (workflowName, parameters) => {
            if (agenticEngine) {
                return agenticEngine.executeWorkflow(workflowName, parameters);
            }
        },

        // Security & Performance
        getSecurityManager: () => securityManager,
        getPerformanceOptimizer: () => performanceOptimizer,
        clearCache: () => {
            if (performanceOptimizer) {
                performanceOptimizer.clearCache();
            }
        },
        getSecurityLogs: () => {
            if (securityManager && securityManager.auditLogger) {
                return securityManager.auditLogger.getLogs();
            }
            return [];
        },
        getRateLimitStatus: () => {
            if (securityManager && securityManager.rateLimiter) {
                return securityManager.rateLimiter.getRemainingRequests('current_user');
            }
            return null;
        },
        getCacheStats: () => {
            if (performanceOptimizer) {
                return performanceOptimizer.getCacheStats();
            }
            return null;
        }
    };
    
    console.log('🚀 AI Assistant script loaded');
})();
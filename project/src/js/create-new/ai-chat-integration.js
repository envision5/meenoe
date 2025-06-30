/**
 * AI Chat Integration for Off-canvas Interface
 * Connects the dark-themed off-canvas chat UI with the comprehensive agentic AI system
 */

(function() {
    'use strict';
    
    let isInitialized = false;
    let conversationManager = null;
    let agenticEngine = null;
    let aiProviderManager = null;
    let meenoeIntegration = null;
    let securityManager = null;
    
    // UI Elements
    let messagesContainer = null;
    let messageInput = null;
    let sendButton = null;
    let typingIndicator = null;
    let statusText = null;
    let providerInfo = null;
    let rateLimitInfo = null;
    let notificationBadge = null;
    
    // Initialize when AI system is ready
    window.addEventListener('aiSystemReady', initializeAIChatIntegration);
    
    // Also try to initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeAIChatIntegration, 1000);
    });
    
    function initializeAIChatIntegration() {
        if (isInitialized) return;
        
        console.log('🎨 Initializing AI Chat Integration...');
        
        // Get AI system components
        if (window.AIAssistant) {
            conversationManager = window.AIAssistant.getConversationManager();
            agenticEngine = window.AIAssistant.getAgenticEngine();
            aiProviderManager = window.AIAssistant.getProviderManager();
            meenoeIntegration = window.AIAssistant.getMeenoeIntegration();
            securityManager = window.AIAssistant.getSecurityManager();
        }
        
        // Get UI elements - updated for new off-canvas structure
        messagesContainer = document.getElementById('chat-messages');
        messageInput = document.getElementById('user-input');
        sendButton = document.getElementById('send-button');
        typingIndicator = document.getElementById('aiTypingIndicator'); // May not exist in new structure
        statusText = document.getElementById('aiStatusText'); // May not exist in new structure
        providerInfo = document.getElementById('aiProviderInfo'); // May not exist in new structure
        rateLimitInfo = document.getElementById('aiRateLimitInfo'); // May not exist in new structure
        notificationBadge = document.getElementById('aiNotificationBadge'); // May not exist in new structure
        
        if (!messagesContainer || !messageInput || !sendButton) {
            console.log('⏳ AI Chat UI elements not ready, retrying...');
            setTimeout(initializeAIChatIntegration, 500);
            return;
        }
        
        setupEventListeners();
        setupProactiveNotifications();
        updateUIStatus();
        
        isInitialized = true;
        console.log('✅ AI Chat Integration initialized successfully');
    }
    
    function setupEventListeners() {
        // Use event delegation for dynamic content - updated for new off-canvas structure
        // TTS playback state
        let currentTTS = {
            messageDiv: null,
            listenBtn: null,
            stopBtn: null,
            isPlaying: false,
            isPaused: false
        };

        document.addEventListener('click', (e) => {
            // Send button - updated ID
            if (e.target.closest('#send-button')) {
                handleSendMessage();
            }
            // New chat button - updated selector for new structure
            else if (e.target.closest('#clear-chat')) {
                handleNewChat();
            }
            // Settings button - may not exist in new structure, keeping for compatibility
            else if (e.target.closest('#aiSettingsBtn')) {
                showAISettingsModal();
            }
            // Voice button - updated for new structure
            else if (e.target.closest('#micButton')) {
                handleVoiceInput();
            }
            // Attach button - updated for new structure
            else if (e.target.closest('#upload-file')) {
                handleAttachFile();
            }
            // Copy message button
            else if (e.target.closest('.copy-message-btn')) {
                const btn = e.target.closest('.copy-message-btn');
                const messageDiv = btn.closest('.message');
                if (messageDiv) {
                    const p = messageDiv.querySelector('p');
                    if (p) {
                        const text = p.innerText || p.textContent || '';
                        navigator.clipboard.writeText(text).then(() => {
                            btn.classList.add('copied');
                            const originalIcon = btn.querySelector('i');
                            if (originalIcon) {
                                const prevClass = originalIcon.className;
                                originalIcon.className = 'ti ti-check';
                                setTimeout(() => {
                                    originalIcon.className = prevClass;
                                    btn.classList.remove('copied');
                                }, 1200);
                            }
                        });
                    }
                }
            }
            // Listen (TTS) button
            else if (e.target.closest('.tts-button-group .action-button:not(.stop-button)')) {
                const listenBtn = e.target.closest('.action-button');
                const messageDiv = listenBtn.closest('.message');
                const stopBtn = messageDiv.querySelector('.stop-button');
                const p = messageDiv.querySelector('p');
                if (!p) return;
                const text = p.innerText || p.textContent || '';

                // If another message is playing, stop it and reset UI
                if (currentTTS.isPlaying && currentTTS.listenBtn && currentTTS.listenBtn !== listenBtn) {
                    window.ttsStop && window.ttsStop();
                    // Reset previous UI
                    currentTTS.listenBtn.querySelector('i').className = 'ti ti-player-play';
                    currentTTS.listenBtn.title = 'Listen';
                    if (currentTTS.stopBtn) currentTTS.stopBtn.classList.add('hidden');
                }

                // Helper: Split text for ultra-low latency: first 5 words, then chunks of 3 sentences
                function splitIntoChunks(text, groupSize = 3) {
                    // Split into sentences
                    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
                    const chunks = [];
                    // First chunk: first 5 words of the text (for ultra-low latency)
                    const firstWords = text.trim().split(/\s+/).slice(0, 5).join(' ');
                    if (firstWords.length > 0) {
                        chunks.push(firstWords);
                    }
                    // Remove those words from the text for further chunking
                    let restText = text.trim().split(/\s+/).slice(5).join(' ');
                    if (restText.length > 0) {
                        // Now split the rest into sentences and group by 3
                        const restSentences = restText.match(/[^.!?]+[.!?]+/g) || [restText];
                        for (let i = 0; i < restSentences.length; i += groupSize) {
                            chunks.push(restSentences.slice(i, i + groupSize).join(' '));
                        }
                    }
                    return chunks;
                }

                // Helper: Clean text for TTS (strip markdown, etc)
                function cleanTextForTTS(text) {
                    // Remove code blocks
                    text = text.replace(/```[\s\S]*?```/g, '');
                    // Remove inline code
                    text = text.replace(/`[^`]*`/g, '');
                    // Remove markdown bold/italic
                    text = text.replace(/\*\*([^*]*)\*\*/g, '$1');
                    text = text.replace(/\*([^*]*)\*/g, '$1');
                    text = text.replace(/__([^_]*)__/g, '$1');
                    text = text.replace(/_([^_]*)_/g, '$1');
                    // Remove links but keep text
                    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
                    // Remove images
                    text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
                    // Remove horizontal rules
                    text = text.replace(/^-{3,}|_{3,}|\*{3,}$/gm, '');
                    // Remove blockquotes
                    text = text.replace(/^\s*>\s+/gm, '');
                    // Clean up extra whitespace
                    text = text.replace(/\n{3,}/g, '\n\n');
                    text = text.replace(/\s+/g, ' ').trim();
                    return text;
                }

                // Toggle play/pause
                if (!currentTTS.isPlaying || currentTTS.listenBtn !== listenBtn) {
                    // Start playback
                    currentTTS = { messageDiv, listenBtn, stopBtn, isPlaying: true, isPaused: false };
                    listenBtn.querySelector('i').className = 'ti ti-player-pause';
                    listenBtn.title = 'Pause';
                    if (stopBtn) stopBtn.classList.remove('hidden');

                    // Efficient chunked TTS playback with prefetch/caching for seamless playback
                    (async () => {
                        const cleanText = cleanTextForTTS(text);
                        const chunks = splitIntoChunks(cleanText, 3);

                        // DEBUG: Log TTS call
                        console.log('TTS: Chunked pipelined playback:', cleanText);

                        // --- CHUNKED PIPELINED TTS PLAYBACK ---
                        const voice = 'en-CA-LiamNeural';
                        const rate = '1';
                        const prosodyOptions = { rate: rate };
                        const edgeTTS = window.edgeTTSHandler;
                        if (!edgeTTS || !edgeTTS.processChunk) {
                            // fallback to old method
                            await window.ttsSpeak(cleanText, voice, rate);
                            window.dispatchEvent(new CustomEvent('tts-complete', { detail: { success: currentTTS.isPlaying } }));
                            return;
                        }

                        let stopped = false;
                        let paused = false;
                        let playPromise = null;
                        let currentAudio = null;
                        let chunkIndex = 0;

                        // Listen for stop/pause/resume
                        const stopListener = () => { stopped = true; if (currentAudio) { currentAudio.pause(); currentAudio = null; } };
                        const pauseListener = () => { paused = true; if (currentAudio) currentAudio.pause(); };
                        const resumeListener = () => { paused = false; if (currentAudio) currentAudio.play(); };

                        window.addEventListener('ttsStop', stopListener);
                        window.addEventListener('ttsPause', pauseListener);
                        window.addEventListener('ttsResume', resumeListener);

                        // Remove listeners on complete
                        function cleanupListeners() {
                            window.removeEventListener('ttsStop', stopListener);
                            window.removeEventListener('ttsPause', pauseListener);
                            window.removeEventListener('ttsResume', resumeListener);
                        }

                        // Helper to play a buffer as audio
                        async function playAudioBuffer(buffer) {
                            return new Promise((resolve, reject) => {
                                try {
                                    const audio = new Audio();
                                    const blob = new Blob([buffer], { type: 'audio/mpeg' });
                                    audio.src = URL.createObjectURL(blob);
                                    currentAudio = audio;
                                    audio.onended = () => { currentAudio = null; resolve(); };
                                    audio.onerror = (e) => { currentAudio = null; reject(e); };
                                    audio.onpause = () => { /* handled by pause/resume */ };
                                    audio.play().catch(reject);
                                } catch (err) {
                                    reject(err);
                                }
                            });
                        }

                        // Main chunked playback loop
                        try {
                            const chunkBuffers = [];
                            let prefetching = false;
                            let prefetchPromise = null;

                            // Prefetch next chunk while playing current
                            async function prefetchChunk(idx) {
                                if (chunkBuffers[idx] !== undefined) return chunkBuffers[idx];
                                if (stopped) return null;
                                const chunk = chunks[idx];
                                if (!chunk) return null;
                                const buf = await edgeTTS.processChunk(chunk, voice, prosodyOptions);
                                chunkBuffers[idx] = buf;
                                return buf;
                            }

                            // Start prefetch of chunk 1
                            prefetchPromise = prefetchChunk(0);

                            for (chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
                                if (stopped) break;
                                // Wait for current chunk buffer
                                const buffer = await prefetchPromise;
                                if (!buffer) continue;

                                // Start prefetch of next chunk
                                prefetchPromise = prefetchChunk(chunkIndex + 1);

                                // Play current chunk
                                while (paused && !stopped) await new Promise(r => setTimeout(r, 100));
                                if (stopped) break;
                                await playAudioBuffer(buffer);
                            }
                        } finally {
                            cleanupListeners();
                            window.dispatchEvent(new CustomEvent('tts-complete', { detail: { success: !stopped } }));
                        }
                    })();
                } else if (!currentTTS.isPaused) {
                    // Pause
                    currentTTS.isPaused = true;
                    listenBtn.querySelector('i').className = 'ti ti-player-play';
                    listenBtn.title = 'Resume';
                    window.ttsPause && window.ttsPause();
                } else {
                    // Resume
                    currentTTS.isPaused = false;
                    listenBtn.querySelector('i').className = 'ti ti-player-pause';
                    listenBtn.title = 'Pause';
                    window.ttsResume && window.ttsResume();
                }
            }
            // Stop TTS button
            else if (e.target.closest('.tts-button-group .stop-button')) {
                if (currentTTS.isPlaying) {
                    window.ttsStop && window.ttsStop();
                    if (currentTTS.listenBtn) {
                        currentTTS.listenBtn.querySelector('i').className = 'ti ti-player-play';
                        currentTTS.listenBtn.title = 'Listen';
                    }
                    if (currentTTS.stopBtn) currentTTS.stopBtn.classList.add('hidden');
                    currentTTS.isPlaying = false;
                    currentTTS.isPaused = false;
                }
            }
            // Quick action buttons
            else if (e.target.closest('[data-action]')) {
                const action = e.target.closest('[data-action]').getAttribute('data-action');
                handleQuickAction(action);
            }
        });

        // Listen for global TTS complete event to reset UI
        window.addEventListener('tts-complete', function() {
            if (currentTTS.listenBtn) {
                currentTTS.listenBtn.querySelector('i').className = 'ti ti-player-play';
                currentTTS.listenBtn.title = 'Listen';
            }
            if (currentTTS.stopBtn) currentTTS.stopBtn.classList.add('hidden');
            currentTTS.isPlaying = false;
            currentTTS.isPaused = false;
        });

        // Use event delegation for keypress events - updated for new off-canvas structure
        document.addEventListener('keypress', (e) => {
            if (e.target.closest('#user-input') && e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Listen for AI configuration changes
        window.addEventListener('aiConfigurationChanged', updateUIStatus);

        // Listen for agentic suggestions
        window.addEventListener('agenticSuggestion', handleAgenticSuggestion);

        // Listen for off-canvas events - updated for new off-canvas structure
        document.addEventListener('shown.bs.offcanvas', (e) => {
            if (e.target.id === 'aichatoffcanvas') {
                hideNotificationBadge();
                // Focus input when chat opens
                setTimeout(() => {
                    const input = document.getElementById('user-input');
                    if (input) input.focus();
                }, 100);
            }
        });

        document.addEventListener('hidden.bs.offcanvas', (e) => {
            if (e.target.id === 'aichatoffcanvas') {
                // Update visibility state
                if (window.AIAssistant) {
                    window.AIAssistant.isAssistantVisible = false;
                }
            }
        });
    }
    
    // Quick actions now handled by main event delegation
    
    function setupProactiveNotifications() {
        // Show notification badge when there are proactive suggestions
        window.addEventListener('agenticSuggestion', () => {
            showNotificationBadge();
        });
        
        // Hide badge when chat is opened - updated for new off-canvas structure
        const offcanvas = document.getElementById('aichatoffcanvas');
        if (offcanvas) {
            offcanvas.addEventListener('shown.bs.offcanvas', () => {
                hideNotificationBadge();
            });
        }
    }
    
    // --- AI Send/Stop Button State Helpers ---
function setSendButtonToStop() {
    const btn = document.getElementById('send-button');
    if (btn) {
        btn.classList.add('ai-stop-btn');
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-danger');
        btn.innerHTML = '<i class="ti ti-square-rounded-filled"></i>';
        btn.title = 'Stop AI Response';
    }
    // Add "shine" class to chat-input-wrapper
    const chatInputWrapper = document.querySelector('.chat-input-wrapper');
    if (chatInputWrapper) {
        chatInputWrapper.classList.add('shine');
    }
}
function setSendButtonToSend() {
    const btn = document.getElementById('send-button');
    if (btn) {
        btn.classList.remove('ai-stop-btn');
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        btn.innerHTML = '<i class="ti ti-arrow-up"></i>';
        btn.title = 'Send';
    }
    // Remove "shine" class from chat-input-wrapper
    const chatInputWrapper = document.querySelector('.chat-input-wrapper');
    if (chatInputWrapper) {
        chatInputWrapper.classList.remove('shine');
    }
}

    // --- AI Stop Button Click Handler ---
    let aiAbortController = null;
    document.addEventListener('click', function(e) {
        const stopBtn = e.target.closest('#send-button.ai-stop-btn');
        if (stopBtn) {
            // Only handle stop, do not send a new message
            e.preventDefault();
            e.stopPropagation();
            if (aiAbortController) {
                aiAbortController.abort();
            }
            setSendButtonToSend();
            return;
        }
        // Only trigger send if not in stop mode
        const sendBtn = e.target.closest('#send-button');
        if (sendBtn && !sendBtn.classList.contains('ai-stop-btn')) {
            handleSendMessage();
        }
    });

    async function handleSendMessage() {
        // Get input dynamically to handle dynamic content - updated for new off-canvas structure
        const currentInput = document.getElementById('user-input');
        if (!currentInput) return;

        const message = currentInput.value.trim();
        if (!message) return;

        // Clear input
        currentInput.value = '';

        // Add user message to UI
        addMessageToUI('user', message);

        // (No immediate assistant message here; unified response will be added after processing)

        // Show typing indicator
        showTypingIndicator();

        // Change send button to stop
        setSendButtonToStop();

        try {
            if (!conversationManager) {
                setSendButtonToSend();
                throw new Error('AI system not initialized. Please configure your AI settings.');
            }

            // Process message with AI system
            const context = agenticEngine ? agenticEngine.getContextSummary() : {};

            // Check if streaming is enabled
            const config = window.AIAssistant ? window.AIAssistant.getConfig() : {};

            if (config.enableStreaming && aiProviderManager?.currentProvider?.supportsStreaming()) {
                await handleStreamingResponse(message, context);
            } else {
                await handleRegularResponse(message, context);
            }

        } catch (error) {
            setSendButtonToSend();
            console.error('Error processing message:', error);
            hideTypingIndicator();

            let errorMessage = 'I encountered an error processing your message.';
            if (error.message.includes('not initialized') || error.message.includes('configure')) {
                errorMessage = 'Please configure your AI settings first. Click the settings button (⚙️) to get started.';
            } else if (error.message.includes('Rate limit')) {
                errorMessage = 'You\'re sending messages too quickly. Please wait a moment.';
            }

            addMessageToUI('assistant', errorMessage);
        }
        // Always restore send button after response
        setSendButtonToSend();
    }
    
    async function handleStreamingResponse(message, context) {
        hideTypingIndicator();

        // Create message container for streaming
        const messageElement = addMessageToUI('assistant', '', true);
        const contentElement = messageElement.querySelector('p');

        let fullResponse = '';
        aiAbortController = new AbortController();
        const { signal } = aiAbortController;

        try {
            await conversationManager.streamResponse(
                message,
                context,
                (chunk) => {
                    if (signal.aborted) throw new Error('aborted');
                    fullResponse += chunk;
                    if (contentElement) {
                        contentElement.textContent = fullResponse;
                        scrollToBottom();
                    }
                }
            );
        } catch (error) {
            if (contentElement) {
                contentElement.textContent = error.message === 'aborted'
                    ? 'AI response stopped.' : 'I encountered an error while responding. Please try again.';
            }
        } finally {
            aiAbortController = null;
            setSendButtonToSend();
        }
    }
    
    async function handleRegularResponse(message, context) {
        try {
            const response = await conversationManager.processMessage(message, context);

            hideTypingIndicator();
            // Only add a new assistant message for regular conversational responses
            // Don't create a message for agentic_execution as it's already handled by processRequest()
            if (response.type !== 'agentic_execution' && response.message && response.message.trim()) {
                addMessageToUI('assistant', response.message);
            }

            // Handle function call results
            if (response.type === 'function_call' && response.functionResult) {
                handleFunctionCallResult(response.functionResult);
            }

        } catch (error) {
            hideTypingIndicator();
            addMessageToUI('assistant', 'I encountered an error processing your request. Please try again.');
        } finally {
            setSendButtonToSend();
        }
    }
    
    function handleQuickAction(action) {
        const actionMessages = {
            'analyze': 'Analyze my meeting structure and provide recommendations',
            'optimize': 'Optimize my meeting structure for better efficiency',
            'generate-actions': 'Generate action items from my current agenda'
        };

        const message = actionMessages[action];
        if (message) {
            const currentInput = document.getElementById('user-input');
            if (currentInput) {
                currentInput.value = message;
                handleSendMessage();
            }
        }
    }
    
    function handleNewChat() {
        // Clear conversation history
        if (conversationManager) {
            conversationManager.clearHistory();
        }

        // Clear UI messages (keep welcome message) - get container dynamically, updated for new structure
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (currentMessagesContainer) {
            const welcomeMessage = currentMessagesContainer.querySelector('.ai-welcome-message');
            currentMessagesContainer.innerHTML = '';
            if (welcomeMessage) {
                currentMessagesContainer.appendChild(welcomeMessage);
            }
        }

        updateStatusText('Chat history cleared. How can I help you?');
    }
    
    function handleVoiceInput() {
        // Placeholder for voice input functionality
        addMessageToUI('assistant', 'Voice input is not yet implemented, but it\'s coming soon! For now, please type your message.');
    }
    
    function handleAttachFile() {
        // Placeholder for file attachment functionality
        addMessageToUI('assistant', 'File attachment is not yet implemented, but it\'s coming soon! You can describe your file contents in text for now.');
    }
    
    function addMessageToUI(sender, content, isStreaming = false) {
        // Get container dynamically to handle dynamic content - updated for new off-canvas structure
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return null;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const messageContent = isStreaming ? '' : escapeHtml(content);

        // Message actions markup
        const messageActions = `<div class="message-actions"><button class="action-button copy-message-btn" title="Copy message"><i class="ti ti-copy"></i></button><div class="tts-button-group"><button class="action-button" title="Listen"><i class="ti ti-player-play"></i></button><button class="action-button stop-button hidden" title="Stop"><i class="ti ti-player-stop"></i></button></div></div>`;

        if (sender === 'assistant') {
            messageDiv.innerHTML = `<p>${messageContent}</p>${messageActions}`;
        } else {
            messageDiv.innerHTML = `<p>${messageContent}</p>`;
        }

        currentMessagesContainer.appendChild(messageDiv);
        scrollToBottom();

        return messageDiv;
    }

    // Update the content of the last assistant message (for progressive reveal)
    function updateLastAssistantMessageContent(newContent) {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;
        // Find the last assistant message (not indicator)
        const messages = Array.from(currentMessagesContainer.querySelectorAll('.message.assistant:not(.ai-progress-indicator):not(.typing-indicator)'));
        if (messages.length === 0) return;
        const lastAssistant = messages[messages.length - 1];
        // Only update the <p> content, keep message actions
        const p = lastAssistant.querySelector('p');
        if (p) {
            p.innerHTML = escapeHtml(newContent).replace(/\n/g, "<br>");
        }
    }
    
    // Visual progress indicators for agentic AI actions
    function showAnalyzingIndicator() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;
        removeAllProgressIndicators();

        const analyzingDiv = document.createElement('div');
        analyzingDiv.className = 'message assistant ai-progress-indicator analyzing-indicator';
        analyzingDiv.innerHTML = `
            <div class="ai-progress-visual">
                <span class="ai-spinner"></span>
                <span class="ai-progress-text">Analyzing your request...</span>
            </div>
        `;
        currentMessagesContainer.appendChild(analyzingDiv);
        scrollToBottom();
    }

    function showExecutingIndicator() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;
        removeAllProgressIndicators();

        const executingDiv = document.createElement('div');
        executingDiv.className = 'message assistant ai-progress-indicator executing-indicator';
        executingDiv.innerHTML = `
            <div class="ai-progress-visual">
                <span class="ai-spinner ai-spinner-execute"></span>
                <span class="ai-progress-text">Working on your request...</span>
            </div>
        `;
        currentMessagesContainer.appendChild(executingDiv);
        scrollToBottom();
    }

    function showCompletedIndicator() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;
        removeAllProgressIndicators();

        const completedDiv = document.createElement('div');
        completedDiv.className = 'message assistant ai-progress-indicator completed-indicator';
        completedDiv.innerHTML = `
            <div class="ai-progress-visual">
                <span class="ai-checkmark">&#10003;</span>
                <span class="ai-progress-text">All done! Here’s what I accomplished:</span>
            </div>
        `;
        currentMessagesContainer.appendChild(completedDiv);
        scrollToBottom();
    }

    function removeAllProgressIndicators() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;
        currentMessagesContainer.querySelectorAll('.ai-progress-indicator').forEach(el => el.remove());
    }

    function showTypingIndicator() {
        // Create a typing indicator if it doesn't exist in the new structure
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (!currentMessagesContainer) return;

        // Remove existing typing indicator
        const existingIndicator = currentMessagesContainer.querySelector('.typing-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create new typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing-indicator';
        typingDiv.innerHTML = `
            <p>
                <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
                AI is thinking...
            </p>
        `;

        currentMessagesContainer.appendChild(typingDiv);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (currentMessagesContainer) {
            const typingIndicator = currentMessagesContainer.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    }
    
    function scrollToBottom() {
        const currentMessagesContainer = document.getElementById('chat-messages');
        if (currentMessagesContainer) {
            currentMessagesContainer.scrollTop = currentMessagesContainer.scrollHeight;
        }
    }
    
    function updateUIStatus() {
        const config = window.AIAssistant ? window.AIAssistant.getConfig() : {};

        // Update provider info - get element dynamically (may not exist in new structure)
        const currentProviderInfo = document.getElementById('aiProviderInfo');
        if (currentProviderInfo) {
            const provider = config.provider || 'Not configured';
            const hasKey = !!config.apiKey;
            currentProviderInfo.textContent = `AI Provider: ${provider}${hasKey ? ' ✓' : ' (needs API key)'}`;
        }

        // Update rate limit info - get element dynamically (may not exist in new structure)
        const currentRateLimitInfo = document.getElementById('aiRateLimitInfo');
        if (currentRateLimitInfo && window.AIAssistant) {
            const rateLimits = window.AIAssistant.getRateLimitStatus();
            if (rateLimits) {
                currentRateLimitInfo.textContent = `Rate limit: ${rateLimits.perMinute}/20 per min`;
            }
        }

        // Update status text (may not exist in new structure)
        if (config.apiKey) {
            updateStatusText('Ready to help');
        } else {
            updateStatusText('Please configure AI settings');
        }

        // Update AI assistant button state
        const aiButton = document.getElementById('aiAssistantButton');
        if (aiButton) {
            if (config.apiKey) {
                aiButton.classList.remove('pulse');
                aiButton.title = 'AI Assistant (Configured)';
            } else {
                aiButton.classList.add('pulse');
                aiButton.title = 'AI Assistant (Needs Configuration)';
            }
        }
    }
    
    function updateStatusText(text) {
        const currentStatusText = document.getElementById('aiStatusText');
        if (currentStatusText) {
            currentStatusText.textContent = text;
        }
    }
    
    function handleAgenticSuggestion(event) {
        const { type, data } = event.detail;
        
        // Show notification badge
        showNotificationBadge();
        
        // Add proactive message based on suggestion type
        let message = '';
        switch (type) {
            case 'suggestions':
                message = '💡 I noticed some opportunities to improve your meeting. Would you like me to share them?';
                break;
            case 'balance_alert':
                message = '⚖️ Your meeting structure could be more balanced. Should I help optimize it?';
                break;
            case 'urgency_recommendations':
                message = '🎯 I have some urgency recommendations for your agenda items. Interested?';
                break;
            case 'next_steps':
                message = '📋 I can suggest some next steps for your meeting. Would that be helpful?';
                break;
            case 'workflow_suggestion':
                message = '🔄 I can run an optimization workflow to improve your meeting. Shall I proceed?';
                break;
        }
        
        if (message) {
            setTimeout(() => {
                addMessageToUI('assistant', message);
            }, 1000);
        }
    }
    
    function handleFunctionCallResult(result) {
        if (result.success) {
            // Trigger UI updates if needed
            if (window.meenoeState) {
                window.meenoeState.refreshAllCounters();
            }
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('aiActionCompleted', {
                detail: result
            }));
        }
    }
    
    function showNotificationBadge() {
        // Try to find existing notification badge
        let currentNotificationBadge = document.getElementById('aiNotificationBadge');

        // If it doesn't exist, create one on the AI assistant button
        if (!currentNotificationBadge) {
            const aiButton = document.getElementById('aiAssistantButton');
            if (aiButton) {
                currentNotificationBadge = document.createElement('span');
                currentNotificationBadge.id = 'aiNotificationBadge';
                currentNotificationBadge.className = 'ai-notification-badge';
                currentNotificationBadge.textContent = '!';
                aiButton.appendChild(currentNotificationBadge);
            }
        }

        if (currentNotificationBadge) {
            currentNotificationBadge.style.display = 'flex';
        }
    }

    function hideNotificationBadge() {
        const currentNotificationBadge = document.getElementById('aiNotificationBadge');
        if (currentNotificationBadge) {
            currentNotificationBadge.style.display = 'none';
        }
    }
    
    function showAISettingsModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('aiSettingsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'aiSettingsModal';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'aiSettingsModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content ai-settings-modal">
                    <div class="modal-header">
                        <h5 class="modal-title" id="aiSettingsModalLabel">
                            <i class="ti ti-settings me-2"></i>AI Assistant Settings
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="aiSettingsForm">
                            <!-- Provider Selection -->
                            <div class="mb-4">
                                <label for="aiProvider" class="form-label fw-bold">
                                    <i class="ti ti-robot me-2"></i>AI Provider
                                </label>
                                <select class="form-select" id="aiProvider" required>
                                    <option value="">Select AI Provider</option>
                                    <option value="openai">OpenAI (GPT-4)</option>
                                    <option value="claude">Claude (Anthropic)</option>
                                    <option value="gemini">Gemini (Google)</option>
                                    <option value="ollama">Ollama (Local)</option>
                                    <option value="openai-compatible">OpenAI Compatible (Custom)</option>
                                </select>
                                <div class="form-text">Choose your preferred AI provider</div>
                            </div>

                            <!-- OpenAI Compatible Settings (hidden by default) -->
                            <div id="openaiCompatibleSettings" style="display: none;">
                                <div class="mb-3">
                                    <label for="aiBaseUrl" class="form-label fw-bold">
                                        <i class="ti ti-link me-2"></i>Base URL
                                    </label>
                                    <input type="url" class="form-control" id="aiBaseUrl"
                                           placeholder="https://api.example.com/v1">
                                    <div class="form-text">API endpoint URL (e.g., for local models or custom providers)</div>
                                </div>
                            </div>

                            <!-- API Key -->
                            <div class="mb-3">
                                <label for="aiApiKey" class="form-label fw-bold">
                                    <i class="ti ti-key me-2"></i>API Key
                                </label>
                                <div class="input-group">
                                    <input type="password" class="form-control" id="aiApiKey"
                                           placeholder="Enter your API key" required>
                                    <button class="btn btn-outline-secondary" type="button" id="toggleApiKey">
                                        <i class="ti ti-eye"></i>
                                    </button>
                                </div>
                                <div class="form-text">Your API key is stored locally and encrypted</div>
                            </div>

                            <!-- Model Selection -->
                            <div class="mb-3">
                                <label for="aiModel" class="form-label fw-bold">
                                    <i class="ti ti-cpu me-2"></i>Model
                                </label>
                                <input type="text" class="form-control" id="aiModel"
                                       placeholder="Leave blank for default">
                                <div class="form-text">Optional: Specify a custom model (e.g., gpt-4, claude-3-opus)</div>
                            </div>

                            <!-- Advanced Settings -->
                            <div class="mb-4">
                                <h6 class="fw-bold mb-3">
                                    <i class="ti ti-adjustments me-2"></i>Advanced Settings
                                </h6>

                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="enableProactive" checked>
                                    <label class="form-check-label" for="enableProactive">
                                        <strong>Enable Proactive Assistance</strong>
                                        <div class="text-muted small">AI will provide suggestions and recommendations automatically</div>
                                    </label>
                                </div>

                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="enableStreaming" checked>
                                    <label class="form-check-label" for="enableStreaming">
                                        <strong>Enable Streaming Responses</strong>
                                        <div class="text-muted small">See AI responses as they're being generated</div>
                                    </label>
                                </div>
                            </div>

                            <!-- Test Connection -->
                            <div class="mb-3">
                                <button type="button" class="btn btn-outline-primary" id="testConnection">
                                    <i class="ti ti-plug me-2"></i>Test Connection
                                </button>
                                <div id="connectionStatus" class="mt-2"></div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveAISettings">
                            <i class="ti ti-device-floppy me-2"></i>Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.appendChild(modal);

        // Set up event listeners
        setupSettingsModalEventListeners();

        // Load current settings
        loadCurrentSettings();

        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Clean up when modal is hidden
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    function setupSettingsModalEventListeners() {
        // Provider change handler
        document.getElementById('aiProvider').addEventListener('change', (e) => {
            const isOpenAICompatible = e.target.value === 'openai-compatible';
            const compatibleSettings = document.getElementById('openaiCompatibleSettings');
            compatibleSettings.style.display = isOpenAICompatible ? 'block' : 'none';

            // Update API key placeholder based on provider
            const apiKeyInput = document.getElementById('aiApiKey');
            const placeholders = {
                'openai': 'sk-...',
                'claude': 'sk-ant-...',
                'gemini': 'AI...',
                'ollama': 'Not required for local Ollama',
                'openai-compatible': 'Your custom API key'
            };
            apiKeyInput.placeholder = placeholders[e.target.value] || 'Enter your API key';

            // Disable API key for Ollama
            apiKeyInput.disabled = e.target.value === 'ollama';
            apiKeyInput.required = e.target.value !== 'ollama';
        });

        // Toggle API key visibility
        document.getElementById('toggleApiKey').addEventListener('click', () => {
            const apiKeyInput = document.getElementById('aiApiKey');
            const toggleBtn = document.getElementById('toggleApiKey');
            const icon = toggleBtn.querySelector('i');

            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                icon.className = 'ti ti-eye-off';
            } else {
                apiKeyInput.type = 'password';
                icon.className = 'ti ti-eye';
            }
        });

        // Test connection
        document.getElementById('testConnection').addEventListener('click', testAIConnection);

        // Save settings
        document.getElementById('saveAISettings').addEventListener('click', saveAISettings);
    }

    function loadCurrentSettings() {
        try {
            const savedConfig = localStorage.getItem('meenoe_ai_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);

                document.getElementById('aiProvider').value = config.provider || '';
                document.getElementById('aiApiKey').value = config.apiKey || '';
                document.getElementById('aiModel').value = config.model || '';
                document.getElementById('aiBaseUrl').value = config.baseUrl || '';
                document.getElementById('enableProactive').checked = config.enableProactiveAssistance !== false;
                document.getElementById('enableStreaming').checked = config.enableStreaming !== false;

                // Trigger provider change to show/hide compatible settings
                document.getElementById('aiProvider').dispatchEvent(new Event('change'));
            }
        } catch (error) {
            console.error('Error loading AI settings:', error);
        }
    }

    async function testAIConnection() {
        const statusDiv = document.getElementById('connectionStatus');
        const testBtn = document.getElementById('testConnection');
        const originalText = testBtn.innerHTML;

        // Show loading state
        testBtn.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Testing...';
        testBtn.disabled = true;
        statusDiv.innerHTML = '<div class="text-info"><i class="ti ti-loader-2 spin me-2"></i>Testing connection...</div>';

        try {
            const provider = document.getElementById('aiProvider').value;
            const apiKey = document.getElementById('aiApiKey').value;
            const baseUrl = document.getElementById('aiBaseUrl').value;
            const model = document.getElementById('aiModel').value;

            if (!provider) {
                throw new Error('Please select a provider');
            }

            if (provider !== 'ollama' && !apiKey) {
                throw new Error('Please enter an API key');
            }

            // Simple test request
            const testConfig = { provider, apiKey, baseUrl, model };
            const success = await performConnectionTest(testConfig);

            if (success) {
                statusDiv.innerHTML = '<div class="text-success"><i class="ti ti-check me-2"></i>Connection successful!</div>';
            } else {
                throw new Error('Connection test failed');
            }

        } catch (error) {
            statusDiv.innerHTML = `<div class="text-danger"><i class="ti ti-x me-2"></i>Error: ${error.message}</div>`;
        } finally {
            testBtn.innerHTML = originalText;
            testBtn.disabled = false;
        }
    }

    async function performConnectionTest(config) {
        try {
            // Use proxy test endpoint if available
            if (window.location.hostname === 'localhost') {
                const testData = {
                    provider: config.provider,
                    apiKey: config.apiKey,
                    baseUrl: config.baseUrl,
                    model: config.model
                };

                const response = await fetch('/api/ai/test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(testData)
                });

                const result = await response.json();

                if (result.success) {
                    return true;
                } else {
                    throw new Error(result.error || 'Connection test failed');
                }
            }

            // Fallback to direct test (for production)
            return await performDirectConnectionTest(config);

        } catch (error) {
            console.error('Connection test failed:', error);
            throw error;
        }
    }

    async function performDirectConnectionTest(config) {
        try {
            // Apply the test configuration temporarily
            if (window.aiProviderManager) {
                const originalProvider = window.aiProviderManager.currentProvider;
                const originalConfig = {
                    apiKey: originalProvider?.apiKey,
                    baseURL: originalProvider?.baseURL,
                    model: originalProvider?.model
                };

                // Configure for test
                if (config.provider === 'openai-compatible') {
                    window.aiProviderManager.setProvider('openai');
                } else {
                    window.aiProviderManager.setProvider(config.provider);
                }

                const testConfig = {
                    apiKey: config.apiKey,
                    model: config.model
                };

                if (config.baseUrl) {
                    testConfig.baseURL = config.baseUrl;
                }

                await window.aiProviderManager.currentProvider.configure(testConfig);

                // Make a simple test request
                const testResponse = await window.aiProviderManager.generateResponse(
                    'Hello, this is a connection test. Please respond with "Connection successful!"',
                    {},
                    { maxTokens: 50 }
                );

                // Restore original configuration
                if (originalProvider) {
                    await originalProvider.configure(originalConfig);
                }

                return testResponse && testResponse.length > 0;
            }

            return false;
        } catch (error) {
            console.error('Direct connection test failed:', error);
            throw error;
        }
    }

    async function applyAIConfiguration(config) {
        try {
            console.log('🔧 Applying AI configuration:', config);

            // Update global AI configuration if available
            if (window.AIAssistant && typeof window.AIAssistant.updateConfig === 'function') {
                window.AIAssistant.updateConfig(config);
            }

            // Update AI provider manager if available
            if (window.aiProviderManager) {
                // Handle OpenAI-compatible providers specially
                if (config.provider === 'openai-compatible') {
                    // Use OpenAI provider but configure it with custom base URL
                    window.aiProviderManager.setProvider('openai');

                    if (window.aiProviderManager.currentProvider && config.apiKey && config.baseUrl) {
                        const providerConfig = {
                            apiKey: config.apiKey,
                            baseURL: config.baseUrl,
                            model: config.model
                        };

                        // Await the configuration to ensure it's applied
                        console.log('🔧 About to configure provider with:', providerConfig);
                        await window.aiProviderManager.currentProvider.configure(providerConfig);
                        console.log('🔧 Configured OpenAI-compatible provider:', {
                            baseURL: config.baseUrl,
                            model: config.model,
                            hasApiKey: !!config.apiKey,
                            actualBaseURL: window.aiProviderManager.currentProvider.baseURL,
                            useProxy: window.aiProviderManager.currentProvider.useProxy,
                            providerName: window.aiProviderManager.currentProvider.name
                        });
                    }
                } else {
                    // Switch to the specified provider
                    if (config.provider && window.aiProviderManager.setProvider) {
                        window.aiProviderManager.setProvider(config.provider);
                    }

                    // Configure provider with API key and settings
                    if (window.aiProviderManager.currentProvider && config.apiKey) {
                        const providerConfig = {
                            apiKey: config.apiKey,
                            model: config.model
                        };

                        // Await the configuration to ensure it's applied
                        await window.aiProviderManager.currentProvider.configure(providerConfig);
                    }
                }
            }

            // Update agentic engine if available
            if (window.agenticEngine) {
                if (config.enableProactiveAssistance) {
                    window.agenticEngine.start?.();
                } else {
                    window.agenticEngine.stop?.();
                }
            }

            // Store configuration globally for other components
            window.meenoeAIConfig = config;

            console.log('✅ AI configuration applied successfully');

        } catch (error) {
            console.error('Error applying AI configuration:', error);
            // Don't throw error to prevent save failure
        }
    }

    async function saveAISettings() {
        try {
            const config = {
                provider: document.getElementById('aiProvider').value,
                apiKey: document.getElementById('aiApiKey').value,
                model: document.getElementById('aiModel').value,
                baseUrl: document.getElementById('aiBaseUrl').value,
                enableProactiveAssistance: document.getElementById('enableProactive').checked,
                enableStreaming: document.getElementById('enableStreaming').checked,
                timestamp: new Date().toISOString()
            };

            // Validate required fields
            if (!config.provider) {
                alert('Please select an AI provider');
                return;
            }

            if (config.provider !== 'ollama' && !config.apiKey) {
                alert('Please enter an API key');
                return;
            }

            if (config.provider === 'openai-compatible' && !config.baseUrl) {
                alert('Please enter a base URL for OpenAI compatible provider');
                return;
            }

            // Save to localStorage
            localStorage.setItem('meenoe_ai_config', JSON.stringify(config));

            // Apply configuration to AI system components
            await applyAIConfiguration(config);

            // Update UI status
            updateUIStatus();

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('aiSettingsModal'));
            modal.hide();

            // Show success message
            addMessageToUI('assistant', '✅ AI settings saved successfully! The assistant is now configured and ready to help.');

            // Dispatch configuration change event
            window.dispatchEvent(new CustomEvent('aiConfigurationChanged', {
                detail: config
            }));

        } catch (error) {
            console.error('Error saving AI settings:', error);
            alert('Error saving settings: ' + error.message);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Debug function to check AI configuration
    function debugAIConfiguration() {
        console.log('🔍 AI Configuration Debug:');
        console.log('- Saved config:', JSON.parse(localStorage.getItem('meenoe_ai_config') || '{}'));
        console.log('- Global config:', window.meenoeAIConfig);
        console.log('- Location:', window.location.hostname, window.location.port);

        if (window.aiProviderManager) {
            console.log('- Provider manager:', window.aiProviderManager);
            console.log('- Current provider:', window.aiProviderManager.currentProvider?.name);
            console.log('- Provider baseURL:', window.aiProviderManager.currentProvider?.baseURL);
            console.log('- Provider model:', window.aiProviderManager.currentProvider?.model);
            console.log('- Provider useProxy:', window.aiProviderManager.currentProvider?.useProxy);
            console.log('- Has API key:', !!window.aiProviderManager.currentProvider?.apiKey);
        } else {
            console.log('- Provider manager: Not available');
        }
    }

    // Force proxy mode for testing
    function forceProxyMode() {
        if (window.aiProviderManager && window.aiProviderManager.currentProvider) {
            window.aiProviderManager.currentProvider.useProxy = true;
            console.log('🔧 Forced proxy mode enabled');
            debugAIConfiguration();
        }
    }

    // Test proxy connectivity
    async function testProxyConnectivity() {
        try {
            console.log('🧪 Testing proxy connectivity...');

            // Test health endpoint
            const healthResponse = await fetch('/api/ai/health');
            const healthData = await healthResponse.json();
            console.log('✅ Proxy health check:', healthData);

            // Test configuration endpoint
            const configResponse = await fetch('/api/ai/configure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: 'test_session',
                    provider: 'openai-compatible',
                    apiKey: 'test_key',
                    baseUrl: 'https://api.synthetic.new/v1',
                    model: 'test_model'
                })
            });
            const configData = await configResponse.json();
            console.log('✅ Proxy configuration test:', configData);

            return true;
        } catch (error) {
            console.error('❌ Proxy connectivity test failed:', error);
            return false;
        }
    }

    // Function to reload and apply saved configuration
    async function reloadSavedConfiguration() {
        try {
            const savedConfig = localStorage.getItem('meenoe_ai_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                console.log('🔄 Reloading saved AI configuration:', config);
                await applyAIConfiguration(config);
                updateUIStatus();
            }
        } catch (error) {
            console.error('Error reloading saved configuration:', error);
        }
    }

    // Expose functions globally for debugging and agentic progress
    window.AIChatIntegration = {
        isInitialized: () => isInitialized,
        addMessage: addMessageToUI,
        updateLastAssistantMessageContent: updateLastAssistantMessageContent,
        updateStatus: updateUIStatus,
        clearChat: handleNewChat,
        showSettings: showAISettingsModal,
        debugConfig: debugAIConfiguration,
        reloadConfig: reloadSavedConfiguration,
        forceProxy: forceProxyMode,
        testProxy: testProxyConnectivity,
        testFunctionCalling: () => {
            if (window.conversationManager && window.conversationManager.functionCaller) {
                return window.conversationManager.functionCaller.testFunctionCalling();
            } else {
                console.error('Function caller not available');
            }
        },
        testAgenticSystem: async () => {
            console.log('🧪 Testing Agentic System');

            if (!window.conversationManager) {
                console.error('❌ Conversation manager not available');
                return;
            }

            const testMessage = 'Create a new agenda point named "Test Agenda Item"';
            console.log('📝 Test message:', testMessage);

            try {
                const result = await window.conversationManager.processMessage(testMessage, {});
                console.log('✅ Test result:', result);

                if (result.executedActions > 0) {
                    console.log('🎉 SUCCESS: Agentic system executed actions!');
                } else {
                    console.log('⚠️ No actions executed - check function calling');
                }

                return result;
            } catch (error) {
                console.error('❌ Test failed:', error);
                return { error: error.message };
            }
        },
        debugCurrentState: () => {
            console.log('🔍 Current Meenoe State Debug');

            if (!window.conversationManager || !window.conversationManager.functionCaller) {
                console.error('❌ Function caller not available');
                return;
            }

            const currentState = window.conversationManager.meenoeIntegration.getCurrentMeenoeState();
            console.log('📊 Full State:', currentState);

            const agendaItems = window.conversationManager.functionCaller.extractAgendaItems(currentState);
            const actionItems = window.conversationManager.functionCaller.extractActionItems(currentState);

            console.log('📋 Agenda Items:', agendaItems);
            console.log('⚡ Action Items:', actionItems);

            return { currentState, agendaItems, actionItems };
        },
        testIDResolution: async () => {
            console.log('🧪 Testing ID Resolution');

            if (!window.conversationManager) {
                console.error('❌ Conversation manager not available');
                return;
            }

            // First create an agenda item
            console.log('📝 Step 1: Creating test agenda item...');
            const createResult = await window.conversationManager.processMessage(
                'Create agenda point called "Test Resolution Item"', {}
            );
            console.log('✅ Create result:', createResult);

            // Then try to update it
            console.log('📝 Step 2: Trying to update the item...');
            const updateResult = await window.conversationManager.processMessage(
                'Change the urgency of the "Test Resolution Item" agenda point to critical', {}
            );
            console.log('✅ Update result:', updateResult);

            return { createResult, updateResult };
        },
        testUrgencyLevels: async () => {
            console.log('🧪 Testing Urgency Levels');

            if (!window.conversationManager) {
                console.error('❌ Conversation manager not available');
                return;
            }

            const urgencyTests = [
                'Create agenda point "Normal Test" with normal urgency',
                'Create agenda point "Moderate Test" with moderate urgency',
                'Create agenda point "Important Test" with important urgency',
                'Create agenda point "Critical Test" with critical urgency',
                'Create agenda point "Mandatory Test" with mandatory urgency'
            ];

            const results = [];

            for (const test of urgencyTests) {
                console.log(`📝 Testing: ${test}`);
                try {
                    const result = await window.conversationManager.processMessage(test, {});
                    results.push({ test, result });
                    console.log('✅ Result:', result);
                } catch (error) {
                    results.push({ test, error: error.message });
                    console.error('❌ Error:', error);
                }
            }

            // Check analytics
            console.log('📊 Checking urgency distribution...');
            const analytics = window.conversationManager.meenoeIntegration.getAgendaAnalytics();
            console.log('📊 Urgency Distribution:', analytics.urgencyDistribution);

            return { results, analytics };
        },
        sendMessage: (message) => {
            const currentInput = document.getElementById('user-input');
            if (currentInput) {
                currentInput.value = message;
                handleSendMessage();
            }
        },
        // Agentic progress indicators
        showAnalyzingIndicator,
        showExecutingIndicator,
        showCompletedIndicator,
        removeAllProgressIndicators
    };

    // Set up automatic configuration reload when AI system is ready
    window.addEventListener('aiSystemReady', () => {
        console.log('🎯 AI System ready, reloading configuration...');
        setTimeout(reloadSavedConfiguration, 500);
    });

    // Also reload configuration when the page loads (fallback)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(reloadSavedConfiguration, 2000);
        });
    } else {
        setTimeout(reloadSavedConfiguration, 2000);
    }

    console.log('🎨 AI Chat Integration module loaded');
/* Show message actions only on hover of assistant message */
const style = document.createElement('style');
style.innerHTML = `
.message.assistant .message-actions {
    display: none;
    transition: opacity 0.15s;
}
.message.assistant:hover .message-actions,
.message.assistant:focus-within .message-actions {
    display: flex;
}
.message-actions {
    gap: 0.25rem;
    margin-top: 0.25rem;
    align-items: center;
}
.action-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    font-size: 1rem;
    color: #888;
    border-radius: 3px;
    transition: background 0.15s, color 0.15s;
}
.action-button:hover, .action-button:focus {
    background: #f0f0f0;
    color: #222;
}
.tts-button-group {
    display: flex;
    gap: 0.15rem;
}
.stop-button.hidden {
    display: none !important;
}

/* Agentic progress indicator styles */
.ai-progress-indicator {
    display: flex;
    align-items: center;
    background: #f8fafd;
    border-radius: 8px;
    margin: 0.5rem 0;
    padding: 0.75rem 1rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    font-size: 1rem;
    color: #2a2a2a;
}
.ai-progress-visual {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}
.ai-spinner, .ai-spinner-execute {
    width: 22px;
    height: 22px;
    border: 3px solid #d0e2ff;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: ai-spin 1s linear infinite;
    display: inline-block;
}
.ai-spinner-execute {
    border-top: 3px solid #10b981;
}
@keyframes ai-spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
}
.ai-progress-text {
    font-weight: 500;
    color: #2a2a2a;
}
.completed-indicator .ai-checkmark {
    color: #10b981;
    font-size: 1.5rem;
    margin-right: 0.5rem;
}
`;
document.head.appendChild(style);

/* Add red style for stop button */
const stopBtnStyle = document.createElement('style');
stopBtnStyle.innerHTML = `
#send-button.ai-stop-btn {
    background: #e53935 !important;
    border-color: #e53935 !important;
    color: #fff !important;
}
#send-button.ai-stop-btn:hover, #send-button.ai-stop-btn:focus {
    background: #b71c1c !important;
    border-color: #b71c1c !important;
    color: #fff !important;
}
`;
document.head.appendChild(stopBtnStyle);

})();

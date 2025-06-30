/**
 * AI System Loader
 * Ensures all AI components are loaded in the correct order
 */

(function() {
    'use strict';
    
    const AI_COMPONENTS = [
        'ai-security-performance.js',
        'ai-providers.js',
        'meenoe-ai-integration.js',
        'unified-function-calling.js',
        'agentic-engine.js',
        'conversation-manager.js',
        'ai-assistant.js'
    ];
    
    const CSS_FILES = [
        'ai-assistant-styles.css'
    ];
    
    let loadedComponents = 0;
    let totalComponents = AI_COMPONENTS.length;
    
    console.log('🚀 Starting AI System initialization...');
    
    // Load CSS files first
    loadCSSFiles();
    
    // Load JavaScript components in order
    loadNextComponent();
    
    function loadCSSFiles() {
        CSS_FILES.forEach(cssFile => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `src/js/create-new/${cssFile}`;
            document.head.appendChild(link);
            console.log(`📄 Loaded CSS: ${cssFile}`);
        });
    }
    
    function loadNextComponent() {
        if (loadedComponents >= totalComponents) {
            onAllComponentsLoaded();
            return;
        }
        
        const componentFile = AI_COMPONENTS[loadedComponents];
        loadScript(componentFile, () => {
            loadedComponents++;
            console.log(`✅ Loaded component ${loadedComponents}/${totalComponents}: ${componentFile}`);
            loadNextComponent();
        });
    }
    
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = `src/js/create-new/${src}`;
        script.onload = callback;
        script.onerror = () => {
            console.error(`❌ Failed to load: ${src}`);
            // Continue loading other components
            loadedComponents++;
            loadNextComponent();
        };
        document.head.appendChild(script);
    }
    
    function onAllComponentsLoaded() {
        console.log('🎉 All AI components loaded successfully!');
        
        // Wait a bit for all components to initialize
        setTimeout(() => {
            initializeAISystem();
        }, 100);
    }
    
    function initializeAISystem() {
        try {
            // Check if all required classes are available
            const requiredClasses = [
                'AIProviderManager',
                'MeenoeAIIntegration', 
                'AgenticEngine',
                'ConversationManager'
            ];
            
            const missingClasses = requiredClasses.filter(className => !window[className]);
            
            if (missingClasses.length > 0) {
                console.warn('⚠️ Some AI classes are missing:', missingClasses);
                console.log('Available classes:', Object.keys(window).filter(key => 
                    requiredClasses.some(cls => key.includes(cls.split(/(?=[A-Z])/).join('')))
                ));
            }
            
            // Initialize the main AI assistant
            if (typeof window.initializeAIAssistant === 'function') {
                // The AI assistant will initialize its own components
                console.log('🤖 AI Assistant initialization will be handled by the main script');
            } else {
                console.error('❌ AI Assistant initialization function not found');
            }
            
            // Set up global error handling for AI operations
            setupGlobalErrorHandling();
            
            // Set up performance monitoring
            setupPerformanceMonitoring();
            
            console.log('🎯 AI System initialization complete!');
            
            // Dispatch event to notify other systems
            window.dispatchEvent(new CustomEvent('aiSystemReady', {
                detail: {
                    timestamp: new Date().toISOString(),
                    components: AI_COMPONENTS,
                    loadedClasses: requiredClasses.filter(className => window[className])
                }
            }));
            
        } catch (error) {
            console.error('❌ Error during AI system initialization:', error);
        }
    }
    
    function setupGlobalErrorHandling() {
        // Capture AI-related errors
        const originalConsoleError = console.error;
        console.error = function(...args) {
            // Check if this is an AI-related error
            const errorMessage = args.join(' ').toLowerCase();
            if (errorMessage.includes('ai') || 
                errorMessage.includes('provider') || 
                errorMessage.includes('conversation') ||
                errorMessage.includes('agentic')) {
                
                // Log to AI error tracking
                trackAIError(args);
            }
            
            // Call original console.error
            originalConsoleError.apply(console, args);
        };
    }
    
    function trackAIError(errorArgs) {
        // Store AI errors for debugging
        if (!window.aiErrorLog) {
            window.aiErrorLog = [];
        }
        
        window.aiErrorLog.push({
            timestamp: new Date().toISOString(),
            error: errorArgs,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
        
        // Keep only last 50 errors
        if (window.aiErrorLog.length > 50) {
            window.aiErrorLog = window.aiErrorLog.slice(-50);
        }
    }
    
    function setupPerformanceMonitoring() {
        // Monitor AI operation performance
        window.aiPerformanceLog = [];
        
        // Create performance tracking utility
        window.trackAIPerformance = function(operation, startTime, endTime, metadata = {}) {
            const duration = endTime - startTime;
            
            window.aiPerformanceLog.push({
                operation: operation,
                duration: duration,
                timestamp: new Date().toISOString(),
                metadata: metadata
            });
            
            // Keep only last 100 performance entries
            if (window.aiPerformanceLog.length > 100) {
                window.aiPerformanceLog = window.aiPerformanceLog.slice(-100);
            }
            
            // Log slow operations
            if (duration > 5000) { // 5 seconds
                console.warn(`⚠️ Slow AI operation detected: ${operation} took ${duration}ms`);
            }
        };
    }
    
    // Expose loader utilities globally
    window.AISystemLoader = {
        getLoadedComponents: () => AI_COMPONENTS.slice(0, loadedComponents),
        getTotalComponents: () => totalComponents,
        getLoadProgress: () => Math.round((loadedComponents / totalComponents) * 100),
        isFullyLoaded: () => loadedComponents >= totalComponents,
        getErrorLog: () => window.aiErrorLog || [],
        getPerformanceLog: () => window.aiPerformanceLog || [],
        reinitialize: () => {
            loadedComponents = 0;
            loadNextComponent();
        }
    };
    
    // Handle page visibility changes to pause/resume AI operations
    document.addEventListener('visibilitychange', () => {
        if (window.AIAssistant && window.AIAssistant.getAgenticEngine) {
            const agenticEngine = window.AIAssistant.getAgenticEngine();
            if (agenticEngine) {
                if (document.hidden) {
                    console.log('🔇 Page hidden - pausing agentic engine');
                    agenticEngine.stop();
                } else {
                    console.log('🔊 Page visible - resuming agentic engine');
                    agenticEngine.start();
                }
            }
        }
    });
    
    // Handle beforeunload to cleanup AI operations
    window.addEventListener('beforeunload', () => {
        if (window.AIAssistant && window.AIAssistant.getAgenticEngine) {
            const agenticEngine = window.AIAssistant.getAgenticEngine();
            if (agenticEngine) {
                agenticEngine.stop();
            }
        }
    });
    
    console.log('📋 AI System Loader initialized');
})();

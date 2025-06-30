/**
 * Meenoe Integrations
 * Connects the state management system with existing components
 */

class MeenoeIntegrations {
    constructor() {
        this.isInitialized = false;
        this.originalMethods = new Map();
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Meenoe Integrations...');
        
        // Wait for other systems to be ready
        this.waitForSystems().then(() => {
            this.setupIntegrations();
            this.isInitialized = true;
            console.log('✅ Meenoe Integrations initialized');
        });
    }
    
    /**
     * Wait for required systems to be available
     */
    async waitForSystems() {
        const maxWait = 5000; // 5 seconds
        const checkInterval = 100; // 100ms
        let waited = 0;
        
        while (waited < maxWait) {
            if (window.agendaFlow && window.meenoeUsers && window.tree) {
                break;
            }
            await new Promise(resolve => setTimeout(resolve, checkInterval));
            waited += checkInterval;
        }
        
        console.log('🔗 Required systems ready for integration');
    }
    
    /**
     * Setup integrations with existing systems
     */
    setupIntegrations() {
        this.integrateWithAgendaFlow();
        this.integrateWithActions();
        this.integrateWithFiles();
        this.setupPeriodicSync();
    }
    
    /**
     * Integrate with AgendaFlow system
     */
    integrateWithAgendaFlow() {
        if (!window.agendaFlow) return;
        
        // Store original methods
        const originalAddAgenda = window.agendaFlow.addNewAgendaPoint;
        const originalSelectAgenda = window.agendaFlow.selectAgendaItem;
        
        // Override addNewAgendaPoint to dispatch events
        window.agendaFlow.addNewAgendaPoint = function(...args) {
            const result = originalAddAgenda.apply(this, args);
            
            // Dispatch agenda change event
            window.dispatchEvent(new CustomEvent('meenoeAgendaChanged', {
                detail: {
                    action: 'added',
                    count: this.state.agendaItems.size,
                    agendaItems: this.state.agendaItems
                }
            }));
            
            return result;
        };
        
        // Override agenda item deletion (we need to patch the click handler)
        this.patchAgendaDeleteHandler();
        
        console.log('🔗 Integrated with AgendaFlow');
    }
    
    /**
     * Patch agenda delete handler to dispatch events
     */
    patchAgendaDeleteHandler() {
        // We'll use a MutationObserver to watch for agenda item removals
        const agendaContainer = document.getElementById('all-agenda-points');
        if (!agendaContainer) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    // Check if removed nodes were agenda items
                    const removedAgendaItems = Array.from(mutation.removedNodes).filter(node => 
                        node.nodeType === Node.ELEMENT_NODE && node.dataset && node.dataset.agendaId
                    );
                    
                    if (removedAgendaItems.length > 0) {
                        // Dispatch agenda change event
                        setTimeout(() => {
                            const currentCount = window.agendaFlow ? window.agendaFlow.state.agendaItems.size : 0;
                            window.dispatchEvent(new CustomEvent('meenoeAgendaChanged', {
                                detail: {
                                    action: 'removed',
                                    count: currentCount,
                                    removedItems: removedAgendaItems.length
                                }
                            }));
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(agendaContainer, { childList: true });
    }
    
    /**
     * Integrate with Actions system
     */
    integrateWithActions() {
        if (!window.tree) return;
        
        // Store original createNode method
        const originalCreateNode = window.tree.createNode;
        
        // Override createNode to dispatch events
        window.tree.createNode = function(...args) {
            const result = originalCreateNode.apply(this, args);
            
            // Dispatch action change event
            setTimeout(() => {
                const actionCount = window.meenoeState ? window.meenoeState.countActionsInTree() : 0;
                window.dispatchEvent(new CustomEvent('meenoeActionsChanged', {
                    detail: {
                        action: 'added',
                        count: actionCount
                    }
                }));
            }, 100);
            
            return result;
        };
        
        // Store original removeNode method
        const originalRemoveNode = window.tree.removeNode;
        
        // Override removeNode to dispatch events
        window.tree.removeNode = function(...args) {
            const result = originalRemoveNode.apply(this, args);
            
            // Dispatch action change event
            setTimeout(() => {
                const actionCount = window.meenoeState ? window.meenoeState.countActionsInTree() : 0;
                window.dispatchEvent(new CustomEvent('meenoeActionsChanged', {
                    detail: {
                        action: 'removed',
                        count: actionCount
                    }
                }));
            }, 100);
            
            return result;
        };
        
        console.log('🔗 Integrated with Actions system');
    }
    
    /**
     * Integrate with file upload systems
     */
    integrateWithFiles() {
        if (!window.agendaFlow) return;

        // Store original handleFileUpload method
        const originalHandleFileUpload = window.agendaFlow.handleFileUpload;

        // Override handleFileUpload to dispatch events
        window.agendaFlow.handleFileUpload = function(files) {
            const result = originalHandleFileUpload.apply(this, arguments);

            // Dispatch file change event
            setTimeout(() => {
                const totalFiles = window.meenoeState ? window.meenoeState.countTotalFiles() : 0;
                window.dispatchEvent(new CustomEvent('meenoeFilesChanged', {
                    detail: {
                        action: 'added',
                        totalFiles: totalFiles,
                        addedFiles: files.length
                    }
                }));
            }, 100);

            return result;
        };

        // Store original removeFile method
        const originalRemoveFile = window.agendaFlow.removeFile;

        // Override removeFile to dispatch events
        window.agendaFlow.removeFile = function(agendaId, fileName) {
            const result = originalRemoveFile.apply(this, arguments);

            // Dispatch file change event
            setTimeout(() => {
                const totalFiles = window.meenoeState ? window.meenoeState.countTotalFiles() : 0;
                window.dispatchEvent(new CustomEvent('meenoeFilesChanged', {
                    detail: {
                        action: 'removed',
                        totalFiles: totalFiles,
                        removedFile: fileName,
                        agendaId: agendaId
                    }
                }));
            }, 100);

            return result;
        };

        console.log('🔗 Integrated with file upload and removal system');
    }
    
    /**
     * Setup periodic sync to catch any missed updates
     */
    setupPeriodicSync() {
        // Sync every 5 seconds to catch any missed updates
        this.syncInterval = setInterval(() => {
            if (window.meenoeState) {
                window.meenoeState.refreshAllCounters();
            }
        }, 5000);
        
        console.log('🔄 Periodic sync enabled');
    }
    
    /**
     * Manual sync trigger
     */
    syncNow() {
        if (window.meenoeState) {
            window.meenoeState.refreshAllCounters();
            console.log('🔄 Manual sync completed');
        }
    }
    
    /**
     * Restore original methods (for cleanup)
     */
    restoreOriginalMethods() {
        // Restore AgendaFlow methods
        if (window.agendaFlow && this.originalMethods.has('addNewAgendaPoint')) {
            window.agendaFlow.addNewAgendaPoint = this.originalMethods.get('addNewAgendaPoint');
        }
        
        // Restore tree methods
        if (window.tree) {
            if (this.originalMethods.has('createNode')) {
                window.tree.createNode = this.originalMethods.get('createNode');
            }
            if (this.originalMethods.has('removeNode')) {
                window.tree.removeNode = this.originalMethods.get('removeNode');
            }
        }
        
        console.log('🔄 Original methods restored');
    }
    
    /**
     * Cleanup function
     */
    cleanup() {
        // Clear periodic sync
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        
        // Restore original methods
        this.restoreOriginalMethods();
        
        console.log('🧹 Meenoe Integrations cleaned up');
    }
}

// Create global instance
window.meenoeIntegrations = new MeenoeIntegrations();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeenoeIntegrations;
}

/**
 * Meenoe State Management System
 * Centralized state management for tracking all meenoe data with real-time updates
 */

class MeenoeState {
    constructor() {
        this.state = {
            // Basic meenoe information
            name: 'Name Your Meenoe Here',
            objective: 'Enter your Meenoe objective or an introduction here',
            status: 'Live',
            
            // Counters for at-a-glance cards
            counters: {
                users: 0,
                agendaPoints: 0,
                files: 0,
                actions: 0
            },
            
            // Detailed data
            users: new Set(),
            agendaPoints: new Map(),
            files: new Map(),
            actions: new Map(),
            
            // Event listeners for state changes
            listeners: new Map()
        };
        
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Meenoe State Management...');
        
        // Listen for existing system events
        this.setupEventListeners();
        
        // Initialize counters from existing data
        this.syncWithExistingSystems();
        
        this.isInitialized = true;
        console.log('✅ Meenoe State Management initialized');
    }
    
    /**
     * Setup event listeners for existing systems
     */
    setupEventListeners() {
        // Listen for user changes from people-modal.js
        window.addEventListener('meenoeUsersChanged', (event) => {
            this.updateUserCount(event.detail);
        });
        
        // Listen for agenda changes (we'll dispatch these from agendaflow.js)
        window.addEventListener('meenoeAgendaChanged', (event) => {
            this.updateAgendaCount(event.detail);
        });
        
        // Listen for file changes
        window.addEventListener('meenoeFilesChanged', (event) => {
            this.updateFileCount(event.detail);
        });
        
        // Listen for action changes
        window.addEventListener('meenoeActionsChanged', (event) => {
            this.updateActionCount(event.detail);
        });
    }
    
    /**
     * Sync with existing systems to get current counts
     */
    syncWithExistingSystems() {
        // Sync users from existing meenoeUsers global
        if (window.meenoeUsers) {
            const userCount = window.meenoeUsers.getSelectedPeople().length;
            this.state.counters.users = userCount;
        }
        
        // Sync agenda points from agendaFlow
        if (window.agendaFlow && window.agendaFlow.state.agendaItems) {
            this.state.counters.agendaPoints = window.agendaFlow.state.agendaItems.size;
        }
        
        // Sync actions from tree
        if (window.tree) {
            this.state.counters.actions = this.countActionsInTree();
        }
        
        // Sync files from agenda points
        this.state.counters.files = this.countTotalFiles();
        
        // Update UI with current counts
        this.updateAllCounters();
    }
    
    /**
     * Count total actions in the tree
     */
    countActionsInTree() {
        if (!window.tree || !window.tree.childNodes) return 0;
        
        let count = 0;
        const countNodes = (nodes) => {
            for (const node of nodes) {
                count++;
                if (node.childNodes && node.childNodes.length > 0) {
                    countNodes(node.childNodes);
                }
            }
        };
        
        countNodes(window.tree.childNodes);
        return count;
    }
    
    /**
     * Count total files across all agenda points
     */
    countTotalFiles() {
        if (!window.agendaFlow || !window.agendaFlow.state.agendaItems) return 0;
        
        let totalFiles = 0;
        for (const agendaItem of window.agendaFlow.state.agendaItems.values()) {
            if (agendaItem.files && Array.isArray(agendaItem.files)) {
                totalFiles += agendaItem.files.length;
            }
        }
        return totalFiles;
    }
    
    /**
     * Update user count
     */
    updateUserCount(detail) {
        const newCount = (detail.selectedUsers?.length || 0) + (detail.invitedGuests?.length || 0);
        this.state.counters.users = newCount;
        this.updateCounter('users', newCount);
        this.notifyListeners('userCountChanged', { count: newCount, detail });
    }
    
    /**
     * Update agenda count
     */
    updateAgendaCount(detail) {
        const newCount = detail.count || 0;
        this.state.counters.agendaPoints = newCount;
        this.updateCounter('agenda', newCount);
        this.notifyListeners('agendaCountChanged', { count: newCount, detail });
    }
    
    /**
     * Update file count
     */
    updateFileCount(detail) {
        const newCount = detail.totalFiles || this.countTotalFiles();
        this.state.counters.files = newCount;
        this.updateCounter('files', newCount);
        this.notifyListeners('fileCountChanged', { count: newCount, detail });
    }
    
    /**
     * Update action count
     */
    updateActionCount(detail) {
        const newCount = detail.count || this.countActionsInTree();
        this.state.counters.actions = newCount;
        this.updateCounter('actions', newCount);
        this.notifyListeners('actionCountChanged', { count: newCount, detail });
    }
    
    /**
     * Update a specific counter in the UI
     */
    updateCounter(type, count) {
        const elementId = `${type}-count`;
        const element = document.getElementById(elementId);
        if (element) {
            // Add animation effect
            element.style.transform = 'scale(1.1)';
            element.textContent = count;
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    /**
     * Update all counters in the UI
     */
    updateAllCounters() {
        this.updateCounter('users', this.state.counters.users);
        this.updateCounter('agenda', this.state.counters.agendaPoints);
        this.updateCounter('files', this.state.counters.files);
        this.updateCounter('actions', this.state.counters.actions);
    }
    
    /**
     * Force refresh all counters from current state
     */
    refreshAllCounters() {
        this.syncWithExistingSystems();
    }
    
    /**
     * Add event listener for state changes
     */
    addEventListener(event, callback) {
        if (!this.state.listeners.has(event)) {
            this.state.listeners.set(event, []);
        }
        this.state.listeners.get(event).push(callback);
    }
    
    /**
     * Remove event listener
     */
    removeEventListener(event, callback) {
        if (this.state.listeners.has(event)) {
            const listeners = this.state.listeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    /**
     * Notify all listeners of a state change
     */
    notifyListeners(event, data) {
        if (this.state.listeners.has(event)) {
            this.state.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }
    
    /**
     * Get current state (deep = true for full agenda/action details)
     */
    getState(deep = false) {
        if (!deep) return { ...this.state };

        // Build deep agenda points
        const agendaPoints = [];
        if (window.agendaFlow && window.agendaFlow.state.agendaItems) {
            for (const [id, item] of window.agendaFlow.state.agendaItems) {
                agendaPoints.push({
                    id,
                    title: item.title,
                    description: item.description,
                    urgency: item.urgency,
                    files: (item.files || []).map(f => ({
                        name: f.name,
                        size: f.size
                    })),
                    fileCount: (item.files || []).length,
                    audioClips: (item.audioClips || []).map(a => ({
                        name: a.name,
                        duration: a.duration
                    })),
                    audioCount: (item.audioClips || []).length,
                    threads: (item.threads || []).map(t => ({
                        author: t.author,
                        created: t.created,
                        summary: t.content ? t.content.slice(0, 100) : ''
                    })),
                    threadCount: (item.threads || []).length
                });
            }
        }

        // Build deep actions
        const actions = [];
        if (window.tree && window.tree.childNodes) {
            const walk = nodes => {
                for (const node of nodes) {
                    actions.push({
                        id: node.id,
                        title: node.actionTitle,
                        description: node.actionDescription,
                        status: node.actionStatus,
                        files: (node.files || []).map(f => ({
                            name: f.name,
                            size: f.size
                        })),
                        fileCount: (node.files || []).length
                        // Add more as needed
                    });
                    if (node.childNodes && node.childNodes.length > 0) walk(node.childNodes);
                }
            };
            walk(window.tree.childNodes);
        }

        return {
            ...this.state,
            agendaPoints,
            actions
        };
    }
    
    /**
     * Get specific counter value
     */
    getCounter(type) {
        return this.state.counters[type] || 0;
    }
    
    /**
     * Update meenoe name
     */
    updateName(newName) {
        this.state.name = newName;
        this.notifyListeners('nameChanged', { name: newName });
    }
    
    /**
     * Update meenoe objective
     */
    updateObjective(newObjective) {
        this.state.objective = newObjective;
        this.notifyListeners('objectiveChanged', { objective: newObjective });
    }
    
    /**
     * Sync the order of agendaPoints Map to match agendaFlow's agendaItems order
     */
    updateAgendaOrderFromAgendaFlow() {
        if (
            window.agendaFlow &&
            window.agendaFlow.state &&
            window.agendaFlow.state.agendaItems &&
            this.state.agendaPoints
        ) {
            // Create a new Map with the same order as agendaFlow.state.agendaItems
            const newOrder = new Map();
            for (const [id, item] of window.agendaFlow.state.agendaItems.entries()) {
                if (this.state.agendaPoints.has(id)) {
                    newOrder.set(id, this.state.agendaPoints.get(id));
                } else {
                    // If not present, add a minimal stub (optional, or skip)
                    newOrder.set(id, item);
                }
            }
            this.state.agendaPoints = newOrder;
            // Optionally, notify listeners or update counters/UI
            this.updateAgendaCount({ count: this.state.agendaPoints.size });
        }
    }

    /**
     * Cleanup function
     */
    cleanup() {
        this.state.listeners.clear();
        console.log('🧹 Meenoe State Management cleaned up');
    }
}

// Create global instance
window.meenoeState = new MeenoeState();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeenoeState;
}

/**
 * At-A-Glance Cards Manager
 * Manages the real-time updating cards showing meenoe statistics
 */

class AtAGlanceCards {
    constructor() {
        this.isInitialized = false;
        this.cardElements = {};
        this.animationTimeouts = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing At-A-Glance Cards...');
        
        // Cache card elements
        this.cacheElements();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup click handlers for cards
        this.setupCardClickHandlers();
        
        this.isInitialized = true;
        console.log('✅ At-A-Glance Cards initialized');
    }
    
    /**
     * Cache card elements for performance
     */
    cacheElements() {
        this.cardElements = {
            users: document.getElementById('users-count'),
            agenda: document.getElementById('agenda-count'),
            files: document.getElementById('files-count'),
            actions: document.getElementById('actions-count')
        };
        
        // Cache parent cards for click handling
        this.cardContainers = {
            users: this.cardElements.users?.closest('.card'),
            agenda: this.cardElements.agenda?.closest('.card'),
            files: this.cardElements.files?.closest('.card'),
            actions: this.cardElements.actions?.closest('.card')
        };
    }
    
    /**
     * Setup event listeners for state changes
     */
    setupEventListeners() {
        // Listen for state changes from meenoeState
        if (window.meenoeState) {
            window.meenoeState.addEventListener('userCountChanged', (data) => {
                this.updateCard('users', data.count);
            });
            
            window.meenoeState.addEventListener('agendaCountChanged', (data) => {
                this.updateCard('agenda', data.count);
            });
            
            window.meenoeState.addEventListener('fileCountChanged', (data) => {
                this.updateCard('files', data.count);
            });
            
            window.meenoeState.addEventListener('actionCountChanged', (data) => {
                this.updateCard('actions', data.count);
            });
        }
        
        // Listen for direct events as backup
        window.addEventListener('meenoeUsersChanged', (event) => {
            const count = (event.detail.selectedUsers?.length || 0) + (event.detail.invitedGuests?.length || 0);
            this.updateCard('users', count);
        });
        
        window.addEventListener('meenoeAgendaChanged', (event) => {
            this.updateCard('agenda', event.detail.count || 0);
        });
        
        window.addEventListener('meenoeFilesChanged', (event) => {
            this.updateCard('files', event.detail.totalFiles || 0);
        });
        
        window.addEventListener('meenoeActionsChanged', (event) => {
            this.updateCard('actions', event.detail.count || 0);
        });
    }
    
    /**
     * Setup click handlers for cards to navigate to relevant tabs
     */
    setupCardClickHandlers() {
        // Users card - open add user modal
        if (this.cardContainers.users) {
            this.cardContainers.users.addEventListener('click', () => {
                const addUserButton = document.getElementById('addUserButton');
                if (addUserButton) {
                    addUserButton.click();
                }
            });
            this.cardContainers.users.style.cursor = 'pointer';
            this.cardContainers.users.title = 'Click to add users';
        }
        
        // Agenda card - switch to Flow tab
        if (this.cardContainers.agenda) {
            this.cardContainers.agenda.addEventListener('click', () => {
                const flowTab = document.getElementById('flow-tab');
                if (flowTab) {
                    flowTab.click();
                }
            });
            this.cardContainers.agenda.style.cursor = 'pointer';
            this.cardContainers.agenda.title = 'Click to view agenda points';
        }
        
        // Files card - open files offcanvas
        if (this.cardContainers.files) {
            this.cardContainers.files.addEventListener('click', () => {
                const viewFilesButton = document.getElementById('agenda-view-files');
                if (viewFilesButton) {
                    viewFilesButton.click();
                }
            });
            this.cardContainers.files.style.cursor = 'pointer';
            this.cardContainers.files.title = 'Click to view files';
        }
        
        // Actions card - switch to Actions tab
        if (this.cardContainers.actions) {
            this.cardContainers.actions.addEventListener('click', () => {
                const actionsTab = document.getElementById('actions-tab');
                if (actionsTab) {
                    actionsTab.click();
                }
            });
            this.cardContainers.actions.style.cursor = 'pointer';
            this.cardContainers.actions.title = 'Click to view actions';
        }
    }
    
    /**
     * Update a specific card with animation
     */
    updateCard(type, count) {
        const element = this.cardElements[type];
        if (!element) return;
        
        const oldCount = parseInt(element.textContent) || 0;
        const newCount = parseInt(count) || 0;
        
        // Clear any existing animation timeout
        if (this.animationTimeouts.has(type)) {
            clearTimeout(this.animationTimeouts.get(type));
        }
        
        // Add animation class
        element.classList.add('updating');
        
        // Animate the change
        if (newCount !== oldCount) {
            this.animateCountChange(element, oldCount, newCount);
        }
        
        // Add visual feedback based on change
        const container = this.cardContainers[type];
        if (container && newCount !== oldCount) {
            if (newCount > oldCount) {
                this.showChangeIndicator(container, 'increase');
            } else if (newCount < oldCount) {
                this.showChangeIndicator(container, 'decrease');
            }
        }
        
        // Remove animation class after animation
        const timeout = setTimeout(() => {
            element.classList.remove('updating');
            this.animationTimeouts.delete(type);
        }, 500);
        
        this.animationTimeouts.set(type, timeout);
    }
    
    /**
     * Animate count change with smooth transition
     */
    animateCountChange(element, fromCount, toCount) {
        const duration = 300;
        const steps = 20;
        const stepDuration = duration / steps;
        const increment = (toCount - fromCount) / steps;
        
        let currentStep = 0;
        
        const animate = () => {
            currentStep++;
            const currentCount = Math.round(fromCount + (increment * currentStep));
            element.textContent = currentCount;
            
            if (currentStep < steps) {
                setTimeout(animate, stepDuration);
            } else {
                element.textContent = toCount;
            }
        };
        
        animate();
    }
    
    /**
     * Show visual indicator for increase/decrease
     */
    showChangeIndicator(container, type) {
        // Remove any existing indicators
        const existingIndicator = container.querySelector('.change-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = `change-indicator ${type}`;
        indicator.innerHTML = type === 'increase' ? 
            '<i class="ti ti-trending-up"></i>' : 
            '<i class="ti ti-trending-down"></i>';
        
        // Style the indicator
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: ${type === 'increase' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            z-index: 10;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        container.style.position = 'relative';
        container.appendChild(indicator);
        
        // Remove indicator after animation
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 2000);
    }
    
    /**
     * Refresh all cards from current state
     */
    refreshAllCards() {
        if (window.meenoeState) {
            const state = window.meenoeState.getState();
            this.updateCard('users', state.counters.users);
            this.updateCard('agenda', state.counters.agendaPoints);
            this.updateCard('files', state.counters.files);
            this.updateCard('actions', state.counters.actions);
        }
    }
    
    /**
     * Reinitialize for dynamic content
     */
    reinitialize() {
        this.cacheElements();
        this.setupCardClickHandlers();
        this.refreshAllCards();
    }
    
    /**
     * Cleanup function
     */
    cleanup() {
        // Clear all animation timeouts
        this.animationTimeouts.forEach(timeout => clearTimeout(timeout));
        this.animationTimeouts.clear();
        
        // Remove change indicators
        Object.values(this.cardContainers).forEach(container => {
            if (container) {
                const indicator = container.querySelector('.change-indicator');
                if (indicator) {
                    indicator.remove();
                }
            }
        });
        
        console.log('🧹 At-A-Glance Cards cleaned up');
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
}

.updating {
    animation: pulse 0.3s ease-in-out;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}
`;
document.head.appendChild(style);

// Create global instance
window.atAGlanceCards = new AtAGlanceCards();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtAGlanceCards;
}

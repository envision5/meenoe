/**
 * Meenoe Details Tab Functionality
 * Handles interactive editing of meenoe name, objective, and other details
 */

class MeenoeDetails {
    constructor() {
        this.isInitialized = false;
        this.editingStates = {
            name: false,
            objective: false
        };
        
        this.init();
    }
    
    init() {
        console.log('🔄 Initializing Meenoe Details functionality...');
        
        // Setup event delegation for dynamic content
        this.setupEventDelegation();
        
        // Initialize existing elements if they exist
        this.initializeElements();
        
        this.isInitialized = true;
        console.log('✅ Meenoe Details functionality initialized');
    }
    
    /**
     * Setup event delegation for all meenoe details interactions
     */
    setupEventDelegation() {
        // Use event delegation on document for dynamic content
        document.addEventListener('click', (e) => {
            // Handle edit meenoe name button
            if (e.target.closest('#edit-meenoe-name')) {
                e.preventDefault();
                this.toggleNameEdit();
                return;
            }

            // Handle edit objective button
            if (e.target.closest('#edit-objective')) {
                e.preventDefault();
                this.toggleObjectiveEdit();
                return;
            }

            // Handle clicks outside editable elements to save
            if (this.editingStates.name || this.editingStates.objective) {
                const nameElement = document.getElementById('meenoe-name');
                const objectiveElement = document.getElementById('objective-text');

                // Check if click is outside the editing elements
                if (nameElement && this.editingStates.name &&
                    !nameElement.contains(e.target) &&
                    !e.target.closest('#edit-meenoe-name')) {
                    this.saveNameEdit();
                }

                if (objectiveElement && this.editingStates.objective &&
                    !objectiveElement.contains(e.target) &&
                    !e.target.closest('#edit-objective')) {
                    this.saveObjectiveEdit();
                }
            }
        });

        // Setup real-time sync for header input
        this.setupHeaderInputSync();

        // Handle keyboard events
        document.addEventListener('keydown', (e) => {
            // Save on Enter key
            if (e.key === 'Enter') {
                if (this.editingStates.name && e.target.closest('#meenoe-name')) {
                    e.preventDefault();
                    this.saveNameEdit();
                    return;
                }
                
                if (this.editingStates.objective && e.target.closest('#objective-text')) {
                    e.preventDefault();
                    this.saveObjectiveEdit();
                    return;
                }
            }
            
            // Cancel on Escape key
            if (e.key === 'Escape') {
                if (this.editingStates.name) {
                    this.cancelNameEdit();
                }
                if (this.editingStates.objective) {
                    this.cancelObjectiveEdit();
                }
            }
        });
    }
    
    /**
     * Initialize existing elements
     */
    initializeElements() {
        // Set initial values from state if available
        if (window.meenoeState) {
            const nameElement = document.getElementById('meenoe-name');
            const objectiveElement = document.getElementById('objective-text');

            if (nameElement && window.meenoeState.state.name) {
                nameElement.textContent = window.meenoeState.state.name;
            }

            if (objectiveElement && window.meenoeState.state.objective) {
                objectiveElement.textContent = window.meenoeState.state.objective;
            }
        }

        // Sync initial values between name elements
        this.syncNameElements();
    }

    /**
     * Setup real-time sync for header input field
     */
    setupHeaderInputSync() {
        // Use event delegation for the header input
        document.addEventListener('input', (e) => {
            // Check if the input is in the meenoe-name2 container
            if (e.target.closest('#meenoe-name2') && e.target.tagName === 'INPUT') {
                this.syncFromHeaderInput(e.target.value);
            }
        });

        // Also listen for contenteditable changes on meenoe-name
        document.addEventListener('input', (e) => {
            if (e.target.id === 'meenoe-name' && e.target.contentEditable === 'true') {
                this.syncFromDetailsName(e.target.textContent);
            }
        });
    }

    /**
     * Sync name from header input to details name
     */
    syncFromHeaderInput(value) {
        const nameElement = document.getElementById('meenoe-name');
        if (nameElement && !this.editingStates.name) {
            nameElement.textContent = value || 'Name Your Meenoe Here';

            // Add visual feedback
            this.addSyncFeedback(nameElement);

            // Update state
            if (window.meenoeState) {
                window.meenoeState.updateName(value || 'Name Your Meenoe Here');
            }
        }
    }

    /**
     * Sync name from details name to header input
     */
    syncFromDetailsName(value) {
        const headerContainer = document.getElementById('meenoe-name2');
        const headerInput = headerContainer?.querySelector('input');
        if (headerInput) {
            headerInput.value = value || 'Name Your Meenoe Here';

            // Add visual feedback
            this.addSyncFeedback(headerInput);

            // Update state
            if (window.meenoeState) {
                window.meenoeState.updateName(value || 'Name Your Meenoe Here');
            }
        }
    }

    /**
     * Sync both name elements to ensure they match
     */
    syncNameElements() {
        const nameElement = document.getElementById('meenoe-name');
        const headerContainer = document.getElementById('meenoe-name2');
        const headerInput = headerContainer?.querySelector('input');

        if (nameElement && headerInput) {
            // Use the header input value as the source of truth if it has content
            const headerValue = headerInput.value.trim();
            const detailsValue = nameElement.textContent.trim();

            if (headerValue && headerValue !== 'Q4 Budget Review') {
                nameElement.textContent = headerValue;
            } else if (detailsValue && detailsValue !== 'Name Your Meenoe Here') {
                headerInput.value = detailsValue;
            }
        }
    }
    
    /**
     * Toggle name editing mode
     */
    toggleNameEdit() {
        const nameElement = document.getElementById('meenoe-name');
        const editButton = document.getElementById('edit-meenoe-name');
        
        if (!nameElement || !editButton) return;
        
        if (this.editingStates.name) {
            this.saveNameEdit();
        } else {
            this.startNameEdit();
        }
    }
    
    /**
     * Start editing the meenoe name
     */
    startNameEdit() {
        const nameElement = document.getElementById('meenoe-name');
        const editButton = document.getElementById('edit-meenoe-name');
        
        if (!nameElement || !editButton) return;
        
        // Store original value
        this.originalName = nameElement.textContent;
        
        // Make element editable
        nameElement.contentEditable = true;
        nameElement.focus();
        nameElement.classList.add('editing');
        
        // Update button
        editButton.innerHTML = '<i class="ti ti-check me-2"></i>Save Title';
        editButton.classList.remove('btn-gradient');
        editButton.classList.add('btn-success');
        
        // Select all text
        this.selectAllText(nameElement);
        
        this.editingStates.name = true;
    }
    
    /**
     * Save name edit
     */
    saveNameEdit() {
        const nameElement = document.getElementById('meenoe-name');
        const editButton = document.getElementById('edit-meenoe-name');

        if (!nameElement || !editButton) return;

        // Get new value and clean it
        const newName = nameElement.textContent.trim();

        // Validate
        if (!newName || newName.length === 0) {
            nameElement.textContent = this.originalName || 'Name Your Meenoe Here';
        } else {
            // Update state
            if (window.meenoeState) {
                window.meenoeState.updateName(newName);
            }

            // Sync to header input
            this.syncFromDetailsName(newName);
        }

        // Reset editing state
        nameElement.contentEditable = false;
        nameElement.classList.remove('editing');
        nameElement.blur();

        // Reset button
        editButton.innerHTML = '<i class="ti ti-edit me-2"></i>Edit Meenoe Title';
        editButton.classList.remove('btn-success');
        editButton.classList.add('btn-gradient');

        this.editingStates.name = false;
    }
    
    /**
     * Cancel name edit
     */
    cancelNameEdit() {
        const nameElement = document.getElementById('meenoe-name');
        const editButton = document.getElementById('edit-meenoe-name');

        if (!nameElement || !editButton) return;

        // Restore original value
        const restoredName = this.originalName || 'Name Your Meenoe Here';
        nameElement.textContent = restoredName;

        // Sync to header input
        this.syncFromDetailsName(restoredName);

        // Reset editing state
        nameElement.contentEditable = false;
        nameElement.classList.remove('editing');
        nameElement.blur();

        // Reset button
        editButton.innerHTML = '<i class="ti ti-edit me-2"></i>Edit Meenoe Title';
        editButton.classList.remove('btn-success');
        editButton.classList.add('btn-gradient');

        this.editingStates.name = false;
    }
    
    /**
     * Toggle objective editing mode
     */
    toggleObjectiveEdit() {
        const objectiveElement = document.getElementById('objective-text');
        const editButton = document.getElementById('edit-objective');
        
        if (!objectiveElement || !editButton) return;
        
        if (this.editingStates.objective) {
            this.saveObjectiveEdit();
        } else {
            this.startObjectiveEdit();
        }
    }
    
    /**
     * Start editing the objective
     */
    startObjectiveEdit() {
        const objectiveElement = document.getElementById('objective-text');
        const editButton = document.getElementById('edit-objective');
        
        if (!objectiveElement || !editButton) return;
        
        // Store original value
        this.originalObjective = objectiveElement.textContent;
        
        // Make element editable
        objectiveElement.contentEditable = true;
        objectiveElement.focus();
        objectiveElement.classList.add('editing');
        
        // Update button
        editButton.innerHTML = '<i class="ti ti-check me-2"></i>';
        editButton.classList.add('text-success');
        
        // Select all text
        this.selectAllText(objectiveElement);
        
        this.editingStates.objective = true;
    }
    
    /**
     * Save objective edit
     */
    saveObjectiveEdit() {
        const objectiveElement = document.getElementById('objective-text');
        const editButton = document.getElementById('edit-objective');
        
        if (!objectiveElement || !editButton) return;
        
        // Get new value and clean it
        const newObjective = objectiveElement.textContent.trim();
        
        // Validate
        if (!newObjective || newObjective.length === 0) {
            objectiveElement.textContent = this.originalObjective || 'Enter your Meenoe objective or an introduction here';
        } else {
            // Update state
            if (window.meenoeState) {
                window.meenoeState.updateObjective(newObjective);
            }
        }
        
        // Reset editing state
        objectiveElement.contentEditable = false;
        objectiveElement.classList.remove('editing');
        objectiveElement.blur();
        
        // Reset button
        editButton.innerHTML = '<i class="ti ti-edit me-2"></i>';
        editButton.classList.remove('text-success');
        
        this.editingStates.objective = false;
    }
    
    /**
     * Cancel objective edit
     */
    cancelObjectiveEdit() {
        const objectiveElement = document.getElementById('objective-text');
        const editButton = document.getElementById('edit-objective');
        
        if (!objectiveElement || !editButton) return;
        
        // Restore original value
        objectiveElement.textContent = this.originalObjective || 'Enter your Meenoe objective or an introduction here';
        
        // Reset editing state
        objectiveElement.contentEditable = false;
        objectiveElement.classList.remove('editing');
        objectiveElement.blur();
        
        // Reset button
        editButton.innerHTML = '<i class="ti ti-edit me-2"></i>';
        editButton.classList.remove('text-success');
        
        this.editingStates.objective = false;
    }
    
    /**
     * Select all text in an element
     */
    selectAllText(element) {
        if (window.getSelection && document.createRange) {
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    /**
     * Add visual feedback when syncing occurs
     */
    addSyncFeedback(element) {
        if (!element) return;

        // Add sync animation class
        element.classList.add('name-syncing');

        // Remove class after animation
        setTimeout(() => {
            element.classList.remove('name-syncing');
        }, 500);
    }
    
    /**
     * Reinitialize for dynamic content
     */
    reinitialize() {
        this.initializeElements();
        // Ensure both name elements are synced
        setTimeout(() => {
            this.syncNameElements();
        }, 100);
    }
    
    /**
     * Cleanup function
     */
    cleanup() {
        // Reset any editing states
        if (this.editingStates.name) {
            this.cancelNameEdit();
        }
        if (this.editingStates.objective) {
            this.cancelObjectiveEdit();
        }
        
        console.log('🧹 Meenoe Details cleaned up');
    }
}

// Create global instance
window.meenoeDetails = new MeenoeDetails();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeenoeDetails;
}

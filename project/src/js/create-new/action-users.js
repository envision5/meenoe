/**
 * Action Users Management
 * Handles user assignment to actions with permissions
 *
 * REFACTORED FOR EVENT DELEGATION:
 * - Uses event delegation for all user interactions to support dynamically loaded content
 * - All event listeners are attached to document and use event delegation patterns
 * - Compatible with Vite's dynamic content loading and hot module replacement
 * - No direct element references that could break with dynamic content
 * - Supports reinitializing when new content is loaded
 */

window.ActionUsers = {
    currentActionId: null,
    actionUsersModal: null,
    pendingActionId: null,
    
    // Permission definitions
    PERMISSIONS: {
        MEENOE_USER: {
            ADMIN: { value: 'admin', label: 'Admin', description: 'Can edit action and manage all users' },
            CONTRIBUTOR: { value: 'contributor', label: 'Contributor', description: 'Can update progress and add comments' },
            VIEWER: { value: 'viewer', label: 'Viewer', description: 'Can view action details only' },
            EXCLUDED: { value: 'excluded', label: 'Excluded', description: 'Cannot see this action' }
        },
        GUEST: {
            CONTRIBUTOR: { value: 'contributor', label: 'Contributor', description: 'Can update progress and add comments' },
            VIEWER: { value: 'viewer', label: 'Viewer', description: 'Can view action details only' },
            EXCLUDED: { value: 'excluded', label: 'Excluded', description: 'Cannot see this action' }
        }
    },
      init: function() {
        this.setupEventListeners();
        if (typeof window.ActionUsers.initializePermissionTooltips === 'function') {
            window.ActionUsers.initializePermissionTooltips();
        }
    },

    setupEventListeners: function() {
        // Use event delegation for all interactions to support dynamically added content
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        document.addEventListener('change', this.handleDocumentChange.bind(this));
        document.addEventListener('input', this.handleDocumentInput.bind(this));

        // Handle modal events using event delegation
        document.addEventListener('show.bs.modal', this.handleModalShow.bind(this));
        document.addEventListener('hidden.bs.modal', this.handleModalHidden.bind(this));
    },

    handleDocumentClick: function(e) {
        // Handle manage-action-users button clicks
        if (e.target.closest('.manage-action-users')) {
            e.preventDefault();
            this.openUserModal(e.target);
            return;
        }

        // Handle save button clicks
        if (e.target.closest('#saveActionUsersButton')) {
            e.preventDefault();
            this.saveActionUsers();
            return;
        }

        // Handle modal switching to add users modal
        if (e.target.matches('[data-bs-target="#addUserModal"]')) {
            const currentActionId = this.currentActionId;
            if (currentActionId) {
                this.pendingActionId = currentActionId;
            }
            return;
        }

        // Handle clicks on user avatars to show user info
        if (e.target.closest('.avatar-item[data-avatar]') && !e.target.closest('.manage-action-users')) {
            e.preventDefault();
            const avatarItem = e.target.closest('.avatar-item[data-avatar]');
            const userId = avatarItem.getAttribute('data-avatar');
            this.showUserTooltip(avatarItem, userId);
            return;
        }
    },

    handleDocumentChange: function(e) {
        // Handle permission changes
        if (e.target.classList.contains('user-permission-select')) {
            this.handlePermissionChange(e.target);
            return;
        }

        // Handle user checkbox changes to show/hide permission controls
        if (e.target.classList.contains('action-user-checkbox')) {
            this.handleUserSelectionChange(e.target);
            return;
        }
    },

    handleDocumentInput: function(e) {
        // Handle search input
        if (e.target.matches('#actionUserSearchInput')) {
            this.filterUsers(e.target.value);
            return;
        }
    },

    handleModalShow: function(e) {
        // Clear search when action users modal opens
        if (e.target && e.target.id === 'actionUsersModal') {
            const searchInput = document.getElementById('actionUserSearchInput');
            if (searchInput) {
                searchInput.value = '';
            }
        }
    },

    handleModalHidden: function(e) {
        // Handle returning to action users modal after adding users
        if (e.target && e.target.id === 'addUserModal') {
            // Check if we have a pending action and users were added
            if (this.pendingActionId && window.meenoeUsers && window.meenoeUsers.hasUsers()) {
                // Restore the current action ID and reopen the action users modal
                setTimeout(() => {
                    this.currentActionId = this.pendingActionId;
                    this.pendingActionId = null;

                    const actionUsersModal = document.getElementById('actionUsersModal');
                    if (actionUsersModal) {
                        this.populateUserList();
                        const modal = new bootstrap.Modal(actionUsersModal);
                        modal.show();
                    }
                }, 300); // Small delay to ensure smooth transition
            }
        }
    },
    
    openUserModal: function(clickedElement) {
        // Find the action card and get the action ID
        const actionCard = clickedElement.closest('.meenoe-action-card');
        if (!actionCard) return;

        this.currentActionId = actionCard.id;

        // Get modal element dynamically to support dynamic content
        const actionUsersModal = document.getElementById('actionUsersModal');
        if (!actionUsersModal) {
            return;
        }

        // Check if there are any users available
        if (!window.meenoeUsers || !window.meenoeUsers.hasUsers()) {
            this.showNoUsersMessage(actionUsersModal);
            return;
        }

        // Populate the modal with available users
        this.populateUserList();

        // Show the modal
        const modal = new bootstrap.Modal(actionUsersModal);
        modal.show();
    },

    showNoUsersMessage: function(modalElement) {
        const userList = document.getElementById('actionUserList');
        const noUsersMessage = document.getElementById('noUsersMessage');

        if (userList) userList.classList.add('d-none');
        if (noUsersMessage) noUsersMessage.classList.remove('d-none');

        const modal = new bootstrap.Modal(modalElement || document.getElementById('actionUsersModal'));
        modal.show();
    },
      populateUserList: function() {
        const userList = document.getElementById('actionUserList');
        const noUsersMessage = document.getElementById('noUsersMessage');
        
        if (!userList) return;
        
        // Show user list, hide no users message
        userList.classList.remove('d-none');
        if (noUsersMessage) noUsersMessage.classList.add('d-none');
          // Get current action and its assigned users
        const currentAction = this.getCurrentAction();
        const assignedUsers = currentAction ? (currentAction.actionUsers || []) : [];
        const assignedUserIds = assignedUsers.map(u => u.id);
        
        // Get all available users
        const availableUsers = window.meenoeUsers.getSelectedPeople();
        
        // Clear existing content
        userList.innerHTML = '';
        
        if (availableUsers.length === 0) {
            this.showNoUsersMessage();
            return;
        }
        
        // Create user cards
        availableUsers.forEach(user => {
            const isSelected = assignedUserIds.includes(user.id);
            // Find existing permission for this user
            const assignedUser = assignedUsers.find(au => au.id === user.id);
            const currentPermission = assignedUser ? assignedUser.permission : null;
            
            const userCard = this.createUserCard(user, isSelected, currentPermission);
            userList.appendChild(userCard);
        });
          // Initialize permission descriptions for selected users
        setTimeout(() => {
            const selectedCards = document.querySelectorAll('.action-user-card');
            selectedCards.forEach(card => {
                const checkbox = card.querySelector('.action-user-checkbox');
                const permissionSelect = card.querySelector('.user-permission-select');
                
                if (checkbox && checkbox.checked && permissionSelect) {
                    // Show permission controls
                    const permissionControls = card.querySelector('.permission-controls');
                    if (permissionControls) {
                        permissionControls.classList.remove('d-none');
                    }
                    
                    // Update permission description
                    this.updatePermissionDescription(permissionSelect);
                }
            });
        }, 100);
    },
      createUserCard: function(user, isSelected = false, currentPermission = null) {
        const col = document.createElement('div');
        col.className = 'col-md-6 mb-3';
        
        const placeholderAvatar = `<span class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; background-color: #e9ecef;">
                                    <i class="bi bi-person-fill" style="font-size: 24px; color: #adb5bd;"></i>
                                  </span>`;
        
        const userAvatar = user.img ? 
            `<img src="${user.img}" class="rounded-circle" alt="${user.name}" width="50" height="50">` : 
            placeholderAvatar;
            
        const isGuest = user.email && user.id && user.id.toString().startsWith('guest_');
        const guestBadge = isGuest ? 
            '<span class="badge bg-info-subtle text-info ms-2">Guest</span>' : '';
        
        const userTitle = user.title || (user.email && !user.title ? user.email : 'No title');
        
        // Get available permissions based on user type
        const availablePermissions = isGuest ? this.PERMISSIONS.GUEST : this.PERMISSIONS.MEENOE_USER;
          // Set default permission if not provided
        if (!currentPermission) {
            // Default permissions based on user type
            const isGuest = user.email && user.id && user.id.toString().startsWith('guest_');
            currentPermission = isGuest ? 'contributor' : 'admin';
        }
        
        // Create permission dropdown options
        const permissionOptions = Object.values(availablePermissions).map(perm => 
            `<option value="${perm.value}" ${currentPermission === perm.value ? 'selected' : ''}>${perm.label}</option>`
        ).join('');
        
        col.innerHTML = `
            <div class="action-user-card card h-100" data-user-id="${user.id}">
                <div class="card-body p-3">
                    <div class="d-flex align-items-center">
                        <div class="form-check me-3">
                            <input class="form-check-input action-user-checkbox" type="checkbox" 
                                   value="${user.id}" ${isSelected ? 'checked' : ''}>
                        </div>
                        <div class="me-3">
                            ${userAvatar}
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${user.name}${guestBadge}</h6>
                            <p class="text-muted small mb-2">${userTitle}</p>
                            
                            <!-- Permission Selection -->
                            <div class="permission-controls ${isSelected ? '' : 'd-none'}">
                                <div class="d-flex align-items-center">
                                    <label class="form-label small mb-0 me-2 text-muted">Permission:</label>
                                    <select class="form-select form-select-sm user-permission-select" data-user-id="${user.id}" style="width: auto;">
                                        ${permissionOptions}
                                    </select>
                                </div>
                                <div class="permission-description">
                                    <small class="text-muted permission-help"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
          return col;
    },
    
    filterUsers: function(searchTerm) {
        // Only filter within the action users modal to avoid affecting other content
        const actionUsersModal = document.getElementById('actionUsersModal');
        if (!actionUsersModal) return;

        const userCards = actionUsersModal.querySelectorAll('.action-user-card');
        const searchLower = searchTerm.toLowerCase();

        userCards.forEach(card => {
            if (!card || typeof card.closest !== 'function') return;
            const nameElement = card.querySelector('h6');
            const titleElement = card.querySelector('.text-muted');

            if (!nameElement || !titleElement) return;

            const name = nameElement.textContent.toLowerCase();
            const title = titleElement.textContent.toLowerCase();

            const cardContainer = card.closest('.col-md-6');
            if (cardContainer) {
                if (name.includes(searchLower) || title.includes(searchLower)) {
                    cardContainer.style.display = '';
                } else {
                    cardContainer.style.display = 'none';
                }
            }
        });
    },    saveActionUsers: function() {
        if (!this.currentActionId) return;

        // Get selected users with permissions from the modal
        const actionUsersModal = document.getElementById('actionUsersModal');
        if (!actionUsersModal) return;

        const selectedCheckboxes = actionUsersModal.querySelectorAll('.action-user-checkbox:checked');
        const selectedUserIds = Array.from(selectedCheckboxes).map(cb => cb.value);

        // Collect permissions for selected users
        const userPermissions = {};
        selectedCheckboxes.forEach(checkbox => {
            const userId = checkbox.value;
            const userCard = checkbox.closest('.action-user-card');
            const permissionSelect = userCard.querySelector('.user-permission-select');

            if (permissionSelect) {
                userPermissions[userId] = permissionSelect.value;
            }
        });

        // Get user objects and add permissions
        const availableUsers = window.meenoeUsers ? window.meenoeUsers.getSelectedPeople() : [];
        const selectedUsers = availableUsers.filter(user => selectedUserIds.includes(user.id.toString()))
            .map(user => ({
                ...user,
                permission: userPermissions[user.id] || 'viewer' // Default to viewer if no permission set
            }));


        // Update the action in the tree
        this.updateActionUsers(selectedUsers);

        // Update the UI
        this.updateActionUserUI(selectedUsers);

        // Close the modal
        const modal = bootstrap.Modal.getInstance(actionUsersModal);
        if (modal) {
            modal.hide();
        }
    },
      updateActionUsers: function(selectedUsers) {
        if (!window.tree || !this.currentActionId) return;
        
        // Find the action node in the tree
        const actionNode = window.tree.findNodeByID(this.currentActionId);
        if (actionNode) {
            actionNode.actionUsers = selectedUsers;
            // Trigger tree serialization to save state
            if (window.tree.serializeActions) {
                window.tree.serializeActions(window.tree);
            }
        }
    },    updateActionUserUI: function(selectedUsers) {
        const actionCard = document.getElementById(this.currentActionId);
        if (!actionCard) {
            return;
        }
        
        const avatarStack = actionCard.querySelector('.action-card-users');
        if (!avatarStack) {
            return;
        }
        
        // Check if users are available in the meeting
        const hasUsersAvailable = window.meenoeUsers && window.meenoeUsers.hasUsers();
        
        // Generate new avatar HTML
        let avatarHTML = '';
        
        if (!hasUsersAvailable) {
            // No users available in meeting - show disabled state
            avatarHTML = `<a href="javascript:void(0)" class="avatar-item manage-action-users disabled" title="Add users to meeting first">
                <div class="avatar bg-light border">
                    <i class="ti ti-user-plus text-muted fs-4"></i>
                </div>
            </a>`;
        } else {
            // Users are available in meeting
            if (selectedUsers && selectedUsers.length > 0) {
                // Show assigned users (up to 3)
                const displayUsers = selectedUsers.slice(0, 3);
                  displayUsers.forEach(user => {
                    const placeholderAvatar = `<div class="avatar">
                        <span class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center bg-light" style="width: 32px; height: 32px;">
                            <i class="bi bi-person-fill" style="font-size: 16px; color: #adb5bd;"></i>
                        </span>
                    </div>`;
                    
                    const userAvatar = user.img ? 
                        `<div class="avatar">
                            <img class="rounded-circle" src="${user.img}" alt="${user.name}" width="32" height="32">
                        </div>` : 
                        placeholderAvatar;
                    
                    // Create tooltip with permission info
                    const permissionLabel = this.getPermissionLabel(user.permission);
                    const isGuest = user.email && user.id && user.id.toString().startsWith('guest_');
                    const guestText = isGuest ? ' (Guest)' : '';
                    const tooltipText = `${user.name}${guestText} - ${permissionLabel}`;
                    
                    avatarHTML += `<a href="javascript:void(0)" class="avatar-item" data-avatar="${user.id}" title="${tooltipText}">
                        ${userAvatar}
                    </a>`;
                });
                
                // Show count if more than 3 users
                if (selectedUsers.length > 3) {
                    avatarHTML += `<a href="javascript:void(0)" class="avatar-item" title="${selectedUsers.length - 3} more">
                        <div class="avatar">
                            <span class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white" style="width: 32px; height: 32px; font-size: 12px;">
                                +${selectedUsers.length - 3}
                            </span>
                        </div>
                    </a>`;
                }
            }
            
            // Always show the manage button when users are available
            const actionStatus = this.getActionStatus();
            avatarHTML += `<a href="javascript:void(0)" class="avatar-item manage-action-users" title="Manage Users">
                <div class="avatar bg-${actionStatus}">
                    <i class="ti ti-dots text-white fs-4"></i>
                </div>
            </a>`;
        }
        avatarStack.innerHTML = avatarHTML;
    },
    
    showUserTooltip: function(element, userId) {
        // Find user in available users
        const availableUsers = window.meenoeUsers ? window.meenoeUsers.getSelectedPeople() : [];
        const user = availableUsers.find(u => u.id.toString() === userId.toString());
        
        if (!user) return;
        
        // Create and show a simple tooltip or modal with user info
        // For now, just show an alert - this could be enhanced with a proper tooltip
        const userInfo = `${user.name}\n${user.title || user.email || 'No additional info'}`;
    },
    
    getCurrentAction: function() {
        if (!window.tree || !this.currentActionId) return null;
        return window.tree.findNodeByID(this.currentActionId);
    },
    
    getActionStatus: function() {
        const action = this.getCurrentAction();
        if (!action) return 'warning';
        
        switch (action.actionStatus) {
            case 'open': return 'primary';
            case 'complete': return 'success';
            case 'queued': return 'dark';
            default: return 'warning';
        }
    },
      // Method to refresh all action user displays when meeting users change
    refreshAllActionUserDisplays: function() {
        if (!window.tree) {
            return;
        }
        
        // Find all action cards in the DOM
        const actionCards = document.querySelectorAll('.meenoe-action-card');
        
        const originalActionId = this.currentActionId; // Store original
        
        actionCards.forEach(actionCard => {
            const actionId = actionCard.id;
            const actionNode = window.tree.findNodeByID(actionId);
            
            if (actionNode) {
                // Set the current action ID before calling updateActionUserUI
                this.currentActionId = actionId;
                this.updateActionUserUI(actionNode.actionUsers || []);
            } else {
            }
        });
        
        this.currentActionId = originalActionId; // Restore original
    },
      // Method to update a specific action's user display
    updateSpecificActionDisplay: function(actionId) {
        if (!window.tree || !actionId) {
            return;
        }
        
        const actionNode = window.tree.findNodeByID(actionId);
        if (!actionNode) {
            return;
        }
        
        const previousActionId = this.currentActionId;
        this.currentActionId = actionId;
        this.updateActionUserUI(actionNode.actionUsers || []);
        this.currentActionId = previousActionId;
    },// Test function for debugging - can be removed in production
    debugInfo: function() {
        
        if (this.currentActionId && window.tree) {
            const action = window.tree.findNodeByID(this.currentActionId);
        }
        
        // Count all action cards and their user states
        const actionCards = document.querySelectorAll('.meenoe-action-card');
        
        actionCards.forEach((card, index) => {
            const userElements = card.querySelectorAll('.avatar-item');
            const hasManageButton = card.querySelector('.manage-action-users');
            const isDisabled = hasManageButton && hasManageButton.classList.contains('disabled');
        });
    },
    
    // Test function to force refresh all action displays
    forceRefresh: function() {
        this.refreshAllActionUserDisplays();
    },
    
    // Test function to debug the action users system
    testActionUsers: function() {
        // Check if tree exists
        if (!window.tree) {
            return;
        }
        
        // Find first action
        const firstAction = window.tree.childNodes && window.tree.childNodes[0];
        if (!firstAction) {
            if (window.tree.createNode) {
                const testAction = window.tree.createNode('Test Action for Users', false, null, null, null, 'context1');
                setTimeout(() => {
                    this.testActionUsers(); // Retry after action is created
                }, 500);
                return;
            } else {
                return;
            }
        }
        
        // Test updating this action
        this.currentActionId = firstAction.id;
        this.updateActionUserUI([]);
        
    },

    // Manual test function to debug the user refresh system
    testUserRefresh: function() {
        // Count existing action cards
        const actionCards = document.querySelectorAll('.meenoe-action-card');
        
        // Check each action card for user sections
        actionCards.forEach((card, index) => {
            const userSection = card.querySelector('.action-card-users');
            const hasManageButton = card.querySelector('.manage-action-users');
            const isDisabled = hasManageButton && hasManageButton.classList.contains('disabled');
        });
        
        // Simulate user change notification
        if (window.meenoeUsers && window.meenoeUsers.notifyUserChange) {
            window.meenoeUsers.notifyUserChange();
        } else {
        }
        
        // Force refresh as well
        this.refreshAllActionUserDisplays();
        
    },

    getPermissionLabel: function(permission) {
        // Search in both permission sets for the label
        const allPermissions = {
            ...this.PERMISSIONS.MEENOE_USER,
            ...this.PERMISSIONS.GUEST
        };
        
        const permissionObj = Object.values(allPermissions).find(p => p.value === permission);
        return permissionObj ? permissionObj.label : 'Unknown';
    },
    
    getPermissionColor: function(permission) {
        const colors = {
            'admin': 'danger',
            'contributor': 'success', 
            'viewer': 'primary',
            'excluded': 'secondary'
        };
        return colors[permission] || 'secondary';
    },
    
    // Testing and debugging methods
    testPermissionSystem: function() {
        // Test permission label retrieval
        
        // Test permission colors
    },
    
    // Comprehensive test function
    runPermissionSystemTest: function() {
        // Test 2: Helper functions
        ['admin', 'contributor', 'viewer', 'excluded'].forEach(perm => {
        });
        
        // Test 3: Mock user creation
        const mockMeenoeUser = {
            id: 'test1',
            name: 'John Doe',
            title: 'Manager',
            email: 'john@example.com'
        };
        
        const mockGuestUser = {
            id: 'guest_123',
            name: 'Jane Guest',
            email: 'jane@external.com'
        };
        
        return {
            permissionsLoaded: !!this.PERMISSIONS,
            modalFound: !!this.actionUsersModal,
            helpersWorking: this.getPermissionLabel('admin') === 'Admin',
            usersModuleAvailable: !!window.meenoeUsers
        };
    },
    
    // User interaction handlers
    handleUserSelectionChange: function(checkbox) {
        const userCard = checkbox.closest('.action-user-card');
        const permissionControls = userCard.querySelector('.permission-controls');
        const permissionSelect = userCard.querySelector('.user-permission-select');
        
        if (checkbox.checked) {
            // Show permission controls when user is selected
            permissionControls.classList.remove('d-none');
            // Update permission description
            this.updatePermissionDescription(permissionSelect);
        } else {
            // Hide permission controls when user is deselected
            permissionControls.classList.add('d-none');
        }
    },
    
    handlePermissionChange: function(select) {
        // Update the permission description when permission changes
        this.updatePermissionDescription(select);
    },
    
    updatePermissionDescription: function(select) {
        const userCard = select.closest('.action-user-card');
        const userId = select.dataset.userId;
        const permission = select.value;
        const descriptionElement = userCard.querySelector('.permission-help');
        
        // Get user to determine if guest
        const availableUsers = window.meenoeUsers ? window.meenoeUsers.getSelectedPeople() : [];
        const user = availableUsers.find(u => u.id.toString() === userId.toString());
        
        if (user) {
            const isGuest = user.email && user.id && user.id.toString().startsWith('guest_');
            const permissions = isGuest ? this.PERMISSIONS.GUEST : this.PERMISSIONS.MEENOE_USER;
            const permissionObj = Object.values(permissions).find(p => p.value === permission);
            
            if (permissionObj && descriptionElement) {
                descriptionElement.textContent = permissionObj.description;
            }
        }
    },
    
    getUserPermissions: function() {
        const userPermissions = {};
        const selectedCheckboxes = document.querySelectorAll('.action-user-checkbox:checked');

        selectedCheckboxes.forEach(checkbox => {
            const userId = checkbox.value;
            const userCard = checkbox.closest('.action-user-card');
            const permissionSelect = userCard.querySelector('.user-permission-select');

            if (permissionSelect) {
                userPermissions[userId] = permissionSelect.value;
            }
        });

        return userPermissions;
    },

    // Method to reinitialize when new content is dynamically loaded
    reinitialize: function() {
        // Event listeners are already set up with delegation, so no need to re-add them
        // Just refresh any existing action displays
        this.refreshAllActionUserDisplays();
    },

    // Method to check if the module is properly initialized
    isInitialized: function() {
        return this._initialized === true;
    }
};

// Initialize when DOM is loaded or when content is dynamically added
function initializeActionUsers() {
    if (window.ActionUsers && !window.ActionUsers._initialized) {
        window.ActionUsers.init();
        window.ActionUsers._initialized = true;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeActionUsers);

// Also initialize if DOM is already loaded (for dynamic content)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActionUsers);
} else {
    initializeActionUsers();
}

// Add descriptive text below permission dropdowns using event delegation
window.ActionUsers.initializePermissionTooltips = function() {
    // Use event delegation for tooltips to work with dynamic content
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.classList.contains('user-permission-select') && !e.target._tooltipInitialized) {
                const tooltip = new bootstrap.Tooltip(e.target, {
                    title: () => this.getPermissionTooltip(e.target),
                    trigger: 'hover'
                });
                e.target._tooltipInitialized = true;
            }
        });
    }
};

window.ActionUsers.getPermissionTooltip = function(element) {
    const permission = element.value;
    const userId = element.dataset.userId;
    const availableUsers = window.meenoeUsers ? window.meenoeUsers.getSelectedPeople() : [];
    const user = availableUsers.find(u => u.id.toString() === userId.toString());

    if (user) {
        const isGuest = user.email && user.id && user.id.toString().startsWith('guest_');
        const permissions = isGuest ? this.PERMISSIONS.GUEST : this.PERMISSIONS.MEENOE_USER;
        const permissionObj = Object.values(permissions).find(p => p.value === permission);

        return permissionObj ? permissionObj.description : 'Select a permission level';
    }

    return 'Select a permission level';
};

/**
 * Quick test function you can run in console
 */
window.testPermissions = function() {
    if (window.ActionUsers) {
        return true;
    } else {
        return false;
    }
};

// Export for Vite/ES6 module compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ActionUsers;
}

// Also support ES6 export syntax for Vite
if (typeof window !== 'undefined') {
    window.ActionUsers = window.ActionUsers;
}

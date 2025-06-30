// Global people data accessible to other modules
window.meenoeUsers = {
    dummyUsers: [],
    selectedUsers: [],
    invitedGuests: [],
    
    // Get all available users (selected + dummyUsers)
    getAllUsers: function() {
        return [...this.selectedUsers, ...this.dummyUsers.filter(u => !this.selectedUsers.find(su => su.id === u.id))];
    },
    
    // Get only selected users and guests
    getSelectedPeople: function() {
        return [...this.selectedUsers, ...this.invitedGuests];
    },
    
    // Check if there are any users/guests available
    hasUsers: function() {
        return this.selectedUsers.length > 0 || this.invitedGuests.length > 0;
    },

    // Add method to notify when user data changes
    notifyUserChange: function() {
        console.log('meenoeUsers: Notifying user change. Selected users:', this.selectedUsers.length, 'Guests:', this.invitedGuests.length);
        // Dispatch a custom event when users change
        window.dispatchEvent(new CustomEvent('meenoeUsersChanged', {
            detail: {
                selectedUsers: this.selectedUsers,
                invitedGuests: this.invitedGuests,
                hasUsers: this.hasUsers()
            }
        }));
    }
};

// Initialize people modal functionality with event delegation
function initializePeopleModal() {
    console.log('🔄 Initializing People Modal with event delegation...');

    // Use event delegation for dynamically loaded content
    setupEventDelegation();

    // Initialize static elements if they exist
    initializeStaticElements();
}

// Set up event delegation for dynamically loaded content
function setupEventDelegation() {
    // Remove any existing event listeners to prevent duplicates
    document.removeEventListener('change', handleCheckboxChange);
    document.removeEventListener('change', handlePermissionRadioChange);
    document.removeEventListener('input', handleSearchInput);
    document.removeEventListener('click', handleButtonClicks);
    document.removeEventListener('change', handleSortChange);
    document.removeEventListener('show.bs.modal', handleModalShow);

    // Add event delegation listeners
    document.addEventListener('change', handleCheckboxChange);
    document.addEventListener('change', handlePermissionRadioChange);
    document.addEventListener('input', handleSearchInput);
    document.addEventListener('click', handleButtonClicks);
    document.addEventListener('change', handleSortChange);
    document.addEventListener('show.bs.modal', handleModalShow);
}

// Initialize static elements that exist in the DOM
function initializeStaticElements() {
    // Use event delegation for #addUserButton to ensure handler works for dynamic DOM
    document.removeEventListener('click', delegatedAddUserButtonHandler);
    document.addEventListener('click', delegatedAddUserButtonHandler);
}

function delegatedAddUserButtonHandler(e) {
    const target = e.target.closest('#addUserButton');
    if (target) {
        console.log('[People Modal] delegatedAddUserButtonHandler triggered for #addUserButton');
        e.preventDefault();
        const addUserModal = document.getElementById('addUserModal');
        console.log('[People Modal] addUserButton clicked (delegated). Modal element:', addUserModal);
        if (addUserModal) {
            let modalInstance = bootstrap.Modal.getOrCreateInstance(addUserModal);
            console.log('[People Modal] Bootstrap modal instance:', modalInstance);
            modalInstance.show();
        } else {
            console.warn('[People Modal] #addUserModal not found in DOM at click time.');
        }
    }
}

    // Dummy data for users - now stored in global object
    window.meenoeUsers.dummyUsers = [
        {
            id: 1,
            name: 'Henry Paulista',
            email: 'henry.p@mail.com',
            title: 'Senior Creative Director',
            img: 'https://i.pravatar.cc/150?img=1',
            progress: 100,
            online: false,
            permission: 'contributor'
        },
        {
            id: 2,
            name: 'Evan Jefferson',
            email: 'jefferson@gmail.com',
            title: 'Creative Director',
            img: 'https://i.pravatar.cc/150?img=2',
            progress: 82,
            online: true,
            permission: 'contributor'
        },
        {
            id: 3,
            name: 'Mark Thomson',
            email: 'mark.t@gmail.com',
            title: 'Senior UI Designer',
            img: 'https://i.pravatar.cc/150?img=3',
            progress: 66,
            online: false,
            permission: 'contributor'
        },
        {
            id: 4,
            name: 'Alice McKenzie',
            email: 'alice.mc@gamil.com',
            title: 'Senior Copywriter',
            img: 'https://i.pravatar.cc/150?img=4',
            progress: 100,
            online: true,
            permission: 'contributor'
        },
        {
            id: 5,
            name: 'Jack Ro',
            email: '', // No email, placeholder user
            title: 'Art Director',
            img: null, // Placeholder image
            progress: 33,
            online: false,
            permission: 'contributor'
        },
        {
            id: 6,
            name: 'Anastasia Groetze',
            email: 'anastasia.g@gmail.com',
            title: 'Senior UX Designer',
            img: 'https://i.pravatar.cc/150?img=5',
            progress: 48,
            online: false,
            permission: 'contributor'
        }
    ];

// Global variables for people modal functionality
let currentSortCriteria = 'name'; // 'name' or 'progress'
let currentSortOrder = 'asc'; // 'asc' or 'desc'

// Helper functions to access global data
function getSelectedUsers() {
    return window.meenoeUsers.selectedUsers;
}

function getInvitedGuests() {
    return window.meenoeUsers.invitedGuests;
}

function getDummyUsers() {
    return window.meenoeUsers.dummyUsers;
}

    function renderUserCard(user) {
        const placeholderAvatar = `<span class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; background-color: #e9ecef;">
                                    <i class="bi bi-person-fill" style="font-size: 40px; color: #adb5bd;"></i>
                                 </span>`;
        const userAvatar = user.img ? `<img src="${user.img}" class="rounded-circle" alt="${user.name}" width="80" height="80">` : placeholderAvatar;
        const isSelected = getSelectedUsers().find(su => su.id === user.id);
        const onlineIndicatorHtml = `<span id="online-indicator-${user.id}" class="online-indicator-conditional online-indicator bg-success position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle ${!isSelected ? 'd-none' : ''}"></span>`;
        const selectedCheckbox = getSelectedUsers().find(su => su.id === user.id) ? 'checked' : '';

        // New 5-segment progress bar logic
        const numSegments = 5;
        const segmentWidthPercentage = 100 / numSegments;
        let segmentsHtml = '';
        const progressPerSegment = 100 / numSegments; // e.g., 33.33 for 3 segments

        for (let i = 0; i < numSegments; i++) {
            const segmentStartProgress = i * progressPerSegment;
            const segmentEndProgress = (i + 1) * progressPerSegment;
            let filledWidth = 0;

            if (user.progress >= segmentEndProgress) { // Segment is fully filled
                filledWidth = 100;
            } else if (user.progress > segmentStartProgress && user.progress < segmentEndProgress) { // Segment is partially filled
                filledWidth = ((user.progress - segmentStartProgress) / progressPerSegment) * 100;
            } else { // Segment is empty
                filledWidth = 0;
            }

            segmentsHtml += `<div class="progress-segment-wrapper" style="width: ${segmentWidthPercentage}%;">
                               <div class="progress-segment-bg"></div>
                               <div class="progress-segment-fill segment-fill-${i + 1}" style="width: ${filledWidth}%;"></div>
                             </div>`;
        }

        const permissions = ['contributor', 'viewer', 'admin', 'excluded'];
        const permissionRadios = permissions.map(perm => `
            <div class="form-check form-check-inline">
                <input class="form-check-input permission-radio" type="radio" name="user-${user.id}-permission" id="user-${user.id}-${perm}" value="${perm}" ${user.permission === perm ? 'checked' : ''} data-user-id="${user.id}">
                <label class="form-check-label" for="user-${user.id}-${perm}">${perm.charAt(0).toUpperCase() + perm.slice(1)}</label>
            </div>`).join('');

        return `<div class="col-md-4 mb-3">
            <div class="card user-card h-100" data-user-id="${user.id}">
                <div class="card-body text-center pb-2">
                    <div class="position-relative mb-2 mx-auto" style="width: 80px; height: 80px;">
                        ${userAvatar}
                        ${onlineIndicatorHtml}
                        <input type="checkbox" class="form-check-input select-user-checkbox" ${selectedCheckbox} title="Select user" style="position: absolute; top: -15%; right: -150%;">
                    </div>
                    <h6 class="card-title mb-0">${user.name}</h6>
                    <p class="card-text small text-muted mb-2">${user.email || ''}</p>
                    <div class="d-flex align-items-center justify-content-center occupancy mb-2">
                        <i class="bi bi-clock me-2 small text-muted"></i>
                        <div class="progress-bar-segments d-flex flex-grow-1 me-2" style="height: 6px;">
                           ${segmentsHtml}
                        </div>
                        <span class="small text-muted">${user.progress}%</span>
                    </div>
                    <div class="permissions-group d-flex justify-content-center flex-wrap mb-2 ${!isSelected ? 'd-none' : ''}">
                        ${permissionRadios}
                    </div>
                </div>
                <div class="card-footer">
                    <p class="small text-muted mb-0">${user.title}</p>
                </div>
            </div>
        </div>`;
    }

    function populateUserList(usersToRender = getDummyUsers()) {
        const addUserModal = document.getElementById('addUserModal');
        const userListContainer = addUserModal?.querySelector('#modalUserList');
        if (!userListContainer) return;
        userListContainer.innerHTML = usersToRender.map(renderUserCard).join('');

        // Event listeners are now handled by event delegation - no need to attach here
    }

    function applySortingAndRender() {
        let sortedUsers = [...getDummyUsers()]; // Create a copy to sort

        sortedUsers.sort((a, b) => {
            let comparison = 0;
            if (currentSortCriteria === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (currentSortCriteria === 'progress') {
                comparison = a.progress - b.progress;
            }

            return currentSortOrder === 'asc' ? comparison : -comparison;
        });

        populateUserList(sortedUsers);
    }

    function updateAvatarStack() {
        const avatarStackContainer = document.querySelector('.avatar-stack');
        if (!avatarStackContainer) return;
        // Clear existing avatars except the add button
        const existingAvatars = avatarStackContainer.querySelectorAll('.avatar, .avatar-more-indicator');
        existingAvatars.forEach(el => el.remove());

        const maxAvatarsToShow = 9;
        const usersToDisplay = getSelectedUsers().slice(0, maxAvatarsToShow);

        usersToDisplay.forEach(user => {
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'avatar me-n2'; // me-n2 for overlap
            avatarDiv.style.width = '32px';
            avatarDiv.style.height = '32px';
            
            const img = document.createElement('img');
            // Use a more distinct placeholder for guests if desired, or a generic one
            const placeholderText = user.isGuest ? 'G' : user.name.charAt(0).toUpperCase();
            const avatarSrc = user.img || `https://via.placeholder.com/32/E9ECEF/ADB5BD?text=${placeholderText}`;
            img.src = avatarSrc;
            img.className = 'rounded-circle border border-white bg-light';
            img.width = 32;
            img.height = 32;
            img.alt = user.name;
            img.title = `${user.name} (${user.permission || 'Guest'})`; // Show name and permission on hover

            avatarDiv.appendChild(img);
            // Insert before the addUserButton which should be the last child or specific element
            const addUserButton = document.getElementById('addUserButton');
            if (addUserButton) {
                avatarStackContainer.insertBefore(avatarDiv, addUserButton);
            } else {
                avatarStackContainer.appendChild(avatarDiv); // Fallback if button not found
            }
        });

        if (getSelectedUsers().length > maxAvatarsToShow) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'avatar-more-indicator avatar me-n2 d-flex align-items-center justify-content-center';
            moreDiv.style.width = '32px';
            moreDiv.style.height = '32px';
            moreDiv.style.backgroundColor = '#e9ecef';
            moreDiv.style.borderRadius = '50%';
            moreDiv.style.border = '1px solid #fff';
            moreDiv.style.fontSize = '12px';
            moreDiv.style.color = '#6c757d';
            moreDiv.style.fontWeight = 'bold';
            moreDiv.textContent = `+${getSelectedUsers().length - maxAvatarsToShow}`;
            moreDiv.title = `${getSelectedUsers().length - maxAvatarsToShow} more`;

            const addUserButton = document.getElementById('addUserButton');
            if (addUserButton) {
                avatarStackContainer.insertBefore(moreDiv, addUserButton);
            } else {
                avatarStackContainer.appendChild(moreDiv);
            }
        }
    }

    function handleSearch(searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredUsers = getDummyUsers().filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.title.toLowerCase().includes(searchTerm)
        );
        populateUserList(filteredUsers);
    }

// Event delegation handlers
function handleCheckboxChange(event) {
    if (!event.target.matches('.select-user-checkbox')) return;

    const card = event.target.closest('.user-card');
    const userId = parseInt(card.dataset.userId);
    const user = window.meenoeUsers.dummyUsers.find(u => u.id === userId);
    const permissionsGroup = card.querySelector('.permissions-group');
    const onlineIndicatorEl = card.querySelector(`#online-indicator-${userId}`);

    if (event.target.checked) {
        if (!window.meenoeUsers.selectedUsers.find(su => su.id === userId)) {
            window.meenoeUsers.selectedUsers.push(user);
        }
        if (permissionsGroup) permissionsGroup.classList.remove('d-none');
        if (onlineIndicatorEl) onlineIndicatorEl.classList.remove('d-none');
    } else {
        window.meenoeUsers.selectedUsers = window.meenoeUsers.selectedUsers.filter(su => su.id !== userId);
        if (permissionsGroup) permissionsGroup.classList.add('d-none');
        if (onlineIndicatorEl) onlineIndicatorEl.classList.add('d-none');
    }

    // Notify user data change after any checkbox change
    window.meenoeUsers.notifyUserChange();
}

function handlePermissionRadioChange(event) {
    if (!event.target.matches('.permission-radio')) return;

    const userId = parseInt(event.target.dataset.userId);
    const newPermission = event.target.value;

    // Update in dummyUsers array
    const userInDummyList = window.meenoeUsers.dummyUsers.find(u => u.id === userId);
    if (userInDummyList) {
        userInDummyList.permission = newPermission;
    }

    // Update in selectedUsers array if the user is already selected
    const userInSelectedList = window.meenoeUsers.selectedUsers.find(u => u.id === userId);
    if (userInSelectedList) {
        userInSelectedList.permission = newPermission;
    }

    // Notify user data change
    window.meenoeUsers.notifyUserChange();
}

function handleSearchInput(event) {
    if (!event.target.matches('#userSearchInput')) return;
    handleSearch(event.target);
}

function renderGuestPills() {
    const guestPillContainer = document.querySelector('#guestPillContainer');
    if (!guestPillContainer) return;
    guestPillContainer.innerHTML = window.meenoeUsers.invitedGuests.map(guest => `
        <span class="badge rounded-pill bg-secondary guest-pill">
            ${guest.name} (${guest.permission})
            <button type="button" class="btn-close btn-close-white btn-close-pill" aria-label="Remove guest" data-guest-id="${guest.id}"></button>
        </span>
    `).join('');

    // Event listeners for guest pill removal are handled by event delegation
}

function handleButtonClicks(event) {
    // Handle invite guest button
    if (event.target.matches('#inviteGuestButton')) {
        const guestEmailInput = document.querySelector('#guestEmailInput');
        const guestPermissionSelect = document.querySelector('#guestPermissionSelect');

        if (!guestEmailInput || !guestPermissionSelect) return;

        const emailsString = guestEmailInput.value.trim();
        const permission = guestPermissionSelect.value;
        if (emailsString) {
            const emails = emailsString.split(',').map(e => e.trim()).filter(e => e);
            emails.forEach(email => {
                // Basic email validation could be simple regex or just check for @
                if (email.includes('@') &&
                    !window.meenoeUsers.invitedGuests.some(g => g.email === email) &&
                    !window.meenoeUsers.selectedUsers.some(su => su.email === email && su.id.startsWith('guest-'))) {
                    const guestUser = {
                        id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
                        name: email.split('@')[0],
                        email: email,
                        title: 'Guest',
                        img: null,
                        progress: 0,
                        online: false,
                        permission: permission,
                        isGuest: true
                    };
                    window.meenoeUsers.invitedGuests.push(guestUser);
                }
            });
            guestEmailInput.value = ''; // Clear input
            renderGuestPills(); // Re-render pills to show newly added guests
        }
        return;
    }

    // Handle guest pill removal
    if (event.target.matches('.btn-close-pill')) {
        const guestIdToRemove = event.target.dataset.guestId;
        window.meenoeUsers.invitedGuests = window.meenoeUsers.invitedGuests.filter(g => g.id !== guestIdToRemove);
        renderGuestPills(); // Re-render pills
        return;
    }

    // Handle add selected users button
    if (event.target.matches('#addSelectedUsersButton')) {
        // Add successfully invited guests to the main selectedUsers list before updating avatar stack
        window.meenoeUsers.invitedGuests.forEach(guest => {
            if (!window.meenoeUsers.selectedUsers.find(su => su.id === guest.id)) {
                window.meenoeUsers.selectedUsers.push(guest);
            }
        });
        window.meenoeUsers.invitedGuests = []; // Clear temporary guest list
        renderGuestPills(); // Clear pills from UI

        updateAvatarStack();

        // Notify that users have changed (this will trigger action display refresh)
        window.meenoeUsers.notifyUserChange();

        const addUserModal = document.getElementById('addUserModal');
        const modalInstance = bootstrap.Modal.getInstance(addUserModal);
        if (modalInstance) {
            modalInstance.hide();
        }
        return;
    }

    // Handle sort order button
    if (event.target.matches('#modalSortOrderButton') || event.target.closest('#modalSortOrderButton')) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        // Update button icon (optional, but good UX)
        const sortOrderButton = document.getElementById('modalSortOrderButton');
        const icon = sortOrderButton?.querySelector('i');
        if (icon) {
            icon.classList.remove('bi-arrow-down-up', 'bi-arrow-down', 'bi-arrow-up');
            if (currentSortOrder === 'asc') {
                icon.classList.add('bi-arrow-up');
            } else {
                icon.classList.add('bi-arrow-down');
            }
        }
        applySortingAndRender();
        return;
    }
}

function handleSortChange(event) {
    if (!event.target.matches('#modalSortBySelect')) return;

    currentSortCriteria = event.target.value;
    applySortingAndRender();
}

function handleModalShow(event) {
    if (!event.target.matches('#addUserModal')) return;

    // Re-render to reflect current selections for regular users
    populateUserList();
}

// Initialize the people modal functionality
function initializePeopleModalData() {
    // Initial population of user list and avatar stack
    applySortingAndRender(); // Initial sort and render
    updateAvatarStack();
}

// Call initialization when DOM is ready or when dynamically loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePeopleModal();
    initializePeopleModalData();
});

// Export initialization function for dynamic loading
window.initializePeopleModal = initializePeopleModal;

// Listen for user changes and refresh action displays
window.addEventListener('meenoeUsersChanged', (event) => {
    console.log('meenoeUsersChanged event received:', event.detail);
    if (window.ActionUsers && typeof window.ActionUsers.refreshAllActionUserDisplays === 'function') {
        console.log('Calling refreshAllActionUserDisplays...');
        window.ActionUsers.refreshAllActionUserDisplays();
    } else {
        console.warn('ActionUsers.refreshAllActionUserDisplays not available');
    }
});

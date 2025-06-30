// Prevent redeclaration errors by checking if variables already exist
if (typeof layoutContainer === 'undefined') {
    var layoutContainer = document.querySelector('.layout-container');
    var defaultLayout = document.querySelector('.layout-default');
    var splitLayout = document.querySelector('.layout-split');
    var tabNavigation = document.querySelector('.tab-navigation');

    var setupContent = document.getElementById('setup');
    var flowContent = document.getElementById('flow');
    var actionsContent = document.getElementById('actions');
}

// --- State and Initialization ---
let originalSetupParent, originalFlowParent, originalActionsParent;

// Function to initialize the layout manager
function initLayoutManager() {
    if (!layoutContainer || !defaultLayout || !splitLayout || !tabNavigation || !setupContent || !flowContent || !actionsContent) {
        // console.warn('Layout manager elements not found, exiting layout manager script.');
        return;
    }

    // Store original parents for resetting views
    originalSetupParent = setupContent.parentNode;
    originalFlowParent = flowContent.parentNode;
    originalActionsParent = actionsContent.parentNode;

    // Set the initial layout
    updateLayout('default');
}

/**
 * Event Delegation for Layout Switching
 * Only listen for clicks within the layout dropdown menu to avoid interfering with other UI elements.
 */
const layoutDropdownMenu = document.querySelector('#layoutDropdown + .dropdown-menu');
if (layoutDropdownMenu) {
    layoutDropdownMenu.addEventListener('click', function(e) {
        const layoutItem = e.target.closest('[data-layout]');
        if (layoutItem) {
            e.preventDefault();
            const layout = layoutItem.dataset.layout;
            updateLayout(layout);
        }
    });
}

// --- Layout Update Logic ---
function updateLayout(layout) {
    // For 'running' layout, content is cloned, so originals should not be moved.
    if (layout !== 'running') {
        resetContentPositions();
    }

    // Hide all layouts and tab navigation initially
    defaultLayout.classList.add('d-none');
    splitLayout.classList.add('d-none');
    splitLayout.innerHTML = ''; // Clear previous split content
    tabNavigation.classList.add('d-none');

    // Show the selected layout
    switch (layout) {
        case 'default':
            showDefaultLayout();
            break;
        case 'running':
            setupRunningPage();
            break;
    }
}

// --- Helper Functions for Layout Setup ---

function resetContentPositions() {
    // Ensure original parents exist before attempting to append
    if (originalSetupParent) safeAppend(originalSetupParent, setupContent);
    if (originalFlowParent) safeAppend(originalFlowParent, flowContent);
    if (originalActionsParent) safeAppend(originalActionsParent, actionsContent);

    // Reset classes on content elements
    [setupContent, flowContent, actionsContent].forEach(content => {
        content.classList.remove('w-100', 'h-100', 'overflow-auto', 'p-4', 'col-md-6', 'show', 'active');
    });
}


function setupRunningPage() {
    splitLayout.classList.remove('d-none');
    splitLayout.innerHTML = `
        <div class="container-fluid h-100 p-0">
            <div id="running-page-content" class="h-100 overflow-auto p-4"></div>
        </div>
    `;
    const runningPageContainer = document.getElementById('running-page-content');

    if (runningPageContainer) {
        runningPageContainer.innerHTML = ''; // Clear previous content

        const contentToClone = [
            { el: setupContent, title: 'Details' },
            { el: flowContent, title: 'Flow' },
            { el: actionsContent, title: 'Actions' }
        ];

        contentToClone.forEach(item => {
            if (item.el) {
                const clone = item.el.cloneNode(true);
                clone.classList.remove('d-none', 'fade', 'tab-pane');
                clone.classList.add('show', 'active');

                const cardDiv = document.createElement('div');
                cardDiv.classList.add('card', 'mb-4');

                const header = document.createElement('div');
                header.classList.add('card-header', 'bg-light');
                header.innerHTML = `<h5 class="mb-0">${item.title}</h5>`;
                cardDiv.appendChild(header);

                const cardBodyDiv = document.createElement('div');
                cardBodyDiv.classList.add('card-body');

                if (item.el.classList.contains('tab-pane')) {
                    while (clone.firstChild) {
                        cardBodyDiv.appendChild(clone.firstChild);
                    }
                } else {
                    cardBodyDiv.appendChild(clone);
                }
                cardDiv.appendChild(cardBodyDiv);
                runningPageContainer.appendChild(cardDiv);
            }
        });
    }
}

function showDefaultLayout() {
    defaultLayout.classList.remove('d-none');
    tabNavigation.classList.remove('d-none');

    [setupContent, flowContent, actionsContent].forEach(content => {
        if (content) {
            content.classList.remove('show', 'active', 'd-none');
        }
    });

    const activeTabLink = tabNavigation.querySelector('.nav-link.active');
    let activePane = null;

    if (activeTabLink) {
        const activePaneId = activeTabLink.getAttribute('href');
        if (activePaneId) activePane = document.querySelector(activePaneId);
    } else {
        const firstTabLink = tabNavigation.querySelector('.nav-link');
        if (firstTabLink) {
            tabNavigation.querySelectorAll('.nav-link.active').forEach(link => link.classList.remove('active'));
            firstTabLink.classList.add('active');
            const firstPaneId = firstTabLink.getAttribute('href');
            if (firstPaneId) activePane = document.querySelector(firstPaneId);
        }
    }

    if (activePane) {
        activePane.classList.add('show', 'active');
    } else if (setupContent) {
        const firstTabLink = tabNavigation.querySelector('a[href="#setup"]');
        if (firstTabLink) firstTabLink.classList.add('active');
        setupContent.classList.add('show', 'active');
    }
}

function safeAppend(parent, child) {
    if (parent && child && !parent.contains(child)) {
        parent.appendChild(child);
    }
}

// --- Initialize ---
initLayoutManager();

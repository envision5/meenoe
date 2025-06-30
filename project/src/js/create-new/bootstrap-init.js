import { Tooltip, Tab, Dropdown } from 'bootstrap';

// Prevent redeclaration errors
if (typeof observeAndInitTooltips === 'undefined') {
    var observeAndInitTooltips = (targetNode) => {
    // Initialize tooltips on elements already present at load time
    const initialTooltipTriggers = targetNode.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...initialTooltipTriggers].forEach(tooltipEl => {
        new Tooltip(tooltipEl);
    });

    // Use a MutationObserver to watch for new nodes being added to the DOM
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is an element and contains tooltips
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newTooltipTriggers = node.querySelectorAll('[data-bs-toggle="tooltip"]');
                        [...newTooltipTriggers].forEach(tooltipEl => {
                            new Tooltip(tooltipEl);
                        });
                        // Also check the node itself if it has the tooltip attribute
                        if (node.matches('[data-bs-toggle="tooltip"]')) {
                            new Tooltip(node);
                        }
                    }
                });
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(targetNode, { childList: true, subtree: true });
    };
}


/**
 * Handles Bootstrap Tabs and Dropdowns using event delegation.
 * This single listener manages components added now or in the future.
 */
if (typeof handleDynamicComponents === 'undefined') {
    var handleDynamicComponents = () => {
    document.body.addEventListener('click', function(e) {
        // --- Tab Delegation ---
        const tabTrigger = e.target.closest('[data-bs-toggle="tab"]');
        if (tabTrigger) {
            e.preventDefault();
            // Use Bootstrap's official API to show the tab.
            // This correctly handles all class toggling and related events.
            const tab = new Tab(tabTrigger);
            tab.show();
            return; // Stop further execution if a tab was clicked
        }

        // --- Dropdown Delegation ---
        const dropdownTrigger = e.target.closest('[data-bs-toggle="dropdown"]');
        if (dropdownTrigger) {
            // Use getOrCreateInstance to initialize and toggle the dropdown.
            // This prevents issues if the dropdown was initialized manually elsewhere.
            const dropdown = Dropdown.getOrCreateInstance(dropdownTrigger);
            dropdown.toggle();
            return; // Stop further execution if a dropdown was clicked
        }
    });
    };
}

/**
 * Ensures the correct tab pane is visible on initial load.
 * This should be run once after the initial DOM is ready.
 */
if (typeof showInitialActiveTab === 'undefined') {
    var showInitialActiveTab = () => {
        const activeTab = document.querySelector('.nav-tabs .nav-link.active[data-bs-toggle="tab"]');
        if (activeTab) {
            // The Bootstrap Tab instance will handle showing the correct pane.
            // No need to manually add 'show'/'active' classes.
            const tab = new Tab(activeTab);
            tab.show();
        }
    };
}


// --- Initialize all handlers ---

/**
 * Ensure Bootstrap JS is loaded before initializing components.
 */
try {
    // Prevent multiple initialization
    if (!window.bootstrapInitialized) {
        window.bootstrapInitialized = true;

        // Start observing the document body for new tooltips
        observeAndInitTooltips(document.body);

        // Set up event delegation for clickable components
        handleDynamicComponents();

        // Show the correct tab on initial load
        showInitialActiveTab();

        console.log('✅ Bootstrap components initialized');
    } else {
        console.log('✅ Bootstrap components already initialized, skipping');
    }
} catch (e) {
    console.warn('❌ Bootstrap components failed to initialize:', e);
}

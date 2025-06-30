// Simple client-side router
class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.isNavigating = false;
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigate(page);
            }
        });
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(page, pushState = true) {
        // Prevent infinite recursion
        if (this.isNavigating || this.currentPage === page) {
            return;
        }

        this.isNavigating = true;

        if (pushState) {
            const url = page === 'dashboard' ? '/' : `/${page}`;
            history.pushState({ page }, '', url);
        }
        
        this.loadPage(page);
    }

    handleRoute() {
        // Prevent infinite recursion
        if (this.isNavigating) {
            return;
        }

        const path = window.location.pathname;
        let page = 'dashboard';

        if (path === '/') {
            page = 'dashboard';
        } else {
            page = path.substring(1); // Remove leading slash
        }

        this.navigate(page, false);
    }

    async loadPage(page) {
        try {
            // Check authentication for protected pages
            if (!window.auth.requireAuth()) {
                this.isNavigating = false;
                return;
            }

            // Update active navigation
            this.updateActiveNavigation(page);

            // Load page content
            const handler = this.routes.get(page);
            if (handler) {
                this.currentPage = page;
                await handler();
            } else {
                // Default to dashboard if page not found, but only if dashboard route exists
                if (this.routes.has('dashboard') && page !== 'dashboard') {
                    this.currentPage = null; // Reset current page to allow navigation
                    this.isNavigating = false;
                    this.navigate('dashboard');
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading page:', error);
        } finally {
            this.isNavigating = false;
        }
    }

    updateActiveNavigation(page) {
        // Remove all active states from sidebar links and their parent items
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add active class to current page link and its parent
        const currentLink = document.querySelector(`[data-page="${page}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
            
            // Also add selected class to the parent sidebar-item
            const parentItem = currentLink.closest('.sidebar-item');
            if (parentItem) {
                parentItem.classList.add('selected');
            }
        }
    }
}

// Create global router instance
window.router = new Router();
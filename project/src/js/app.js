import { loadDashboard } from './pages/dashboard.js';
import { loadCreateNew } from './pages/create-new.js';
import { loadNotifications } from './pages/notifications.js';

// Main application initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!window.auth.requireAuth()) {
        return;
    }

    // Update user info in sidebar
    updateUserInfo();

    // Setup logout handlers
    setupLogoutHandlers();

    // Setup sidebar toggle
    setupSidebarToggle();

    // Register routes
    registerRoutes();

    // Initialize router
    window.router.handleRoute();
});

function updateUserInfo() {
    const user = window.auth.getUser();
    if (user) {
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }

        // Update profile images
        const profileImages = document.querySelectorAll('.client-profile-img img');
        profileImages.forEach(img => {
            if (user.avatar) {
                img.src = user.avatar;
            }
        });
    }
}

// Make updateUserInfo globally accessible for profile updates
window.updateUserInfo = updateUserInfo;

function setupLogoutHandlers() {
    const logoutBtns = document.querySelectorAll('#logout-btn, #header-logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.auth.logout();
            window.location.href = '/login.html';
        });
    });
}

function setupSidebarToggle() {
    const sidebarTogglers = document.querySelectorAll('.sidebartoggler');
    const sidebar = document.querySelector('.left-sidebar');
    const mainWrapper = document.getElementById('main-wrapper');

    sidebarTogglers.forEach(toggler => {
        toggler.addEventListener('click', function() {
            if (window.innerWidth <= 1199) {
                // Mobile: toggle sidebar visibility
                sidebar.classList.toggle('show');
            } else {
                // Desktop: toggle sidebar collapse
                sidebar.classList.toggle('collapsed');
                if (sidebar.classList.contains('collapsed')) {
                    mainWrapper.setAttribute('data-sidebartype', 'mini-sidebar');
                } else {
                    mainWrapper.setAttribute('data-sidebartype', 'full');
                }
            }
        });
    });

    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1199) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggler = e.target.closest('.sidebartoggler');
            
            if (!isClickInsideSidebar && !isClickOnToggler && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        }
    });
}

function registerRoutes() {
    // Register all page routes
    window.router.addRoute('dashboard', loadDashboard);
    window.router.addRoute('my-meenoes', loadMyMeenoes);
    window.router.addRoute('create-new', loadCreateNew);
    window.router.addRoute('my-files', loadMyFiles);
    window.router.addRoute('my-files-personal', loadPersonalFiles);
    window.router.addRoute('my-files-organization', loadOrganizationFiles);
    window.router.addRoute('organization', loadOrganization);
    window.router.addRoute('organization-staff', loadOrganizationStaff);
    window.router.addRoute('notifications', loadNotifications);
    window.router.addRoute('settings', loadSettings);
    window.router.addRoute('support', loadSupport);
    window.router.addRoute('profile', loadProfile);
}

// Placeholder functions for other pages (to be implemented)
function loadMyFiles() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">Knowledge Base <span class="badge bg-primary">2</span></h1>
                            <p class="text-muted mb-0">Manage your personal and organization files with AI-powered insights</p>
                        </div>
                        <div class="d-flex gap-2">
                            <div class="position-relative">
                                <input type="text" class="form-control" placeholder="Search Knowledge Base..." style="width: 300px; padding-right: 40px;">
                                <i class="ti ti-search position-absolute" style="right: 12px; top: 50%; transform: translateY(-50%); color: #6c757d;"></i>
                            </div>
                            <button class="btn btn-primary">
                                <i class="ti ti-plus me-2"></i>
                                Create Knowledge Base
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- File Type Cards -->
            <div class="row g-4">
                <!-- Personal Files Card -->
                <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm file-type-card" data-type="personal">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="file-type-icon bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                    <i class="ti ti-user text-primary" style="font-size: 1.5rem;"></i>
                                </div>
                                <div>
                                    <h5 class="card-title mb-1">Personal Files</h5>
                                    <p class="text-muted mb-0">Your personal file storage and knowledge base.</p>
                                </div>
                            </div>
                            
                            <div class="file-stats mb-3">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <div class="stat-item">
                                            <h4 class="mb-0 text-primary">0</h4>
                                            <small class="text-muted">docs</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="stat-item">
                                            <h6 class="mb-0 text-muted">2 Dec 2024</h6>
                                            <small class="text-muted">Last updated</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button class="btn btn-primary w-100 view-files-btn" data-type="personal">
                                View Files
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Organization Files Card -->
                <div class="col-md-6">
                    <div class="card h-100 border-0 shadow-sm file-type-card" data-type="organization">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="file-type-icon bg-success bg-opacity-10 p-3 rounded-3 me-3">
                                    <i class="ti ti-building text-success" style="font-size: 1.5rem;"></i>
                                </div>
                                <div>
                                    <h5 class="card-title mb-1">Organization Files</h5>
                                    <p class="text-muted mb-0">This is the knowledge base of your organization.</p>
                                </div>
                            </div>
                            
                            <div class="file-stats mb-3">
                                <div class="row text-center">
                                    <div class="col-6">
                                        <div class="stat-item">
                                            <h4 class="mb-0 text-success">0</h4>
                                            <small class="text-muted">docs</small>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="stat-item">
                                            <h6 class="mb-0 text-muted">24 Dec 2024</h6>
                                            <small class="text-muted">Last updated</small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button class="btn btn-success w-100 view-files-btn" data-type="organization">
                                View Files
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .file-type-card {
                transition: all 0.3s ease;
                cursor: pointer;
            }

            .file-type-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
            }

            .file-type-icon {
                transition: all 0.3s ease;
            }

            .file-type-card:hover .file-type-icon {
                transform: scale(1.1);
            }

            .stat-item h4, .stat-item h6 {
                font-weight: 600;
            }

            .view-files-btn {
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .view-files-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
        </style>
    `;

    // Setup event listeners
    setupMyFilesEventListeners();
}

function setupMyFilesEventListeners() {
    // View files buttons
    document.querySelectorAll('.view-files-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            if (type === 'personal') {
                window.router.navigate('my-files-personal');
            } else if (type === 'organization') {
                window.router.navigate('my-files-organization');
            }
        });
    });

    // Card click handlers
    document.querySelectorAll('.file-type-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.view-files-btn')) {
                const type = card.getAttribute('data-type');
                if (type === 'personal') {
                    window.router.navigate('my-files-personal');
                } else if (type === 'organization') {
                    window.router.navigate('my-files-organization');
                }
            }
        });
    });
}

function loadPersonalFiles() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Personal Files</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

function loadOrganizationFiles() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Organization Files</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

function loadOrganization() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Organization</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

function loadOrganizationStaff() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Organization Staff</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

function loadSettings() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Settings</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

function loadSupport() {
    document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <h1 class="h3 mb-4">Support</h1>
            <p class="text-muted">This page is under construction. Coming soon!</p>
        </div>
    `;
}

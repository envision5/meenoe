// My Meenoes page functionality
class MyMeenoesManager {
    constructor() {
        this.meenoes = this.getDummyMeenoes();
        this.currentFilter = 'all-category';
        this.init();
    }

    init() {
        // Initialize any needed functionality
        console.log('My Meenoes Manager initialized');
    }

    getDummyMeenoes() {
        return [
            {
                id: 'meenoe1741327650461-5ejkbht5jb',
                title: 'new id saved',
                description: 'This Meenoe is focused on reviewing the recent sales performance across various regions, discussing any issues, and identifying opportunities for improvement. The objective is to have a detailed breakdown of sales metrics, analyze trends, and agree on actionable steps to enhance performance in the upcoming quarter.',
                date: 'August 20, 2024',
                status: 'review',
                color: 'primary',
                isFavorite: false,
                participants: 8
            },
            {
                id: 'meenoe1741327655461-5ejkbht5jb',
                title: 'Sales Retention Process',
                description: 'This Meenoe is focused on reviewing the recent sales performance across various regions, discussing any issues, and identifying opportunities for improvement. The objective is to have a detailed breakdown of sales metrics, analyze trends, and agree on actionable steps to enhance performance in the upcoming quarter.',
                date: 'August 20, 2024',
                status: 'closed',
                color: 'danger',
                isFavorite: true,
                participants: 12
            },
            {
                id: 'meenoe1741327660461-abc123def',
                title: 'Weekly Team Standup',
                description: 'Regular weekly standup meeting to discuss progress, blockers, and upcoming tasks. Team members share updates on their current work and coordinate on shared projects.',
                date: 'August 22, 2024',
                status: 'live',
                color: 'success',
                isFavorite: false,
                participants: 6
            },
            {
                id: 'meenoe1741327665461-xyz789ghi',
                title: 'Product Roadmap Planning',
                description: 'Strategic planning session for Q4 product roadmap. Discussing feature priorities, resource allocation, and timeline planning for upcoming releases.',
                date: 'August 25, 2024',
                status: 'admin-review',
                color: 'warning',
                isFavorite: false,
                participants: 15
            },
            {
                id: 'meenoe1741327670461-mno456pqr',
                title: 'Client Presentation Prep',
                description: 'Preparation meeting for upcoming client presentation. Review slides, practice delivery, and finalize talking points for the proposal meeting.',
                date: 'August 28, 2024',
                status: 'locked',
                color: 'secondary',
                isFavorite: true,
                participants: 4
            },
            {
                id: 'meenoe1741327675461-stu901vwx',
                title: 'Budget Review Meeting',
                description: 'Monthly budget review and financial planning session. Analyzing expenses, revenue projections, and budget adjustments for the next quarter.',
                date: 'September 1, 2024',
                status: 'invited',
                color: 'info',
                isFavorite: false,
                participants: 8
            },
            {
                id: 'meenoe1741327680461-def234ghi',
                title: 'Marketing Campaign Review',
                description: 'Review of current marketing campaigns performance, ROI analysis, and planning for upcoming promotional activities.',
                date: 'September 3, 2024',
                status: 'review',
                color: 'primary',
                isFavorite: false,
                participants: 10
            },
            {
                id: 'meenoe1741327685461-jkl567mno',
                title: 'HR Policy Updates',
                description: 'Discussion of new HR policies, employee handbook updates, and implementation timeline for organizational changes.',
                date: 'September 5, 2024',
                status: 'closed',
                color: 'danger',
                isFavorite: false,
                participants: 5
            }
        ];
    }

    getStatusConfig(status) {
        const configs = {
            'review': { color: 'primary', icon: 'ti ti-eye-check', label: 'Review' },
            'admin-review': { color: 'warning', icon: 'ti ti-thumb-up', label: 'Admin Review' },
            'live': { color: 'success', icon: 'ti ti-door-enter', label: 'Live' },
            'locked': { color: 'secondary', icon: 'ti ti-lock', label: 'Locked' },
            'closed': { color: 'danger', icon: 'ti ti-door-exit', label: 'Closed' },
            'invited': { color: 'info', icon: 'ti ti-mail-check', label: 'Invited' }
        };
        return configs[status] || configs['review'];
    }

    renderMeenoeCard(meenoe) {
        const statusConfig = this.getStatusConfig(meenoe.status);
        const favoriteClass = meenoe.isFavorite ? 'text-warning' : '';
        
        return `
            <div class="col-md-4 meenoe-single all-category meenoe-${meenoe.status}" data-status="${meenoe.status}">
                <div class="card card-body meenoe-card" data-meenoe-id="${meenoe.id}">
                    <span class="meenoe-side-stick side-stick bg-${statusConfig.color}"></span>
                    
                    <div class="meenoe-header d-flex justify-content-between align-items-start mb-2">
                        <h6 class="meenoe-title text-truncate w-75 mb-1" data-meenoetitle="${meenoe.title}">${meenoe.title}</h6>
                        <span class="meenoe-status-badge badge bg-${statusConfig.color}-subtle text-${statusConfig.color} d-flex align-items-center">
                            <i class="meenoe-status-icon ${statusConfig.icon} me-1" style="width: 12px; height: 12px;"></i>
                            <span class="meenoe-status-label">${statusConfig.label}</span>
                        </span>
                    </div>
                    
                    <div class="meenoe-date-section mb-2">
                        <p class="meenoe-create-date fs-2 mb-2">
                            <span class="meenoe-date-indicator p-1 text-bg-${statusConfig.color} rounded-circle d-inline-block me-2"></span>
                            <span class="meenoe-date-text">${meenoe.date}</span>
                        </p>
                    </div>
                    
                    <div class="meenoe-meta-section meenoe-meta mb-3">
                        <div class="d-flex align-items-center gap-3 text-muted small">
                            <span class="meenoe-participants d-flex align-items-center">
                                <i class="meenoe-participants-icon ti ti-users me-1" style="width: 14px; height: 14px;"></i>
                                <span class="meenoe-participants-count">${meenoe.participants}</span>
                                <span class="meenoe-participants-label"> participants</span>
                            </span>
                        </div>
                    </div>
                    
                    <div class="meenoe-content-section note-content mb-3">
                        <p class="meenoe-description note-inner-content text-muted small" data-notecontent="${meenoe.description}">
                            ${meenoe.description.length > 120 ? meenoe.description.substring(0, 120) + '...' : meenoe.description}
                        </p>
                    </div>
                    
                    <div class="meenoe-actions-section d-flex align-items-center">
                        <button class="meenoe-view-btn btn btn-light align-items-center meenoe-shadow me-2 view-meenoe" data-meenoeid="${meenoe.id}">
                            <i class="meenoe-view-icon ti ti-arrow-right fs-4 me-2"></i>
                            <span class="meenoe-view-text">View</span>
                        </button>
                        <div class="meenoe-secondary-actions ms-auto d-flex align-items-center">
                            <button class="meenoe-favorite-btn btn btn-link p-1 me-1 favorite-meenoe ${favoriteClass}" data-meenoeid="${meenoe.id}" title="Add to favorites">
                                <i class="meenoe-favorite-icon ti ti-star fs-4"></i>
                            </button>
                            <button class="meenoe-delete-btn btn btn-link p-1 text-danger remove-meenoe" data-meenoeid="${meenoe.id}" title="Delete meenoe">
                                <i class="meenoe-delete-icon ti ti-trash fs-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderMeenoes(filter = 'all-category') {
        const container = document.getElementById('meenoe-fcontainer');
        if (!container) return;

        let filteredMeenoes = this.meenoes;
        
        if (filter !== 'all-category') {
            const statusMap = {
                'meenoe-review': 'review',
                'meenoe-admin-review': 'admin-review',
                'meenoe-live': 'live',
                'meenoe-locked': 'locked',
                'meenoe-closed': 'closed',
                'meenoe-invited': 'invited'
            };
            const status = statusMap[filter];
            if (status) {
                filteredMeenoes = this.meenoes.filter(meenoe => meenoe.status === status);
            }
        }

        container.innerHTML = filteredMeenoes.map(meenoe => this.renderMeenoeCard(meenoe)).join('');
        
        // Update count in the active tab
        this.updateTabCounts();
        
        // Attach event listeners
        this.attachEventListeners();
    }

    updateTabCounts() {
        const counts = {
            'all-category': this.meenoes.length,
            'meenoe-review': this.meenoes.filter(m => m.status === 'review').length,
            'meenoe-admin-review': this.meenoes.filter(m => m.status === 'admin-review').length,
            'meenoe-live': this.meenoes.filter(m => m.status === 'live').length,
            'meenoe-locked': this.meenoes.filter(m => m.status === 'locked').length,
            'meenoe-closed': this.meenoes.filter(m => m.status === 'closed').length,
            'meenoe-invited': this.meenoes.filter(m => m.status === 'invited').length
        };

        Object.keys(counts).forEach(tabId => {
            const tab = document.getElementById(tabId);
            if (tab) {
                const span = tab.querySelector('.d-none.d-md-block');
                if (span) {
                    const text = span.textContent.split(' (')[0]; // Remove existing count
                    span.textContent = `${text} (${counts[tabId]})`;
                }
            }
        });
    }

    attachEventListeners() {
        // View meenoe buttons
        document.querySelectorAll('.view-meenoe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meenoeId = e.target.closest('.view-meenoe').getAttribute('data-meenoeid');
                this.viewMeenoe(meenoeId);
            });
        });

        // Favorite buttons
        document.querySelectorAll('.favorite-meenoe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meenoeId = e.target.closest('.favorite-meenoe').getAttribute('data-meenoeid');
                this.toggleFavorite(meenoeId);
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-meenoe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const meenoeId = e.target.closest('.remove-meenoe').getAttribute('data-meenoeid');
                this.removeMeenoe(meenoeId);
            });
        });
    }

    viewMeenoe(meenoeId) {
        console.log('Viewing meenoe:', meenoeId);
        // In a real app, this would navigate to the meenoe details page
        // For now, we'll show an alert
        const meenoe = this.meenoes.find(m => m.id === meenoeId);
        if (meenoe) {
            alert(`Viewing Meenoe: ${meenoe.title}\n\nThis would navigate to the meenoe details page.`);
        }
    }

    toggleFavorite(meenoeId) {
        const meenoe = this.meenoes.find(m => m.id === meenoeId);
        if (meenoe) {
            meenoe.isFavorite = !meenoe.isFavorite;
            this.renderMeenoes(this.currentFilter);
            
            // Show notification
            const action = meenoe.isFavorite ? 'added to' : 'removed from';
            if (window.NotificationUtils) {
                const currentUser = window.auth?.getUser();
                if (currentUser) {
                    window.NotificationUtils.notifySystem(
                        currentUser.id,
                        'Favorites Updated',
                        `"${meenoe.title}" ${action} favorites`,
                        '/my-meenoes',
                        'View Meenoes'
                    );
                }
            }
        }
    }

    removeMeenoe(meenoeId) {
        const meenoe = this.meenoes.find(m => m.id === meenoeId);
        if (meenoe && confirm(`Are you sure you want to delete "${meenoe.title}"?`)) {
            this.meenoes = this.meenoes.filter(m => m.id !== meenoeId);
            this.renderMeenoes(this.currentFilter);
            
            // Show notification
            if (window.NotificationUtils) {
                const currentUser = window.auth?.getUser();
                if (currentUser) {
                    window.NotificationUtils.notifySystem(
                        currentUser.id,
                        'Meenoe Deleted',
                        `"${meenoe.title}" has been deleted`,
                        '/my-meenoes',
                        'View Meenoes'
                    );
                }
            }
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.renderMeenoes(filter);
    }
}

// Create global instance
window.myMeenoesManager = new MyMeenoesManager();

// Make loadMyMeenoes globally accessible
window.loadMyMeenoes = function loadMyMeenoes() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h3 mb-1">My Meenoes</h1>
                            <p class="text-muted mb-0">Manage all your collaborative sessions and async meetings</p>
                        </div>
                        <div class="d-flex gap-2">
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="ti ti-filter me-2"></i>Filter
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" data-filter="all">All Meenoes</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="favorites">Favorites Only</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="recent">Recent</a></li>
                                </ul>
                            </div>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="ti ti-sort-ascending me-2"></i>Sort
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" data-sort="date-desc">Newest First</a></li>
                                    <li><a class="dropdown-item" href="#" data-sort="date-asc">Oldest First</a></li>
                                    <li><a class="dropdown-item" href="#" data-sort="title">Title A-Z</a></li>
                                    <li><a class="dropdown-item" href="#" data-sort="status">Status</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <ul class="nav nav-pills p-3 mb-3 rounded align-items-center card flex-row">
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3 active" id="all-category">
                        <i class="ti ti-list fill-white"></i>
                        <span class="d-none d-md-block fw-medium">All Meenoes</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-review">
                        <i class="ti ti-eye-check fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Review</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-admin-review">
                        <i class="ti ti-thumb-up fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Admin Review</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-live">
                        <i class="ti ti-door-enter fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Live</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-locked">
                        <i class="ti ti-lock fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Locked</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-closed">
                        <i class="ti ti-door-exit fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Closed</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link gap-6 note-link d-flex align-items-center justify-content-center px-3 px-md-3" id="meenoe-invited">
                        <i class="ti ti-mail-check fill-white"></i>
                        <span class="d-none d-md-block fw-medium">Invited</span>
                    </a>
                </li>
                <li class="nav-item ms-auto">
                    <a href="javascript:void(0)" class="btn btn-primary d-flex align-items-center px-3 gap-6" id="add-Meenoes">
                        <i class="ti ti-square-rounded-plus fs-4"></i>
                        <span class="d-none d-md-block fw-medium fs-3">New Meenoe</span>
                    </a>
                </li>
            </ul>

            <!-- Meenoes Grid -->
            <div class="tab-content transparentbg p-0 shadow-none">
                <div id="meenoe-fcontainer" class="meenoe-grid row">
                    <!-- Meenoe cards will be rendered here -->
                </div>
            </div>

            <!-- Empty State (hidden by default) -->
            <div class="row d-none" id="empty-state">
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="ti ti-calendar-off text-muted mb-3" style="font-size: 4rem;"></i>
                        <h4 class="text-muted">No meenoes found</h4>
                        <p class="text-muted">Create your first meenoe to get started with collaborative sessions.</p>
                        <button class="btn btn-primary" onclick="window.router.navigate('create-new')">
                            <i class="ti ti-plus me-2"></i>
                            Create New Meenoe
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .meenoe-card {
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                box-shadow: rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;
            }

            .meenoe-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
            }

            .meenoe-card .card-body {
                padding-left: 1.5rem;
            }

            .meenoe-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: #2c3e50;
                line-height: 1.3;
            }

            .meenoe-create-date {
                font-size: 0.875rem;
                color: #6c757d;
                margin-bottom: 0.75rem;
            }

            .meenoe-meta {
                border-top: 1px solid #f1f3f4;
                border-bottom: 1px solid #f1f3f4;
                padding: 0.75rem 0;
            }

            .note-inner-content {
                line-height: 1.5;
                color: #6c757d;
                font-size: 0.875rem;
            }

            .meenoe-shadow {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                border: none;
                transition: all 0.2s ease;
            }

            .meenoe-shadow:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                transform: translateY(-1px);
            }

            .nav-pills .nav-link {
                border-radius: 0.5rem;
                transition: all 0.2s ease;
                color: #6c757d;
                font-weight: 500;
            }

            .nav-pills .nav-link.active {
                background-color: #2563eb;
                color: white;
            }

            .nav-pills .nav-link:hover:not(.active) {
                background-color: #f8f9fa;
                color: #2563eb;
            }

            .favorite-meenoe.text-warning {
                color: #ffc107 !important;
            }

            .btn-link {
                border: none;
                background: none;
                color: #6c757d;
                transition: color 0.2s ease;
            }

            .btn-link:hover {
                color: #2563eb;
            }

            .btn-link.text-danger:hover {
                color: #dc3545 !important;
            }

            @media (max-width: 768px) {
                .meenoe-grid .col-md-4 {
                    margin-bottom: 1rem;
                }
                
                .nav-pills {
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }
                
                .nav-pills .nav-item {
                    flex: 1;
                    min-width: auto;
                }
            }
        </style>
    `;

    // Initialize the page
    setupMyMeenoesEventListeners();
    window.myMeenoesManager.renderMeenoes();
};

function setupMyMeenoesEventListeners() {
    // Tab navigation
    document.querySelectorAll('.note-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all tabs
            document.querySelectorAll('.note-link').forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            e.target.closest('.note-link').classList.add('active');
            
            // Get filter and render meenoes
            const filter = e.target.closest('.note-link').id;
            window.myMeenoesManager.setFilter(filter);
        });
    });

    // New Meenoe button
    const addMeenoesBtn = document.getElementById('add-Meenoes');
    if (addMeenoesBtn) {
        addMeenoesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.router) {
                window.router.navigate('create-new');
            }
        });
    }

    // Filter dropdown
    document.querySelectorAll('[data-filter]').forEach(filterBtn => {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Sort dropdown
    document.querySelectorAll('[data-sort]').forEach(sortBtn => {
        sortBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const sort = e.target.getAttribute('data-sort');
            applySorting(sort);
        });
    });
}

function applyFilter(filter) {
    console.log('Applying filter:', filter);
    // Filter logic would be implemented here
    // For now, just log the filter
}

function applySorting(sort) {
    console.log('Applying sort:', sort);
    // Sorting logic would be implemented here
    // For now, just log the sort option
}
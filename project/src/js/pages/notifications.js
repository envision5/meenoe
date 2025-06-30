// Notifications page functionality
class NotificationManager {
    constructor() {
        this.notifications = this.getDummyNotifications();
        this.unreadCount = 0;
        this.init();
    }

    init() {
        this.calculateUnreadCount();
    }

    getDummyNotifications() {
        return [
            {
                id: 'notif_001',
                type: 'team_join',
                title: 'Roman Joined the Team!',
                message: 'Congratulate him',
                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                isRead: false,
                actionUrl: '/organization-staff',
                actionText: 'View Team'
            },
            {
                id: 'notif_002',
                type: 'message',
                title: 'New message',
                message: 'Salma sent you new message',
                avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                isRead: false,
                actionUrl: '/my-files',
                actionText: 'View Message'
            },
            {
                id: 'notif_003',
                type: 'payment',
                title: 'Bianca sent payment',
                message: 'Check your earnings',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                isRead: false,
                actionUrl: '/settings',
                actionText: 'View Earnings'
            },
            {
                id: 'notif_004',
                type: 'task_complete',
                title: 'Jolly completed tasks',
                message: 'Assign her new tasks',
                avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                isRead: true,
                actionUrl: '/my-files',
                actionText: 'Assign Tasks'
            },
            {
                id: 'notif_005',
                type: 'payment_received',
                title: 'John received payment',
                message: '$230 deducted from account',
                avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
                isRead: true,
                actionUrl: '/settings',
                actionText: 'View Transaction'
            },
            {
                id: 'notif_006',
                type: 'meeting_scheduled',
                title: 'Meeting Scheduled',
                message: 'Weekly standup meeting scheduled for tomorrow at 10:00 AM',
                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
                isRead: true,
                actionUrl: '/my-meenoes',
                actionText: 'View Meeting'
            },
            {
                id: 'notif_007',
                type: 'file_shared',
                title: 'File Shared',
                message: 'Sarah shared "Project Requirements.pdf" with you',
                avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
                timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
                isRead: true,
                actionUrl: '/my-files',
                actionText: 'View File'
            },
            {
                id: 'notif_008',
                type: 'organization_update',
                title: 'Organization Updated',
                message: 'Your organization profile has been updated successfully',
                avatar: null, // System notification
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                isRead: true,
                actionUrl: '/organization',
                actionText: 'View Organization'
            }
        ];
    }

    calculateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }

    getNotificationIcon(type) {
        const icons = {
            team_join: 'ti-user-plus',
            message: 'ti-message-circle',
            payment: 'ti-credit-card',
            payment_received: 'ti-credit-card',
            task_complete: 'ti-check-circle',
            meeting_scheduled: 'ti-calendar',
            file_shared: 'ti-file-text',
            organization_update: 'ti-building',
            default: 'ti-bell'
        };
        return icons[type] || icons.default;
    }

    getNotificationColor(type) {
        const colors = {
            team_join: 'success',
            message: 'primary',
            payment: 'warning',
            payment_received: 'info',
            task_complete: 'success',
            meeting_scheduled: 'primary',
            file_shared: 'info',
            organization_update: 'secondary',
            default: 'primary'
        };
        return colors[type] || colors.default;
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return timestamp.toLocaleDateString();
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            this.calculateUnreadCount();
            this.updateNotificationDisplay(notificationId);
            this.updateUnreadBadge();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
        this.renderNotifications();
        this.updateUnreadBadge();
    }

    updateNotificationDisplay(notificationId) {
        const notificationElement = document.querySelector(`[data-notification-id="${notificationId}"]`);
        if (notificationElement) {
            notificationElement.classList.remove('notification-unread');
            notificationElement.classList.add('notification-read');
            
            const unreadDot = notificationElement.querySelector('.unread-dot');
            if (unreadDot) {
                unreadDot.remove();
            }
        }
    }

    updateUnreadBadge() {
        // Update header notification badge
        const headerBadge = document.querySelector('.notification.bg-primary');
        if (headerBadge) {
            if (this.unreadCount > 0) {
                headerBadge.style.display = 'block';
            } else {
                headerBadge.style.display = 'none';
            }
        }

        // Update page badge
        const pageBadge = document.querySelector('.notifications-badge');
        if (pageBadge) {
            if (this.unreadCount > 0) {
                pageBadge.textContent = `${this.unreadCount} new`;
                pageBadge.style.display = 'inline-block';
            } else {
                pageBadge.style.display = 'none';
            }
        }
    }

    renderNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;

        container.innerHTML = this.notifications.map(notification => {
            const timeAgo = this.formatTimeAgo(notification.timestamp);
            const icon = this.getNotificationIcon(notification.type);
            const color = this.getNotificationColor(notification.type);
            const unreadClass = notification.isRead ? 'notification-read' : 'notification-unread';
            const unreadDot = notification.isRead ? '' : '<div class="unread-dot"></div>';
            
            const avatar = notification.avatar 
                ? `<img src="${notification.avatar}" alt="Avatar" class="notification-avatar">`
                : `<div class="notification-icon bg-${color}"><i class="${icon}"></i></div>`;

            return `
                <div class="notification-item ${unreadClass}" data-notification-id="${notification.id}">
                    <div class="notification-content">
                        <div class="notification-header">
                            ${avatar}
                            <div class="notification-details">
                                <div class="notification-title-row">
                                    <h6 class="notification-title">${notification.title}</h6>
                                    ${unreadDot}
                                </div>
                                <p class="notification-message">${notification.message}</p>
                                <div class="notification-meta">
                                    <span class="notification-time">${timeAgo}</span>
                                    ${notification.actionUrl ? `<a href="${notification.actionUrl}" class="notification-action" data-page="${notification.actionUrl.substring(1)}">${notification.actionText}</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add click handlers for marking as read
        container.querySelectorAll('.notification-item.notification-unread').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.notification-action')) {
                    const notificationId = item.getAttribute('data-notification-id');
                    this.markAsRead(notificationId);
                }
            });
        });

        // Add click handlers for action links
        container.querySelectorAll('.notification-action').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const notificationId = link.closest('.notification-item').getAttribute('data-notification-id');
                this.markAsRead(notificationId);
                
                const page = link.getAttribute('data-page');
                if (page && window.router) {
                    window.router.navigate(page);
                }
            });
        });
    }

    // Public API for creating notifications (to be used by other parts of the app)
    createNotification(type, title, message, options = {}) {
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            title,
            message,
            avatar: options.avatar || null,
            timestamp: new Date(),
            isRead: false,
            actionUrl: options.actionUrl || null,
            actionText: options.actionText || null
        };

        this.notifications.unshift(notification);
        this.calculateUnreadCount();
        
        // If we're on the notifications page, re-render
        if (window.location.pathname === '/notifications') {
            this.renderNotifications();
        }
        
        this.updateUnreadBadge();
        
        return notification.id;
    }

    deleteNotification(notificationId) {
        const index = this.notifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            this.notifications.splice(index, 1);
            this.calculateUnreadCount();
            this.renderNotifications();
            this.updateUnreadBadge();
        }
    }

    getUnreadCount() {
        return this.unreadCount;
    }

    getAllNotifications() {
        return this.notifications;
    }

    getUnreadNotifications() {
        return this.notifications.filter(n => !n.isRead);
    }
}

// Create global notification manager instance
window.notificationManager = new NotificationManager();

export function loadNotifications() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const unreadCount = window.notificationManager.getUnreadCount();

    mainContent.innerHTML = `
        <div class="container-fluid p-4 fade-in">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <h1 class="h3 mb-0 me-3">Notifications</h1>
                            ${unreadCount > 0 ? `<span class="badge bg-primary notifications-badge">${unreadCount} new</span>` : ''}
                        </div>
                        <div class="d-flex gap-2">
                            ${unreadCount > 0 ? `<button class="btn btn-outline-primary" id="mark-all-read-btn">Mark All as Read</button>` : ''}
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <i class="ti ti-filter me-2"></i>Filter
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" data-filter="all">All Notifications</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="unread">Unread Only</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="team_join">Team Updates</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="message">Messages</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="payment">Payments</a></li>
                                    <li><a class="dropdown-item" href="#" data-filter="meeting_scheduled">Meetings</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notifications List -->
            <div class="row">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-0">
                            <div id="notifications-list" class="notifications-container">
                                <!-- Notifications will be rendered here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State (hidden by default) -->
            <div class="row d-none" id="empty-state">
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="ti ti-bell-off text-muted mb-3" style="font-size: 4rem;"></i>
                        <h4 class="text-muted">No notifications found</h4>
                        <p class="text-muted">You're all caught up! Check back later for new updates.</p>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .notifications-container {
                max-height: 70vh;
                overflow-y: auto;
            }

            .notification-item {
                padding: 1.5rem;
                border-bottom: 1px solid #e9ecef;
                transition: all 0.2s ease;
                cursor: pointer;
                position: relative;
            }

            .notification-item:last-child {
                border-bottom: none;
            }

            .notification-item:hover {
                background-color: #f8f9fa;
            }

            .notification-unread {
                background-color: #eff6ff;
                border-left: 4px solid #2563eb;
            }

            .notification-unread:hover {
                background-color: #dbeafe;
            }

            .notification-content {
                width: 100%;
            }

            .notification-header {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }

            .notification-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
                flex-shrink: 0;
            }

            .notification-icon {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                color: white;
            }

            .notification-icon i {
                font-size: 1.25rem;
            }

            .notification-details {
                flex: 1;
                min-width: 0;
            }

            .notification-title-row {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.25rem;
            }

            .notification-title {
                font-size: 1rem;
                font-weight: 600;
                margin: 0;
                color: #1f2937;
            }

            .notification-message {
                font-size: 0.875rem;
                color: #6b7280;
                margin: 0 0 0.75rem 0;
                line-height: 1.4;
            }

            .notification-meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
            }

            .notification-time {
                font-size: 0.75rem;
                color: #9ca3af;
            }

            .notification-action {
                font-size: 0.875rem;
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s ease;
            }

            .notification-action:hover {
                color: #1d4ed8;
                text-decoration: underline;
            }

            .unread-dot {
                width: 8px;
                height: 8px;
                background-color: #2563eb;
                border-radius: 50%;
                flex-shrink: 0;
            }

            .notifications-badge {
                font-size: 0.75rem;
                padding: 0.25rem 0.5rem;
            }

            @media (max-width: 768px) {
                .notification-item {
                    padding: 1rem;
                }

                .notification-header {
                    gap: 0.75rem;
                }

                .notification-avatar,
                .notification-icon {
                    width: 40px;
                    height: 40px;
                }

                .notification-meta {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
            }
        </style>
    `;

    // Render notifications
    window.notificationManager.renderNotifications();
    window.notificationManager.updateUnreadBadge();

    // Set up event handlers
    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            window.notificationManager.markAllAsRead();
        });
    }

    // Set up filter handlers
    document.querySelectorAll('[data-filter]').forEach(filterBtn => {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.target.getAttribute('data-filter');
            filterNotifications(filter);
        });
    });
}

function filterNotifications(filter) {
    const allNotifications = window.notificationManager.getAllNotifications();
    let filteredNotifications;

    switch (filter) {
        case 'unread':
            filteredNotifications = allNotifications.filter(n => !n.isRead);
            break;
        case 'all':
            filteredNotifications = allNotifications;
            break;
        default:
            filteredNotifications = allNotifications.filter(n => n.type === filter);
            break;
    }

    // Temporarily override the notifications for rendering
    const originalNotifications = window.notificationManager.notifications;
    window.notificationManager.notifications = filteredNotifications;
    window.notificationManager.renderNotifications();
    window.notificationManager.notifications = originalNotifications;

    // Show empty state if no notifications match filter
    const emptyState = document.getElementById('empty-state');
    const notificationsList = document.getElementById('notifications-list');
    
    if (filteredNotifications.length === 0) {
        notificationsList.style.display = 'none';
        emptyState.classList.remove('d-none');
    } else {
        notificationsList.style.display = 'block';
        emptyState.classList.add('d-none');
    }
}

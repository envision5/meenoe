/**
 * Universal Notification System
 * 
 * This module provides utility functions for creating notifications
 * throughout the application. These functions can be called from
 * anywhere in the app to create notifications for users.
 */

// Notification types and their configurations
const NOTIFICATION_TYPES = {
    TEAM_JOIN: {
        type: 'team_join',
        defaultTitle: 'New Team Member',
        icon: 'ti-user-plus',
        color: 'success'
    },
    TEAM_LEAVE: {
        type: 'team_leave',
        defaultTitle: 'Team Member Left',
        icon: 'ti-user-minus',
        color: 'warning'
    },
    MESSAGE: {
        type: 'message',
        defaultTitle: 'New Message',
        icon: 'ti-message-circle',
        color: 'primary'
    },
    MEETING_SCHEDULED: {
        type: 'meeting_scheduled',
        defaultTitle: 'Meeting Scheduled',
        icon: 'ti-calendar',
        color: 'primary'
    },
    MEETING_CANCELLED: {
        type: 'meeting_cancelled',
        defaultTitle: 'Meeting Cancelled',
        icon: 'ti-calendar-off',
        color: 'danger'
    },
    MEETING_REMINDER: {
        type: 'meeting_reminder',
        defaultTitle: 'Meeting Reminder',
        icon: 'ti-clock',
        color: 'warning'
    },
    TASK_ASSIGNED: {
        type: 'task_assigned',
        defaultTitle: 'Task Assigned',
        icon: 'ti-clipboard',
        color: 'info'
    },
    TASK_COMPLETED: {
        type: 'task_complete',
        defaultTitle: 'Task Completed',
        icon: 'ti-check-circle',
        color: 'success'
    },
    FILE_SHARED: {
        type: 'file_shared',
        defaultTitle: 'File Shared',
        icon: 'ti-file-text',
        color: 'info'
    },
    PAYMENT_RECEIVED: {
        type: 'payment_received',
        defaultTitle: 'Payment Received',
        icon: 'ti-credit-card',
        color: 'success'
    },
    PAYMENT_SENT: {
        type: 'payment_sent',
        defaultTitle: 'Payment Sent',
        icon: 'ti-credit-card',
        color: 'info'
    },
    ORGANIZATION_UPDATE: {
        type: 'organization_update',
        defaultTitle: 'Organization Updated',
        icon: 'ti-building',
        color: 'secondary'
    },
    SYSTEM: {
        type: 'system',
        defaultTitle: 'System Notification',
        icon: 'ti-bell',
        color: 'primary'
    }
};

/**
 * Create a notification for a user
 * @param {string} userId - The ID of the user to notify
 * @param {string} type - The type of notification (use NOTIFICATION_TYPES)
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {Object} options - Additional options
 * @param {string} options.avatar - URL to avatar image
 * @param {string} options.actionUrl - URL to navigate to when clicked
 * @param {string} options.actionText - Text for the action button
 * @param {Object} options.metadata - Additional metadata for the notification
 * @returns {string} The notification ID
 */
function createNotification(userId, type, title, message, options = {}) {
    // In a real app, this would make an API call to create the notification
    // For now, we'll just add it to the current user's notifications if they match
    
    const currentUser = window.auth?.getUser();
    if (!currentUser || currentUser.id !== userId) {
        // In a real app, this would still create the notification in the database
        console.log(`Notification created for user ${userId}:`, { type, title, message, options });
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // If it's for the current user, add it to their notifications
    if (window.notificationManager) {
        return window.notificationManager.createNotification(type, title, message, options);
    }

    return null;
}

/**
 * Create a team join notification
 * @param {string} userId - User to notify
 * @param {string} newMemberName - Name of the new team member
 * @param {string} newMemberAvatar - Avatar URL of the new member
 * @returns {string} Notification ID
 */
function notifyTeamJoin(userId, newMemberName, newMemberAvatar = null) {
    return createNotification(
        userId,
        NOTIFICATION_TYPES.TEAM_JOIN.type,
        `${newMemberName} Joined the Team!`,
        'Welcome them to the organization',
        {
            avatar: newMemberAvatar,
            actionUrl: '/organization-staff',
            actionText: 'View Team'
        }
    );
}

/**
 * Create a meeting scheduled notification
 * @param {string} userId - User to notify
 * @param {string} meetingTitle - Title of the meeting
 * @param {Date} meetingDate - Date of the meeting
 * @param {string} meetingId - ID of the meeting
 * @returns {string} Notification ID
 */
function notifyMeetingScheduled(userId, meetingTitle, meetingDate, meetingId) {
    const dateStr = meetingDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return createNotification(
        userId,
        NOTIFICATION_TYPES.MEETING_SCHEDULED.type,
        'Meeting Scheduled',
        `${meetingTitle} scheduled for ${dateStr}`,
        {
            actionUrl: '/my-meenoes',
            actionText: 'View Meeting',
            metadata: { meetingId, meetingDate: meetingDate.toISOString() }
        }
    );
}

/**
 * Create a task assigned notification
 * @param {string} userId - User to notify
 * @param {string} taskTitle - Title of the task
 * @param {string} assignerName - Name of who assigned the task
 * @param {string} assignerAvatar - Avatar of who assigned the task
 * @param {string} taskId - ID of the task
 * @returns {string} Notification ID
 */
function notifyTaskAssigned(userId, taskTitle, assignerName, assignerAvatar = null, taskId = null) {
    return createNotification(
        userId,
        NOTIFICATION_TYPES.TASK_ASSIGNED.type,
        'New Task Assigned',
        `${assignerName} assigned you: ${taskTitle}`,
        {
            avatar: assignerAvatar,
            actionUrl: '/my-files',
            actionText: 'View Task',
            metadata: { taskId, assignerName }
        }
    );
}

/**
 * Create a file shared notification
 * @param {string} userId - User to notify
 * @param {string} fileName - Name of the shared file
 * @param {string} sharerName - Name of who shared the file
 * @param {string} sharerAvatar - Avatar of who shared the file
 * @param {string} fileId - ID of the file
 * @returns {string} Notification ID
 */
function notifyFileShared(userId, fileName, sharerName, sharerAvatar = null, fileId = null) {
    return createNotification(
        userId,
        NOTIFICATION_TYPES.FILE_SHARED.type,
        'File Shared',
        `${sharerName} shared "${fileName}" with you`,
        {
            avatar: sharerAvatar,
            actionUrl: '/my-files',
            actionText: 'View File',
            metadata: { fileId, fileName, sharerName }
        }
    );
}

/**
 * Create a payment notification
 * @param {string} userId - User to notify
 * @param {number} amount - Payment amount
 * @param {string} type - 'received' or 'sent'
 * @param {string} fromToName - Name of sender/recipient
 * @param {string} fromToAvatar - Avatar of sender/recipient
 * @returns {string} Notification ID
 */
function notifyPayment(userId, amount, type, fromToName, fromToAvatar = null) {
    const isReceived = type === 'received';
    const notificationType = isReceived ? NOTIFICATION_TYPES.PAYMENT_RECEIVED : NOTIFICATION_TYPES.PAYMENT_SENT;
    
    const title = isReceived ? 'Payment Received' : 'Payment Sent';
    const message = isReceived 
        ? `You received $${amount} from ${fromToName}`
        : `$${amount} sent to ${fromToName}`;

    return createNotification(
        userId,
        notificationType.type,
        title,
        message,
        {
            avatar: fromToAvatar,
            actionUrl: '/settings',
            actionText: 'View Transaction',
            metadata: { amount, type, fromToName }
        }
    );
}

/**
 * Create a message notification
 * @param {string} userId - User to notify
 * @param {string} senderName - Name of message sender
 * @param {string} messagePreview - Preview of the message
 * @param {string} senderAvatar - Avatar of sender
 * @param {string} conversationId - ID of the conversation
 * @returns {string} Notification ID
 */
function notifyMessage(userId, senderName, messagePreview, senderAvatar = null, conversationId = null) {
    return createNotification(
        userId,
        NOTIFICATION_TYPES.MESSAGE.type,
        'New Message',
        `${senderName}: ${messagePreview}`,
        {
            avatar: senderAvatar,
            actionUrl: '/my-files', // Update when messaging system is built
            actionText: 'View Message',
            metadata: { senderName, conversationId }
        }
    );
}

/**
 * Create a system notification
 * @param {string} userId - User to notify
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} actionUrl - Optional action URL
 * @param {string} actionText - Optional action text
 * @returns {string} Notification ID
 */
function notifySystem(userId, title, message, actionUrl = null, actionText = null) {
    return createNotification(
        userId,
        NOTIFICATION_TYPES.SYSTEM.type,
        title,
        message,
        {
            actionUrl,
            actionText
        }
    );
}

// Export functions for use throughout the app
window.NotificationUtils = {
    createNotification,
    notifyTeamJoin,
    notifyMeetingScheduled,
    notifyTaskAssigned,
    notifyFileShared,
    notifyPayment,
    notifyMessage,
    notifySystem,
    NOTIFICATION_TYPES
};

// Example usage functions (these would be called from other parts of the app)
window.NotificationExamples = {
    // Example: When someone joins a team
    onTeamMemberJoined: (newMemberName, newMemberAvatar) => {
        const currentUser = window.auth?.getUser();
        if (currentUser) {
            notifyTeamJoin(currentUser.id, newMemberName, newMemberAvatar);
        }
    },

    // Example: When a meeting is scheduled
    onMeetingScheduled: (meetingTitle, meetingDate, meetingId) => {
        const currentUser = window.auth?.getUser();
        if (currentUser) {
            notifyMeetingScheduled(currentUser.id, meetingTitle, meetingDate, meetingId);
        }
    },

    // Example: When a file is shared
    onFileShared: (fileName, sharerName, sharerAvatar, fileId) => {
        const currentUser = window.auth?.getUser();
        if (currentUser) {
            notifyFileShared(currentUser.id, fileName, sharerName, sharerAvatar, fileId);
        }
    },

    // Example: Test notification creation
    createTestNotification: () => {
        const currentUser = window.auth?.getUser();
        if (currentUser) {
            notifySystem(
                currentUser.id,
                'Test Notification',
                'This is a test notification to verify the system is working',
                '/notifications',
                'View All Notifications'
            );
        }
    }
};

console.log('Notification utilities loaded. Use window.NotificationUtils or window.NotificationExamples to create notifications.');
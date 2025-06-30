/**
 * Meenoe AI Integration Layer
 * Provides AI assistant with comprehensive access to all Meenoe systems
 */

class MeenoeAIIntegration {
    constructor() {
        this.functions = new Map();
        this.contextCache = new Map();
        this.eventListeners = new Map();
        
        this.initializeFunctions();
        this.setupEventListeners();
        
        console.log('🔗 Meenoe AI Integration initialized');
    }

    initializeFunctions() {
        // Register all available functions for AI
        this.registerStateManagementFunctions();
        this.registerAgendaFlowFunctions();
        this.registerActionManagementFunctions();
        this.registerInitializationFunctions();
        this.registerUtilityFunctions();
    }

    registerStateManagementFunctions() {
        // Meenoe State Management Functions
        this.registerFunction({
            name: 'getCurrentMeenoeState',
            description: 'Get the complete current state of the Meenoe session including counters, participants, agenda items, and actions',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.getCurrentMeenoeState()
        });

        this.registerFunction({
            name: 'updateUserCount',
            description: 'Update the participant count in the Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'New participant count' }
                },
                required: ['count']
            },
            handler: (params) => this.updateUserCount(params.count)
        });

        this.registerFunction({
            name: 'updateAgendaCount',
            description: 'Update the agenda items count',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'New agenda count' }
                },
                required: ['count']
            },
            handler: (params) => this.updateAgendaCount(params.count)
        });

        this.registerFunction({
            name: 'updateFileCount',
            description: 'Update the file attachments count',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'New file count' }
                },
                required: ['count']
            },
            handler: (params) => this.updateFileCount(params.count)
        });

        this.registerFunction({
            name: 'updateActionCount',
            description: 'Update the action items count',
            parameters: {
                type: 'object',
                properties: {
                    count: { type: 'number', description: 'New action count' }
                },
                required: ['count']
            },
            handler: (params) => this.updateActionCount(params.count)
        });

        this.registerFunction({
            name: 'refreshAllCounters',
            description: 'Refresh and sync all counters with current system state',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.refreshAllCounters()
        });
    }

    registerAgendaFlowFunctions() {
        // Agenda Flow Management Functions

        // Create an action from a thread on an agenda point
        this.registerFunction({
            name: 'connectActionToAgendaThread',
            description: 'Create a connected action from a thread on an agenda point. Triggers the UI flow to create an action node linked to the agenda and thread.',
            parameters: {
                type: 'object',
                properties: {
                    agendaId: { type: 'string', description: 'Agenda item ID' },
                    threadId: { type: 'string', description: 'Thread ID to convert to action' }
                },
                required: ['agendaId', 'threadId']
            },
            handler: (params) => this.connectActionToAgendaThread(params.agendaId, params.threadId)
        });

        this.registerFunction({
            name: 'summarizeAgendaThreads',
            description: 'Get a summary of all threads for a specific agenda point',
            parameters: {
                type: 'object',
                properties: {
                    agendaId: { type: 'string', description: 'Agenda point ID' }
                },
                required: ['agendaId']
            },
            handler: (params) => {
                const agendaItem = window.agendaFlow?.state?.agendaItems?.get(params.agendaId);
                if (!agendaItem || !agendaItem.threads) return { agendaId: params.agendaId, summary: [] };
                return {
                    agendaId: params.agendaId,
                    summary: agendaItem.threads.map(t => ({
                        author: t.author,
                        created: t.created,
                        summary: t.content ? t.content.slice(0, 100) : ''
                    }))
                };
            }
        });

        this.registerFunction({
            name: 'createAgendaPoint',
            description: 'Create a new agenda item with title, description, and urgency level',
            parameters: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Agenda item title' },
                    description: { type: 'string', description: 'Detailed description of the agenda item' },
                    urgency: { type: 'string', enum: ['normal', 'moderate', 'important', 'critical', 'mandatory'], description: 'Urgency level (normal/moderate/important/critical/mandatory)' }
                },
                required: ['title']
            },
            handler: (params) => this.createAgendaPoint(params.title, params.description, params.urgency)
        });

        this.registerFunction({
            name: 'updateAgendaPoint',
            description: 'Update an existing agenda item',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Agenda item ID' },
                    updates: { 
                        type: 'object', 
                        description: 'Object containing fields to update',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            urgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] }
                        }
                    }
                },
                required: ['id', 'updates']
            },
            handler: (params) => this.updateAgendaPoint(params.id, params.updates)
        });

        this.registerFunction({
            name: 'deleteAgendaPoint',
            description: 'Remove an agenda item from the meeting',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Agenda item ID to delete' }
                },
                required: ['id']
            },
            handler: (params) => this.deleteAgendaPoint(params.id)
        });

        this.registerFunction({
            name: 'reorderAgendaPoints',
            description: 'Reorder agenda items by providing new order array',
            parameters: {
                type: 'object',
                properties: {
                    newOrder: { 
                        type: 'array', 
                        items: { type: 'string' },
                        description: 'Array of agenda item IDs in new order' 
                    }
                },
                required: ['newOrder']
            },
            handler: (params) => this.reorderAgendaPoints(params.newOrder)
        });
 
        this.registerFunction({
            name: 'addThreadToAgenda',
            description: 'Add a discussion thread to an agenda item',
            parameters: {
                type: 'object',
                properties: {
                    agendaId: { type: 'string', description: 'Agenda item ID' },
                    content: { type: 'string', description: 'Thread content' },
                    author: { type: 'string', description: 'Thread author name' }
                },
                required: ['agendaId', 'content', 'author']
            },
            handler: (params) => this.addThreadToAgenda(params.agendaId, params.content, params.author)
        });

        this.registerFunction({
            name: 'setAgendaUrgency',
            description: 'Set the urgency level for an agenda item',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Agenda item ID' },
                    urgency: { type: 'string', enum: ['normal', 'moderate', 'important', 'critical', 'mandatory'], description: 'New urgency level' }
                },
                required: ['id', 'urgency']
            },
            handler: (params) => this.setAgendaUrgency(params.id, params.urgency)
        });

        this.registerFunction({
            name: 'linkAgendaToAction',
            description: 'Create a link between an agenda item and an action item',
            parameters: {
                type: 'object',
                properties: {
                    agendaId: { type: 'string', description: 'Agenda item ID' },
                    actionId: { type: 'string', description: 'Action item ID' }
                },
                required: ['agendaId', 'actionId']
            },
            handler: (params) => this.linkAgendaToAction(params.agendaId, params.actionId)
        });

        this.registerFunction({
            name: 'getAgendaAnalytics',
            description: 'Get analytics and metrics about agenda items and discussions',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.getAgendaAnalytics()
        });
    }

    registerActionManagementFunctions() {
        // Tab Switching Functions
        // Robust Tab Switching Functions
        this.registerFunction({
            name: 'switchToAgendaTab',
            description: 'Switch the UI to the Agenda tab',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => {
                // Switch to default layout if not already
                const layoutContainer = document.querySelector('.layout-container');
                const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');
                if (!isDefaultLayout) {
                    const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
                    if (defaultLayoutBtn) defaultLayoutBtn.click();
                }
                // Try to find the tab button (nav-link) and tab pane
                let tabBtn = document.getElementById('agenda-tab');
                if (!tabBtn) {
                    // Try fallback: look for nav-link with data-bs-target or href
                    tabBtn = document.querySelector('[data-bs-target="#agenda-section"], [href="#agenda-section"]');
                }
                if (tabBtn) {
                    // Try Bootstrap API
                    try {
                        if (window.bootstrap && window.bootstrap.Tab) {
                            const tab = new bootstrap.Tab(tabBtn);
                            tab.show();
                            console.log('Switched tab using Bootstrap.Tab API');
                        } else {
                            tabBtn.click();
                            console.log('Switched tab using click()');
                        }
                    } catch (e) {
                        tabBtn.click();
                        console.log('Switched tab using click() after Bootstrap.Tab error');
                    }
                    return { success: true, method: 'tabBtn', found: true };
                } else {
                    // Try fallback: click the first nav-link containing "Agenda"
                    const navLinks = Array.from(document.querySelectorAll('.nav-link, [role="tab"]'));
                    const agendaLink = navLinks.find(link => link.textContent && link.textContent.toLowerCase().includes('agenda'));
                    if (agendaLink) {
                        agendaLink.click();
                        console.log('Switched tab using fallback agendaLink');
                        return { success: true, method: 'agendaLink', found: true };
                    }
                    console.warn('Agenda tab not found');
                    return { success: false, error: 'Agenda tab not found' };
                }
            }
        });
        this.registerFunction({
            name: 'switchToActionsTab',
            description: 'Switch the UI to the Actions tab',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => {
                // Switch to default layout if not already
                const layoutContainer = document.querySelector('.layout-container');
                const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');
                if (!isDefaultLayout) {
                    const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
                    if (defaultLayoutBtn) defaultLayoutBtn.click();
                }
                let tabBtn = document.getElementById('actions-tab');
                if (!tabBtn) {
                    tabBtn = document.querySelector('[data-bs-target="#actions-section"], [href="#actions-section"]');
                }
                if (tabBtn) {
                    try {
                        if (window.bootstrap && window.bootstrap.Tab) {
                            const tab = new bootstrap.Tab(tabBtn);
                            tab.show();
                            console.log('Switched tab using Bootstrap.Tab API');
                        } else {
                            tabBtn.click();
                            console.log('Switched tab using click()');
                        }
                    } catch (e) {
                        tabBtn.click();
                        console.log('Switched tab using click() after Bootstrap.Tab error');
                    }
                    return { success: true, method: 'tabBtn', found: true };
                } else {
                    const navLinks = Array.from(document.querySelectorAll('.nav-link, [role="tab"]'));
                    const actionsLink = navLinks.find(link => link.textContent && link.textContent.toLowerCase().includes('action'));
                    if (actionsLink) {
                        actionsLink.click();
                        console.log('Switched tab using fallback actionsLink');
                        return { success: true, method: 'actionsLink', found: true };
                    }
                    console.warn('Actions tab not found');
                    return { success: false, error: 'Actions tab not found' };
                }
            }
        });
        this.registerFunction({
            name: 'switchToDetailsTab',
            description: 'Switch the UI to the Details tab',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => {
                // Switch to default layout if not already
                const layoutContainer = document.querySelector('.layout-container');
                const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');
                if (!isDefaultLayout) {
                    const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
                    if (defaultLayoutBtn) defaultLayoutBtn.click();
                }
                let tabBtn = document.getElementById('details-tab');
                if (!tabBtn) {
                    tabBtn = document.querySelector('[data-bs-target="#details-section"], [href="#details-section"]');
                }
                if (tabBtn) {
                    try {
                        if (window.bootstrap && window.bootstrap.Tab) {
                            const tab = new bootstrap.Tab(tabBtn);
                            tab.show();
                            console.log('Switched tab using Bootstrap.Tab API');
                        } else {
                            tabBtn.click();
                            console.log('Switched tab using click()');
                        }
                    } catch (e) {
                        tabBtn.click();
                        console.log('Switched tab using click() after Bootstrap.Tab error');
                    }
                    return { success: true, method: 'tabBtn', found: true };
                } else {
                    const navLinks = Array.from(document.querySelectorAll('.nav-link, [role="tab"]'));
                    const detailsLink = navLinks.find(link => link.textContent && link.textContent.toLowerCase().includes('detail'));
                    if (detailsLink) {
                        detailsLink.click();
                        console.log('Switched tab using fallback detailsLink');
                        return { success: true, method: 'detailsLink', found: true };
                    }
                    console.warn('Details tab not found');
                    return { success: false, error: 'Details tab not found' };
                }
            }
        });

        // Action Management Functions
        this.registerFunction({
            name: 'createAction',
            description: 'Create a new action item with title and optional type',
            parameters: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'Action item title' },
                    actionType: { type: 'string', enum: ['Approvals', 'Surveys', 'Signing', 'Voting', 'Feedback', 'Brainstorming', 'Scheduling', 'Reporting', 'Video', 'Audio', 'Presentation', 'Integrations', 'Custom Action'], description: 'Type of action' },
                    assignee: { type: 'string', description: 'Person assigned to the action (user name)' },
                    actionDate: { type: 'string', description: 'Due date in ISO format' },
                    actionTrigger: { type: 'object', description: 'Trigger object for the action' }
                },
                required: ['title']
            },
            handler: (params) => this.createAction(params.title, params.actionType, params.assignee, params.actionDate, params.actionTrigger)
        });

        this.registerFunction({
            name: 'setActionTrigger',
            description: 'Set or update the trigger for an existing action item',
            parameters: {
                type: 'object',
                properties: {
                    actionId: { type: 'string', description: 'Action item ID' },
                    trigger: { type: 'object', description: 'Trigger object to set' }
                },
                required: ['actionId', 'trigger']
            },
            handler: (params) => this.setActionTrigger(params.actionId, params.trigger)
        });

        this.registerFunction({
            name: 'updateAction',
            description: 'Update an existing action item',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Action item ID' },
                    updates: {
                        type: 'object',
                        description: 'Object containing fields to update',
                        properties: {
                            actionTitle: { type: 'string', description: 'Action title' },
                            actionType: { type: 'string', enum: ['Approvals', 'Surveys', 'Signing', 'Voting', 'Feedback', 'Brainstorming', 'Scheduling', 'Reporting', 'Video', 'Audio', 'Presentation', 'Integrations', 'Custom Action'], description: 'Action type' },
                            actionUsers: { type: 'array', items: { type: 'string' }, description: 'Array of assigned users' },
                            actionDate: { type: 'string', description: 'Due date in ISO format' },
                            actionStatus: { type: 'string', enum: ['open', 'complete', 'queued'], description: 'Action status' }
                        }
                    }
                },
                required: ['id', 'updates']
            },
            handler: (params) => this.updateAction(params.id, params.updates)
        });

        this.registerFunction({
            name: 'deleteAction',
            description: 'Remove an action item',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Action item ID to delete' }
                },
                required: ['id']
            },
            handler: (params) => this.deleteAction(params.id)
        });

        this.registerFunction({
            name: 'assignAction',
            description: 'Assign an action item to a specific user',
            parameters: {
                type: 'object',
                properties: {
                    actionId: { type: 'string', description: 'Action item ID' },
                    userId: { type: 'string', description: 'User ID to assign to' }
                },
                required: ['actionId', 'userId']
            },
            handler: (params) => this.assignAction(params.actionId, params.userId)
        });

        this.registerFunction({
            name: 'setActionStatus',
            description: 'Update the status of an action item',
            parameters: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Action item ID' },
                    status: { type: 'string', enum: ['open', 'in-progress', 'complete', 'blocked'], description: 'New status' }
                },
                required: ['id', 'status']
            },
            handler: (params) => this.setActionStatus(params.id, params.status)
        });

        this.registerFunction({
            name: 'createSubAction',
            description: 'Create a sub-action under a parent action item',
            parameters: {
                type: 'object',
                properties: {
                    parentId: { type: 'string', description: 'Parent action item ID' },
                    details: { 
                        type: 'object', 
                        description: 'Sub-action details',
                        properties: {
                            title: { type: 'string' },
                            description: { type: 'string' },
                            assignee: { type: 'string' },
                            dueDate: { type: 'string' }
                        },
                        required: ['title']
                    }
                },
                required: ['parentId', 'details']
            },
            handler: (params) => this.createSubAction(params.parentId, params.details)
        });

        this.registerFunction({
            name: 'linkActionToAgenda',
            description: 'Link an action item to an agenda item',
            parameters: {
                type: 'object',
                properties: {
                    actionId: { type: 'string', description: 'Action item ID' },
                    agendaId: { type: 'string', description: 'Agenda item ID' }
                },
                required: ['actionId', 'agendaId']
            },
            handler: (params) => this.linkActionToAgenda(params.actionId, params.agendaId)
        });

        this.registerFunction({
            name: 'getActionAnalytics',
            description: 'Get analytics and metrics about action items and completion rates',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.getActionAnalytics()
        });
    }

    registerInitializationFunctions() {
        // Meenoe Initialization Functions
        this.registerFunction({
            name: 'initializeMeenoe',
            description: 'Initialize a new Meenoe session with configuration',
            parameters: {
                type: 'object',
                properties: {
                    config: {
                        type: 'object',
                        description: 'Meenoe configuration object',
                        properties: {
                            title: { type: 'string' },
                            objective: { type: 'string' },
                            participants: { type: 'array', items: { type: 'string' } }
                        }
                    }
                },
                required: ['config']
            },
            handler: (params) => this.initializeMeenoe(params.config)
        });

        this.registerFunction({
            name: 'updateMeenoeTitle',
            description: 'Update the title of the current Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    title: { type: 'string', description: 'New meeting title' }
                },
                required: ['title']
            },
            handler: (params) => this.updateMeenoeTitle(params.title)
        });

        this.registerFunction({
            name: 'updateMeenoeObjective',
            description: 'Update the objective/purpose of the current Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    objective: { type: 'string', description: 'New meeting objective' }
                },
                required: ['objective']
            },
            handler: (params) => this.updateMeenoeObjective(params.objective)
        });

        this.registerFunction({
            name: 'addParticipant',
            description: 'Add a participant to the Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    userDetails: {
                        type: 'object',
                        description: 'Participant details',
                        properties: {
                            name: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string' }
                        },
                        required: ['name']
                    }
                },
                required: ['userDetails']
            },
            handler: (params) => this.addParticipant(params.userDetails)
        });

        this.registerFunction({
            name: 'removeParticipant',
            description: 'Remove a participant from the Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    userId: { type: 'string', description: 'User ID to remove' }
                },
                required: ['userId']
            },
            handler: (params) => this.removeParticipant(params.userId)
        });

        this.registerFunction({
            name: 'setMeenoeStatus',
            description: 'Update the publishing status of the Meenoe session',
            parameters: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['draft', 'live', 'completed', 'archived'], description: 'New status' }
                },
                required: ['status']
            },
            handler: (params) => this.setMeenoeStatus(params.status)
        });

        this.registerFunction({
            name: 'configureMeenoeSettings',
            description: 'Configure various Meenoe session settings',
            parameters: {
                type: 'object',
                properties: {
                    settings: {
                        type: 'object',
                        description: 'Settings object',
                        properties: {
                            allowPublicAccess: { type: 'boolean' },
                            enableNotifications: { type: 'boolean' },
                            autoSave: { type: 'boolean' }
                        }
                    }
                },
                required: ['settings']
            },
            handler: (params) => this.configureMeenoeSettings(params.settings)
        });
    }

    registerUtilityFunctions() {
        // Utility Functions
        this.registerFunction({
            name: 'analyzeMeetingStructure',
            description: 'Analyze the current meeting structure and provide optimization suggestions',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.analyzeMeetingStructure()
        });

        this.registerFunction({
            name: 'generateMeetingSummary',
            description: 'Generate a comprehensive summary of the current meeting state',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            },
            handler: () => this.generateMeetingSummary()
        });

        this.registerFunction({
            name: 'extractActionsFromText',
            description: 'Extract potential action items from provided text',
            parameters: {
                type: 'object',
                properties: {
                    text: { type: 'string', description: 'Text to analyze for action items' }
                },
                required: ['text']
            },
            handler: (params) => this.extractActionsFromText(params.text)
        });

        this.registerFunction({
            name: 'suggestAgendaStructure',
            description: 'Suggest an optimal agenda structure based on meeting objective and participants',
            parameters: {
                type: 'object',
                properties: {
                    objective: { type: 'string', description: 'Meeting objective' },
                    participantCount: { type: 'number', description: 'Number of participants' },
                    duration: { type: 'number', description: 'Meeting duration in minutes' }
                },
                required: ['objective']
            },
            handler: (params) => this.suggestAgendaStructure(params.objective, params.participantCount, params.duration)
        });
    }

    registerFunction(functionDef) {
        this.functions.set(functionDef.name, functionDef);
    }

    getFunctionDefinitions() {
        return Array.from(this.functions.values()).map(func => ({
            name: func.name,
            description: func.description,
            parameters: func.parameters
        }));
    }

    async executeFunction(functionName, parameters) {
        const func = this.functions.get(functionName);
        if (!func) {
            throw new Error(`Function ${functionName} not found`);
        }

        try {
            console.log(`🔧 Executing function: ${functionName}`, parameters);
            const result = await func.handler(parameters);
            console.log(`✅ Function ${functionName} completed`, result);
            return result;
        } catch (error) {
            console.error(`❌ Function ${functionName} failed:`, error);
            throw error;
        }
    }

    setupEventListeners() {
        // Listen for Meenoe system events
        window.addEventListener('meenoeStateChanged', (event) => {
            this.handleStateChange(event.detail);
        });

        window.addEventListener('meenoeAgendaChanged', (event) => {
            this.handleAgendaChange(event.detail);
        });

        window.addEventListener('meenoeActionsChanged', (event) => {
            this.handleActionsChange(event.detail);
        });

        window.addEventListener('meenoeUsersChanged', (event) => {
            this.handleUsersChange(event.detail);
        });
    }

    // State Management Function Implementations
    getCurrentMeenoeState() {
        // Check if meenoe state system is available
        if (!window.meenoeState) {
            console.warn('Meenoe state system not available, returning empty state');
            return this.getEmptyMeenoeState();
        }

        try {
            // Use deep state to include full agenda/action/thread details
            const deepState = window.meenoeState.getState(true);
            return {
                ...deepState,
                timestamp: new Date().toISOString(),
                systemStatus: {
                    agendaFlowAvailable: !!window.agendaFlow,
                    actionsAvailable: !!window.tree,
                    usersAvailable: !!window.meenoeUsers,
                    integrationsAvailable: !!window.meenoeIntegrations
                }
            };
        } catch (error) {
            console.warn('Error getting Meenoe state:', error);
            return this.getEmptyMeenoeState();
        }
    }

    getEmptyMeenoeState() {
        return {
            name: '',
            objective: '',
            agenda: [],
            actions: [],
            users: [],
            files: [],
            timestamp: new Date().toISOString(),
            systemStatus: {
                agendaFlowAvailable: false,
                actionsAvailable: false,
                usersAvailable: false,
                integrationsAvailable: false
            }
        };
    }

    updateUserCount(count) {
        if (!window.meenoeState) {
            throw new Error('Meenoe state system not available');
        }

        window.meenoeState.updateUserCount(count);
        return { success: true, newCount: count };
    }

    updateAgendaCount(count) {
        if (!window.meenoeState) {
            throw new Error('Meenoe state system not available');
        }

        window.meenoeState.updateAgendaCount(count);
        return { success: true, newCount: count };
    }

    updateFileCount(count) {
        if (!window.meenoeState) {
            throw new Error('Meenoe state system not available');
        }

        window.meenoeState.updateFileCount(count);
        return { success: true, newCount: count };
    }

    updateActionCount(count) {
        if (!window.meenoeState) {
            throw new Error('Meenoe state system not available');
        }

        window.meenoeState.updateActionCount(count);
        return { success: true, newCount: count };
    }

    refreshAllCounters() {
        if (!window.meenoeState) {
            throw new Error('Meenoe state system not available');
        }

        window.meenoeState.refreshAllCounters();
        return { success: true, counters: window.meenoeState.state.counters };
    }

    // Agenda Flow Function Implementations
    createAgendaPoint(title, description = '', urgency = 'normal') {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        try {
            // Use the proper AgendaFlow method to create the agenda point
            window.agendaFlow.addNewAgendaPoint(title, description);

            // Get the newly created agenda item
            const agendaItems = Array.from(window.agendaFlow.state.agendaItems.values());
            const newItem = agendaItems[agendaItems.length - 1];

            if (newItem && urgency !== 'normal') {
                // Update the urgency in the state
                newItem.urgency = urgency;
                window.agendaFlow.state.agendaItems.set(newItem.id, newItem);

                // Update the UI urgency display
                window.agendaFlow.updateAgendaPointUrgency(urgency);
            }

            return {
                success: true,
                agendaId: newItem?.id,
                title: title,
                description: description,
                urgency: urgency
            };
        } catch (error) {
            throw new Error(`Failed to create agenda point: ${error.message}`);
        }
    }

    updateAgendaPoint(id, updates) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItem = window.agendaFlow.state.agendaItems.get(id);
        if (!agendaItem) {
            throw new Error(`Agenda item ${id} not found`);
        }

        try {
            // Update the agenda item in state
            Object.assign(agendaItem, updates);
            window.agendaFlow.state.agendaItems.set(id, agendaItem);

            // Update UI if element exists
            const agendaElement = document.querySelector(`[data-agenda-id="${id}"]`);
            // Use AgendaFlow's updateAgendaItemUI for all UI updates
            if (window.agendaFlow && typeof window.agendaFlow.updateAgendaItemUI === 'function') {
                window.agendaFlow.updateAgendaItemUI(id);
            }
            // Explicitly update description in all relevant DOM locations
            if (updates.description) {
                // Main agenda item card
                const agendaElement = document.querySelector(`[data-agenda-id="${id}"]`);
                if (agendaElement) {
                    const descElement = agendaElement.querySelector('.agenda-description');
                    if (descElement && !descElement.isContentEditable) {
                        descElement.textContent = updates.description;
                    }
                }
                // Details panel
                const detailsDesc = document.querySelector('#agenda-point-description .thread-text');
                if (detailsDesc && !detailsDesc.isContentEditable) {
                    detailsDesc.textContent = updates.description;
                }
            }
            // If urgency is updated, call setAgendaUrgency to ensure full UI sync
            if (updates.urgency) {
                this.setAgendaUrgency(id, updates.urgency);
            }

            return { success: true, updatedItem: agendaItem };
        } catch (error) {
            throw new Error(`Failed to update agenda point: ${error.message}`);
        }
    }

    deleteAgendaPoint(id) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        try {
            // Remove from state
            const deleted = window.agendaFlow.state.agendaItems.delete(id);

            if (!deleted) {
                throw new Error(`Agenda item ${id} not found`);
            }

            // Remove from UI
            const agendaElement = document.querySelector(`[data-agenda-id="${id}"]`);
            if (agendaElement) {
                agendaElement.remove();
                window.agendaFlow.renumberAgendaPoints();
            }

            return { success: true, deletedId: id };
        } catch (error) {
            throw new Error(`Failed to delete agenda point: ${error.message}`);
        }
    }

    reorderAgendaPoints(newOrder) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        try {
            const container = document.getElementById('all-agenda-points');
            if (!container) {
                throw new Error('Agenda container not found');
            }

            // Reorder DOM elements
            newOrder.forEach((agendaId, index) => {
                const element = container.querySelector(`[data-agenda-id="${agendaId}"]`);
                if (element) {
                    container.appendChild(element);
                }
            });

            window.agendaFlow.renumberAgendaPoints();
            return { success: true, newOrder: newOrder };
        } catch (error) {
            throw new Error(`Failed to reorder agenda points: ${error.message}`);
        }
    }

    addThreadToAgenda(agendaId, content, author) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItem = window.agendaFlow.state.agendaItems.get(agendaId);
        if (!agendaItem) {
            throw new Error(`Agenda item ${agendaId} not found`);
        }

        try {
            const thread = {
                id: `thread-${Date.now()}`,
                content: content,
                author: author,
                timestamp: new Date().toISOString()
            };

            if (!agendaItem.threads) {
                agendaItem.threads = [];
            }

            agendaItem.threads.push(thread);
            window.agendaFlow.state.agendaItems.set(agendaId, agendaItem);

            return { success: true, threadId: thread.id, agendaId: agendaId };
        } catch (error) {
            throw new Error(`Failed to add thread to agenda: ${error.message}`);
        }
    }

    editAgendaThread(agendaId, threadId, content) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItem = window.agendaFlow.state.agendaItems.get(agendaId);
        if (!agendaItem) {
            throw new Error(`Agenda item ${agendaId} not found`);
        }

        if (!agendaItem.threads) {
            throw new Error('No threads found for this agenda item');
        }

        const thread = agendaItem.threads.find(t => t.id === threadId);
        if (!thread) {
            throw new Error(`Thread ${threadId} not found`);
        }

        try {
            thread.content = content;
            thread.isEditing = false;
            window.agendaFlow.state.agendaItems.set(agendaId, agendaItem);

            return { success: true, threadId: threadId, agendaId: agendaId };
        } catch (error) {
            throw new Error(`Failed to edit thread: ${error.message}`);
        }
    }

    deleteAgendaThread(agendaId, threadId) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItem = window.agendaFlow.state.agendaItems.get(agendaId);
        if (!agendaItem) {
            throw new Error(`Agenda item ${agendaId} not found`);
        }

        if (!agendaItem.threads) {
            throw new Error('No threads found for this agenda item');
        }

        try {
            agendaItem.threads = agendaItem.threads.filter(t => t.id !== threadId);
            window.agendaFlow.state.agendaItems.set(agendaId, agendaItem);

            return { success: true, threadId: threadId, agendaId: agendaId };
        } catch (error) {
            throw new Error(`Failed to delete thread: ${error.message}`);
        }
    }

    setAgendaUrgency(id, urgency) {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItem = window.agendaFlow.state.agendaItems.get(id);
        if (!agendaItem) {
            throw new Error(`Agenda item ${id} not found`);
        }

        try {
            agendaItem.urgency = urgency;
            window.agendaFlow.state.agendaItems.set(id, agendaItem);

            // Update UI urgency badge (agenda-point-urgency)
            const agendaElement = document.querySelector(`[data-agenda-id="${id}"]`);
            if (agendaElement) {
                const urgencyBadge = agendaElement.querySelector('.agenda-point-urgency');
                if (urgencyBadge) {
                    urgencyBadge.textContent = urgency.charAt(0).toUpperCase() + urgency.slice(1);
                    // Remove all possible urgency classes before adding the new one
                    const urgencyClasses = ['text-bg-muted','text-bg-secondary','text-bg-primary','text-bg-warning','text-bg-danger'];
                    urgencyBadge.className = 'mb-1 badge rounded-pill agenda-point-urgency';
                    // Map urgency to class (should match agendaflow.js)
                    const urgencyMap = {
                        normal: 'text-bg-muted',
                        moderate: 'text-bg-secondary',
                        important: 'text-bg-primary',
                        critical: 'text-bg-warning',
                        mandatory: 'text-bg-danger'
                    };
                    urgencyBadge.classList.add(urgencyMap[urgency] || 'text-bg-primary');
                }
                // Use AgendaFlow's updateAgendaItemBackground for correct background update
                if (window.agendaFlow && window.agendaFlow.state && Array.isArray(window.agendaFlow.state.urgencyLevels)) {
                    const urgencyLevel = window.agendaFlow.state.urgencyLevels.find(level => level.id === urgency);
                    if (urgencyLevel && typeof window.agendaFlow.updateAgendaItemBackground === 'function') {
                        window.agendaFlow.updateAgendaItemBackground(id, urgencyLevel.bgClass);
                    }
                    // Update border class to match urgency
                    if (agendaElement && window.agendaFlow && window.agendaFlow.state && Array.isArray(window.agendaFlow.state.urgencyLevels)) {
                        const urgencyLevel = window.agendaFlow.state.urgencyLevels.find(level => level.id === urgency);
                        if (urgencyLevel) {
                            const allBorderClasses = ['border-dark', 'border-secondary', 'border-primary', 'border-warning', 'border-danger'];
                            agendaElement.classList.remove(...allBorderClasses);
                            agendaElement.classList.add(urgencyLevel.borderClass);
                        }
                    }
                }
            }

            return { success: true, agendaId: id, urgency: urgency };
        } catch (error) {
            throw new Error(`Failed to set agenda urgency: ${error.message}`);
        }
    }

    linkAgendaToAction(agendaId, actionId) {
        if (!window.agendaFlow || !window.tree) {
            throw new Error('AgendaFlow or Actions system not available');
        }

        try {
            // Find the action node
            const actionNode = this.findActionNode(window.tree, actionId);
            if (!actionNode) {
                throw new Error(`Action ${actionId} not found`);
            }

            // Link agenda to action
            if (!actionNode.linkedAgenda) {
                actionNode.linkedAgenda = [];
            }

            if (!actionNode.linkedAgenda.some(link => link.id === agendaId)) {
                actionNode.linkedAgenda.push({ id: agendaId });
            }

            return { success: true, agendaId: agendaId, actionId: actionId };
        } catch (error) {
            throw new Error(`Failed to link agenda to action: ${error.message}`);
        }
    }

    /**
     * Create a connected action from a thread on an agenda point.
     * @param {string} agendaId - The agenda item ID
     * @param {string} threadId - The thread ID to convert to action
     * @returns {object} Result of the operation
     */
    /**
     * Create a connected action from a thread on an agenda point, following the full UI/UX flow.
     * @param {string} agendaId - The agenda item ID
     * @param {string} threadId - The thread ID to convert to action
     * @returns {object} Result of the operation
     */
    /**
     * Create a connected action from a thread on an agenda point, following the full UI/UX flow.
     * @param {string} agendaId - The agenda item ID
     * @param {string} threadId - The thread ID to convert to action
     * @returns {object} Result of the operation
     */
    connectActionToAgendaThread(agendaId, threadId) {
        if (!window.agendaFlow || !window.tree) {
            throw new Error('AgendaFlow or Actions system not available');
        }

        // Get agenda item and thread
        const agendaItem = window.agendaFlow.state.agendaItems.get(agendaId);
        if (!agendaItem || !agendaItem.threads || agendaItem.threads.length === 0) {
            throw new Error('Agenda item or threads not found');
        }

        // If threadId is a number or "0", treat as index (for AI compatibility)
        let threadIndex = -1;
        let thread = null;
        if (typeof threadId === "number" || (typeof threadId === "string" && /^\d+$/.test(threadId))) {
            // If threadId is "0", "1", etc., treat as index
            const idx = parseInt(threadId, 10);
            if (idx >= 0 && idx < agendaItem.threads.length) {
                threadIndex = idx;
                thread = agendaItem.threads[threadIndex];
            }
        }
        // Otherwise, treat as thread id
        if (!thread) {
            threadIndex = agendaItem.threads.findIndex(t => t.id === threadId);
            if (threadIndex !== -1) {
                thread = agendaItem.threads[threadIndex];
            }
        }

        if (!thread) {
            // Log available thread IDs and their order for debugging
            const availableThreadIds = agendaItem.threads.map((t, i) => `${i}: ${t.id}`);
            console.error(`Thread not found. Provided threadId: ${threadId}. Available thread IDs for agenda ${agendaId}:`, availableThreadIds);
            throw new Error(`Thread not found for agendaId=${agendaId} and threadId=${threadId}. Available thread IDs: ${availableThreadIds.join(', ')}`);
        }

        // Switch to default layout if not already
        const layoutContainer = document.querySelector('.layout-container');
        const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');
        if (!isDefaultLayout) {
            const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
            if (defaultLayoutBtn) defaultLayoutBtn.click();
        }

        // Switch to the actions tab
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
            const tab = new bootstrap.Tab(actionsTab);
            tab.show();
        }

        // Create the action with the combined title
        const threadNumber = threadIndex + 1;
        const actionTitle = `${agendaItem.title.trim()} - Thread ${threadNumber}`;
        const newAction = window.tree.createNode(
            actionTitle,
            false,
            null,
            null,
            null,
            'context1'
        );

        // Scroll to and highlight the new action
        setTimeout(() => {
            if (newAction && newAction.elementLi) {
                newAction.elementLi.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newAction.elementLi.classList.add('highlight-action');
                setTimeout(() => {
                    newAction.elementLi.classList.remove('highlight-action');
                }, 2000);
            }
        }, 300);

        // Link the action to the agenda point
        if (newAction) {
            newAction.linkedAgenda = [agendaId];
            // Show success message
            if (window.agendaFlow && typeof window.agendaFlow.showToast === 'function') {
                window.agendaFlow.showToast(`Created new action: ${actionTitle}`, 'success');
            }
            // Redraw the tree to show the new action
            window.tree.drawTree();
        } else {
            throw new Error('Tree object is not available or failed to create action');
        }

        return { success: true, agendaId, threadId: thread.id, actionId: newAction.id, actionTitle };
    }

    getAgendaAnalytics() {
        if (!window.agendaFlow) {
            throw new Error('AgendaFlow system not available');
        }

        const agendaItems = Array.from(window.agendaFlow.state.agendaItems.values());

        const analytics = {
            totalItems: agendaItems.length,
            urgencyDistribution: {
                normal: agendaItems.filter(item => item.urgency === 'normal').length,
                moderate: agendaItems.filter(item => item.urgency === 'moderate').length,
                important: agendaItems.filter(item => item.urgency === 'important').length,
                critical: agendaItems.filter(item => item.urgency === 'critical').length,
                mandatory: agendaItems.filter(item => item.urgency === 'mandatory').length
            },
            totalThreads: agendaItems.reduce((sum, item) => sum + (item.threads?.length || 0), 0),
            averageThreadsPerItem: agendaItems.length > 0 ?
                agendaItems.reduce((sum, item) => sum + (item.threads?.length || 0), 0) / agendaItems.length : 0,
            itemsWithFiles: agendaItems.filter(item => item.files && item.files.length > 0).length,
            createdToday: agendaItems.filter(item => {
                const created = new Date(item.createdAt);
                const today = new Date();
                return created.toDateString() === today.toDateString();
            }).length
        };

        return analytics;
    }

    // Action Management Function Implementations
    /**
     * Utility to switch to the Actions tab in the UI.
     */
    switchToActionsTab() {
        // Switch to default layout if not already
        const layoutContainer = document.querySelector('.layout-container');
        const isDefaultLayout = layoutContainer && layoutContainer.querySelector('.layout-default:not(.d-none)');
        if (!isDefaultLayout) {
            const defaultLayoutBtn = document.querySelector('[data-layout="default"]');
            if (defaultLayoutBtn) defaultLayoutBtn.click();
        }
        // Switch to the actions tab
        const actionsTab = document.getElementById('actions-tab');
        if (actionsTab) {
            const tab = new bootstrap.Tab(actionsTab);
            tab.show();
        }
    }

    createAction(title, actionType = null, assignee = '', actionDate = null, actionTrigger = null) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        // Always switch to actions tab before creating an action
        this.switchToActionsTab();

        try {
            // Use the same logic as the UI and meenoeactions.js
            const newNode = window.tree.createNode(title, false, null, null, null, 'context1');

            if (!newNode) throw new Error('Failed to create action node - createNode returned null');

            // Set all relevant properties using the same property names as the UI
            if (actionType) newNode.actionType = actionType;
            if (assignee) newNode.actionUsers = Array.isArray(assignee) ? assignee : [assignee];
            if (actionDate) newNode.actionDate = actionDate;
            if (actionTrigger) newNode.actionTrigger = actionTrigger;

            // Redraw tree to show changes
            window.tree.drawTree();

            // --- BEGIN: UI/DOM update for action type (mimic meenoeInit.js logic) ---
            // Find the action card DOM element by node id
            const card = document.getElementById(newNode.id);
            if (card && card.classList.contains('meenoe-action-card')) {
                let actionSelector = card.querySelector('.action-selector');
                if (!actionSelector) {
                    actionSelector = document.createElement('div');
                    actionSelector.className = 'action-selector';
                    card.prepend(actionSelector);
                }
                // Set up the actionSelector UI if actionType is present
                if (actionType) {
                    // Determine action status class
                    let actionStatus = newNode.actionStatus || 'open';
                    let actionStatusClass = 'warning';
                    if (actionStatus === 'open') actionStatusClass = 'warning';
                    else if (actionStatus === 'pending') actionStatusClass = 'primary';
                    else if (actionStatus === 'complete') actionStatusClass = 'success';
                    else if (actionStatus === 'queued') actionStatusClass = 'dark';

                    // Map of action type to icon class
                    const actionTypeIcons = {
                        "Approvals": "ti ti-square-check",
                        "Surveys": "ti ti-help-hexagon",
                        "Signing": "ti ti-signature",
                        "Project": "ti ti-layout-kanban",
                        "Voting": "ti ti-ballpen",
                        "Tasklist": "ti ti-checklist",
                        "Brainstorming": "ti ti-grain",
                        "Documentation": "ti ti-file-description",
                        "Policies": "ti ti-notebook",
                        "Discussion": "ti ti-message-plus",
                        "Resource Allocation": "ti ti-target",
                        "Reviews": "ti ti-text-scan-2",
                        "Feedback": "ti ti-message-forward",
                        "Assessments": "ti ti-square-rounded-check",
                        "Problem Solving": "ti ti-mood-check",
                        "File Uploads": "ti ti-upload",
                        "Video": "ti ti-video",
                        "Audio": "ti ti-microphone",
                        "Presentation": "ti ti-presentation",
                        "Integrations": "ti ti-arrow-iteration",
                        "Custom Action": "ti ti-adjustments-check"
                    };
                    // Map of action type to description
                    const actionDescriptions = {
                        "Approvals": "Approvals are crucial for ensuring that decisions are made collectively and with full understanding of the implications.\nThis process involves reviewing and approving documents or proposals.",
                        "Surveys": "Surveys are essential for gathering feedback and insights from various stakeholders.\nThey help in understanding the needs, preferences, and opinions of the participants.",
                        "Signing": "Signing is a formal way of agreeing to terms or conditions.\nIt's often used in legal documents, contracts, or agreements to validate the consent of the parties involved.",
                        "Project": "Projects are structured efforts to create a product, service, or result.\nThey involve planning, execution, and monitoring to achieve specific goals within a defined timeframe",
                        "Voting": "Voting is a democratic process where individuals express their preferences for a particular choice.\nIt's used in decision-making processes to select options based on majority or consensus",
                        "Tasklist": "Tasklists are lists of tasks or activities that need to be completed.\nThey help in organizing work, tracking progress, and ensuring that all necessary steps are taken",
                        "Brainstorming": "Brainstorming is a creative process to generate ideas and solutions.\nIt involves free thinking and discussion to explore various possibilities and innovations",
                        "Documentation": "Documentation is the process of creating and maintaining records of information.\nIt's crucial for preserving knowledge, facilitating communication, and ensuring accountability",
                        "Policies": "Policies are rules or guidelines established by an organization to govern its operations.\nThey help in maintaining standards, ensuring consistency, and promoting ethical behavior",
                        "Discussion": "Discussion is a process of exchanging ideas and information among individuals or groups.\nIt's essential for problem-solving, decision-making, and fostering collaboration",
                        "Resource Allocation": "Resource allocation is the process of distributing resources among various activities or projects.\nIt involves planning and managing resources efficiently to achieve optimal outcomes",
                        "Reviews": "Reviews are processes of examining and evaluating work or materials.\nThey help in identifying strengths, weaknesses, and areas for improvement",
                        "Feedback": "Feedback is information provided by an individual or group about the performance or quality of a product, service, or process.\nIt's crucial for continuous improvement and learning",
                        "Assessments": "Assessments are evaluations of an individual's or group's knowledge, skills, or abilities.\nThey help in determining the level of competence and identifying areas for development",
                        "Problem Solving": "Problem solving is the process of finding solutions to problems or challenges.\nIt involves identifying issues, analyzing them, and implementing effective strategies to overcome obstacles",
                        "File Uploads": "File uploads are the process of transferring files from a local computer to a server or cloud storage.\nIt's essential for sharing documents, images, and other files with others",
                        "Video": "Video is a medium used for communication, entertainment, education, and various other purposes. Quickly share your video recorded ideas, thoughts or information without needing to type.",
                        "Audio": "Communicate your thoughts, ideas, and details through voice recorded messages in a quick and effective manner without needing to type.",
                        "Presentation": "Presentations are formal or informal speeches or displays of information.\nThey are used to convey ideas, information, or arguments to an audience",
                        "Integrations": "Integrations are the process of combining different systems or applications to work together seamlessly.\nIt's crucial for enhancing functionality, improving efficiency, and achieving synergy",
                        "Custom Action": "Custom actions provide a versatile way to manage various aspects of your life. Simply define the specific action and the associated goal you aim to achieve, then manually track your progress towards it. This way, you can stay organized and focused on your objectives."
                    };

                    // Use current date if not already set
                    let formattedDate = newNode.actionDate;
                    if (!formattedDate) {
                        let currentDate = new Date();
                        formattedDate = currentDate.toLocaleDateString();
                        newNode.actionDate = formattedDate;
                    }

                    // Build the actionSelector innerHTML
                    actionSelector.innerHTML = `
<div class="d-flex align-items-center gap-3">
  <div class="meenoe-action-info-icon p-6 bg-${actionStatusClass}-super-subtle rounded d-flex align-items-center justify-content-center">
    <i class="${actionTypeIcons[actionType] || 'ti ti-grid-dots'} text-${actionStatusClass} fw-semibold fs-7"></i>
  </div>
  <div>
    <h6 class="meenoe_action_type fs-4 fw-semibold">${actionType}</h6>
    <div class="meenoe-action-date fs-2 text-muted">${formattedDate}</div>
  </div>
  <button type="button" class="btn p-2 bg-${actionStatusClass}-super-subtle rounded-circle round-40 btn-sm d-inline-flex align-items-center justify-content-center action-edit-info ms-auto">
    <i class="fs-3 ti ti-pencil text-${actionStatusClass}"></i>
  </button>
</div>
<h6 class="meenoe_action_description text-muted fw-normal mt-2">
  ${actionDescriptions[actionType] || "No description available for this action type."}
</h6>
                    `;
                }
            }
            // --- END: UI/DOM update for action type ---

            // Ensure the DOM for the new action card is fully initialized (AI/agentic support)
            if (typeof window.buildActionCardUI === "function") {
                window.buildActionCardUI(newNode);
            }

            // Return the full node details for downstream use
            return {
                success: true,
                actionId: newNode.id,
                actionTitle: newNode.actionTitle,
                actionType: newNode.actionType,
                actionUsers: newNode.actionUsers,
                actionDate: newNode.actionDate,
                actionStatus: newNode.actionStatus,
                actionTrigger: newNode.actionTrigger,
                childActions: newNode.childNodes?.map(child => child.id) || []
            };
        } catch (error) {
            console.error('❌ Error in createAction:', error);
            throw new Error(`Failed to create action: ${error.message}`);
        }
    }

    setActionTrigger(actionId, trigger) {
        if (!window.tree) throw new Error('Actions system not available');
        const actionNode = this.findActionNode(window.tree, actionId);
        if (!actionNode) throw new Error(`Action ${actionId} not found`);

        // --- Normalize trigger object for UI compatibility ---
        let normalizedTrigger = {};
        if (trigger && typeof trigger === "object") {
            // Normalize triggerType (accepts "due_date", "due date", etc.)
            let type = trigger.triggerType || trigger.type || trigger.trigger_type || "";
            type = type.toLowerCase().replace(/_/g, " ");
            if (type === "due_date") type = "due date";
            if (type === "available_until") type = "available until";
            if (type === "approval based") type = "approval";
            if (type === "fluid" || !type) type = "fluid";
            normalizedTrigger.triggerType = type;

            // Normalize triggerDate
            normalizedTrigger.triggerDate = trigger.triggerDate || trigger.date || trigger.trigger_date || trigger.deadline || "";

            // Normalize frequency
            normalizedTrigger.frequency = trigger.frequency || trigger.freq || "";

            // Normalize conditionPercent
            normalizedTrigger.conditionPercent = trigger.conditionPercent || trigger.percent || trigger.condition_percent || "";

            // Normalize approved
            normalizedTrigger.approved = typeof trigger.approved !== "undefined" ? trigger.approved : null;

            // Start/end (for recurring)
            normalizedTrigger.triggerStart = trigger.triggerStart || trigger.start || "";
            normalizedTrigger.triggerEnd = trigger.triggerEnd || trigger.end || "";
        }

        actionNode.actionTrigger = normalizedTrigger;

        window.tree.drawTree();

        // Update the DOM/UI for the trigger (agentic/AI support)
        if (typeof window.renderActionTriggerUI === "function") {
            window.renderActionTriggerUI(actionNode);
        }

        // Optionally, serialize state
        if (typeof window.tree.serializeNodeById === "function") {
            window.tree.serializeNodeById(actionNode);
        }

        return { success: true, actionId, trigger: normalizedTrigger };
    }

    updateAction(id, updates) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        try {
            const actionNode = this.findActionNode(window.tree, id);
            if (!actionNode) {
                throw new Error(`Action ${id} not found`);
            }

            // Update properties
            if (updates.title) actionNode.actionTitle = updates.title;
            if (updates.description) actionNode.actionDescription = updates.description;
            if (updates.assignee) actionNode.actionUsers = [updates.assignee];
            if (updates.dueDate) actionNode.actionDate = updates.dueDate;
            if (updates.priority) actionNode.actionPriority = updates.priority;
            if (updates.status) actionNode.actionStatus = updates.status;

            // Redraw tree to show changes
            window.tree.drawTree();

            return { success: true, actionId: id, updates: updates };
        } catch (error) {
            throw new Error(`Failed to update action: ${error.message}`);
        }
    }

    deleteAction(id) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        try {
            const actionNode = this.findActionNode(window.tree, id);
            if (!actionNode) {
                throw new Error(`Action ${id} not found`);
            }

            actionNode.removeNode();
            return { success: true, deletedId: id };
        } catch (error) {
            throw new Error(`Failed to delete action: ${error.message}`);
        }
    }

    assignAction(actionId, userId) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        try {
            const actionNode = this.findActionNode(window.tree, actionId);
            if (!actionNode) {
                throw new Error(`Action ${actionId} not found`);
            }

            actionNode.actionUsers = [userId];
            window.tree.drawTree();

            return { success: true, actionId: actionId, assignee: userId };
        } catch (error) {
            throw new Error(`Failed to assign action: ${error.message}`);
        }
    }

    setActionStatus(id, status) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        try {
            const actionNode = this.findActionNode(window.tree, id);
            if (!actionNode) {
                throw new Error(`Action ${id} not found`);
            }

            window.tree.updateNodeStatus(actionNode, status);
            return { success: true, actionId: id, status: status };
        } catch (error) {
            throw new Error(`Failed to set action status: ${error.message}`);
        }
    }

    createSubAction(parentId, details) {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        try {
            const parentNode = this.findActionNode(window.tree, parentId);
            if (!parentNode) {
                throw new Error(`Parent action ${parentId} not found`);
            }

            const subAction = window.tree.createNode(
                details.title,
                false,
                null,
                parentNode,
                null,
                'context1'
            );

            if (subAction) {
                if (details.description) subAction.actionDescription = details.description;
                if (details.assignee) subAction.actionUsers = [details.assignee];
                if (details.dueDate) subAction.actionDate = details.dueDate;

                window.tree.drawTree();

                return {
                    success: true,
                    subActionId: subAction.id,
                    parentId: parentId,
                    details: details
                };
            } else {
                throw new Error('Failed to create sub-action');
            }
        } catch (error) {
            throw new Error(`Failed to create sub-action: ${error.message}`);
        }
    }

    linkActionToAgenda(actionId, agendaId) {
        return this.linkAgendaToAction(agendaId, actionId);
    }

    getActionAnalytics() {
        if (!window.tree) {
            throw new Error('Actions system not available');
        }

        const allActions = this.getAllActionNodes(window.tree);

        const analytics = {
            totalActions: allActions.length,
            statusDistribution: {
                open: allActions.filter(action => action.actionStatus === 'open').length,
                'in-progress': allActions.filter(action => action.actionStatus === 'in-progress').length,
                complete: allActions.filter(action => action.actionStatus === 'complete').length,
                blocked: allActions.filter(action => action.actionStatus === 'blocked').length
            },
            assignedActions: allActions.filter(action => action.actionUsers && action.actionUsers.length > 0).length,
            unassignedActions: allActions.filter(action => !action.actionUsers || action.actionUsers.length === 0).length,
            actionsWithDueDates: allActions.filter(action => action.actionDate).length,
            overdue: allActions.filter(action => {
                if (!action.actionDate) return false;
                return new Date(action.actionDate) < new Date();
            }).length,
            linkedToAgenda: allActions.filter(action => action.linkedAgenda && action.linkedAgenda.length > 0).length
        };

        return analytics;
    }

    // Utility Functions
    findActionNode(tree, actionId) {
        const searchNode = (node) => {
            if (node.id === actionId) return node;

            for (const child of node.childNodes || []) {
                const found = searchNode(child);
                if (found) return found;
            }

            return null;
        };

        for (const rootNode of tree.childNodes || []) {
            const found = searchNode(rootNode);
            if (found) return found;
        }

        return null;
    }

    getAllActionNodes(tree) {
        const actions = [];

        const collectNodes = (node) => {
            actions.push(node);
            for (const child of node.childNodes || []) {
                collectNodes(child);
            }
        };

        for (const rootNode of tree.childNodes || []) {
            collectNodes(rootNode);
        }

        return actions;
    }

    // Event Handlers
    handleStateChange(detail) {
        console.log('🔄 Meenoe state changed:', detail);
        this.contextCache.set('lastStateChange', {
            timestamp: new Date().toISOString(),
            detail: detail
        });
    }

    handleAgendaChange(detail) {
        console.log('📋 Agenda changed:', detail);
        this.contextCache.set('lastAgendaChange', {
            timestamp: new Date().toISOString(),
            detail: detail
        });
    }

    handleActionsChange(detail) {
        console.log('✅ Actions changed:', detail);
        this.contextCache.set('lastActionsChange', {
            timestamp: new Date().toISOString(),
            detail: detail
        });
    }

    handleUsersChange(detail) {
        console.log('👥 Users changed:', detail);
        this.contextCache.set('lastUsersChange', {
            timestamp: new Date().toISOString(),
            detail: detail
        });
    }

    // Additional utility implementations
    analyzeMeetingStructure() {
        const state = this.getCurrentMeenoeState();
        const agendaAnalytics = this.getAgendaAnalytics();
        const actionAnalytics = this.getActionAnalytics();

        const analysis = {
            overall: {
                completeness: this.calculateCompleteness(state),
                balance: this.calculateBalance(agendaAnalytics, actionAnalytics),
                efficiency: this.calculateEfficiency(state, agendaAnalytics, actionAnalytics)
            },
            recommendations: this.generateRecommendations(state, agendaAnalytics, actionAnalytics),
            strengths: this.identifyStrengths(state, agendaAnalytics, actionAnalytics),
            improvements: this.identifyImprovements(state, agendaAnalytics, actionAnalytics)
        };

        return analysis;
    }

    calculateCompleteness(state) {
        let score = 0;
        let maxScore = 5;

        if (state.name && state.name !== 'Name Your Meenoe Here') score += 1;
        if (state.objective && state.objective !== 'Enter your Meenoe objective or an introduction here') score += 1;
        if (state.counters.users > 0) score += 1;
        if (state.counters.agendaPoints > 0) score += 1;
        if (state.counters.actions > 0) score += 1;

        return Math.round((score / maxScore) * 100);
    }

    calculateBalance(agendaAnalytics, actionAnalytics) {
        const agendaCount = agendaAnalytics.totalItems;
        const actionCount = actionAnalytics.totalActions;

        if (agendaCount === 0 && actionCount === 0) return 0;

        const ratio = agendaCount > 0 ? actionCount / agendaCount : 0;
        const idealRatio = 2; // 2 actions per agenda item is considered balanced

        const balance = Math.max(0, 100 - Math.abs(ratio - idealRatio) * 25);
        return Math.round(balance);
    }

    calculateEfficiency(state, agendaAnalytics, actionAnalytics) {
        let score = 0;
        let factors = 0;

        // Check urgency distribution
        const urgencyTotal = Object.values(agendaAnalytics.urgencyDistribution).reduce((a, b) => a + b, 0);
        if (urgencyTotal > 0) {
            const criticalRatio = agendaAnalytics.urgencyDistribution.critical / urgencyTotal;
            score += criticalRatio < 0.3 ? 25 : 10; // Not too many critical items
            factors += 1;
        }

        // Check action assignment
        if (actionAnalytics.totalActions > 0) {
            const assignmentRatio = actionAnalytics.assignedActions / actionAnalytics.totalActions;
            score += assignmentRatio * 25;
            factors += 1;
        }

        // Check action-agenda linking
        if (actionAnalytics.totalActions > 0) {
            const linkingRatio = actionAnalytics.linkedToAgenda / actionAnalytics.totalActions;
            score += linkingRatio * 25;
            factors += 1;
        }

        // Check due dates
        if (actionAnalytics.totalActions > 0) {
            const dueDateRatio = actionAnalytics.actionsWithDueDates / actionAnalytics.totalActions;
            score += dueDateRatio * 25;
            factors += 1;
        }

        return factors > 0 ? Math.round(score / factors) : 0;
    }

    generateRecommendations(state, agendaAnalytics, actionAnalytics) {
        const recommendations = [];

        if (state.counters.agendaPoints === 0) {
            recommendations.push({
                type: 'agenda',
                priority: 'high',
                message: 'Add agenda items to structure your meeting'
            });
        }

        if (state.counters.actions === 0 && state.counters.agendaPoints > 0) {
            recommendations.push({
                type: 'actions',
                priority: 'medium',
                message: 'Create action items to track follow-ups from agenda discussions'
            });
        }

        if (actionAnalytics.unassignedActions > actionAnalytics.assignedActions) {
            recommendations.push({
                type: 'assignment',
                priority: 'medium',
                message: 'Assign owners to action items for better accountability'
            });
        }

        if (actionAnalytics.actionsWithDueDates < actionAnalytics.totalActions * 0.5) {
            recommendations.push({
                type: 'deadlines',
                priority: 'low',
                message: 'Add due dates to action items for better time management'
            });
        }

        return recommendations;
    }

    identifyStrengths(state, agendaAnalytics, actionAnalytics) {
        const strengths = [];

        if (agendaAnalytics.totalItems > 0) {
            strengths.push('Well-structured agenda');
        }

        if (actionAnalytics.assignedActions > actionAnalytics.unassignedActions) {
            strengths.push('Good action item ownership');
        }

        if (actionAnalytics.linkedToAgenda > actionAnalytics.totalActions * 0.7) {
            strengths.push('Strong agenda-action linkage');
        }

        if (state.counters.users > 1) {
            strengths.push('Collaborative meeting setup');
        }

        return strengths;
    }

    identifyImprovements(state, agendaAnalytics, actionAnalytics) {
        const improvements = [];

        if (agendaAnalytics.urgencyDistribution.critical > agendaAnalytics.totalItems * 0.5) {
            improvements.push('Consider reducing critical urgency items for better focus');
        }

        if (actionAnalytics.overdue > 0) {
            improvements.push('Address overdue action items');
        }

        if (state.counters.files === 0) {
            improvements.push('Consider adding supporting documents');
        }

        return improvements;
    }

    generateMeetingSummary() {
        const state = this.getCurrentMeenoeState();
        const agendaAnalytics = this.getAgendaAnalytics();
        const actionAnalytics = this.getActionAnalytics();

        return {
            meeting: {
                title: state.name,
                objective: state.objective,
                status: state.status,
                participants: state.counters.users
            },
            agenda: {
                totalItems: agendaAnalytics.totalItems,
                urgencyBreakdown: agendaAnalytics.urgencyDistribution,
                discussions: agendaAnalytics.totalThreads
            },
            actions: {
                totalActions: actionAnalytics.totalActions,
                statusBreakdown: actionAnalytics.statusDistribution,
                assigned: actionAnalytics.assignedActions,
                withDeadlines: actionAnalytics.actionsWithDueDates
            },
            files: state.counters.files,
            timestamp: new Date().toISOString()
        };
    }

    extractActionsFromText(text) {
        // Simple action extraction using patterns
        const actionPatterns = [
            /(?:action|todo|task|follow[- ]?up|next step):\s*(.+)/gi,
            /(?:^|\n)\s*[-*]\s*(.+(?:will|should|must|need to).+)/gmi,
            /(?:assign|delegate|responsible for):\s*(.+)/gi
        ];

        const extractedActions = [];

        actionPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const actionText = match[1].trim();
                if (actionText.length > 5) { // Filter out very short matches
                    extractedActions.push({
                        text: actionText,
                        confidence: 0.8,
                        source: 'pattern_match'
                    });
                }
            }
        });

        // Remove duplicates
        const uniqueActions = extractedActions.filter((action, index, self) =>
            index === self.findIndex(a => a.text.toLowerCase() === action.text.toLowerCase())
        );

        return {
            extractedActions: uniqueActions,
            totalFound: uniqueActions.length,
            originalText: text
        };
    }

    suggestAgendaStructure(objective, participantCount = 1, duration = 60) {
        const suggestions = [];

        // Basic structure based on meeting duration
        if (duration <= 30) {
            suggestions.push(
                { title: 'Quick Check-in', duration: 5, urgency: 'low' },
                { title: 'Main Topic Discussion', duration: 20, urgency: 'high' },
                { title: 'Action Items & Next Steps', duration: 5, urgency: 'medium' }
            );
        } else if (duration <= 60) {
            suggestions.push(
                { title: 'Welcome & Introductions', duration: 5, urgency: 'low' },
                { title: 'Review Previous Actions', duration: 10, urgency: 'medium' },
                { title: 'Main Discussion Topics', duration: 35, urgency: 'high' },
                { title: 'Action Items & Assignments', duration: 8, urgency: 'medium' },
                { title: 'Next Steps & Closing', duration: 2, urgency: 'low' }
            );
        } else {
            suggestions.push(
                { title: 'Welcome & Agenda Review', duration: 10, urgency: 'low' },
                { title: 'Previous Meeting Follow-up', duration: 15, urgency: 'medium' },
                { title: 'Primary Discussion Topics', duration: duration * 0.5, urgency: 'high' },
                { title: 'Decision Making & Consensus', duration: duration * 0.2, urgency: 'high' },
                { title: 'Action Planning', duration: duration * 0.15, urgency: 'medium' },
                { title: 'Summary & Next Meeting', duration: duration * 0.05, urgency: 'low' }
            );
        }

        // Adjust based on participant count
        if (participantCount > 5) {
            suggestions.unshift({
                title: 'Ground Rules & Participation Guidelines',
                duration: 5,
                urgency: 'medium'
            });
        }

        // Customize based on objective keywords
        const objectiveLower = objective.toLowerCase();
        if (objectiveLower.includes('brainstorm') || objectiveLower.includes('creative')) {
            suggestions.splice(2, 0, {
                title: 'Brainstorming Session',
                duration: Math.max(20, duration * 0.4),
                urgency: 'high'
            });
        }

        if (objectiveLower.includes('decision') || objectiveLower.includes('approve')) {
            suggestions.splice(-2, 0, {
                title: 'Decision Point & Voting',
                duration: 15,
                urgency: 'critical'
            });
        }

        return {
            suggestedStructure: suggestions,
            totalDuration: suggestions.reduce((sum, item) => sum + item.duration, 0),
            participantCount: participantCount,
            objective: objective
        };
    }

    // Placeholder implementations for initialization functions
    initializeMeenoe(config) {
        // This would integrate with the actual Meenoe initialization system
        return { success: true, message: 'Meenoe initialization not yet implemented' };
    }

    updateMeenoeTitle(title) {
        if (window.meenoeState) {
            window.meenoeState.state.name = title;
            // Update UI if title element exists
            const titleElement = document.querySelector('.meenoe-title, #meenoe-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
            return { success: true, newTitle: title };
        }
        throw new Error('Meenoe state system not available');
    }

    updateMeenoeObjective(objective) {
        if (window.meenoeState) {
            window.meenoeState.state.objective = objective;
            // Update UI if objective element exists
            const objectiveElement = document.querySelector('.meenoe-objective, #meenoe-objective');
            if (objectiveElement) {
                objectiveElement.textContent = objective;
            }
            return { success: true, newObjective: objective };
        }
        throw new Error('Meenoe state system not available');
    }

    addParticipant(userDetails) {
        // This would integrate with the actual user management system
        return { success: true, message: 'Participant management not yet implemented', userDetails };
    }

    removeParticipant(userId) {
        // This would integrate with the actual user management system
        return { success: true, message: 'Participant management not yet implemented', userId };
    }

    setMeenoeStatus(status) {
        if (window.meenoeState) {
            window.meenoeState.state.status = status;
            return { success: true, newStatus: status };
        }
        throw new Error('Meenoe state system not available');
    }

    configureMeenoeSettings(settings) {
        // This would integrate with the actual settings system
        return { success: true, message: 'Settings configuration not yet implemented', settings };
    }

    // Helper methods for system availability
    isMeenoeSystemAvailable() {
        return !!(window.meenoeState && window.agendaFlow && window.tree);
    }

    async waitForMeenoeSystem(timeout = 10000) {
        const startTime = Date.now();

        while (!this.isMeenoeSystemAvailable() && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return this.isMeenoeSystemAvailable();
    }

    safeCall(fn) {
        try {
            return fn();
        } catch (error) {
            console.warn('Safe call failed:', error);
            return null;
        }
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.MeenoeAIIntegration = MeenoeAIIntegration;
}

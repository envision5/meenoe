/**
 * Agentic Workflow Engine
 * Provides context awareness, intelligent decision making, and multi-step task execution
 */

class AgenticEngine {
    constructor(aiProvider, meenoeIntegration) {
        this.aiProvider = aiProvider;
        this.meenoeIntegration = meenoeIntegration;

        this.contextEngine = new ContextAwarenessEngine(meenoeIntegration);
        this.decisionEngine = new IntelligentDecisionEngine(aiProvider, meenoeIntegration);
        this.workflowEngine = new MultiStepWorkflowEngine(aiProvider, meenoeIntegration);

        this.isActive = false;

        // Rate limiting for notifications
        this.lastNotifications = new Map(); // type -> timestamp
        this.notificationCooldown = 30000; // 30 seconds between same type notifications
        this.maxNotificationsPerMinute = 3;
        this.notificationHistory = [];

        console.log('🧠 Agentic Engine initialized');
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.contextEngine.start();
        
        console.log('🚀 Agentic Engine started');
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.contextEngine.stop();
        
        console.log('⏹️ Agentic Engine stopped');
    }


    async executeWorkflow(workflowName, parameters = {}) {
        return await this.workflowEngine.executeWorkflow(workflowName, parameters);
    }

    getContextSummary() {
        return this.contextEngine.getContextSummary();
    }
}

/**
 * Context Awareness Engine
 * Continuously monitors and analyzes the Meenoe system state
 */
class ContextAwarenessEngine {
    constructor(meenoeIntegration) {
        this.meenoeIntegration = meenoeIntegration;
        this.contextHistory = [];
        this.currentContext = null;
        this.patterns = new Map();
        this.isMonitoring = false;

        this.setupEventListeners();
    }

    start() {
        this.isMonitoring = true;
        this.updateContext();
        console.log('👁️ Context Awareness Engine started');
    }

    stop() {
        this.isMonitoring = false;
        console.log('👁️ Context Awareness Engine stopped');
    }

    setupEventListeners() {
        // Listen for all Meenoe system changes
        const events = [
            'meenoeStateChanged',
            'meenoeAgendaChanged',
            'meenoeActionsChanged',
            'meenoeUsersChanged'
        ];

        events.forEach(eventType => {
            window.addEventListener(eventType, (event) => {
                if (this.isMonitoring) {
                    this.handleSystemChange(eventType, event.detail);
                }
            });
        });

        // Listen for user interactions
        document.addEventListener('click', (event) => {
            if (this.isMonitoring) {
                this.handleUserInteraction('click', event);
            }
        });

        document.addEventListener('focus', (event) => {
            if (this.isMonitoring) {
                this.handleUserInteraction('focus', event);
            }
        }, true);
    }

    handleSystemChange(eventType, detail) {
        this.updateContext();
        this.analyzePatterns(eventType, detail);
    }

    handleUserInteraction(interactionType, event) {
        const target = event.target;
        const context = {
            type: interactionType,
            element: target.tagName,
            className: target.className,
            id: target.id,
            timestamp: new Date().toISOString()
        };

        this.recordUserBehavior(context);
    }

    updateContext() {
        try {
            const state = this.meenoeIntegration.getCurrentMeenoeState();
            const agendaAnalytics = this.safeGetAnalytics(() => this.meenoeIntegration.getAgendaAnalytics());
            const actionAnalytics = this.safeGetAnalytics(() => this.meenoeIntegration.getActionAnalytics());

            this.currentContext = {
                immediate: {
                    activeTab: this.getActiveTab(),
                    selectedItems: this.getSelectedItems(),
                    userFocus: this.getUserFocus()
                },
                session: {
                    state: state,
                    agendaAnalytics: agendaAnalytics,
                    actionAnalytics: actionAnalytics,
                    duration: this.getSessionDuration()
                },
                historical: {
                    patterns: this.getPatternSummary(),
                    trends: this.getTrends(),
                    userBehavior: this.getUserBehaviorSummary()
                },
                timestamp: new Date().toISOString()
            };

            this.contextHistory.push(this.currentContext);

            // Keep only last 50 context snapshots
            if (this.contextHistory.length > 50) {
                this.contextHistory = this.contextHistory.slice(-50);
            }

        } catch (error) {
            console.error('Error updating context:', error);
        }
    }

    safeGetAnalytics(analyticsFunction) {
        try {
            return analyticsFunction();
        } catch (error) {
            console.warn('Analytics function failed:', error);
            return {
                total: 0,
                completed: 0,
                pending: 0,
                distribution: {},
                trends: []
            };
        }
    }

    getCurrentContext() {
        return this.currentContext;
    }

    getContextSummary() {
        if (!this.currentContext) return null;

        // Safely access session data
        const sessionCounters = this.currentContext.session?.state?.counters || {};
        const immediateFocus = this.currentContext.immediate?.userFocus || 'unknown';
        const historicalTrends = this.currentContext.historical?.trends || [];

        return {
            counters: sessionCounters,
            balance: this.calculateBalance(),
            completeness: this.calculateCompleteness(),
            activity: this.getActivityLevel(),
            focus: immediateFocus,
            trends: historicalTrends
        };
    }

    getActiveTab() {
        // Detect which section/tab is currently active
        const activeElements = document.querySelectorAll('.active, .selected, :focus');
        for (const element of activeElements) {
            if (element.closest('#agenda-section')) return 'agenda';
            if (element.closest('#actions-section')) return 'actions';
            if (element.closest('#participants-section')) return 'participants';
            if (element.closest('#files-section')) return 'files';
        }
        return 'unknown';
    }

    getSelectedItems() {
        const selected = {
            agenda: [],
            actions: [],
            participants: []
        };

        // Find selected agenda items
        document.querySelectorAll('.agenda-item.selected, .agenda-item.active').forEach(item => {
            const id = item.getAttribute('data-agenda-id');
            if (id) selected.agenda.push(id);
        });

        // Find selected action items
        document.querySelectorAll('.action-item.selected, .action-item.active').forEach(item => {
            const id = item.getAttribute('data-action-id');
            if (id) selected.actions.push(id);
        });

        return selected;
    }

    getUserFocus() {
        const focusedElement = document.activeElement;
        if (!focusedElement || focusedElement === document.body) return 'none';

        // Determine what the user is focused on
        if (focusedElement.closest('.agenda-section')) return 'agenda';
        if (focusedElement.closest('.actions-section')) return 'actions';
        if (focusedElement.closest('.participants-section')) return 'participants';
        if (focusedElement.closest('.ai-assistant')) return 'ai_assistant';

        return 'other';
    }

    getSessionDuration() {
        // Calculate how long the current session has been active
        const startTime = window.sessionStartTime || new Date();
        return Date.now() - startTime.getTime();
    }

    analyzePatterns(eventType, detail) {
        const pattern = {
            event: eventType,
            detail: detail,
            timestamp: new Date().toISOString(),
            context: this.getActiveTab()
        };

        const patternKey = `${eventType}_${this.getActiveTab()}`;
        if (!this.patterns.has(patternKey)) {
            this.patterns.set(patternKey, []);
        }

        this.patterns.get(patternKey).push(pattern);

        // Keep only recent patterns (last 100 per type)
        const patterns = this.patterns.get(patternKey);
        if (patterns.length > 100) {
            this.patterns.set(patternKey, patterns.slice(-100));
        }
    }

    recordUserBehavior(behavior) {
        if (!this.userBehavior) {
            this.userBehavior = [];
        }

        this.userBehavior.push(behavior);

        // Keep only recent behavior (last 200 interactions)
        if (this.userBehavior.length > 200) {
            this.userBehavior = this.userBehavior.slice(-200);
        }
    }

    getPatternSummary() {
        const summary = {};

        for (const [key, patterns] of this.patterns) {
            summary[key] = {
                count: patterns.length,
                recent: patterns.slice(-5),
                frequency: this.calculateFrequency(patterns)
            };
        }

        return summary;
    }

    getTrends() {
        if (this.contextHistory.length < 2) return {};

        const recent = this.contextHistory.slice(-10);
        const trends = {};

        // Analyze counter trends
        if (recent.length > 1) {
            const first = recent[0].session.state.counters;
            const last = recent[recent.length - 1].session.state.counters;

            trends.agenda = last.agendaPoints - first.agendaPoints;
            trends.actions = last.actions - first.actions;
            trends.users = last.users - first.users;
            trends.files = last.files - first.files;
        }

        return trends;
    }

    getUserBehaviorSummary() {
        if (!this.userBehavior || this.userBehavior.length === 0) return {};

        const recent = this.userBehavior.slice(-50);
        const summary = {
            totalInteractions: recent.length,
            focusAreas: {},
            activityLevel: this.calculateActivityLevel(recent)
        };

        // Count focus areas
        recent.forEach(behavior => {
            const area = this.categorizeBehavior(behavior);
            summary.focusAreas[area] = (summary.focusAreas[area] || 0) + 1;
        });

        return summary;
    }

    calculateFrequency(patterns) {
        if (patterns.length < 2) return 0;

        const timeSpan = new Date(patterns[patterns.length - 1].timestamp) -
                        new Date(patterns[0].timestamp);

        return patterns.length / (timeSpan / (1000 * 60)); // patterns per minute
    }

    calculateBalance() {
        if (!this.currentContext) return 0;

        const counters = this.currentContext.session.state.counters;
        const agendaCount = counters.agendaPoints;
        const actionCount = counters.actions;

        if (agendaCount === 0 && actionCount === 0) return 0;

        const ratio = agendaCount > 0 ? actionCount / agendaCount : 0;
        const idealRatio = 2;

        return Math.max(0, 100 - Math.abs(ratio - idealRatio) * 25);
    }

    calculateCompleteness() {
        if (!this.currentContext) return 0;

        const state = this.currentContext.session.state;
        let score = 0;
        let maxScore = 5;

        if (state.name && state.name !== 'Name Your Meenoe Here') score += 1;
        if (state.objective && state.objective !== 'Enter your Meenoe objective or an introduction here') score += 1;
        if (state.counters.users > 0) score += 1;
        if (state.counters.agendaPoints > 0) score += 1;
        if (state.counters.actions > 0) score += 1;

        return Math.round((score / maxScore) * 100);
    }

    getActivityLevel() {
        if (!this.userBehavior || this.userBehavior.length === 0) return 'low';

        const recentBehavior = this.userBehavior.slice(-20);
        const timeSpan = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();

        const recentActivity = recentBehavior.filter(behavior =>
            now - new Date(behavior.timestamp).getTime() < timeSpan
        );

        if (recentActivity.length > 10) return 'high';
        if (recentActivity.length > 5) return 'medium';
        return 'low';
    }

    calculateActivityLevel(behaviors) {
        const timeSpan = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();

        const recentActivity = behaviors.filter(behavior =>
            now - new Date(behavior.timestamp).getTime() < timeSpan
        );

        return recentActivity.length;
    }

    categorizeBehavior(behavior) {
        if (behavior.className.includes('agenda')) return 'agenda';
        if (behavior.className.includes('action')) return 'actions';
        if (behavior.className.includes('user') || behavior.className.includes('participant')) return 'participants';
        if (behavior.className.includes('file')) return 'files';
        if (behavior.className.includes('ai')) return 'ai_assistant';
        return 'other';
    }
}

/**
 * Intelligent Decision Engine
 * Makes smart decisions about when and how to provide assistance
 */
class IntelligentDecisionEngine {
    constructor(aiProvider, meenoeIntegration) {
        this.aiProvider = aiProvider;
        this.meenoeIntegration = meenoeIntegration;
        this.decisionHistory = [];
        this.thresholds = {
            emptyStateDelay: 30000, // 30 seconds
            imbalanceThreshold: 0.5,
            urgencyReviewInterval: 300000, // 5 minutes
            completionCheckInterval: 120000 // 2 minutes
        };
    }

    async identifyOpportunities(context) {
        const opportunities = [];

        // Check if context is available
        if (!context) {
            console.warn('No context available for opportunity identification');
            return opportunities;
        }

        try {
            // Check for empty state opportunities
            const emptyStateOpp = this.checkEmptyState(context);
            if (emptyStateOpp) opportunities.push(emptyStateOpp);
        } catch (error) {
            console.warn('Error checking empty state opportunities:', error);
        }

        try {
            // Check for imbalance opportunities
            const imbalanceOpp = this.checkImbalance(context);
            if (imbalanceOpp) opportunities.push(imbalanceOpp);
        } catch (error) {
            console.warn('Error checking imbalance opportunities:', error);
        }

        try {
            // Check for urgency opportunities
            const urgencyOpp = this.checkUrgencyIssues(context);
            if (urgencyOpp) opportunities.push(urgencyOpp);
        } catch (error) {
            console.warn('Error checking urgency opportunities:', error);
        }

        try {
            // Check for completion opportunities
            const completionOpp = this.checkCompletionOpportunities(context);
            if (completionOpp) opportunities.push(completionOpp);
        } catch (error) {
            console.warn('Error checking completion opportunities:', error);
        }

        try {
            // Check for workflow opportunities
            const workflowOpp = await this.checkWorkflowOpportunities(context);
            if (workflowOpp) opportunities.push(workflowOpp);
        } catch (error) {
            console.warn('Error checking workflow opportunities:', error);
        }

        return opportunities;
    }

    checkEmptyState(context) {
        // Check if session data is available
        if (!context.session || !context.session.state) {
            console.warn('Session data not available for empty state check');
            return null;
        }

        const counters = context.session.state.counters || {};
        const sessionDuration = context.session.duration || 0;

        // If user has been in session for a while but has empty sections
        if (sessionDuration > this.thresholds.emptyStateDelay) {
            if ((counters.agendaPoints || 0) === 0 || (counters.actions || 0) === 0) {
                return {
                    type: 'empty_state',
                    priority: 'high',
                    context: context,
                    reason: 'User has empty sections after significant time in session'
                };
            }
        }

        return null;
    }

    checkImbalance(context) {
        const counters = context.session.state.counters;
        const agendaCount = counters.agendaPoints;
        const actionCount = counters.actions;

        if (agendaCount === 0 && actionCount === 0) return null;

        const ratio = agendaCount > 0 ? actionCount / agendaCount : 0;

        // Too few actions relative to agenda items
        if (agendaCount > 2 && ratio < this.thresholds.imbalanceThreshold) {
            return {
                type: 'imbalance_detection',
                priority: 'medium',
                context: context,
                reason: 'Too few action items relative to agenda items'
            };
        }

        // Too many actions relative to agenda items
        if (agendaCount > 0 && ratio > 4) {
            return {
                type: 'imbalance_detection',
                priority: 'low',
                context: context,
                reason: 'Many action items relative to agenda items - consider consolidation'
            };
        }

        return null;
    }

    checkUrgencyIssues(context) {
        const agendaAnalytics = context.session.agendaAnalytics;

        if (!agendaAnalytics || agendaAnalytics.totalItems === 0) return null;

        const urgencyDist = agendaAnalytics.urgencyDistribution;
        const totalItems = agendaAnalytics.totalItems;

        // Too many critical items
        if (urgencyDist.critical > totalItems * 0.5) {
            return {
                type: 'urgency_analysis',
                priority: 'medium',
                context: context,
                reason: 'High proportion of critical urgency items may reduce focus'
            };
        }

        // No urgency variation (all same level)
        const nonZeroLevels = Object.values(urgencyDist).filter(count => count > 0).length;
        if (nonZeroLevels === 1 && totalItems > 3) {
            return {
                type: 'urgency_analysis',
                priority: 'low',
                context: context,
                reason: 'Consider varying urgency levels for better prioritization'
            };
        }

        return null;
    }

    checkCompletionOpportunities(context) {
        const actionAnalytics = context.session.actionAnalytics;

        if (!actionAnalytics || actionAnalytics.totalActions === 0) return null;

        // Only trigger if there are at least 3 actions to avoid spam on small meetings
        if (actionAnalytics.totalActions < 3) return null;

        // Many unassigned actions (increased threshold to be less aggressive)
        if (actionAnalytics.unassignedActions > actionAnalytics.totalActions * 0.8) {
            return {
                type: 'completion_monitoring',
                priority: 'medium',
                context: context,
                reason: 'Most action items lack assigned owners'
            };
        }

        // Few actions have due dates (only trigger if there are many actions)
        if (actionAnalytics.totalActions >= 5 && actionAnalytics.actionsWithDueDates < actionAnalytics.totalActions * 0.2) {
            return {
                type: 'completion_monitoring',
                priority: 'low',
                context: context,
                reason: 'Consider adding due dates to action items'
            };
        }

        return null;
    }

    async checkWorkflowOpportunities(context) {
        const state = context.session.state;

        // Suggest workflow if meeting has good structure but could be optimized
        if (state.counters.agendaPoints > 2 && state.counters.actions > 1) {
            const completeness = context.session.agendaAnalytics?.totalItems > 0 ?
                this.calculateStructureCompleteness(context) : 0;

            if (completeness > 60 && completeness < 90) {
                return {
                    type: 'workflow_suggestion',
                    priority: 'low',
                    context: context,
                    reason: 'Meeting structure could benefit from optimization workflow'
                };
            }
        }

        return null;
    }

    calculateStructureCompleteness(context) {
        let score = 0;
        let maxScore = 6;

        const state = context.session.state;
        const agendaAnalytics = context.session.agendaAnalytics;
        const actionAnalytics = context.session.actionAnalytics;

        // Basic structure
        if (state.counters.agendaPoints > 0) score += 1;
        if (state.counters.actions > 0) score += 1;
        if (state.counters.users > 1) score += 1;

        // Quality indicators
        if (actionAnalytics.assignedActions > actionAnalytics.unassignedActions) score += 1;
        if (agendaAnalytics.urgencyDistribution &&
            Object.values(agendaAnalytics.urgencyDistribution).filter(v => v > 0).length > 1) score += 1;
        if (actionAnalytics.actionsWithDueDates > actionAnalytics.totalActions * 0.5) score += 1;

        return Math.round((score / maxScore) * 100);
    }

    recordDecision(opportunity, action, outcome) {
        this.decisionHistory.push({
            opportunity: opportunity,
            action: action,
            outcome: outcome,
            timestamp: new Date().toISOString()
        });

        // Keep only recent decisions
        if (this.decisionHistory.length > 100) {
            this.decisionHistory = this.decisionHistory.slice(-100);
        }
    }
}

/**
 * Multi-Step Workflow Engine
 * Executes complex multi-step workflows
 */
class MultiStepWorkflowEngine {
    constructor(aiProvider, meenoeIntegration) {
        this.aiProvider = aiProvider;
        this.meenoeIntegration = meenoeIntegration;
        this.workflows = new Map();
        this.activeWorkflows = new Map();

        this.initializeWorkflows();
    }

    initializeWorkflows() {
        // Register predefined workflows
        this.registerWorkflow('createMeetingFromEmail', this.createMeetingFromEmailWorkflow.bind(this));
        this.registerWorkflow('optimizeExistingMeenoe', this.optimizeExistingMeenoeWorkflow.bind(this));
        this.registerWorkflow('generateActionPlan', this.generateActionPlanWorkflow.bind(this));
        this.registerWorkflow('structureBrainstormingSession', this.structureBrainstormingSessionWorkflow.bind(this));
        this.registerWorkflow('prepareDecisionMeeting', this.prepareDecisionMeetingWorkflow.bind(this));
    }

    async createMeetingFromEmailWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze email content
        steps.push('Analyzing email content');
        const emailAnalysis = await this.analyzeEmailContent(parameters.emailContent || '');

        // Step 2: Extract participants
        steps.push('Extracting participants');
        const participants = this.extractParticipants(parameters.emailContent || '');

        // Step 3: Generate agenda points
        steps.push('Generating agenda points');
        const agendaPoints = await this.generateAgendaFromEmail(emailAnalysis);

        // Step 4: Create preliminary actions
        steps.push('Creating preliminary actions');
        const actions = await this.generateActionsFromEmail(emailAnalysis);

        // Step 5: Set meeting structure
        steps.push('Setting up meeting structure');
        await this.setupMeetingStructure(emailAnalysis, agendaPoints, actions);

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            emailAnalysis: emailAnalysis,
            participants: participants,
            agendaPoints: agendaPoints,
            actions: actions
        };
    }

    async optimizeExistingMeenoeWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze current structure
        steps.push('Analyzing current meeting structure');
        const currentState = this.meenoeIntegration.getCurrentMeenoeState();
        const analysis = this.meenoeIntegration.analyzeMeetingStructure();

        // Step 2: Identify gaps and redundancies
        steps.push('Identifying gaps and redundancies');
        const gaps = this.identifyStructuralGaps(analysis);

        // Step 3: Suggest agenda reordering
        steps.push('Optimizing agenda order');
        const reorderedAgenda = await this.suggestAgendaReordering(currentState);

        // Step 4: Recommend action consolidation
        steps.push('Consolidating action items');
        const consolidatedActions = await this.suggestActionConsolidation(currentState);

        // Step 5: Generate improvement report
        steps.push('Generating improvement report');
        const improvementReport = this.generateImprovementReport(analysis, gaps, reorderedAgenda, consolidatedActions);

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            analysis: analysis,
            gaps: gaps,
            reorderedAgenda: reorderedAgenda,
            consolidatedActions: consolidatedActions,
            improvementReport: improvementReport
        };
    }

    async generateActionPlanWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze agenda items
        steps.push('Analyzing agenda items for action potential');
        const agendaItems = await this.getAgendaItemsForActionGeneration();

        // Step 2: Generate actions for each agenda item
        steps.push('Generating action items');
        const generatedActions = [];

        for (const agendaItem of agendaItems) {
            const actions = await this.generateActionsForAgendaItem(agendaItem);
            generatedActions.push(...actions);
        }

        // Step 3: Assign priorities and owners
        steps.push('Assigning priorities and owners');
        const prioritizedActions = await this.prioritizeAndAssignActions(generatedActions);

        // Step 4: Create action items in system
        steps.push('Creating action items in system');
        const createdActions = [];

        for (const action of prioritizedActions) {
            try {
                const result = await this.meenoeIntegration.createAction(
                    action.title,
                    action.description,
                    action.assignee,
                    action.dueDate,
                    action.priority
                );
                createdActions.push(result);
            } catch (error) {
                console.error('Error creating action:', error);
            }
        }

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            generatedActions: generatedActions,
            createdActions: createdActions
        };
    }

    async structureBrainstormingSessionWorkflow(parameters, workflowId) {
        const steps = ['Setting up brainstorming structure'];
        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            message: 'Brainstorming session workflow not yet implemented'
        };
    }

    async prepareDecisionMeetingWorkflow(parameters, workflowId) {
        const steps = ['Preparing decision meeting structure'];
        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            message: 'Decision meeting workflow not yet implemented'
        };
    }

    registerWorkflow(name, handler) {
        this.workflows.set(name, handler);
    }

    async executeWorkflow(workflowName, parameters = {}) {
        const workflow = this.workflows.get(workflowName);
        if (!workflow) {
            throw new Error(`Workflow ${workflowName} not found`);
        }

        const workflowId = `${workflowName}_${Date.now()}`;
        this.activeWorkflows.set(workflowId, {
            name: workflowName,
            parameters: parameters,
            status: 'running',
            startTime: new Date().toISOString(),
            steps: []
        });

        try {
            console.log(`🔄 Starting workflow: ${workflowName}`);
            const result = await workflow(parameters, workflowId);

            this.activeWorkflows.get(workflowId).status = 'completed';
            this.activeWorkflows.get(workflowId).result = result;

            console.log(`✅ Workflow completed: ${workflowName}`);
            return result;
        } catch (error) {
            console.error(`❌ Workflow failed: ${workflowName}`, error);

            this.activeWorkflows.get(workflowId).status = 'failed';
            this.activeWorkflows.get(workflowId).error = error.message;

            throw error;
        }
    }

    async createMeetingFromEmailWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze email content
        steps.push('Analyzing email content');
        const emailAnalysis = await this.analyzeEmailContent(parameters.emailContent);

        // Step 2: Extract participants
        steps.push('Extracting participants');
        const participants = this.extractParticipants(parameters.emailContent);

        // Step 3: Generate agenda points
        steps.push('Generating agenda points');
        const agendaPoints = await this.generateAgendaFromEmail(emailAnalysis);

        // Step 4: Create preliminary actions
        steps.push('Creating preliminary actions');
        const actions = await this.generateActionsFromEmail(emailAnalysis);

        // Step 5: Set meeting structure
        steps.push('Setting up meeting structure');
        await this.setupMeetingStructure(emailAnalysis, agendaPoints, actions);

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            emailAnalysis: emailAnalysis,
            participants: participants,
            agendaPoints: agendaPoints,
            actions: actions
        };
    }

    async optimizeExistingMeenoeWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze current structure
        steps.push('Analyzing current meeting structure');
        const currentState = this.meenoeIntegration.getCurrentMeenoeState();
        const analysis = this.meenoeIntegration.analyzeMeetingStructure();

        // Step 2: Identify gaps and redundancies
        steps.push('Identifying gaps and redundancies');
        const gaps = this.identifyStructuralGaps(analysis);

        // Step 3: Suggest agenda reordering
        steps.push('Optimizing agenda order');
        const reorderedAgenda = await this.suggestAgendaReordering(currentState);

        // Step 4: Recommend action consolidation
        steps.push('Consolidating action items');
        const consolidatedActions = await this.suggestActionConsolidation(currentState);

        // Step 5: Generate improvement report
        steps.push('Generating improvement report');
        const improvementReport = this.generateImprovementReport(analysis, gaps, reorderedAgenda, consolidatedActions);

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            analysis: analysis,
            gaps: gaps,
            reorderedAgenda: reorderedAgenda,
            consolidatedActions: consolidatedActions,
            improvementReport: improvementReport
        };
    }

    async generateActionPlanWorkflow(parameters, workflowId) {
        const steps = [];

        // Step 1: Analyze agenda items
        steps.push('Analyzing agenda items for action potential');
        const agendaItems = await this.getAgendaItemsForActionGeneration();

        // Step 2: Generate actions for each agenda item
        steps.push('Generating action items');
        const generatedActions = [];

        for (const agendaItem of agendaItems) {
            const actions = await this.generateActionsForAgendaItem(agendaItem);
            generatedActions.push(...actions);
        }

        // Step 3: Assign priorities and owners
        steps.push('Assigning priorities and owners');
        const prioritizedActions = await this.prioritizeAndAssignActions(generatedActions);

        // Step 4: Create action items in system
        steps.push('Creating action items in system');
        const createdActions = [];

        for (const action of prioritizedActions) {
            try {
                const result = await this.meenoeIntegration.createAction(
                    action.title,
                    action.description,
                    action.assignee,
                    action.dueDate,
                    action.priority
                );
                createdActions.push(result);
            } catch (error) {
                console.error('Error creating action:', error);
            }
        }

        this.updateWorkflowSteps(workflowId, steps);

        return {
            success: true,
            generatedActions: generatedActions,
            createdActions: createdActions
        };
    }

    updateWorkflowSteps(workflowId, steps) {
        const workflow = this.activeWorkflows.get(workflowId);
        if (workflow) {
            workflow.steps = steps;
            workflow.lastUpdate = new Date().toISOString();
        }
    }

    // Workflow helper methods
    async analyzeEmailContent(emailContent) {
        return {
            purpose: 'Meeting purpose extracted from email',
            topics: ['Topic 1', 'Topic 2'],
            participants: [],
            urgency: 'medium'
        };
    }

    extractParticipants(emailContent) {
        return ['participant1', 'participant2'];
    }

    async generateAgendaFromEmail(emailAnalysis) {
        return emailAnalysis.topics.map((topic, index) => ({
            title: topic,
            description: `Discussion about ${topic}`,
            urgency: emailAnalysis.urgency || 'medium'
        }));
    }

    async generateActionsFromEmail(emailAnalysis) {
        return [{
            title: 'Follow up on email discussion',
            description: 'Review and respond to key points',
            priority: 'medium'
        }];
    }

    async setupMeetingStructure(emailAnalysis, agendaPoints, actions) {
        // Implementation would create actual agenda and action items
        return { success: true };
    }

    identifyStructuralGaps(analysis) {
        const gaps = [];

        if (analysis.overall.completeness < 70) {
            gaps.push('Meeting structure is incomplete');
        }

        if (analysis.overall.balance < 50) {
            gaps.push('Poor balance between agenda and actions');
        }

        return gaps;
    }

    async suggestAgendaReordering(currentState) {
        return {
            suggested: true,
            message: 'Consider reordering agenda items by priority'
        };
    }

    async suggestActionConsolidation(currentState) {
        return {
            suggested: true,
            message: 'Some action items could be consolidated'
        };
    }

    generateImprovementReport(analysis, gaps, reorderedAgenda, consolidatedActions) {
        return {
            summary: 'Meeting optimization complete',
            improvements: gaps.length,
            recommendations: [
                'Improve agenda-action balance',
                'Add more specific action items',
                'Consider time allocation'
            ]
        };
    }

    async getAgendaItemsForActionGeneration() {
        try {
            const state = this.meenoeIntegration.getCurrentMeenoeState();
            // Return mock agenda items for now
            return [
                { id: '1', title: 'Budget Review', description: 'Review quarterly budget' },
                { id: '2', title: 'Team Updates', description: 'Team status updates' }
            ];
        } catch (error) {
            console.error('Error getting agenda items:', error);
            return [];
        }
    }

    async generateActionsForAgendaItem(agendaItem) {
        return [{
            title: `Follow up on ${agendaItem.title}`,
            description: `Action item generated from ${agendaItem.title}`,
            priority: 'medium',
            agendaId: agendaItem.id
        }];
    }

    async prioritizeAndAssignActions(actions) {
        return actions.map(action => ({
            ...action,
            priority: action.priority || 'medium',
            assignee: action.assignee || 'Unassigned'
        }));
    }

    async suggestWorkflow(context) {
        // Analyze context and suggest appropriate workflow
        const state = context.session.state;

        if (state.counters.agendaPoints === 0 && state.counters.actions === 0) {
            return {
                workflow: 'createMeetingFromEmail',
                reason: 'Empty meeting structure - consider creating from email or template',
                priority: 'high'
            };
        }

        if (state.counters.agendaPoints > 3 && state.counters.actions < 2) {
            return {
                workflow: 'generateActionPlan',
                reason: 'Rich agenda but few actions - generate action plan',
                priority: 'medium'
            };
        }

        return null;
    }
}

// Export classes
if (typeof window !== 'undefined') {
    window.AgenticEngine = AgenticEngine;
    window.ContextAwarenessEngine = ContextAwarenessEngine;
    window.IntelligentDecisionEngine = IntelligentDecisionEngine;
    window.MultiStepWorkflowEngine = MultiStepWorkflowEngine;
}

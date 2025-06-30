/**
 * Unified Agentic System
 * Parses AI responses for function calls and executes them
 * Provides real-time progress updates and UI changes
 */

class UnifiedFunctionCaller {
    constructor(aiProvider, meenoeIntegration) {
        this.aiProvider = aiProvider;
        this.meenoeIntegration = meenoeIntegration;
        this.functionRegistry = new Map();
        this.intentPatterns = new Map();

        // Execution tracking
        this.currentExecution = null;
        this.executionCallbacks = [];

        this.initializeFunctionRegistry();
        this.initializeIntentPatterns();

        console.log('🔧 Unified Agentic System initialized');
    }

    initializeFunctionRegistry() {
        // Get all available functions from Meenoe integration
        const functions = this.meenoeIntegration.getFunctionDefinitions();
        
        functions.forEach(func => {
            this.functionRegistry.set(func.name, {
                ...func,
                handler: this.meenoeIntegration.executeFunction.bind(this.meenoeIntegration)
            });
        });

        // Register summarizeAgendaThreads for AI use
        this.functionRegistry.set('summarizeAgendaThreads', {
            name: 'summarizeAgendaThreads',
            description: 'Get a summary of all threads for a specific agenda point',
            parameters: {
                properties: {
                    agendaId: { type: 'string', description: 'Agenda point ID' }
                }
            },
            handler: async ({ agendaId }) => {
                const agendaItem = window.agendaFlow?.state?.agendaItems?.get(agendaId);
                if (!agendaItem || !agendaItem.threads) return { agendaId, summary: [] };
                return {
                    agendaId,
                    summary: agendaItem.threads.map(t => ({
                        author: t.author,
                        created: t.created,
                        summary: t.content ? t.content.slice(0, 100) : ''
                    }))
                };
            }
        });

        console.log(`📋 Registered ${this.functionRegistry.size} functions:`, 
            Array.from(this.functionRegistry.keys()));
    }

    initializeIntentPatterns() {
        // Enhanced intent patterns with better matching
        this.intentPatterns.set('create_agenda', {
            patterns: [
                /create.*agenda.*point/i,
                /add.*agenda.*item/i,
                /new.*agenda/i,
                /agenda.*point.*named/i,
                /agenda.*item.*called/i,
                /make.*agenda/i
            ],
            function: 'createAgendaPoint',
            extractors: {
                title: [
                    /agenda.*point.*named\s+"([^"]+)"/i,
                    /agenda.*item.*called\s+"([^"]+)"/i,
                    /create.*agenda.*point\s+"([^"]+)"/i,
                    /add.*agenda.*item\s+"([^"]+)"/i,
                    /new.*agenda.*point\s+"([^"]+)"/i,
                    /"([^"]+)"/i // fallback for any quoted text
                ],
                description: [
                    /description[:\s]+"([^"]+)"/i,
                    /about\s+"([^"]+)"/i,
                    /regarding\s+"([^"]+)"/i
                ],
                urgency: [
                    /(normal|moderate|important|critical|mandatory)\s+priority/i,
                    /(normal|moderate|important|critical|mandatory)\s+urgency/i,
                    /priority[:\s]+(normal|moderate|important|critical|mandatory)/i,
                    /urgency[:\s]+(normal|moderate|important|critical|mandatory)/i
                ]
            }
        });

        this.intentPatterns.set('create_action', {
            patterns: [
                /create.*action.*item/i,
                /add.*action/i,
                /new.*action/i,
                /action.*item.*named/i,
                /task.*called/i,
                /todo.*item/i,
                /assign.*task/i
            ],
            function: 'createAction',
            extractors: {
                title: [
                    /action.*item.*named\s+"([^"]+)"/i,
                    /task.*called\s+"([^"]+)"/i,
                    /create.*action\s+"([^"]+)"/i,
                    /add.*action\s+"([^"]+)"/i,
                    /todo.*item\s+"([^"]+)"/i,
                    /"([^"]+)"/i
                ],
                description: [
                    /description[:\s]+"([^"]+)"/i,
                    /details[:\s]+"([^"]+)"/i
                ],
                assignee: [
                    /assign.*to\s+([^\s,]+)/i,
                    /assigned.*to\s+([^\s,]+)/i,
                    /for\s+([^\s,]+)/i,
                    /assignee[:\s]+([^\s,]+)/i
                ],
                priority: [
                    /(low|medium|high|critical)\s+priority/i,
                    /priority[:\s]+(low|medium|high|critical)/i
                ],
                dueDate: [
                    /due\s+(\d{4}-\d{2}-\d{2})/i,
                    /deadline[:\s]+(\d{4}-\d{2}-\d{2})/i,
                    /by\s+(\d{4}-\d{2}-\d{2})/i
                ]
            }
        });

        this.intentPatterns.set('update_item', {
            patterns: [
                /update.*agenda/i,
                /modify.*action/i,
                /change.*item/i,
                /edit.*point/i
            ],
            function: 'updateAgendaPoint', // Will be determined dynamically
            extractors: {
                id: [/item\s+(\w+)/i, /id[:\s]+(\w+)/i],
                title: [/title[:\s]+"([^"]+)"/i, /name[:\s]+"([^"]+)"/i],
                description: [/description[:\s]+"([^"]+)"/i]
            }
        });

        this.intentPatterns.set('delete_item', {
            patterns: [
                /delete.*agenda/i,
                /remove.*action/i,
                /get rid of.*item/i
            ],
            function: 'deleteAgendaPoint', // Will be determined dynamically
            extractors: {
                id: [/item\s+(\w+)/i, /id[:\s]+(\w+)/i],
                title: [/"([^"]+)"/i]
            }
        });

        // Add thread to agenda intent
        this.intentPatterns.set('add_thread_to_agenda', {
            patterns: [
                /add.*thread.*to.*agenda/i,
                /new.*thread.*for.*agenda/i,
                /create.*discussion.*on.*agenda/i,
                /add.*comment.*to.*agenda/i,
                /add.*note.*to.*agenda/i
            ],
            function: 'addThreadToAgenda',
            extractors: {
                agendaId: [/agenda\s*(?:point)?\s*id[:\s]+(\w+)/i],
                content: [
                    /content[:\s]+"([^"]+)"/i,
                    /thread[:\s]+"([^"]+)"/i,
                    /note[:\s]+"([^"]+)"/i,
                    /comment[:\s]+"([^"]+)"/i,
                    /discussion[:\s]+"([^"]+)"/i,
                    /"([^"]+)"/i // fallback for any quoted text
                ],
                author: [
                    /author[:\s]+"([^"]+)"/i,
                    /by\s+([^\s,]+)/i
                ]
            }
        });

        // Summarize agenda threads intent
        this.intentPatterns.set('summarize_agenda_threads', {
            patterns: [
                /summarize.*threads.*agenda/i,
                /what.*threads.*about.*agenda/i,
                /show.*discussion.*for.*agenda/i,
                /show.*threads.*for.*agenda/i,
                /list.*threads.*for.*agenda/i
            ],
            function: 'summarizeAgendaThreads',
            extractors: {
                agendaId: [/agenda\s*(?:point)?\s*id[:\s]+(\w+)/i]
            }
        });

        // Tab switching intents
        this.intentPatterns.set('switch_to_agenda_tab', {
            patterns: [
                /switch.*to.*agenda.*tab/i,
                /go.*to.*agenda.*tab/i,
                /show.*agenda.*tab/i,
                /open.*agenda.*tab/i,
                /agenda.*tab/i
            ],
            function: 'switchToAgendaTab',
            extractors: {}
        });
        this.intentPatterns.set('switch_to_actions_tab', {
            patterns: [
                /switch.*to.*actions?.*tab/i,
                /go.*to.*actions?.*tab/i,
                /show.*actions?.*tab/i,
                /open.*actions?.*tab/i,
                /actions?.*tab/i
            ],
            function: 'switchToActionsTab',
            extractors: {}
        });
        this.intentPatterns.set('switch_to_details_tab', {
            patterns: [
                /switch.*to.*details?.*tab/i,
                /go.*to.*details?.*tab/i,
                /show.*details?.*tab/i,
                /open.*details?.*tab/i,
                /details?.*tab/i
            ],
            function: 'switchToDetailsTab',
            extractors: {}
        });
    }

    async processRequest(userMessage, context = {}, progressCallback = null) {
        console.log('🎯 Processing agentic request:', userMessage);

        try {
            let fullResponse = '';

            // STEP 1: Professional acknowledgment with expertise
            const ackPrompt = `You are an elite meeting management expert and AI assistant. The user said: "${userMessage}"
Respond in 1-2 warm, professional lines that acknowledge their request and show your expertise. Be confident and helpful, but don't describe actions yet.`;
            const ackResponse = await this.aiProvider.generateResponse(ackPrompt, context, { temperature: 0.7, maxTokens: 80 });
            fullResponse += ackResponse.trim();

            // Add the initial assistant message (acknowledgment) to the UI
            let assistantMessageDiv = null;
            if (window.AIChatIntegration && typeof window.AIChatIntegration.addMessage === 'function') {
                assistantMessageDiv = window.AIChatIntegration.addMessage('assistant', fullResponse);
            }

            // STEP 2: "Here's what I'm going to do" explanation (before processing)
            // We'll need to parse the intent and function call first, so generate the agentic response, but do NOT execute yet.
            const aiResponse = await this.generateAgenticResponse(userMessage, context, progressCallback);
            const functionCalls = this.parseResponseForFunctionCalls(aiResponse, context);

            let explanation = '';
            if (functionCalls.length > 0) {
                // Use the AI to generate a professional explanation of what will be done
                const explainPrompt = `You are an expert meeting facilitator. The user asked: "${userMessage}"
You are about to perform this action: ${JSON.stringify(functionCalls[0], null, 2)}
In 1-2 professional, clear lines, explain your approach and what you're about to do. Show your expertise in meeting management.`;
                explanation = await this.aiProvider.generateResponse(explainPrompt, context, { temperature: 0.7, maxTokens: 80 });
                fullResponse += "\n\n" + explanation.trim();

                // Update the assistant message in the UI
                if (window.AIChatIntegration && typeof window.AIChatIntegration.updateLastAssistantMessageContent === 'function') {
                    window.AIChatIntegration.updateLastAssistantMessageContent(fullResponse);
                }
            }

            // STEP 3: Show visual indicator and execute function call(s)
            let workflowResult = null;
            if (functionCalls.length > 0) {
                // Preprocess functionCalls: split createAction with actionTrigger into two calls
                const processedFunctionCalls = [];
                for (const call of functionCalls) {
                    if (
                        call.function === "createAction" &&
                        call.parameters &&
                        call.parameters.actionTrigger
                    ) {
                        // Split: first createAction without actionTrigger
                        const { actionTrigger, ...rest } = call.parameters;
                        processedFunctionCalls.push({
                            function: "createAction",
                            parameters: rest,
                        });
                        // Add a placeholder for setActionTrigger, to be filled after createAction result
                        processedFunctionCalls.push({
                            function: "setActionTrigger",
                            parameters: {
                                actionId: "__ACTION_ID_FROM_CREATEACTION__",
                                trigger: actionTrigger,
                            },
                            _linkToPrevious: true,
                        });
                    } else {
                        processedFunctionCalls.push(call);
                    }
                }

                // Execute ALL function calls in sequential order
                if (processedFunctionCalls.length > 1) {
                    console.warn(`⚠️ AI tried to call ${processedFunctionCalls.length} functions, executing all in order`);
                }

                // Patch executeAgenticWorkflow to handle placeholder actionId
                workflowResult = await this.executeAgenticWorkflowWithActionTrigger(processedFunctionCalls, aiResponse, progressCallback);
            }

            // STEP 4: Professional summary with next steps (after processing)
            if (workflowResult && workflowResult.functionCalls && workflowResult.functionCalls.length > 0) {
                // Use the AI to generate an expert summary of what was accomplished
                const summaryPrompt = `You are an expert meeting management consultant. The user requested: "${userMessage}"
You successfully completed this action: ${JSON.stringify(workflowResult.functionCalls[0], null, 2)}
In 2-3 professional lines, summarize what was accomplished and suggest logical next steps or related optimizations. Show your meeting facilitation expertise.`;
                const summaryResponse = await this.aiProvider.generateResponse(summaryPrompt, context, { temperature: 0.7, maxTokens: 100 });
                fullResponse += "\n\n" + summaryResponse.trim();

                // Update the assistant message in the UI with the final full response
                if (window.AIChatIntegration && typeof window.AIChatIntegration.updateLastAssistantMessageContent === 'function') {
                    window.AIChatIntegration.updateLastAssistantMessageContent(fullResponse);
                }

                // Return the full result for downstream use
                return {
                    ...workflowResult,
                    summary: summaryResponse.trim(),
                    type: 'agentic_execution'
                };
            }

            // If no function call, fallback to conversational response
            if (!functionCalls.length) {
                // Only update the existing assistant message, do NOT create a new one
                if (window.AIChatIntegration && typeof window.AIChatIntegration.updateLastAssistantMessageContent === 'function') {
                    window.AIChatIntegration.updateLastAssistantMessageContent(fullResponse + "\n\n" + aiResponse);
                }
                return {
                    success: true,
                    type: 'conversational',
                    message: aiResponse,
                    functionCalls: []
                };
            }

        } catch (error) {
            console.error('❌ Error in agentic processing:', error);
            return {
                success: false,
                type: 'error',
                message: `I encountered an error: ${error.message}`,
                error: error
            };
        }
    }

    // Custom workflow executor to handle setActionTrigger after createAction
    async executeAgenticWorkflowWithActionTrigger(functionCalls, originalResponse, progressCallback) {
        const results = [];
        let cleanResponse = originalResponse;

        // Remove function calls from the response text
        cleanResponse = cleanResponse.replace(/FUNCTION_CALL:\s*\{[^}]+\}/g, '').trim();

        if (progressCallback && window.AIChatIntegration?.showExecutingIndicator) {
            window.AIChatIntegration.showExecutingIndicator();
        }

        // Track IDs for propagation
        let lastAgendaId = null;
        let lastThreadId = null;
        let lastActionId = null;

        for (let i = 0; i < functionCalls.length; i++) {
            const functionCall = functionCalls[i];

            try {
                let params = { ...functionCall.parameters };

                // Propagate agendaId
                if (params.agendaId === "__AGENDA_ID_FROM_CREATE__" && lastAgendaId) {
                    params.agendaId = lastAgendaId;
                }
                // Propagate threadId
                if (params.threadId === "__THREAD_ID_FROM_CREATE__" && lastThreadId) {
                    params.threadId = lastThreadId;
                }
                // Propagate actionId for setActionTrigger
                if (
                    functionCall.function === "setActionTrigger" &&
                    params.actionId === "__ACTION_ID_FROM_CREATEACTION__"
                ) {
                    params.actionId = lastActionId;
                }

                // Patch: If agendaId is missing but lastAgendaId exists and function expects it
                if (!params.agendaId && lastAgendaId && (
                    functionCall.function === "addThreadToAgenda" ||
                    functionCall.function === "connectActionToAgendaThread"
                )) {
                    params.agendaId = lastAgendaId;
                }
                // Patch: If threadId is missing but lastThreadId exists and function expects it
                if (!params.threadId && lastThreadId && functionCall.function === "connectActionToAgendaThread") {
                    params.threadId = lastThreadId;
                }
                // Patch: If actionId is missing but lastActionId exists and function expects it
                if (!params.actionId && lastActionId && functionCall.function === "setActionTrigger") {
                    params.actionId = lastActionId;
                }

                // Validate function exists
                if (!this.functionRegistry.has(functionCall.function)) {
                    throw new Error(`Function ${functionCall.function} not found in registry`);
                }

                const result = await this.meenoeIntegration.executeFunction(
                    functionCall.function,
                    params
                );

                // Save IDs for propagation
                if (functionCall.function === "createAgendaPoint" && result && result.agendaId) {
                    lastAgendaId = result.agendaId;
                }
                if (functionCall.function === "addThreadToAgenda" && result && result.threadId) {
                    lastThreadId = result.threadId;
                }
                if (functionCall.function === "connectActionToAgendaThread" && result && result.actionId) {
                    lastActionId = result.actionId;
                }
                if (functionCall.function === "createAction" && result && result.actionId) {
                    lastActionId = result.actionId;
                }

                results.push({
                    function: functionCall.function,
                    parameters: params,
                    result: result,
                    success: true
                });

                this.triggerUIUpdates(functionCall.function, result);

            } catch (error) {
                results.push({
                    function: functionCall.function,
                    parameters: functionCall.parameters,
                    error: error.message,
                    success: false
                });
            }
        }

        if (progressCallback && window.AIChatIntegration?.showCompletedIndicator) {
            window.AIChatIntegration.showCompletedIndicator();
        }

        const summary = this.generateExecutionSummary(results);

        if (window.AIChatIntegration?.removeAllProgressIndicators) {
            window.AIChatIntegration.removeAllProgressIndicators();
        }

        return {
            success: true,
            type: 'agentic_execution',
            message: cleanResponse,
            summary: summary,
            functionCalls: results,
            executedActions: results.filter(r => r.success).length
        };
    }

    async generateAgenticResponse(userMessage, context, progressCallback) {
        // (No assistant message here; unified response will be added after processing)
        if (progressCallback && window.AIChatIntegration?.showAnalyzingIndicator) {
            window.AIChatIntegration.showAnalyzingIndicator();
        }

        const availableFunctions = Array.from(this.functionRegistry.values());

        // Always get the latest state if not provided in context
        let currentState = context.currentMeenoeState;
        if (!currentState) {
            currentState = this.meenoeIntegration.getCurrentMeenoeState();
        }
        const agendaItems = this.extractAgendaItems(currentState);
        const actionItems = this.extractActionItems(currentState);

        const now = new Date();
        const formattedNow = now.toISOString();

        const prompt = `You are an elite AI assistant for Meenoe meeting management with advanced agentic capabilities and deep expertise in meeting facilitation.

CURRENT SESSION CONTEXT:
User Request: "${userMessage}"
Current Date/Time: ${formattedNow}

MEETING STATE ANALYSIS:
======================
Agenda Structure (${agendaItems.length} items):
${agendaItems.map((item, idx) => `  ${idx + 1}. [${item.id}] "${item.title}" (${item.urgency} priority)
     ${item.description ? `Description: ${item.description}` : 'No description'}`).join('\n') || '  → No agenda items exist yet'}

Action Items (${actionItems.length} items):
${actionItems.map(item => `  • [${item.id}] "${item.title}" (${item.status})
     ${item.description ? `Details: ${item.description}` : 'No details'}`).join('\n') || '  → No action items exist yet'}

Meeting Metrics:
- Participants: ${currentState.counters?.users || 0}
- Files: ${currentState.counters?.files || 0}
- Overall Completeness: ${this.calculateCompleteness(currentState)}%
- Agenda-Action Balance: ${this.calculateBalance(currentState)}%

COMPLETE STATE DATA:
${JSON.stringify(currentState, null, 2)}

AVAILABLE FUNCTIONS & CAPABILITIES:
${availableFunctions.map(func =>
    `🔧 ${func.name}
   Purpose: ${func.description}
   Required Parameters: ${Object.keys(func.parameters.properties || {}).join(', ') || 'None'}
   Optional Parameters: ${Object.keys(func.parameters.properties || {})
       .filter(key => !(func.parameters.required || []).includes(key)).join(', ') || 'None'}`
).join('\n\n')}

EXECUTION GUIDELINES:
====================
1. **ID Management**: Use EXACT IDs from the current state above. Never fabricate IDs.
2. **Reference Resolution**: 
   - "first agenda" = ${agendaItems[0]?.id || 'none exists'}
   - "second agenda" = ${agendaItems[1]?.id || 'none exists'}  
   - Match titles to find correct IDs
3. **Function Selection**: Choose the most appropriate function for the user's intent
4. **Parameter Validation**: Ensure all required parameters are provided and valid
5. **Context Awareness**: Consider current meeting state and user's context
6. **Quality Standards**: Aim for professional, helpful, and actionable responses

RESPONSE STRUCTURE:
==================
1. **Acknowledgment**: Briefly acknowledge the user's request
2. **Analysis**: Show your understanding of what needs to be done
3. **Action**: Execute the appropriate function call
4. **Confirmation**: Explain what was accomplished and next steps

FUNCTION CALL FORMAT:
For each action, output a separate FUNCTION_CALL block, one after another, in the order they should be executed. For example, if the user requests multiple actions, output:

FUNCTION_CALL: {"function": "switchToAgendaTab", "parameters": {}}
FUNCTION_CALL: {"function": "createAgendaPoint", "parameters": {"title": "Sales Focus", "description": "Talking about sales projections", "urgency": "mandatory"}}

BEST PRACTICES:
- Use descriptive, professional language
- Provide context for your decisions
- Suggest related improvements when appropriate
- Handle edge cases gracefully
- Maintain meeting management expertise in responses

Example Response Pattern:
"I understand you'd like to [restate request]. Based on the current meeting structure, I'll [explain approach].

FUNCTION_CALL: {"function": "switchToAgendaTab", "parameters": {}}
FUNCTION_CALL: {"function": "createAgendaPoint", "parameters": {"title": "Sales Focus", "description": "Talking about sales projections", "urgency": "mandatory"}}

Perfect! I've switched to the agenda tab and created the agenda point for sales focus with mandatory urgency. Would you like me to add related action items or further details?"

Now, applying this methodology to your request:`;

        try {
            const response = await this.aiProvider.generateResponse(prompt, context, {
                temperature: 0.3,
                maxTokens: 800
            });

            return response;
        } catch (error) {
            console.error('AI response generation failed:', error);
            throw error;
        }
    }

    parseResponseForFunctionCalls(response, context) {
        const functionCalls = [];

        // Look for FUNCTION_CALL: patterns with more flexible matching
        const functionCallPattern = /FUNCTION_CALL:\s*(\{[\s\S]*?)(?=\n\n|\nFUNCTION_CALL:|$)/g;
        let match;

        while ((match = functionCallPattern.exec(response)) !== null) {
            let jsonStr = match[1].trim();

            // Try to fix common JSON issues
            jsonStr = this.fixMalformedJson(jsonStr);

            try {
                const functionCall = JSON.parse(jsonStr);
                if (functionCall.function && functionCall.parameters !== undefined) {
                    // Resolve IDs before adding to the list
                    this.resolveParameterIDs(functionCall, response, context);
                    functionCalls.push(functionCall);
                    console.log('🔧 Parsed function call:', functionCall);
                }
            } catch (error) {
                console.error('Failed to parse function call:', jsonStr, error);

                // Try to extract function and parameters manually
                const manualParse = this.manuallyParseFunctionCall(jsonStr);
                if (manualParse) {
                    functionCalls.push(manualParse);
                    console.log('🔧 Manually parsed function call:', manualParse);
                }
            }
        }

        return functionCalls;
    }

    fixMalformedJson(jsonStr) {
        // Remove any trailing text after the JSON
        let cleaned = jsonStr;

        // Find the last complete brace
        let braceCount = 0;
        let lastValidIndex = -1;

        for (let i = 0; i < cleaned.length; i++) {
            if (cleaned[i] === '{') {
                braceCount++;
            } else if (cleaned[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                    lastValidIndex = i;
                    break;
                }
            }
        }

        if (lastValidIndex > -1) {
            cleaned = cleaned.substring(0, lastValidIndex + 1);
        } else if (braceCount > 0) {
            // Add missing closing braces
            cleaned += '}';
        }

        return cleaned;
    }

    manuallyParseFunctionCall(jsonStr) {
        try {
            // Extract function name
            const functionMatch = jsonStr.match(/"function":\s*"([^"]+)"/);
            if (!functionMatch) return null;

            const functionName = functionMatch[1];

            // Extract parameters object
            const parametersMatch = jsonStr.match(/"parameters":\s*(\{[^}]*\}?)/);
            let parameters = {};

            if (parametersMatch) {
                try {
                    // Try to parse parameters
                    let paramStr = parametersMatch[1];
                    if (!paramStr.endsWith('}')) {
                        paramStr += '}';
                    }
                    parameters = JSON.parse(paramStr);
                } catch (e) {
                    // Extract individual parameter values
                    const titleMatch = jsonStr.match(/"title":\s*"([^"]+)"/);
                    const descriptionMatch = jsonStr.match(/"description":\s*"([^"]*)"/);
                    const urgencyMatch = jsonStr.match(/"urgency":\s*"([^"]+)"/);
                    const assigneeMatch = jsonStr.match(/"assignee":\s*"([^"]+)"/);
                    const priorityMatch = jsonStr.match(/"priority":\s*"([^"]+)"/);

                    if (titleMatch) parameters.title = titleMatch[1];
                    if (descriptionMatch) parameters.description = descriptionMatch[1];
                    if (urgencyMatch) parameters.urgency = urgencyMatch[1];
                    if (assigneeMatch) parameters.assignee = assigneeMatch[1];
                    if (priorityMatch) parameters.priority = priorityMatch[1];
                }
            }

            return {
                function: functionName,
                parameters: parameters
            };

        } catch (error) {
            console.error('Manual parsing failed:', error);
            return null;
        }
    }

    async executeAgenticWorkflow(functionCalls, originalResponse, progressCallback) {
        const results = [];
        let cleanResponse = originalResponse;

        // Remove function calls from the response text
        cleanResponse = cleanResponse.replace(/FUNCTION_CALL:\s*\{[^}]+\}/g, '').trim();

        if (progressCallback && window.AIChatIntegration?.showExecutingIndicator) {
            window.AIChatIntegration.showExecutingIndicator();
        }

        // Execute each function call
        for (let i = 0; i < functionCalls.length; i++) {
            const functionCall = functionCalls[i];

            // Optionally, could show step progress here if desired

            try {
                console.log(`🔧 Executing: ${functionCall.function}`, functionCall.parameters);

                // Validate function exists
                if (!this.functionRegistry.has(functionCall.function)) {
                    throw new Error(`Function ${functionCall.function} not found in registry`);
                }

                const result = await this.meenoeIntegration.executeFunction(
                    functionCall.function,
                    functionCall.parameters
                );

                console.log(`✅ Function executed successfully:`, result);

                results.push({
                    function: functionCall.function,
                    parameters: functionCall.parameters,
                    result: result,
                    success: true
                });

                // Trigger UI updates
                this.triggerUIUpdates(functionCall.function, result);

            } catch (error) {
                console.error(`❌ Function execution failed: ${functionCall.function}`, error);
                results.push({
                    function: functionCall.function,
                    parameters: functionCall.parameters,
                    error: error.message,
                    success: false
                });
            }
        }

        if (progressCallback && window.AIChatIntegration?.showCompletedIndicator) {
            window.AIChatIntegration.showCompletedIndicator();
        }

        // Generate final summary
        const summary = this.generateExecutionSummary(results);

        // Remove all progress indicators before showing the final message
        if (window.AIChatIntegration?.removeAllProgressIndicators) {
            window.AIChatIntegration.removeAllProgressIndicators();
        }

        return {
            success: true,
            type: 'agentic_execution',
            message: cleanResponse,
            summary: summary,
            functionCalls: results,
            executedActions: results.filter(r => r.success).length
        };
    }

    triggerUIUpdates(functionName, result) {
        // Trigger appropriate UI updates based on the function executed
        switch (functionName) {
            case 'createAgendaPoint':
                // Trigger agenda refresh
                if (window.agendaFlow) {
                    window.dispatchEvent(new CustomEvent('meenoeAgendaChanged', {
                        detail: { action: 'added', agendaId: result.agendaId }
                    }));
                    // Force UI update of urgency badge/class after creation
                    if (result.agendaId && typeof window.agendaFlow.updateAgendaItemUI === 'function') {
                        setTimeout(() => {
                            window.agendaFlow.updateAgendaItemUI(result.agendaId);
                        }, 0);
                    }
                }
                break;

            case 'createAction':
                // Trigger actions refresh
                if (window.tree) {
                    window.dispatchEvent(new CustomEvent('meenoeActionsChanged', {
                        detail: { action: 'added', actionId: result.actionId }
                    }));
                }
                break;

            case 'updateUserCount':
                // Trigger counter refresh
                if (window.meenoeState) {
                    window.meenoeState.refreshAllCounters();
                }
                break;

            case 'addThreadToAgenda':
                // Refresh agenda threads UI if needed
                if (window.agendaFlow && result.agendaId) {
                    const agendaItem = window.agendaFlow.state.agendaItems.get(result.agendaId);
                    if (agendaItem) {
                        window.agendaFlow.renderThreads(agendaItem);
                        window.agendaFlow.updateThreadCount(agendaItem);
                    }
                }
                break;
        }
    }

    generateExecutionSummary(results) {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        let summary = '';

        if (successful.length > 0 && failed.length === 0) {
            // Professional, expert-level summary for all success
            const phrases = [
                "✅ Successfully completed your meeting management request:",
                "✅ Task accomplished! Here's what I've optimized for you:",
                "✅ Excellent! I've enhanced your meeting structure:",
                "✅ Mission accomplished! Your meeting has been updated:"
            ];
            const nextSteps = [
                "Consider adding related agenda items or action items to maximize meeting effectiveness.",
                "You might want to review participant assignments or add due dates for better accountability.",
                "For optimal results, consider adding more detail or connecting related items.",
                "Your meeting structure is improving! Let me know if you need further optimizations."
            ];
            summary += `${phrases[Math.floor(Math.random() * phrases.length)]}\n`;
            successful.forEach(result => {
                summary += `• ${this.getFunctionDisplayName(result.function)}\n`;
            });
            summary += "\n" + nextSteps[Math.floor(Math.random() * nextSteps.length)];
        } else if (successful.length > 0 && failed.length > 0) {
            summary += "I've completed some of your request, but there were issues:\n";
            successful.forEach(result => {
                summary += `• ${this.getFunctionDisplayName(result.function)} (done)\n`;
            });
            failed.forEach(result => {
                summary += `• ${this.getFunctionDisplayName(result.function)} (could not complete: ${result.error})\n`;
            });
            summary += "\nLet me know if you'd like to try again or need help with something else!";
        } else if (failed.length > 0) {
            summary += "Sorry, I wasn't able to complete your request:\n";
            failed.forEach(result => {
                summary += `• ${this.getFunctionDisplayName(result.function)}: ${result.error}\n`;
            });
            summary += "\nWould you like to try again or need help with something else?";
        }

        return summary.trim();
    }

    getFunctionDisplayName(functionName) {
        const displayNames = {
            'createAgendaPoint': 'Successfully created new agenda point with strategic priority',
            'createAction': 'Created actionable item with clear accountability',
            'updateUserCount': 'Updated participant count for optimal collaboration',
            'deleteAgendaPoint': 'Removed agenda point to streamline meeting focus',
            'updateAgendaPoint': 'Enhanced agenda point with improved details',
            'addThreadToAgenda': 'Added strategic discussion thread to agenda',
            'updateAction': 'Optimized action item with enhanced specifications',
            'deleteAction': 'Removed action item to improve workflow clarity',
            'assignAction': 'Assigned action item to enhance accountability',
            'setActionStatus': 'Updated action status for better progress tracking',
            'linkAgendaToAction': 'Connected agenda and action for improved alignment',
            'addParticipant': 'Added participant to strengthen team collaboration',
            'updateMeenoeTitle': 'Updated meeting title for better clarity',
            'updateMeenoeObjective': 'Enhanced meeting objective for clearer direction'
        };

        return displayNames[functionName] || `Executed ${functionName} for meeting optimization`;
    }

    generateSuccessMessage(functionName, parameters, result) {
        switch (functionName) {
            case 'createAgendaPoint':
                return `✅ Created agenda point "${parameters.title}"${parameters.urgency && parameters.urgency !== 'important' ? ` with ${parameters.urgency} urgency` : ''}`;
            case 'createAction':
                return `✅ Created action item "${parameters.title}"${parameters.assignee ? ` assigned to ${parameters.assignee}` : ''}${parameters.priority !== 'medium' ? ` with ${parameters.priority} priority` : ''}`;
            case 'updateAgendaPoint':
                return `✅ Updated agenda point "${parameters.title || result.title}"`;
            case 'deleteAgendaPoint':
                return `✅ Deleted agenda point`;
            case 'addThreadToAgenda':
                return `✅ Added thread to agenda "${parameters.agendaId}"${parameters.author ? ` by ${parameters.author}` : ''}`;
            default:
                return `✅ Successfully executed ${functionName}`;
        }
    }

    extractAgendaItems(state) {
        const items = [];

        // Check if agendaFlow state exists
        if (state.agendaFlow && state.agendaFlow.agendaItems) {
            if (state.agendaFlow.agendaItems instanceof Map) {
                // Handle Map structure
                for (const [id, item] of state.agendaFlow.agendaItems) {
                    items.push({
                        id: id,
                        title: item.title || 'Untitled',
                        urgency: item.urgency || 'important',
                        description: item.description || ''
                    });
                }
            } else if (Array.isArray(state.agendaFlow.agendaItems)) {
                // Handle Array structure
                state.agendaFlow.agendaItems.forEach(item => {
                    items.push({
                        id: item.id,
                        title: item.title || 'Untitled',
                        urgency: item.urgency || 'important',
                        description: item.description || ''
                    });
                });
            }
        }

        return items;
    }

    extractActionItems(state) {
        const items = [];

        // Check if actions tree exists
        if (state.actions && state.actions.childNodes) {
            const extractFromNodes = (nodes) => {
                nodes.forEach(node => {
                    items.push({
                        id: node.id,
                        title: node.actionTitle || 'Untitled',
                        status: node.actionStatus || 'open',
                        description: node.actionDescription || ''
                    });

                    // Recursively extract from child nodes
                    if (node.childNodes && node.childNodes.length > 0) {
                        extractFromNodes(node.childNodes);
                    }
                });
            };

            extractFromNodes(state.actions.childNodes);
        }

        return items;
    }

    resolveParameterIDs(functionCall, originalResponse, context) {
        // Get current state from context or fresh
        const currentState = context?.currentMeenoeState || this.meenoeIntegration.getCurrentMeenoeState();
        const agendaItems = this.extractAgendaItems(currentState);
        const actionItems = this.extractActionItems(currentState);

        console.log('🔍 Resolving IDs with current items:', { agendaItems, actionItems });

        // Resolve agenda IDs
        if (functionCall.parameters.agendaId) {
            const resolvedId = this.findBestMatchingId(
                functionCall.parameters.agendaId,
                agendaItems,
                originalResponse,
                'agenda'
            );
            if (resolvedId) {
                console.log(`🔍 Resolved agenda ID: ${functionCall.parameters.agendaId} → ${resolvedId}`);
                functionCall.parameters.agendaId = resolvedId;
            }
        }

        // Resolve action IDs
        if (functionCall.parameters.actionId) {
            const resolvedId = this.findBestMatchingId(
                functionCall.parameters.actionId,
                actionItems,
                originalResponse,
                'action'
            );
            if (resolvedId) {
                console.log(`🔍 Resolved action ID: ${functionCall.parameters.actionId} → ${resolvedId}`);
                functionCall.parameters.actionId = resolvedId;
            }
        }
    }

    findBestMatchingId(providedId, items, originalResponse, type) {
        // If the provided ID exists, use it
        const exactMatch = items.find(item => item.id === providedId);
        if (exactMatch) {
            return providedId;
        }

        // Try to find by title mentioned in the response or user request
        const titleMatches = this.extractTitleFromResponse(originalResponse, type);
        console.log(`🔍 Looking for ${type} titles:`, titleMatches);

        if (titleMatches.length > 0) {
            for (const titleMatch of titleMatches) {
                const item = items.find(item => {
                    const itemTitle = item.title.toLowerCase();
                    const searchTitle = titleMatch.toLowerCase();

                    // Exact match
                    if (itemTitle === searchTitle) return true;

                    // Contains match (both directions)
                    if (itemTitle.includes(searchTitle) || searchTitle.includes(itemTitle)) return true;

                    // Word-based matching for partial matches
                    const itemWords = itemTitle.split(/\s+/);
                    const searchWords = searchTitle.split(/\s+/);
                    const commonWords = itemWords.filter(word =>
                        searchWords.some(searchWord =>
                            word.includes(searchWord) || searchWord.includes(word)
                        )
                    );

                    // If more than half the words match, consider it a match
                    return commonWords.length >= Math.min(itemWords.length, searchWords.length) / 2;
                });

                if (item) {
                    console.log(`🎯 Found item by title match: "${titleMatch}" → ${item.id} (${item.title})`);
                    return item.id;
                }
            }
        }

        // If only one item exists, use it (likely the most recent)
        if (items.length === 1) {
            console.log(`🎯 Using only available ${type}: ${items[0].id}`);
            return items[0].id;
        }

        // Use the most recently created item (highest timestamp in ID)
        if (items.length > 0) {
            const mostRecent = items.reduce((latest, current) => {
                // Extract timestamp from ID (agenda-1751000594103 or action_xug8tv40c)
                const latestTime = this.extractTimestampFromId(latest.id);
                const currentTime = this.extractTimestampFromId(current.id);
                return currentTime > latestTime ? current : latest;
            });
            console.log(`🎯 Using most recent ${type}: ${mostRecent.id}`);
            return mostRecent.id;
        }

        return null;
    }

    extractTitleFromResponse(response, type) {
        const titles = [];

        // Look for quoted titles
        const quotedMatches = response.match(/"([^"]+)"/g);
        if (quotedMatches) {
            titles.push(...quotedMatches.map(match => match.replace(/"/g, '')));
        }

        // Look for specific patterns based on type
        if (type === 'agenda') {
            const agendaPatterns = [
                /agenda.*?(?:point|item).*?(?:called|named)\s+"?([^".!?]+)"?/gi,
                /(?:the|that)\s+"?([^".!?]+)"?\s+agenda/gi,
                /agenda.*?(?:point|item)\s+"?([^".!?]+)"?/gi,
                /(?:called|named)\s+"?([^".!?]+)"?/gi,
                /with.*?name\s+"?([^".!?]+)"?/gi
            ];

            agendaPatterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(response)) !== null) {
                    const title = match[1].trim();
                    if (title.length > 2) { // Avoid very short matches
                        titles.push(title);
                    }
                }
            });
        }

        // Remove duplicates and clean up
        const uniqueTitles = [...new Set(titles)].map(title =>
            title.replace(/^(the|that|a|an)\s+/i, '').trim()
        ).filter(title => title.length > 2);

        console.log(`🔍 Extracted ${type} titles from response:`, uniqueTitles);
        return uniqueTitles;
    }

    extractTimestampFromId(id) {
        // Extract timestamp from agenda-1751000594103 format
        const timestampMatch = id.match(/(\d{13})/);
        if (timestampMatch) {
            return parseInt(timestampMatch[1]);
        }

        // For action IDs without timestamps, use 0
        return 0;
    }

    calculateCompleteness(state) {
        let score = 0;
        let maxScore = 6;

        // Basic structure points
        if (state.name && state.name !== 'Name Your Meenoe Here') score += 1;
        if (state.objective && state.objective !== 'Enter your Meenoe objective or an introduction here') score += 1;
        if (state.counters?.users > 0) score += 1;
        if (state.counters?.agendaPoints > 0) score += 1;
        if (state.counters?.actions > 0) score += 1;
        if (state.counters?.files > 0) score += 1;

        return Math.round((score / maxScore) * 100);
    }

    calculateBalance(state) {
        const agendaCount = state.counters?.agendaPoints || 0;
        const actionCount = state.counters?.actions || 0;

        if (agendaCount === 0 && actionCount === 0) return 0;
        if (agendaCount === 0) return 50; // Actions without agenda
        if (actionCount === 0) return 25; // Agenda without actions

        // Ideal ratio is about 2 actions per agenda item
        const ratio = actionCount / agendaCount;
        const idealRatio = 2;
        const deviation = Math.abs(ratio - idealRatio) / idealRatio;
        
        return Math.max(25, Math.round(100 - (deviation * 50)));
    }

    tryPatternMatching(userMessage) {
        for (const [intentName, intentConfig] of this.intentPatterns) {
            // Check if any pattern matches
            const matchedPattern = intentConfig.patterns.find(pattern => pattern.test(userMessage));
            
            if (matchedPattern) {
                console.log(`🎯 Pattern matched for intent: ${intentName}`);
                
                // Extract parameters using extractors
                const parameters = {};
                
                for (const [paramName, extractors] of Object.entries(intentConfig.extractors)) {
                    for (const extractor of extractors) {
                        const match = userMessage.match(extractor);
                        if (match && match[1]) {
                            parameters[paramName] = match[1].trim();
                            break; // Use first successful extraction
                        }
                    }
                }

                // Apply intelligent defaults and validation
                this.applyIntelligentDefaults(intentName, parameters, userMessage);

                return {
                    intent: intentName,
                    function: intentConfig.function,
                    parameters: parameters,
                    confidence: 0.9
                };
            }
        }

        return null;
    }

    applyIntelligentDefaults(intent, parameters, userMessage) {
        switch (intent) {
            case 'create_agenda':
                // If no title extracted, try to infer from the message
                if (!parameters.title) {
                    // Remove command words and extract the main content
                    let inferredTitle = userMessage
                        .replace(/create|add|new|agenda|point|item/gi, '')
                        .replace(/named|called/gi, '')
                        .replace(/['"]/g, '')
                        .trim();
                    
                    if (inferredTitle.length > 3) {
                        parameters.title = inferredTitle;
                    } else {
                        parameters.title = 'New Agenda Point';
                    }
                }
                
                // Default urgency
                if (!parameters.urgency) {
                    parameters.urgency = 'normal';
                }
                break;

            case 'create_action':
                // Similar logic for actions
                if (!parameters.title) {
                    let inferredTitle = userMessage
                        .replace(/create|add|new|action|item|task|todo/gi, '')
                        .replace(/named|called/gi, '')
                        .replace(/['"]/g, '')
                        .trim();
                    
                    if (inferredTitle.length > 3) {
                        parameters.title = inferredTitle;
                    } else {
                        parameters.title = 'New Action Item';
                    }
                }
                
                // Default priority
                if (!parameters.priority) {
                    parameters.priority = 'medium';
                }
                break;
        }
    }

    async useAIForFunctionCalling(userMessage, context) {
        // Create a comprehensive prompt for function calling
        const availableFunctions = Array.from(this.functionRegistry.values());
        
        const prompt = `You are a function calling assistant for Meenoe. Analyze the user's request and determine if it requires calling a function.

User Request: "${userMessage}"

Available Functions:
${availableFunctions.map(func => 
    `- ${func.name}: ${func.description}\n  Parameters: ${JSON.stringify(func.parameters, null, 2)}`
).join('\n\n')}

Current Context:
${JSON.stringify(context, null, 2)}

If the user's request requires calling a function, respond with EXACTLY this JSON format:
{
    "function_call": true,
    "function": "function_name",
    "parameters": {
        "param1": "value1",
        "param2": "value2"
    },
    "reasoning": "Why this function was chosen"
}

If no function call is needed, respond with:
{
    "function_call": false,
    "reasoning": "Why no function call is needed"
}

Be intelligent about extracting parameters from natural language. For example:
- "Create agenda point called Budget Review" → {"title": "Budget Review"}
- "Add action for John to review documents by Friday" → {"title": "review documents", "assignee": "John", "dueDate": "2024-01-05"}`;

        try {
            const response = await this.aiProvider.generateResponse(prompt, context, {
                temperature: 0.1, // Low temperature for consistent function calling
                maxTokens: 500
            });

            // Parse the AI response
            const parsed = this.parseAIResponse(response);
            return parsed;

        } catch (error) {
            console.error('AI function calling failed:', error);
            return null;
        }
    }

    parseAIResponse(response) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return null;

            const parsed = JSON.parse(jsonMatch[0]);
            
            if (parsed.function_call && parsed.function && parsed.parameters) {
                return {
                    function: parsed.function,
                    parameters: parsed.parameters,
                    reasoning: parsed.reasoning
                };
            }

            return null;
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            return null;
        }
    }

    async executeFunction(functionName, parameters) {
        console.log(`🔧 Executing function: ${functionName}`, parameters);

        try {
            const result = await this.meenoeIntegration.executeFunction(functionName, parameters);
            
            return {
                success: true,
                type: 'function_call',
                function: functionName,
                parameters: parameters,
                result: result,
                message: this.generateSuccessMessage(functionName, parameters, result)
            };

        } catch (error) {
            console.error(`❌ Function execution failed: ${functionName}`, error);
            
            return {
                success: false,
                type: 'function_error',
                function: functionName,
                parameters: parameters,
                error: error.message,
                message: `I tried to ${functionName} but encountered an error: ${error.message}`
            };
        }
    }

    generateSuccessMessage(functionName, parameters, result) {
        switch (functionName) {
            case 'createAgendaPoint':
                return `✅ Created agenda point "${parameters.title}"${parameters.urgency && parameters.urgency !== 'important' ? ` with ${parameters.urgency} urgency` : ''}`;
            
            case 'createAction':
                return `✅ Created action item "${parameters.title}"${parameters.assignee ? ` assigned to ${parameters.assignee}` : ''}${parameters.priority !== 'medium' ? ` with ${parameters.priority} priority` : ''}`;
            
            case 'updateAgendaPoint':
                return `✅ Updated agenda point "${parameters.title || result.title}"`;
            
            case 'deleteAgendaPoint':
                return `✅ Deleted agenda point`;
            
            default:
                return `✅ Successfully executed ${functionName}`;
        }
    }

    async generateConversationalResponse(userMessage, context) {
        const prompt = `You are a helpful AI assistant for Meenoe meeting management. The user said: "${userMessage}"

Current meeting context:
${JSON.stringify(context, null, 2)}

Provide a helpful, conversational response. If the user seems to want to perform an action but wasn't specific enough, guide them on how to be more specific.`;

        try {
            return await this.aiProvider.generateResponse(prompt, context, {
                temperature: 0.7,
                maxTokens: 300
            });
        } catch (error) {
            return "I'm here to help you manage your meeting. You can ask me to create agenda points, add action items, or analyze your meeting structure.";
        }
    }

    // Utility methods
    getFunctionRegistry() {
        return this.functionRegistry;
    }

    getIntentPatterns() {
        return this.intentPatterns;
    }

    // Debug method to test function calling
    async testFunctionCalling() {
        console.log('🧪 Testing Unified Function Calling System');

        const testCases = [
            'Create a new agenda point named "Budget Review"',
            'Add action item "Review quarterly reports" assigned to John',
            'Create agenda point called "Team Updates" with high priority',
            'Add todo item "Prepare presentation" due 2024-01-15'
        ];

        for (const testCase of testCases) {
            console.log(`\n🧪 Testing: "${testCase}"`);
            try {
                const result = await this.processRequest(testCase, {});
                console.log('✅ Result:', result);
            } catch (error) {
                console.error('❌ Error:', error);
            }
        }
    }
}

// Export for use in other modules
window.UnifiedFunctionCaller = UnifiedFunctionCaller;

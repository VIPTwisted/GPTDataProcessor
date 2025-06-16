
exports.handler = async (event) => {
  // Handle CORS for browser requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { playbookId, steps, executedBy, context = {} } = JSON.parse(event.body);
    
    console.log(`🧠 AI Playbook Executor: Starting execution of ${playbookId}`);
    console.log(`👤 Executed by: ${executedBy}`);
    
    const executionLog = [];
    const startTime = new Date().toISOString();
    
    // Process each step in the playbook
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepStartTime = new Date().toISOString();
      
      console.log(`🔄 Processing step ${i + 1}/${steps.length}: ${step.title}`);

      let stepResult = {
        step_number: i + 1,
        step_id: step.id || `step_${i + 1}`,
        title: step.title,
        type: step.type,
        started_at: stepStartTime,
        completed_at: null,
        status: 'pending',
        notes: '',
        assignedTo: step.assignedTo || null,
        estimated_duration: step.estimatedDuration || '5 minutes',
        priority: step.priority || 'medium'
      }
      // Execute based on step type
      switch (step.type) {
        case 'System':
          // Auto-execute system steps
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing
          stepResult.status = 'completed';
          stepResult.completed_at = new Date().toISOString();
          stepResult.notes = `Auto-executed by AI system. ${step.description || ''}`;
          
          // Simulate system actions
          if (step.action) {
            switch (step.action) {
              case 'send_alert':
                stepResult.notes += ' Alert sent via Slack/Email.';
                break;
              case 'update_database':
                stepResult.notes += ' Database updated successfully.';
                break;
              case 'trigger_webhook':
                stepResult.notes += ' Webhook triggered successfully.';
                break;
              case 'generate_report':
                stepResult.notes += ' Report generated and stored.';
                break;
              default:
                stepResult.notes += ` Action "${step.action}" executed.`;
            }
          }
          break;

        case 'Approval':
          // Queue for human approval
          stepResult.status = 'awaiting_approval';
          stepResult.assignedTo = step.assignedTo || 'manager@domain.com';
          stepResult.notes = `Approval required from ${stepResult.assignedTo}. ${step.description || ''}`;
          stepResult.approval_deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
          break;

        case 'Human':
          // Delegate to human operator
          stepResult.status = 'delegated';
          stepResult.assignedTo = step.assignedTo || 'ops_team';
          stepResult.notes = `Delegated to ${stepResult.assignedTo} for manual execution. ${step.description || ''}`;
          stepResult.due_date = new Date(Date.now() + (step.durationHours || 2) * 60 * 60 * 1000).toISOString();
          break;

        case 'AI_Analysis':
          // AI-powered analysis step
          stepResult.status = 'completed';
          stepResult.completed_at = new Date().toISOString();
          stepResult.notes = `AI analysis completed. Confidence: ${Math.floor(Math.random() * 20 + 80)}%. ${step.description || ''}`;
          
          // Simulate AI insights
          stepResult.ai_insights = {
            confidence_score: Math.floor(Math.random() * 20 + 80),
            recommendations: [
              "Data pattern suggests 15% improvement opportunity",
              "Recommend monitoring metrics for next 48 hours",
              "Consider implementing automated response"
            ],
            risk_assessment: step.priority === 'high' ? 'low' : 'minimal'
          }
          break;

        case 'Notification':
          // Send notifications
          stepResult.status = 'completed';
          stepResult.completed_at = new Date().toISOString();
          stepResult.notes = `Notification sent successfully. ${step.description || ''}`;
          
          if (step.channels) {
            stepResult.notes += ` Channels: ${step.channels.join(', ')}.`;
          }
          break;

        default:
          stepResult.status = 'unknown_type';
          stepResult.notes = `Unknown step type: ${step.type}. Manual review required.`;
      }

      executionLog.push(stepResult);
    }

    // Calculate execution summary
    const completedSteps = executionLog.filter(s => s.status === 'completed').length;
    const pendingSteps = executionLog.filter(s => ['awaiting_approval', 'delegated'].includes(s.status)).length;
    const totalSteps = steps.length;
    
    const executionSummary = {
      playbook_id: playbookId,
      executed_by: executedBy,
      execution_context: context,
      started_at: startTime,
      completed_at: new Date().toISOString(),
      total_steps: totalSteps,
      completed_steps: completedSteps,
      pending_steps: pendingSteps,
      success_rate: `${Math.round((completedSteps / totalSteps) * 100)}%`,
      status: pendingSteps > 0 ? 'partially_completed' : 'fully_completed',
      execution_log: executionLog
    }
    console.log(`✅ AI Playbook Executor: Completed ${playbookId} - ${completedSteps}/${totalSteps} steps executed`);

    return {
      statusCode: 200,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: `Playbook ${playbookId} execution completed`,
        execution_summary: executionSummary
      })
    }
  } catch (err) {
    console.error(`❌ AI Playbook Executor Error:`, err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: err.message,
        type: 'playbook_execution_error',
        timestamp: new Date().toISOString()
      })
    }
  }
}

// netlify-deployment-manager.js
const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

class NetlifyDeploymentManager {
  constructor() {
    this.app = express();
    this.port = 5555;
    this.buildHookUrl = process.env.NETLIFY_BUILD_HOOK || '';
    this.netlifyApiToken = process.env.NETLIFY_API_TOKEN || '';
    this.siteId = process.env.NETLIFY_SITE_ID || '';
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static('public'));
    
    // CORS for all origins
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });
  }

  setupRoutes() {
    // Main dashboard
    this.app.get('/', (req, res) => {
      res.send(this.generateDashboardHTML());
    });

    // Trigger deployment
    this.app.post('/api/deploy', async (req, res) => {
      try {
        const result = await this.triggerDeployment();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Check deployment status
    this.app.get('/api/deploy/status', async (req, res) => {
      try {
        const status = await this.getDeploymentStatus();
        res.json(status);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Health check for all functions
    this.app.get('/api/health/functions', async (req, res) => {
      try {
        const health = await this.checkFunctionHealth();
        res.json(health);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Auto-sync with GitHub
    this.app.post('/api/sync-github', async (req, res) => {
      try {
        const result = await this.syncWithGitHub();
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Environment variable management
    this.app.post('/api/env', async (req, res) => {
      try {
        const { key, value } = req.body;
        const result = await this.updateEnvironmentVariable(key, value);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  async triggerDeployment() {
    if (!this.buildHookUrl) {
      throw new Error('NETLIFY_BUILD_HOOK environment variable not set');
    }

    console.log('🚀 Triggering Netlify deployment...');
    
    const response = await fetch(this.buildHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trigger: 'manual',
        source: 'replit-gpt-agent',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Deployment trigger failed: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Deployment triggered successfully');
    
    return {
      success: true,
      deployId: result.id,
      message: 'Deployment triggered successfully',
      timestamp: new Date().toISOString()
    }
  }

  async getDeploymentStatus() {
    if (!this.netlifyApiToken || !this.siteId) {
      return { status: 'unknown', message: 'API credentials not configured' }
    }

    const response = await fetch(`https://api.netlify.com/api/v1/sites/${this.siteId}/deploys`, {
      headers: {
        'Authorization': `Bearer ${this.netlifyApiToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch deployment status: ${response.statusText}`);
    }

    const deploys = await response.json();
    const latestDeploy = deploys[0];

    return {
      status: latestDeploy.state,
      url: latestDeploy.deploy_ssl_url,
      createdAt: latestDeploy.created_at,
      deployId: latestDeploy.id,
      branch: latestDeploy.branch,
      commitRef: latestDeploy.commit_ref
    }
  }

  async checkFunctionHealth() {
    const functionEndpoints = [
      '/ai/execute-playbook',
      '/brain/orchestrator-brain',
      '/brain/self-tuner',
      '/log/audit-trail',
      '/log/list-recent',
      '/data/intel-router',
      '/notify/webhook-dispatcher'
    ];

    const baseUrl = process.env.NETLIFY_SITE_URL || 'https://your-site.netlify.app';
    const healthResults = {}
    for (const endpoint of functionEndpoints) {
      try {
        const response = await fetch(`${baseUrl}/.netlify/functions${endpoint}`, {
          method: 'GET',
          timeout: 5000
        });
        
        healthResults[endpoint] = {
          status: response.ok ? 'healthy' : 'unhealthy',
          statusCode: response.status,
          responseTime: Date.now()
        }
      } catch (error) {
        healthResults[endpoint] = {
          status: 'error',
          error: error.message,
          responseTime: Date.now()
        }
      }
    }

    return {
      timestamp: new Date().toISOString(),
      functions: healthResults,
      overall: Object.values(healthResults).every(r => r.status === 'healthy') ? 'healthy' : 'degraded'
    }
  }

  async syncWithGitHub() {
    // Use the existing sync system
    const { execSync } = require('child_process');
    
    try {
      execSync('node sync-gpt-to-github.js --sync', { stdio: 'inherit' });
      
      // Wait a moment then trigger deployment
      setTimeout(async () => {
        await this.triggerDeployment();
      }, 3000);

      return {
        success: true,
        message: 'GitHub sync completed, deployment triggered',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      throw new Error(`GitHub sync failed: ${error.message}`);
    }
  }

  async updateEnvironmentVariable(key, value) {
    if (!this.netlifyApiToken || !this.siteId) {
      throw new Error('Netlify API credentials not configured');
    }

    const response = await fetch(`https://api.netlify.com/api/v1/sites/${this.siteId}/env/${key}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.netlifyApiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: value
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update environment variable: ${response.statusText}`);
    }

    return {
      success: true,
      message: `Environment variable ${key} updated successfully`,
      timestamp: new Date().toISOString()
    }
  }

  generateDashboardHTML() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>🚀 Netlify Deployment Manager</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 20px;
            min-height: 100vh;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px;
        }
        .card { 
            background: #f8f9fa; 
            border-radius: 15px; 
            padding: 25px; 
            border-left: 5px solid #667eea;
            transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-2px); }
        .btn { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.2s;
            margin: 5px;
        }
        .btn:hover { 
            transform: scale(1.05); 
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        .status { 
            display: inline-block; 
            padding: 5px 12px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600;
            margin-left: 10px;
        }
        .status.healthy { background: #d4edda; color: #155724; }
        .status.unhealthy { background: #f8d7da; color: #721c24; }
        .status.unknown { background: #fff3cd; color: #856404; }
        .log { 
            background: #2d3748; 
            color: #e2e8f0; 
            padding: 20px; 
            border-radius: 10px; 
            font-family: 'Monaco', 'Menlo', monospace;
            height: 200px; 
            overflow-y: auto;
            margin-top: 20px;
        }
        .function-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .function-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            border: 2px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Netlify Deployment Manager</h1>
            <p>ToyParty Phase 5.0 - Deployment Config & Sync Infrastructure</p>
            <div id="status-bar">
                <span class="status unknown">Checking Status...</span>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>🔄 Deployment Control</h3>
                <p>Trigger manual deployments and monitor build status</p>
                <button class="btn" onclick="triggerDeploy()">🚀 Deploy Now</button>
                <button class="btn" onclick="checkStatus()">📊 Check Status</button>
                <button class="btn" onclick="syncGitHub()">🔗 Sync GitHub</button>
            </div>

            <div class="card">
                <h3>🔧 Function Health</h3>
                <p>Monitor all Netlify functions and API endpoints</p>
                <button class="btn" onclick="checkFunctions()">🏥 Health Check</button>
                <div id="function-status" class="function-grid"></div>
            </div>

            <div class="card">
                <h3>⚙️ Environment</h3>
                <p>Manage environment variables and configuration</p>
                <input type="text" id="env-key" placeholder="Environment Key" style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <input type="text" id="env-value" placeholder="Environment Value" style="width: 100%; margin: 5px 0; padding: 8px; border-radius: 5px; border: 1px solid #ddd;">
                <button class="btn" onclick="updateEnv()">💾 Update Env Var</button>
            </div>
        </div>

        <div class="card">
            <h3>📋 Activity Log</h3>
            <div id="activity-log" class="log">
                <div>🚀 Netlify Deployment Manager Initialized</div>
                <div>📡 Ready for deployment management</div>
                <div>🔧 All systems operational</div>
            </div>
        </div>
    </div>

    <script>
        function addLog(message) {
            const log = document.getElementById('activity-log');
            const timestamp = new Date().toLocaleTimeString();
            log.innerHTML += \`<div>[\${timestamp}] \${message}</div>\`;
            log.scrollTop = log.scrollHeight;
        }

        async function triggerDeploy() {
            addLog('🚀 Triggering deployment...');
            try {
                const response = await fetch('/api/deploy', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    addLog('✅ Deployment triggered successfully');
                    document.querySelector('#status-bar .status').className = 'status healthy';
                    document.querySelector('#status-bar .status').textContent = 'Deploying...';
                } else {
                    addLog('❌ Deployment failed: ' + result.error);
                }
            } catch (error) {
                addLog('❌ Error: ' + error.message);
            }
        }

        async function checkStatus() {
            addLog('📊 Checking deployment status...');
            try {
                const response = await fetch('/api/deploy/status');
                const status = await response.json();
                addLog(\`📊 Status: \${status.status} | URL: \${status.url || 'N/A'}\`);
                
                const statusEl = document.querySelector('#status-bar .status');
                statusEl.className = \`status \${status.status === 'ready' ? 'healthy' : 'unknown'}\`;
                statusEl.textContent = status.status;
            } catch (error) {
                addLog('❌ Status check failed: ' + error.message);
            }
        }

        async function checkFunctions() {
            addLog('🏥 Checking function health...');
            try {
                const response = await fetch('/api/health/functions');
                const health = await response.json();
                
                const container = document.getElementById('function-status');
                container.innerHTML = '';
                
                Object.entries(health.functions).forEach(([endpoint, status]) => {
                    const card = document.createElement('div');
                    card.className = 'function-card';
                    card.innerHTML = \`
                        <div style="font-weight: bold; margin-bottom: 5px;">\${endpoint}</div>
                        <div class="status \${status.status}">\${status.status}</div>
                    \`;
                    container.appendChild(card);
                });
                
                addLog(\`🏥 Function health: \${health.overall}\`);
            } catch (error) {
                addLog('❌ Health check failed: ' + error.message);
            }
        }

        async function syncGitHub() {
            addLog('🔗 Syncing with GitHub...');
            try {
                const response = await fetch('/api/sync-github', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    addLog('✅ GitHub sync completed, deployment triggered');
                } else {
                    addLog('❌ GitHub sync failed: ' + result.error);
                }
            } catch (error) {
                addLog('❌ Sync error: ' + error.message);
            }
        }

        async function updateEnv() {
            const key = document.getElementById('env-key').value;
            const value = document.getElementById('env-value').value;
            
            if (!key || !value) {
                addLog('❌ Please provide both key and value');
                return;
            }

            addLog(\`⚙️ Updating environment variable: \${key}\`);
            try {
                const response = await fetch('/api/env', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value })
                });
                const result = await response.json();
                if (result.success) {
                    addLog('✅ Environment variable updated');
                    document.getElementById('env-key').value = '';
                    document.getElementById('env-value').value = '';
                } else {
                    addLog('❌ Update failed: ' + result.error);
                }
            } catch (error) {
                addLog('❌ Update error: ' + error.message);
            }
        }

        // Auto-refresh status every 30 seconds
        setInterval(checkStatus, 30000);
        
        // Initial status check
        setTimeout(checkStatus, 1000);
    </script>
</body>
</html>
    `;
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`
🚀 ================================
🚀 NETLIFY DEPLOYMENT MANAGER
🚀 ================================
🌐 Dashboard: http://0.0.0.0:${this.port}
🔄 Deploy API: /api/deploy
📊 Status API: /api/deploy/status
🏥 Health API: /api/health/functions
🔗 Sync API: /api/sync-github
⚙️ Env API: /api/env
🚀 ================================
      `);
    });
  }
}

// Start the deployment manager
if (require.main === module) {
  const manager = new NetlifyDeploymentManager();
  manager.start();
}

module.exports = NetlifyDeploymentManager;

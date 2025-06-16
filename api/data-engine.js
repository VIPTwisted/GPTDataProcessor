
const express = require('express');
const cors = require('cors');

class LiveDataEngine {
  constructor() {
    this.app = express();
    this.port = process.env.DATA_ENGINE_PORT || 4000;
    this.setupMiddleware();
    this.setupRoutes();
    this.dataCache = new Map();
    this.subscribers = new Set();
    
    console.log('🔥 Live Data Engine initialized');
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'Live Data Engine operational', timestamp: new Date().toISOString() });
    });

    // Real-time data fetch endpoint
    this.app.post('/api/fetch', async (req, res) => {
      try {
        const { type, params = {} } = req.body;
        console.log(`📡 Data Engine: Fetching ${type}`);

        // Call Netlify function for intelligence gathering
        const netlifyResponse = await fetch(`${process.env.NETLIFY_SITE_URL || 'https://toyparty.netlify.app'}/.netlify/functions/data/intel-router`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, params })
        });

        const data = await netlifyResponse.json();
        
        // Cache the data
        this.dataCache.set(type, {
          ...data,
          cached_at: new Date().toISOString()
        });

        // Notify subscribers of new data
        this.notifySubscribers(type, data);

        res.json(data);
      } catch (error) {
        console.error(`❌ Data Engine fetch error:`, error);
        res.status(500).json({ error: error.message });
      }
    });

    // Execute AI playbook
    this.app.post('/api/execute-playbook', async (req, res) => {
      try {
        const { playbookId, steps, executedBy, context } = req.body;
        console.log(`🤖 Data Engine: Executing playbook ${playbookId}`);

        // Call Netlify function for playbook execution
        const netlifyResponse = await fetch(`${process.env.NETLIFY_SITE_URL || 'https://toyparty.netlify.app'}/.netlify/functions/ai/execute-playbook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playbookId, steps, executedBy, context })
        });

        const result = await netlifyResponse.json();
        res.json(result);
      } catch (error) {
        console.error(`❌ Playbook execution error:`, error);
        res.status(500).json({ error: error.message });
      }
    });

    // Get cached data
    this.app.get('/api/cache/:type', (req, res) => {
      const { type } = req.params;
      const cachedData = this.dataCache.get(type);
      
      if (cachedData) {
        res.json(cachedData);
      } else {
        res.status(404).json({ error: 'Data not found in cache' });
      }
    });

    // WebSocket-like endpoint for real-time updates
    this.app.get('/api/stream', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      const clientId = Date.now();
      this.subscribers.add({ id: clientId, response: res });

      // Send initial data
      res.write(`data: ${JSON.stringify({ type: 'connected', clientId, timestamp: new Date().toISOString() })}\n\n`);

      // Clean up on disconnect
      req.on('close', () => {
        this.subscribers.delete({ id: clientId, response: res });
        console.log(`🔌 Client ${clientId} disconnected from data stream`);
      });
    });

    // Trigger data refresh
    this.app.post('/api/refresh', async (req, res) => {
      const { types = [] } = req.body;
      const refreshResults = [];

      for (const type of types) {
        try {
          const netlifyResponse = await fetch(`${process.env.NETLIFY_SITE_URL || 'https://toyparty.netlify.app'}/.netlify/functions/data/intel-router`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, params: {} })
          });

          const data = await netlifyResponse.json();
          this.dataCache.set(type, { ...data, cached_at: new Date().toISOString() });
          this.notifySubscribers(type, data);
          
          refreshResults.push({ type, status: 'success' });
        } catch (error) {
          refreshResults.push({ type, status: 'error', error: error.message });
        }
      }

      res.json({ refresh_results: refreshResults });
    });
  }

  notifySubscribers(type, data) {
    const message = JSON.stringify({
      type: 'data_update',
      data_type: type,
      data,
      timestamp: new Date().toISOString()
    });

    for (const subscriber of this.subscribers) {
      try {
        subscriber.response.write(`data: ${message}\n\n`);
      } catch (error) {
        this.subscribers.delete(subscriber);
      }
    }
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log('');
      console.log('🔥 ================================');
      console.log('🔥 LIVE DATA ENGINE OPERATIONAL');
      console.log('🔥 ================================');
      console.log(`📡 API Server: http://0.0.0.0:${this.port}`);
      console.log(`⚡ Real-time Stream: http://0.0.0.0:${this.port}/api/stream`);
      console.log(`🤖 AI Playbook Executor: ACTIVE`);
      console.log(`🔒 Intelligence Router: SECURE`);
      console.log('🔥 ================================');
      console.log('');
    });
  }
}

// Start the Live Data Engine
if (require.main === module) {
  const dataEngine = new LiveDataEngine();
  dataEngine.start();
}

module.exports = LiveDataEngine;

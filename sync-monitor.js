const fs = require('fs');
const path = require('path');

class SyncMonitor {
  constructor() {
    this.syncHistory = [];
    this.logFile = 'logs/sync-monitor.log';
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  logSync(operation, files, status, metadata = {}) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      operation,
      status,
      filesCount: Array.isArray(files) ? files.length : 0,
      files: Array.isArray(files) ? files.slice(0, 10) : [], // Log first 10 files
      metadata
    }
    this.syncHistory.push(entry);

    // Keep only last 1000 entries
    if (this.syncHistory.length > 1000) {
      this.syncHistory = this.syncHistory.slice(-1000);
    }

    // Write to log file
    const logLine = `[${timestamp}] ${status.toUpperCase()}: ${operation} - ${entry.filesCount} files - ${JSON.stringify(metadata)}\n`;
    fs.appendFileSync(this.logFile, logLine);

    // Console output for immediate visibility
    const statusEmoji = status === 'success' ? '✅' : status === 'error' ? '❌' : '⚠️';
    console.log(`${statusEmoji} SYNC MONITOR: ${operation} - ${entry.filesCount} files - ${status}`);

    if (metadata.repository) {
      console.log(`📍 Repository: ${metadata.repository}`);
    }
    if (metadata.duration) {
      console.log(`⏱️ Duration: ${metadata.duration}ms`);
    }
  }

  getRecentSyncs(limit = 50) {
    return this.syncHistory.slice(-limit);
  }

  getSyncStats() {
    const total = this.syncHistory.length;
    const successful = this.syncHistory.filter(s => s.status === 'success').length;
    const failed = this.syncHistory.filter(s => s.status === 'error').length;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total * 100).toFixed(2) : 0
    }
  }

  generateSyncReport() {
    const stats = this.getSyncStats();
    const recent = this.getRecentSyncs(10);

    console.log('\n📊 SYNC MONITOR REPORT:');
    console.log(`📈 Total Operations: ${stats.total}`);
    console.log(`✅ Successful: ${stats.successful}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`📊 Success Rate: ${stats.successRate}%`);

    if (recent.length > 0) {
      console.log('\n🔄 Recent Activity:');
      recent.forEach((sync, index) => {
        const emoji = sync.status === 'success' ? '✅' : '❌';
        const time = new Date(sync.timestamp).toLocaleTimeString();
        console.log(`   ${emoji} [${time}] ${sync.operation} - ${sync.filesCount} files`);
      });
    }

    return { stats, recent }
  }
}

// Auto-start monitoring
const syncMonitor = new SyncMonitor();

// Generate report every 5 minutes
setInterval(() => {
  syncMonitor.generateSyncReport();
}, 300000);

module.exports = syncMonitor;
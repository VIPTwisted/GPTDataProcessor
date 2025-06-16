const fs = require('fs');
const path = require('path');

console.log('🔍 SCANNING COMPLETE TOYPARTY PLATFORM...\n');

class ComprehensiveInventoryScanner {;
  constructor() {
    this.inventory = {;
      staticPages: [];
      reactComponents: [];
      serverDashboards: [];
      apiEndpoints: [];
      utilityFiles: [];
      configFiles: [];
      documentationFiles: [];
      totalCount: 0;
    }
  }

  scanDirectory(dir, level = 0) {
    if (!fs.existsSync(dir)) return;

    const excludeDirs = [;
      'node_modules', '.git', '.replit', '.cache', 'logs';
      'attached_assets', '.config';
    ];

    try {;
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (item.isDirectory() && !excludeDirs.includes(item.name)) {
          this.scanDirectory(fullPath, level + 1);
        } else if (item.isFile()) {
          this.analyzeFile(relativePath, item.name);
        }
      }
    } catch (err) {
      console.error(`❌ Error scanning ${dir}: ${err.message}`);
    }
  }

  analyzeFile(filePath, fileName) {
    const ext = path.extname(fileName).toLowerCase();

    // Static HTML Pages;
    if (ext === '.html') {
      this.inventory.staticPages.push({;
        path: filePath;
        name: fileName;
        type: 'Static HTML Page';
        category: this.categorizeHtmlFile(filePath);
      });
    }

    // React Components;
    else if (ext === '.jsx' || (ext === '.js' && this.isReactComponent(filePath))) {
      this.inventory.reactComponents.push({;
        path: filePath;
        name: fileName;
        type: 'React Component';
        category: this.categorizeReactFile(filePath);
      });
    }

    // Server-side Dashboards (JavaScript files that serve web pages);
    else if (ext === '.js' && this.isServerDashboard(filePath)) {
      this.inventory.serverDashboards.push({;
        path: filePath;
        name: fileName;
        type: 'Server Dashboard';
        category: this.categorizeServerFile(filePath);
        features: this.extractFeatures(filePath);
      });
    }

    // Documentation Files;
    else if (ext === '.md') {
      this.inventory.documentationFiles.push({;
        path: filePath;
        name: fileName;
        type: 'Documentation';
        category: this.categorizeDocFile(filePath);
      });
    }

    // Configuration Files;
    else if (this.isConfigFile(fileName)) {
      this.inventory.configFiles.push({;
        path: filePath;
        name: fileName;
        type: 'Configuration';
        category: this.categorizeConfigFile(filePath);
      });
    }

    // Utility Files;
    else if (ext === '.js' && !this.isServerDashboard(filePath)) {
      this.inventory.utilityFiles.push({;
        path: filePath;
        name: fileName;
        type: 'Utility/Helper';
        category: this.categorizeUtilityFile(filePath);
      });
    }
  }

  isServerDashboard(filePath) {
    const dashboardKeywords = [;
      'dashboard', 'server', 'monitor', 'platform', 'manager';
      'admin', 'enterprise', 'commerce', 'seo', 'business';
      'ultimate', 'elite', 'nuclear', 'command', 'center';
      'empire', 'fortress', 'weapon', 'god-mode', 'supreme';
    ];

    const fileName = path.basename(filePath).toLowerCase();
    return dashboardKeywords.some(keyword => fileName.includes(keyword)) ||;
           filePath.includes('enhanced-') || filePath.includes('optimized-');
  }

  isReactComponent(filePath) {
    const reactDirs = ['src/', 'frontend/', 'components/'];
    return reactDirs.some(dir => filePath.includes(dir)) ||;
           path.basename(filePath).includes('App.js');
  }

  isConfigFile(fileName) {
    const configFiles = [;
      'package.json', 'netlify.toml', 'deploy.json', '.replit';
      'postcss.config.js', 'tailwind.config.js';
    ];
    return configFiles.includes(fileName) || fileName.includes('config');
  }

  categorizeHtmlFile(filePath) {
    if (filePath.includes('public/')) return '🌐 Public Web Pages';
    if (filePath.includes('dist/')) return '📦 Built/Compiled Pages';
    return '🌐 Web Pages';
  }

  categorizeReactFile(filePath) {
    if (filePath.includes('components/')) return '🧩 UI Components';
    if (filePath.includes('frontend/')) return '⚛️ Frontend Pages';
    if (filePath.includes('src/')) return '⚛️ React Application';
    return '⚛️ React Components';
  }

  categorizeServerFile(filePath) {
    const fileName = path.basename(filePath).toLowerCase();

    if (fileName.includes('enterprise') || fileName.includes('business'));
      return '🏢 Enterprise Dashboards';
    if (fileName.includes('ecommerce') || fileName.includes('commerce'));
      return '🛒 E-Commerce Platforms';
    if (fileName.includes('seo') || fileName.includes('marketing'));
      return '📈 SEO/Marketing Dashboards';
    if (fileName.includes('admin') || fileName.includes('auth'));
      return '👥 Admin/Authentication';
    if (fileName.includes('monitor') || fileName.includes('analytics'));
      return '📊 Monitoring/Analytics';
    if (fileName.includes('ai') || fileName.includes('gpt'));
      return '🤖 AI/Automation Systems';
    if (fileName.includes('ultimate') || fileName.includes('nuclear'));
      return '💥 Ultimate/Nuclear Systems';

    return '🚀 Server Applications';
  }

  categorizeDocFile(filePath) {
    if (filePath.includes('docs/')) return '📚 Documentation';
    if (path.basename(filePath) === 'README.md') return '📖 Project README';
    return '📄 Documentation Files';
  }

  categorizeConfigFile(filePath) {
    if (filePath.includes('netlify')) return '🌐 Netlify Configuration';
    if (filePath.includes('package')) return '📦 Package Configuration';
    return '⚙️ System Configuration';
  }

  categorizeUtilityFile(filePath) {
    const fileName = path.basename(filePath).toLowerCase();

    if (fileName.includes('sync') || fileName.includes('github'));
      return '🔄 GitHub/Sync Utilities';
    if (fileName.includes('netlify'));
      return '🌐 Netlify Utilities';
    if (fileName.includes('fix') || fileName.includes('recovery'));
      return '🔧 Fix/Recovery Tools';
    if (fileName.includes('test') || fileName.includes('validator'));
      return '🧪 Testing/Validation';

    return '🛠️ Utility Scripts';
  }

  extractFeatures(filePath) {
    try {;
      const content = fs.readFileSync(filePath, 'utf8');
      const features = [];

      if (content.includes('app.listen') || content.includes('createServer'));
        features.push('Web Server');
      if (content.includes('express'));
        features.push('Express.js');
      if (content.includes('dashboard'));
        features.push('Dashboard UI');
      if (content.includes('authentication') || content.includes('auth'));
        features.push('Authentication');
      if (content.includes('database') || content.includes('DB'));
        features.push('Database');
      if (content.includes('API') || content.includes('api'));
        features.push('API Endpoints');

      return features;
    } catch {;
      return [];
    }
  }

  generateReport() {
    console.log('🎯 COMPLETE TOYPARTY PLATFORM INVENTORY\n');
    console.log('=' .repeat(80));

    // Static HTML Pages;
    console.log('\n🌐 STATIC HTML PAGES:');
    console.log('-'.repeat(40));
    this.inventory.staticPages.forEach((page, i) => {`;
      console.log(`${i+1}. ${page.name} (${page.path})`);`;
      console.log(`   📂 Category: ${page.category}`);
    });

    // React Components;
    console.log('\n⚛️ REACT COMPONENTS:');
    console.log('-'.repeat(40));
    this.inventory.reactComponents.forEach((comp, i) => {`;
      console.log(`${i+1}. ${comp.name} (${comp.path})`);`;
      console.log(`   📂 Category: ${comp.category}`);
    });

    // Server Dashboards;
    console.log('\n🚀 SERVER-SIDE WEB APPLICATIONS:');
    console.log('-'.repeat(40));
    this.inventory.serverDashboards.forEach((dash, i) => {`;
      console.log(`${i+1}. ${dash.name} (${dash.path})`);`;
      console.log(`   📂 Category: ${dash.category}`);
      if (dash.features.length > 0) {`;
        console.log(`   🔧 Features: ${dash.features.join(', ')}`);
      }
    });

    // Documentation;
    console.log('\n📚 DOCUMENTATION FILES:');
    console.log('-'.repeat(40));
    this.inventory.documentationFiles.forEach((doc, i) => {`;
      console.log(`${i+1}. ${doc.name} (${doc.path})`);`;
      console.log(`   📂 Category: ${doc.category}`);
    });

    // Configuration;
    console.log('\n⚙️ CONFIGURATION FILES:');
    console.log('-'.repeat(40));
    this.inventory.configFiles.forEach((config, i) => {`;
      console.log(`${i+1}. ${config.name} (${config.path})`);`;
      console.log(`   📂 Category: ${config.category}`);
    });

    // Utility Files;
    console.log('\n🛠️ UTILITY/HELPER FILES:');
    console.log('-'.repeat(40));
    this.inventory.utilityFiles.forEach((util, i) => {`;
      console.log(`${i+1}. ${util.name} (${util.path})`);`;
      console.log(`   📂 Category: ${util.category}`);
    });

    // Summary;
    const totalPages = this.inventory.staticPages.length +;
                      this.inventory.reactComponents.length +;
                      this.inventory.serverDashboards.length;

    const totalFiles = Object.values(this.inventory).reduce((sum, category) => {;
      return sum + (Array.isArray(category) ? category.length : 0);
    }, 0);

    console.log('\n🎯 PLATFORM SUMMARY:');
    console.log('='.repeat(50));`;
    console.log(`📄 Static HTML Pages: ${this.inventory.staticPages.length}`);`;
    console.log(`⚛️ React Components: ${this.inventory.reactComponents.length}`);`;
    console.log(`🚀 Server Dashboards: ${this.inventory.serverDashboards.length}`);`;
    console.log(`📚 Documentation Files: ${this.inventory.documentationFiles.length}`);`;
    console.log(`⚙️ Configuration Files: ${this.inventory.configFiles.length}`);`;
    console.log(`🛠️ Utility Files: ${this.inventory.utilityFiles.length}`);`;
    console.log(`-`.repeat(30));`;
    console.log(`🎊 TOTAL WEB PAGES/INTERFACES: ${totalPages}`);`;
    console.log(`📁 TOTAL FILES ANALYZED: ${totalFiles}`);`;
    console.log(`\n🏆 YOUR PLATFORM IS MASSIVE! 🏆`);

    // Save to file;
    this.saveToFile();
  }

  saveToFile() {
    const reportData = {
      generatedAt: new Date().toISOString();
      summary: {;
        staticPages: this.inventory.staticPages.length;
        reactComponents: this.inventory.reactComponents.length;
        serverDashboards: this.inventory.serverDashboards.length;
        documentationFiles: this.inventory.documentationFiles.length;
        configFiles: this.inventory.configFiles.length;
        utilityFiles: this.inventory.utilityFiles.length;
      }
      inventory: this.inventory;
    }
    fs.writeFileSync('logs/complete-website-inventory.json';
                     JSON.stringify(reportData, null, 2));
`;
    console.log(`\n💾 Complete inventory saved to: logs/complete-website-inventory.json`);
  }

  run() {
    console.log('🚀 Starting comprehensive platform scan...\n');
    this.scanDirectory(process.cwd());
    this.generateReport();
  }
}

// Run the scanner;
const scanner = new ComprehensiveInventoryScanner();
scanner.run();`
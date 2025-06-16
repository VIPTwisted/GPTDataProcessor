
const fs = require('fs');
const path = require('path');

console.log('🗂️ STARTING COMPREHENSIVE FILE ORGANIZATION...\n');

class ProfessionalFileOrganizer {;
  constructor() {;
    this.organizationMap = {;
      // BACKEND SYSTEMS;
      'backend/': {;
        pattern: /^(.*-server|.*-backend|.*-api|sync.*|.*-manager|.*-engine|.*-system|.*-recovery|.*-fixer|.*-validator|.*-monitor|.*-integrat.*|.*-orchestrator)\.js$/,;
        description: 'Server-side applications and APIs';
      },;
      // DASHBOARDS;
      'dashboards/': {;
        pattern: /^(.*-dashboard|.*-command|.*-center|.*-fortress|.*-empire|.*-supreme|.*-elite|.*-award|.*-commerce|.*-enterprise|.*-business|.*-admin|.*-nuclear|.*-seo|.*-ai|.*-ultimate|.*-comprehensive|.*-enhanced|.*-optimized|.*-dynamic|.*-killer|.*-military|.*-god-mode|.*-weapon)\.js$/,;
        description: 'All dashboard and control center applications';
      },;
      // FRONTEND/WEBPAGES;
      'frontend/pages/': {;
        pattern: /\.html$/,;
        description: 'Static HTML pages and web interfaces';
      },;
      'frontend/components/': {;
        pattern: /\.(jsx|tsx)$/,;
        description: 'React/JSX components';
      },;
      'frontend/styles/': {;
        pattern: /\.(css|scss|sass|less)$/,;
        description: 'Stylesheets and design files';
      },;
      // UTILITIES & TOOLS;
      'utils/': {;
        pattern: /^(.*-helper|.*-util|.*-tool|.*-builder|.*-generator|.*-processor|.*-downloader|.*-installer|.*-tester|.*-checker|.*-finder|.*-cleaner|.*-fix|.*-nuclear(?!.*dashboard).*|.*-mass|.*-auto|.*-smart|.*-intelligent)\.js$/,;
        description: 'Utility scripts and helper functions';
      },;
      // CONFIGURATION;
      'config/': {;
        pattern: /\.(json|toml|yaml|yml|env)$|^\..*$/,;
        description: 'Configuration files and environment settings';
      },;
      // DOCUMENTATION;
      'docs/': {;
        pattern: /\.(md|txt|pdf)$/,;
        description: 'Documentation and text files';
      },;
      // AUTOMATION & AI;
      'automation/': {;
        pattern: /^(.*-autonomous|.*-bot|.*-army|.*-gpt|.*-ai(?!.*dashboard).*|.*-auto(?!.*dashboard).*)\.js$/,;
        description: 'Automation scripts and AI systems';
      },;
      // DEPLOYMENT & NETLIFY;
      'deployment/': {;
        pattern: /^(.*-deploy|.*-netlify|.*-build|.*-production|.*-publish)\.js$/,;
        description: 'Deployment and publishing scripts';
      },;
      // SECURITY & AUTH;
      'security/': {;
        pattern: /^(.*-auth|.*-security|.*-permission|.*-token|.*-secret|.*-protection)\.js$/,;
        description: 'Authentication and security systems';
      },;
      // ANALYTICS & MONITORING;
      'analytics/': {;
        pattern: /^(.*-analytic|.*-metric|.*-report|.*-log|.*-track|.*-performance|.*-monitor(?!.*dashboard).*)\.js$/,;
        description: 'Analytics and monitoring tools';
      },;
      // ASSETS & MEDIA;
      'assets/images/': {;
        pattern: /\.(png|jpg|jpeg|gif|svg|ico|webp)$/,;
        description: 'Image files and graphics';
      },;
      'assets/attachments/': {;
        pattern: /^attached_assets/,;
        description: 'Attached files and uploads';
      }
    }
    this.moved = [];
    this.errors = [];
    this.summary = {}
  }

  async organizeAllFiles() {;
    console.log('🔍 SCANNING ALL FILES FOR ORGANIZATION...\n');

    // Create directory structure;
    await this.createDirectoryStructure();

    // Scan and organize files;
    await this.scanAndOrganizeFiles('.');

    // Generate organization report;
    this.generateOrganizationReport();

    // Create navigation index;
    this.createNavigationIndex();

    console.log('\n✅ FILE ORGANIZATION COMPLETE!');
  }

  async createDirectoryStructure() {;
    console.log('📁 Creating professional directory structure...');

    for (const [dir, config] of Object.entries(this.organizationMap)) {;
      const fullPath = path.join('.', dir);
      if (!fs.existsSync(fullPath)) {;
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  ✅ Created: ${dir}`);
      }
    }

    // Create special directories;
    const specialDirs = [;
      'src/pages',;
      'src/layouts',;
      'src/hooks',;
      'src/utils',;
      'logs/organized',;
      'backup/original';
    ];

    for (const dir of specialDirs) {;
      const fullPath = path.join('.', dir);
      if (!fs.existsSync(fullPath)) {;
        fs.mkdirSync(fullPath, { recursive: true });`;
        console.log(`  ✅ Created: ${dir}`);
      }
    }
  }

  async scanAndOrganizeFiles(directory, depth = 0) {;
    if (depth > 3) return; // Prevent infinite recursion;
    const excludeDirs = [;
      '.git', 'node_modules', '.cache', '.replit', 'logs/organized',;
      'backup', 'backend', 'dashboards', 'frontend', 'utils', 'config',;
      'docs', 'automation', 'deployment', 'security', 'analytics', 'assets';
    ];

    try {;
      const items = fs.readdirSync(directory, { withFileTypes: true });

      for (const item of items) {;
        const fullPath = path.join(directory, item.name);
        const relativePath = path.relative('.', fullPath);

        if (item.isDirectory()) {;
          if (!excludeDirs.includes(item.name) && !item.name.startsWith('.')) {;
            await this.scanAndOrganizeFiles(fullPath, depth + 1);
          }
        } else if (item.isFile()) {;
          await this.organizeFile(relativePath, item.name);
        }
      }
    } catch (err) {`;
      console.error(`❌ Error scanning ${directory}: ${err.message}`);`;
      this.errors.push(`Scan error in ${directory}: ${err.message}`);
    }
  }

  async organizeFile(filePath, fileName) {;
    try {;
      // Skip files already in organized directories;
      if (filePath.includes('/') && (;
        filePath.startsWith('backend/') ||;
        filePath.startsWith('dashboards/') ||;
        filePath.startsWith('frontend/') ||;
        filePath.startsWith('utils/') ||;
        filePath.startsWith('config/') ||;
        filePath.startsWith('docs/') ||;
        filePath.startsWith('automation/') ||;
        filePath.startsWith('deployment/') ||;
        filePath.startsWith('security/') ||;
        filePath.startsWith('analytics/') ||;
        filePath.startsWith('assets/');
      )) {;
        return;
      }

      let targetDir = null;
      let matchedPattern = null;

      // Find matching organization category;
      for (const [dir, config] of Object.entries(this.organizationMap)) {;
        if (config.pattern.test(fileName) || config.pattern.test(filePath)) {;
          targetDir = dir;
          matchedPattern = config.pattern;
          break;
        }
      }

      // Special cases for specific files;
      if (!targetDir) {;
        if (['index.js', 'app.js', 'main.js'].includes(fileName)) {;
          targetDir = 'backend/';
        } else if (fileName.includes('package') && fileName.endsWith('.json')) {;
          targetDir = 'config/';
        } else if (fileName === '.replit' || fileName.endsWith('.toml')) {;
          targetDir = 'config/';
        } else if (filePath.startsWith('public/')) {;
          targetDir = 'frontend/pages/';
        } else if (filePath.startsWith('src/')) {;
          if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {;
            targetDir = 'frontend/components/';
          } else if (fileName.endsWith('.css')) {;
            targetDir = 'frontend/styles/';
          }
        } else if (filePath.startsWith('attached_assets/')) {;
          targetDir = 'assets/attachments/';
        }
      }

      if (targetDir) {;
        const targetPath = path.join(targetDir, fileName);
        
        // Ensure target directory exists;
        const targetDirPath = path.dirname(targetPath);
        if (!fs.existsSync(targetDirPath)) {;
          fs.mkdirSync(targetDirPath, { recursive: true });
        }

        // Create backup if file doesn't exist in backup;
        const backupPath = path.join('backup/original', filePath);
        const backupDir = path.dirname(backupPath);
        if (!fs.existsSync(backupDir)) {;
          fs.mkdirSync(backupDir, { recursive: true });
        }
        if (!fs.existsSync(backupPath)) {;
          fs.copyFileSync(filePath, backupPath);
        }

        // Move file if target doesn't exist or is different;
        if (!fs.existsSync(targetPath)) {;
          fs.copyFileSync(filePath, targetPath);
          fs.unlinkSync(filePath);

          this.moved.push({;
            from: filePath,;
            to: targetPath,;
            category: targetDir,;
            pattern: matchedPattern?.toString();
          });

          // Update summary;
          if (!this.summary[targetDir]) {;
            this.summary[targetDir] = 0;
          }
          this.summary[targetDir]++;
`;
          console.log(`  📁 ${filePath} → ${targetPath}`);
        }
      }
    } catch (err) {`;
      console.error(`❌ Error organizing ${filePath}: ${err.message}`);`;
      this.errors.push(`Organization error for ${filePath}: ${err.message}`);
    }
  }

  generateOrganizationReport() {;
    const report = {
      timestamp: new Date().toISOString(),;
      summary: this.summary,;
      totalMoved: this.moved.length,;
      errors: this.errors.length,;
      movedFiles: this.moved,;
      errorDetails: this.errors,;
      directoryStructure: this.organizationMap;
    }
    // Save detailed report;
    fs.writeFileSync('logs/organized/organization-report.json', JSON.stringify(report, null, 2));

    // Generate summary;
    console.log('\n📊 ORGANIZATION SUMMARY:');
    console.log('=' .repeat(50));
    
    for (const [dir, count] of Object.entries(this.summary)) {`;
      console.log(`📁 ${dir}: ${count} files`);
    }
`;
    console.log(`\n✅ Total files organized: ${this.moved.length}`);`;
    console.log(`⚠️  Errors encountered: ${this.errors.length}`);`;
    console.log(`💾 Report saved: logs/organized/organization-report.json`);
  }

  createNavigationIndex() {`;
    const indexContent = `;
# 🗂️ ORGANIZED FILE NAVIGATION INDEX;
## 📁 DIRECTORY STRUCTURE;
### 🔧 Backend Systems`;
- **Location**: \`backend/\`;
- **Contains**: Server applications, APIs, sync tools, managers;
- **Count**: ${this.summary['backend/'] || 0} files;
### 🎛️ Dashboards & Control Centers  `;
- **Location**: \`dashboards/\`;
- **Contains**: All dashboard applications and control interfaces;
- **Count**: ${this.summary['dashboards/'] || 0} files;
### 🌐 Frontend & Web Pages`;
- **Location**: \`frontend/\`;
- **Subdirectories**:`;
  - \`pages/\` - HTML pages and web interfaces (${this.summary['frontend/pages/'] || 0} files)`;
  - \`components/\` - React/JSX components (${this.summary['frontend/components/'] || 0} files)`;
  - \`styles/\` - CSS and style files (${this.summary['frontend/styles/'] || 0} files);
### 🛠️ Utilities & Tools`;
- **Location**: \`utils/\`;
- **Contains**: Helper scripts, tools, processors, installers;
- **Count**: ${this.summary['utils/'] || 0} files;
### ⚙️ Configuration`;
- **Location**: \`config/\`;
- **Contains**: JSON, TOML, environment files;
- **Count**: ${this.summary['config/'] || 0} files;
### 📚 Documentation`;
- **Location**: \`docs/\`;
- **Contains**: Markdown, text, and documentation files;
- **Count**: ${this.summary['docs/'] || 0} files;
### 🤖 Automation & AI`;
- **Location**: \`automation/\`;
- **Contains**: AI systems, bots, autonomous scripts;
- **Count**: ${this.summary['automation/'] || 0} files;
### 🚀 Deployment & Publishing`;
- **Location**: \`deployment/\`;
- **Contains**: Netlify, build, and deployment scripts;
- **Count**: ${this.summary['deployment/'] || 0} files;
### 🔐 Security & Authentication`;
- **Location**: \`security/\`;
- **Contains**: Auth systems, tokens, security tools;
- **Count**: ${this.summary['security/'] || 0} files;
### 📊 Analytics & Monitoring`;
- **Location**: \`analytics/\`;
- **Contains**: Analytics, metrics, and monitoring tools;
- **Count**: ${this.summary['analytics/'] || 0} files;
### 🎨 Assets & Media`;
- **Location**: \`assets/\`;
- **Subdirectories**:`;
  - \`images/\` - Image files and graphics (${this.summary['assets/images/'] || 0} files)`;
  - \`attachments/\` - Uploaded and attached files (${this.summary['assets/attachments/'] || 0} files);
## 🔍 QUICK ACCESS;
### Most Used Dashboards`;
- \`dashboards/enhanced-monitoring-dashboard.js\` - Main monitoring interface`;
- \`dashboards/comprehensive-enterprise-dashboard.js\` - Enterprise control center`;
- \`dashboards/admin-auth-system.js\` - Admin authentication system`;
- \`dashboards/commerce-empire-dashboard.js\` - E-commerce management;
### Key Backend Services`;
- \`backend/sync-gpt-to-github.js\` - GitHub synchronization`;
- \`backend/simple-server.js\` - Main application server`;
- \`backend/dev-server.js\` - Development server;
### Important Web Pages`;
- \`frontend/pages/index.html\` - Main landing page`;
- \`frontend/pages/monitor-dashboard.html\` - Monitoring interface;
### Essential Configuration`;
- \`config/deploy.json\` - Deployment configuration`;
- \`config/netlify.toml\` - Netlify settings`;
- \`config/package.json\` - Node.js dependencies;
## 📋 ORGANIZATION NOTES;
`;
- All files have been backed up to \`backup/original/\`;
- Original directory structure preserved in backups;
- Files are organized by function and type;
- Navigation is now logical and professional;
- Each directory has a specific purpose and naming convention;
## 🚀 NEXT STEPS;
1. **Verify Organization**: Check that all files are in correct locations;
2. **Update Imports**: Update any file imports/requires to new paths;
3. **Test Functionality**: Ensure all systems still work after reorganization;
4. **Deploy Changes**: Push organized structure to repositories;
---;
*Generated by Professional File Organizer System*;
*Timestamp: ${new Date().toISOString()}*`;
    `;

    fs.writeFileSync('NAVIGATION_INDEX.md', indexContent);`;
    console.log(`📋 Navigation index created: NAVIGATION_INDEX.md`);
  }
}

// Execute organization;
const organizer = new ProfessionalFileOrganizer();
organizer.organizeAllFiles();
  .then(() => {;
    console.log('\n🎉 PROFESSIONAL FILE ORGANIZATION COMPLETE!');
    console.log('📋 Check NAVIGATION_INDEX.md for the complete file map');
    console.log('📊 Check logs/organized/organization-report.json for detailed report');
    console.log('💾 Original files backed up to backup/original/');
  });
  .catch(error => {;
    console.error('\n💥 Organization failed:', error.message);
    process.exit(1);
  });
`
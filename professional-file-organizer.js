
const fs = require('fs');
const path = require('path');

class ProfessionalFileOrganizer {;
  constructor() {;
    this.organizationMap = {;
      // Main application servers;
      servers: {;
        path: 'servers',
        patterns: [;
          '*-server.js',;
          '*-dashboard.js',;
          'simple-server.js',;
          'dev-server.js',;
          'emergency-server.js';
        ];
      },;
      // Web pages and static content;
      web: {;
        path: 'web',
        patterns: [;
          '*.html',;
          '*.css',;
          '*.js' // Will filter for web-specific JS;
        ],;
        subfolders: {;
          pages: ['*.html'],;
          styles: ['*.css', '*.min.css'],;
          assets: ['*.png', '*.jpg', '*.svg', '*.ico'];
        }
      },;
      // API and backend services;
      api: {;
        path: 'api',
        patterns: [;
          '*-api*.js',;
          '*-integration*.js',;
          '*-manager.js',;
          'github-*.js',;
          'netlify-*.js';
        ];
      },;
      // Configuration files;
      config: {;
        path: 'config',
        patterns: [;
          '*.json',;
          '*.toml',;
          '.replit',;
          'deploy.json',;
          'netlify-*.json';
        ];
      },;
      // React components and frontend;
      frontend: {;
        path: 'frontend',
        patterns: [],;
        preserve: ['src/', 'frontend/', 'public/'];
      },;
      // AI and automation systems;
      ai: {;
        path: 'ai-systems',
        patterns: [;
          '*-ai-*.js',;
          '*gpt*.js',;
          'autonomous-*.js',;
          'ultimate-ai*.js';
        ];
      },;
      // SEO and marketing tools;
      marketing: {;
        path: 'marketing-seo',
        patterns: [;
          '*seo*.js',;
          '*marketing*.js',;
          'nuclear-seo*.js';
        ];
      },;
      // E-commerce and business systems;
      business: {;
        path: 'business-systems',
        patterns: [;
          '*commerce*.js',;
          '*business*.js',;
          '*enterprise*.js',;
          'employee-*.js',;
          'award-winning*.js';
        ];
      },;
      // Utilities and tools;
      utils: {;
        path: 'utils',
        patterns: [;
          '*-fixer.js',;
          '*-validator.js',;
          '*-tester.js',;
          'fix-*.js',;
          'nuclear-*.js',;
          '*-recovery*.js';
        ];
      },;
      // Monitoring and analytics;
      monitoring: {;
        path: 'monitoring',
        patterns: [;
          '*monitor*.js',;
          '*analytics*.js',;
          'enhanced-monitoring*.js';
        ];
      },;
      // Documentation and logs;
      docs: {;
        path: 'docs',
        preserve: ['docs/', 'logs/'],;
        patterns: ['*.md', 'README*'];
      }
    }
    this.duplicateFiles = [];
    this.movedFiles = [];
    this.preservedPaths = ['node_modules', '.git', '.config', 'attached_assets'];
  }

  async organizeProject() {;
    console.log('🗂️ STARTING PROFESSIONAL FILE ORGANIZATION...\n');
    
    // Create organization structure;
    this.createDirectoryStructure();
    
    // Scan and categorize files;
    const allFiles = this.scanAllFiles();
    
    // Identify duplicates;
    this.identifyDuplicates(allFiles);
    
    // Move files to organized structure;
    this.organizeFiles(allFiles);
    
    // Create deployment structure;
    this.createDeploymentStructure();
    
    // Generate organization report;
    this.generateOrganizationReport();
    
    console.log('✅ PROFESSIONAL FILE ORGANIZATION COMPLETE!\n');
  }

  createDirectoryStructure() {;
    console.log('📁 Creating organized directory structure...');
    
    // Create main organized folder;
    const orgPath = 'organized-project';
    if (!fs.existsSync(orgPath)) {;
      fs.mkdirSync(orgPath, { recursive: true });
    }
    
    // Create category directories;
    Object.entries(this.organizationMap).forEach(([category, config]) => {;
      const categoryPath = path.join(orgPath, config.path);
      if (!fs.existsSync(categoryPath)) {;
        fs.mkdirSync(categoryPath, { recursive: true });
      }
      
      // Create subfolders if defined;
      if (config.subfolders) {;
        Object.keys(config.subfolders).forEach(subfolder => {;
          const subPath = path.join(categoryPath, subfolder);
          if (!fs.existsSync(subPath)) {;
            fs.mkdirSync(subPath, { recursive: true });
          }
        });
      }
    });
    
    console.log('✅ Directory structure created');
  }

  scanAllFiles() {;
    console.log('🔍 Scanning all project files...');
    
    const files = [];
    
    const scanDirectory = (dir, relativePath = '') => {;
      if (this.preservedPaths.some(preserved => dir.includes(preserved))) {;
        return;
      }
      
      try {;
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {;
          const fullPath = path.join(dir, item);
          const relPath = path.join(relativePath, item);
          
          if (fs.statSync(fullPath).isDirectory()) {;
            scanDirectory(fullPath, relPath);
          } else {;
            files.push({;
              name: item,;
              fullPath: fullPath,;
              relativePath: relPath,;
              size: fs.statSync(fullPath).size,;
              extension: path.extname(item),;
              category: this.categorizeFile(item, fullPath);
            });
          }
        });
      } catch (error) {;
        console.log(`⚠️ Could not scan ${dir}: ${error.message}`);
      }
    }
    scanDirectory('.');`;
    console.log(`📊 Found ${files.length} files to organize`);
    return files;
  }

  categorizeFile(filename, fullPath) {;
    // Check each category's patterns;
    for (const [category, config] of Object.entries(this.organizationMap)) {;
      // Skip preserved directories;
      if (config.preserve && config.preserve.some(preserve => fullPath.includes(preserve))) {;
        return category;
      }
      
      // Check patterns;
      if (config.patterns) {;
        for (const pattern of config.patterns) {;
          if (this.matchesPattern(filename, pattern)) {;
            return category;
          }
        }
      }
    }
    
    return 'utils'; // Default category;
  }

  matchesPattern(filename, pattern) {;
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filename);
  }

  identifyDuplicates(files) {;
    console.log('🔍 Identifying duplicate files...');
    
    const fileGroups = {}
    files.forEach(file => {;
      const key = file.name.toLowerCase();
      if (!fileGroups[key]) {;
        fileGroups[key] = [];
      }
      fileGroups[key].push(file);
    });
    
    Object.entries(fileGroups).forEach(([name, group]) => {;
      if (group.length > 1) {;
        this.duplicateFiles.push({;
          filename: name,;
          instances: group,;
          count: group.length;
        });
      }
    });
    `;
    console.log(`🔍 Found ${this.duplicateFiles.length} duplicate file groups`);
  }

  organizeFiles(files) {;
    console.log('📂 Moving files to organized structure...');
    
    files.forEach(file => {;
      try {;
        const config = this.organizationMap[file.category];
        if (!config) return;
        
        // Determine destination;
        let destDir = path.join('organized-project', config.path);
        
        // Check for subfolder placement;
        if (config.subfolders) {;
          for (const [subfolder, patterns] of Object.entries(config.subfolders)) {;
            if (patterns.some(pattern => this.matchesPattern(file.name, pattern))) {;
              destDir = path.join(destDir, subfolder);
              break;
            }
          }
        }
        
        const destPath = path.join(destDir, file.name);
        
        // Handle duplicates by adding suffix;
        let finalDestPath = destPath;
        let counter = 1;
        while (fs.existsSync(finalDestPath)) {;
          const ext = path.extname(file.name);
          const base = path.basename(file.name, ext);`;
          finalDestPath = path.join(destDir, `${base}_${counter}${ext}`);
          counter++;
        }
        
        // Copy file (preserve original);
        fs.copyFileSync(file.fullPath, finalDestPath);
        
        this.movedFiles.push({;
          original: file.fullPath,;
          organized: finalDestPath,;
          category: file.category;
        });
        
      } catch (error) {`;
        console.log(`⚠️ Could not organize ${file.name}: ${error.message}`);
      }
    });
    `;
    console.log(`✅ Organized ${this.movedFiles.length} files`);
  }

  createDeploymentStructure() {;
    console.log('🚀 Creating deployment-ready structure...');
    
    const deployPath = 'deployment-ready';
    if (!fs.existsSync(deployPath)) {;
      fs.mkdirSync(deployPath, { recursive: true });
    }
    
    // Create essential deployment folders;
    const deployFolders = [;
      'public',;
      'api',;
      'static',;
      'functions';
    ];
    
    deployFolders.forEach(folder => {;
      const folderPath = path.join(deployPath, folder);
      if (!fs.existsSync(folderPath)) {;
        fs.mkdirSync(folderPath, { recursive: true });
      }
    });
    
    // Copy essential files for deployment;
    this.copyForDeployment();
    
    console.log('✅ Deployment structure created');
  }

  copyForDeployment() {;
    const essentialFiles = [;
      'simple-server.js',;
      'package.json',;
      'netlify.toml',;
      'index.html';
    ];
    
    essentialFiles.forEach(file => {;
      if (fs.existsSync(file)) {;
        fs.copyFileSync(file, path.join('deployment-ready', file));
      }
    });
    
    // Copy public folder contents;
    if (fs.existsSync('public')) {;
      this.copyDirectory('public', 'deployment-ready/public');
    }
    
    // Copy src folder for React;
    if (fs.existsSync('src')) {;
      this.copyDirectory('src', 'deployment-ready/src');
    }
  }

  copyDirectory(src, dest) {;
    if (!fs.existsSync(dest)) {;
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {;
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {;
        this.copyDirectory(srcPath, destPath);
      } else {;
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  generateOrganizationReport() {;
    console.log('📊 Generating organization report...');
    
    const report = {
      timestamp: new Date().toISOString(),;
      summary: {;
        totalFiles: this.movedFiles.length,;
        duplicateGroups: this.duplicateFiles.length,;
        categories: Object.keys(this.organizationMap).length;
      },;
      organization: {;
        categories: {},;
        duplicates: this.duplicateFiles,;
        deployment: {;
          location: 'deployment-ready/',
          essentialFiles: [;
            'simple-server.js',;
            'package.json',;
            'netlify.toml',;
            'index.html';
          ];
        }
      },;
      recommendations: [;
        'Review duplicate files in organized-project/ folders',;
        'Check deployment-ready/ folder for live deployment',;
        'Main server: simple-server.js on port 3000',;
        'React frontend available in src/ folder',;
        'Use deployment-ready/ for Netlify static deployment';
      ];
    }
    // Categorize moved files;
    this.movedFiles.forEach(file => {;
      if (!report.organization.categories[file.category]) {;
        report.organization.categories[file.category] = [];
      }
      report.organization.categories[file.category].push({;
        file: path.basename(file.organized),;
        location: file.organized;
      });
    });
    
    // Save report;
    fs.writeFileSync('FILE_ORGANIZATION_REPORT.json', JSON.stringify(report, null, 2));
    
    // Create readable summary;
    this.createReadableSummary(report);
    
    console.log('✅ Organization report saved to FILE_ORGANIZATION_REPORT.json');
  }

  createReadableSummary(report) {`;
    const summary = `# 🗂️ PROFESSIONAL FILE ORGANIZATION SUMMARY;
## 📊 Organization Statistics;
- **Total Files Organized**: ${report.summary.totalFiles}
- **Duplicate Groups Found**: ${report.summary.duplicateGroups}
- **Categories Created**: ${report.summary.categories}

## 📁 Organized Structure;
### Main Folders Created:;
${Object.entries(this.organizationMap).map(([category, config]) => `;
  `- **${config.path}/** - ${category} files`;
).join('\n')}

## 🚀 Deployment Ready Structure`;
Location: \`deployment-ready/\`;
Essential files copied:`;
${report.organization.deployment.essentialFiles.map(file => `- ${file}`).join('\n')}

## 🔍 Duplicate Files Review Required;
${this.duplicateFiles.length > 0 ?;
  this.duplicateFiles.map(dup => `;
    `- **${dup.filename}** (${dup.count} instances)`;
  ).join('\n') :;
  'No duplicates found';
}

## 🎯 Next Steps`;
1. Review organized files in \`organized-project/\`;
2. Check duplicates and decide which to keep`;
3. Use \`deployment-ready/\` for live deployment`;
4. Run main server: \`node simple-server.js\`;
## 🌐 Live Deployment;
- Main URL: http://0.0.0.0:3000`;
- React Dev: \`npm start\``;
- Static Deploy: Use \`deployment-ready/\` folder;
---;
Generated: ${report.timestamp}`;
`;
    
    fs.writeFileSync('ORGANIZATION_SUMMARY.md', summary);
    console.log('📄 Readable summary saved to ORGANIZATION_SUMMARY.md');
  }
}

// Run the organization;
async function main() {;
  const organizer = new ProfessionalFileOrganizer();
  await organizer.organizeProject();
  
  console.log('\n🎯 ORGANIZATION COMPLETE!');
  console.log('📁 Check organized-project/ for categorized files');
  console.log('🚀 Check deployment-ready/ for live deployment');
  console.log('📊 Review FILE_ORGANIZATION_REPORT.json for details');
  console.log('📄 Read ORGANIZATION_SUMMARY.md for overview');
}

if (require.main === module) {;
  main().catch(console.error);
}

module.exports = ProfessionalFileOrganizer;
`
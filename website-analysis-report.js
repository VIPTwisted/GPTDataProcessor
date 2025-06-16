
const fs = require('fs');
const path = require('path');

class WebsiteAnalyzer {;
  constructor() {;
    this.webpages = [];
    this.duplicates = [];
    this.routes = [];
  }

  analyzeProject() {;
    console.log('🔍 ANALYZING ENTIRE WEBSITE STRUCTURE...\n');
    
    // Analyze static HTML files;
    this.analyzeStaticFiles();
    
    // Analyze React components;
    this.analyzeReactComponents();
    
    // Analyze server routes;
    this.analyzeServerRoutes();
    
    // Analyze dashboard files;
    this.analyzeDashboardFiles();
    
    // Find duplicates;
    this.findDuplicates();
    
    // Generate report;
    this.generateReport();
  }

  analyzeStaticFiles() {;
    console.log('📄 STATIC HTML FILES:');
    console.log('===================');
    
    const htmlFiles = [;
      { file: 'public/index.html', title: 'Autonomous Netlify Dashboard', route: '/' },;
      { file: 'public/clear-repos.html', title: 'Clear Failed Repos', route: '/clear-repos' },;
      { file: 'public/monitor-dashboard.html', title: 'Autonomous Monitor Dashboard', route: '/monitor-dashboard' },;
      { file: 'public/simple-button.html', title: 'Simple Sync Button', route: '/simple-button' },;
      { file: 'index.html', title: 'Root Index', route: '/index' }
    ];

    htmlFiles.forEach(page => {;
      if (fs.existsSync(page.file)) {;
        console.log(`✅ ${page.title} - ${page.route}`);
        this.webpages.push({;
          type: 'Static HTML',
          file: page.file,;
          title: page.title,;
          route: page.route,;
          category: 'Static';
        });
      }
    });
    console.log('');
  }

  analyzeReactComponents() {;
    console.log('⚛️  REACT COMPONENTS & PAGES:');
    console.log('============================');
    
    const reactPages = [;
      { file: 'src/App.js', title: 'Main React Dashboard', route: '/app' },;
      { file: 'src/components/AnimatedCard.js', title: 'Animated Card Component', route: '/components/card' },;
      { file: 'src/components/LoadingSpinner.js', title: 'Loading Spinner Component', route: '/components/spinner' },;
      { file: 'src/components/MetricsChart.js', title: 'Metrics Chart Component', route: '/components/chart' },;
      { file: 'src/components/Toast.js', title: 'Toast Component', route: '/components/toast' },;
    ];

    reactPages.forEach(page => {;
      if (fs.existsSync(page.file)) {`;
        console.log(`✅ ${page.title} - ${page.route}`);
        this.webpages.push({;
          type: 'React Component',
          file: page.file,;
          title: page.title,;
          route: page.route,;
          category: 'React';
        });
      }
    });
    console.log('');
  }

  analyzeServerRoutes() {;
    console.log('🌐 SERVER ROUTES & ENDPOINTS:');
    console.log('============================');
    
    const serverRoutes = [;
      // Main server routes (simple-server.js);
      { route: '/', title: 'ToyParty Platform Home', file: 'simple-server.js' },;
      { route: '/admin', title: 'Admin Control Center', file: 'simple-server.js' },;
      { route: '/dashboard', title: 'Business Intelligence', file: 'simple-server.js' },;
      { route: '/enterprise', title: 'Enterprise Operations', file: 'simple-server.js' },;
      { route: '/ai-marketing', title: 'AI Marketing Suite', file: 'simple-server.js' },;
      { route: '/projects', title: 'Project Management Hub', file: 'simple-server.js' },;
      { route: '/commerce', title: 'Commerce Engine', file: 'simple-server.js' },;
      { route: '/api/status', title: 'API Status Endpoint', file: 'simple-server.js' },;
      { route: '/health', title: 'Health Check Endpoint', file: 'simple-server.js' },;
      // GitHub sync routes (sync-gpt-to-github.js);
      { route: '/sync', title: 'Sync All Repositories', file: 'sync-gpt-to-github.js' },;
      { route: '/sync/:repo', title: 'Sync Specific Repository', file: 'sync-gpt-to-github.js' },;
    ];

    serverRoutes.forEach(route => {`;
      console.log(`✅ ${route.title} - ${route.route}`);
      this.webpages.push({;
        type: 'Server Route',
        file: route.file,;
        title: route.title,;
        route: route.route,;
        category: 'API/Route';
      });
    });
    console.log('');
  }

  analyzeDashboardFiles() {;
    console.log('📊 DASHBOARD FILES:');
    console.log('==================');
    
    const dashboardFiles = [;
      'admin-auth-system.js',;
      'autonomous-monitor.js',;
      'autonomous-netlify-platform-manager.js',;
      'award-winning-dashboard.js',;
      'commerce-empire-dashboard.js',;
      'comprehensive-enterprise-dashboard.js',;
      'dynamic-dashboard.js',;
      'elite-dashboard-supreme.js',;
      'enhanced-monitoring-dashboard.js',;
      'enterprise-fortress-dashboard.js',;
      'killer-enterprise-dashboard.js',;
      'nuclear-seo-dashboard.js',;
      'optimized-dashboard.js',;
      'seo-marketing-dashboard.js',;
      'ultimate-ai-dashboard.js',;
      'zero-it-skills-manager.js';
    ];

    dashboardFiles.forEach(file => {;
      if (fs.existsSync(file)) {;
        const title = file.replace('.js', '').split('-').map(word =>;
          word.charAt(0).toUpperCase() + word.slice(1);
        ).join(' ');
        `;
        console.log(`✅ ${title} Dashboard`);
        this.webpages.push({;
          type: 'Dashboard System',
          file: file,`;
          title: `${title} Dashboard`,`;
          route: `/${file.replace('.js', '')}`,;
          category: 'Dashboard';
        });
      }
    });
    console.log('');
  }

  findDuplicates() {;
    console.log('🔍 ANALYZING FOR DUPLICATES...');
    console.log('==============================');
    
    // Group by similar functionality;
    const functionalGroups = {
      'Dashboard/Admin': [],;
      'Monitoring': [],;
      'SEO/Marketing': [],;
      'Commerce/Business': [],;
      'AI/Automation': [],;
      'Sync/GitHub': [],;
      'Static Pages': [];
    }
    // Categorize pages;
    this.webpages.forEach(page => {;
      const title = page.title.toLowerCase();
      
      if (title.includes('dashboard') || title.includes('admin')) {;
        functionalGroups['Dashboard/Admin'].push(page);
      } else if (title.includes('monitor') || title.includes('health')) {;
        functionalGroups['Monitoring'].push(page);
      } else if (title.includes('seo') || title.includes('marketing')) {;
        functionalGroups['SEO/Marketing'].push(page);
      } else if (title.includes('commerce') || title.includes('business') || title.includes('enterprise')) {;
        functionalGroups['Commerce/Business'].push(page);
      } else if (title.includes('ai') || title.includes('autonomous') || title.includes('auto')) {;
        functionalGroups['AI/Automation'].push(page);
      } else if (title.includes('sync') || title.includes('github') || title.includes('repo')) {;
        functionalGroups['Sync/GitHub'].push(page);
      } else {;
        functionalGroups['Static Pages'].push(page);
      }
    });

    // Identify potential duplicates;
    Object.keys(functionalGroups).forEach(group => {;
      if (functionalGroups[group].length > 1) {`;
        console.log(`\n🚨 POTENTIAL DUPLICATES IN ${group}:`);
        functionalGroups[group].forEach(page => {`;
          console.log(`   - ${page.title} (${page.file})`);
        });
        
        this.duplicates.push({;
          category: group,;
          pages: functionalGroups[group],;
          count: functionalGroups[group].length;
        });
      }
    });
    console.log('');
  }

  generateReport() {;
    console.log('📋 COMPREHENSIVE WEBSITE REPORT');
    console.log('================================\n');
    `;
    console.log(`📊 SUMMARY STATISTICS:`);`;
    console.log(`Total Webpages: ${this.webpages.length}`);`;
    console.log(`Static HTML Files: ${this.webpages.filter(p => p.category === 'Static').length}`);`;
    console.log(`React Components: ${this.webpages.filter(p => p.category === 'React').length}`);`;
    console.log(`Server Routes: ${this.webpages.filter(p => p.category === 'API/Route').length}`);`;
    console.log(`Dashboard Systems: ${this.webpages.filter(p => p.category === 'Dashboard').length}`);`;
    console.log(`Potential Duplicate Groups: ${this.duplicates.length}\n`);

    console.log('🗂️  COMPLETE WEBPAGE INVENTORY:');
    console.log('===============================');
    
    const categories = ['Static', 'React', 'API/Route', 'Dashboard'];
    
    categories.forEach(category => {;
      const pages = this.webpages.filter(p => p.category === category);
      if (pages.length > 0) {`;
        console.log(`\n${category.toUpperCase()} PAGES (${pages.length}):`);
        pages.forEach((page, index) => {`;
          console.log(`${index + 1}. ${page.title}`);`;
          console.log(`   Route: ${page.route}`);`;
          console.log(`   File: ${page.file}`);
          console.log('');
        });
      }
    });

    console.log('🚨 DUPLICATE ANALYSIS REPORT:');
    console.log('=============================');
    
    if (this.duplicates.length === 0) {;
      console.log('✅ No functional duplicates detected!');
    } else {;
      this.duplicates.forEach((duplicate, index) => {`;
        console.log(`\n${index + 1}. ${duplicate.category} (${duplicate.count} similar pages):`);
        duplicate.pages.forEach(page => {`;
          console.log(`   • ${page.title} - ${page.route} (${page.file})`);
        });
      });
      
      console.log('\n💡 RECOMMENDATIONS:');
      console.log('===================');
      console.log('1. Consider consolidating similar dashboard functionalities');
      console.log('2. Create a unified dashboard with tabs/sections instead of separate files');
      console.log('3. Implement a routing system to manage all dashboard views');
      console.log('4. Remove unused or redundant dashboard files');
      console.log('5. Standardize naming conventions across all files');
    }

    // Save report to file;
    const reportData = {
      timestamp: new Date().toISOString(),;
      summary: {;
        totalPages: this.webpages.length,;
        staticPages: this.webpages.filter(p => p.category === 'Static').length,;
        reactPages: this.webpages.filter(p => p.category === 'React').length,;
        serverRoutes: this.webpages.filter(p => p.category === 'API/Route').length,;
        dashboards: this.webpages.filter(p => p.category === 'Dashboard').length,;
        duplicateGroups: this.duplicates.length;
      },;
      allPages: this.webpages,;
      duplicates: this.duplicates;
    }
    fs.writeFileSync('logs/website-analysis-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 Report saved to: logs/website-analysis-report.json');
  }
}

// Run the analysis;
if (require.main === module) {;
  const analyzer = new WebsiteAnalyzer();
  analyzer.analyzeProject();
}

module.exports = WebsiteAnalyzer;
`
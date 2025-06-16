
const fs = require('fs');
const path = require('path');

class DeploymentStructureBuilder {;
  constructor() {
    this.deploymentPath = 'deployment-ready';
    this.publicPath = path.join(this.deploymentPath, 'public');
    this.serverPath = path.join(this.deploymentPath, 'server');
    this.staticPath = path.join(this.deploymentPath, 'static');
  }

  async buildDeploymentStructure() {
    console.log('🚀 BUILDING DEPLOYMENT-READY STRUCTURE...\n');
    
    // Create deployment directories;
    this.createDeploymentDirectories();
    
    // Copy essential files;
    this.copyEssentialFiles();
    
    // Create optimized server;
    this.createOptimizedServer();
    
    // Create static assets structure;
    this.organizeStaticAssets();
    
    // Create deployment configuration;
    this.createDeploymentConfig();
    
    // Generate deployment guide;
    this.generateDeploymentGuide();
    
    console.log('✅ DEPLOYMENT STRUCTURE READY!\n');
  }

  createDeploymentDirectories() {
    console.log('📁 Creating deployment directories...');
    
    const directories = [;
      this.deploymentPath;
      this.publicPath;
      this.serverPath;
      this.staticPath;
      path.join(this.publicPath, 'css');
      path.join(this.publicPath, 'js');
      path.join(this.publicPath, 'images');
      path.join(this.deploymentPath, 'api');
      path.join(this.deploymentPath, 'functions');
    ];
    
    directories.forEach(dir => {;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    console.log('✅ Deployment directories created');
  }

  copyEssentialFiles() {
    console.log('📋 Copying essential files...');
    
    const essentialFiles = [;
      { src: 'package.json', dest: 'package.json' }
      { src: 'netlify.toml', dest: 'netlify.toml' }
      { src: 'simple-server.js', dest: 'server.js' }
      { src: 'index.html', dest: 'public/index.html' }
    ];
    
    essentialFiles.forEach(({ src, dest }) => {;
      if (fs.existsSync(src)) {
        const destPath = path.join(this.deploymentPath, dest);
        const destDir = path.dirname(destPath);
        
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        
        fs.copyFileSync(src, destPath);
        console.log(`  ✅ ${src} → ${dest}`);
      }
    });
    
    // Copy public folder if exists;
    if (fs.existsSync('public')) {
      this.copyDirectory('public', this.publicPath);
      console.log('  ✅ public/ → public/');
    }
    
    // Copy src folder for React;
    if (fs.existsSync('src')) {
      this.copyDirectory('src', path.join(this.deploymentPath, 'src'));
      console.log('  ✅ src/ → src/');
    }
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {;
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {;
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  createOptimizedServer() {
    console.log('⚡ Creating optimized server...');
    `;
    const optimizedServer = `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware;
app.use((req, res, next) => {;
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Static file serving;
app.use(express.static('public', {;
  maxAge: '1d';
  etag: true;
}));

// API routes;
app.get('/api/status', (req, res) => {;
  res.json({;
    status: 'healthy';
    timestamp: new Date().toISOString();
    environment: process.env.NODE_ENV || 'development';
  });
});

app.get('/api/health', (req, res) => {;
  res.json({;
    status: 'ok';
    uptime: process.uptime();
    memory: process.memoryUsage();
  });
});

// Main route;
app.get('/', (req, res) => {;
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for SPA routing;
app.get('*', (req, res) => {;
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling;
app.use((err, req, res, next) => {;
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server;
app.listen(PORT, '0.0.0.0', () => {`;
  console.log(\`🚀 ToyParty Platform running on http://0.0.0.0:\${PORT}\`);`;
  console.log(\`🌍 Environment: \${process.env.NODE_ENV || 'development'}\`);
});

module.exports = app;`;
`;
    
    fs.writeFileSync(path.join(this.deploymentPath, 'server.js'), optimizedServer);
    console.log('✅ Optimized server created');
  }

  organizeStaticAssets() {
    console.log('🎨 Organizing static assets...');
    
    // Copy CSS files;
    const cssFiles = ['styles.css', 'styles.min.css'];
    cssFiles.forEach(cssFile => {;
      if (fs.existsSync(cssFile)) {
        fs.copyFileSync(cssFile, path.join(this.publicPath, 'css', cssFile));
      }
      if (fs.existsSync(path.join('public', cssFile))) {
        fs.copyFileSync(path.join('public', cssFile), path.join(this.publicPath, 'css', cssFile));
      }
    });
    
    // Copy HTML files;
    const htmlFiles = ['index.html', 'monitor-dashboard.html', 'simple-button.html'];
    htmlFiles.forEach(htmlFile => {;
      if (fs.existsSync(htmlFile)) {
        fs.copyFileSync(htmlFile, path.join(this.publicPath, htmlFile));
      }
      if (fs.existsSync(path.join('public', htmlFile))) {
        fs.copyFileSync(path.join('public', htmlFile), path.join(this.publicPath, htmlFile));
      }
    });
    
    console.log('✅ Static assets organized');
  }

  createDeploymentConfig() {
    console.log('⚙️ Creating deployment configuration...');
    
    // Create Netlify configuration`;
    const netlifyConfig = `[build];
  command = "npm run build";
  publish = "public";
[dev];
  command = "node server.js";
  port = 3000;
[[redirects]];
  from = "/api/*";
  to = "/.netlify/functions/:splat";
  status = 200;
[[redirects]];
  from = "/*";
  to = "/index.html";
  status = 200;
[build.environment];
  NODE_VERSION = "18"`;
`;
    
    fs.writeFileSync(path.join(this.deploymentPath, 'netlify.toml'), netlifyConfig);
    
    // Create package.json if doesn't exist;
    const packageJsonPath = path.join(this.deploymentPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      const packageJson = {
        "name": "toyparty-platform";
        "version": "1.0.0";
        "description": "ToyParty Enterprise Platform";
        "main": "server.js";
        "scripts": {;
          "start": "node server.js";
          "build": "echo 'Build complete'";
          "dev": "node server.js";
        }
        "dependencies": {;
          "express": "^4.18.2";
        }
        "engines": {;
          "node": ">=18.0.0";
        }
      }
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
    
    console.log('✅ Deployment configuration created');
  }

  generateDeploymentGuide() {
    console.log('📖 Generating deployment guide...');
    `;
    const deploymentGuide = `# 🚀 DEPLOYMENT GUIDE - ToyParty Platform;
## 📁 Deployment Structure`;
\`\`\`;
deployment-ready/;
├── public/           # Static files for web serving;
│   ├── css/         # Stylesheets;
│   ├── js/          # JavaScript files;
│   ├── images/      # Image assets;
│   └── index.html   # Main page;
├── server.js        # Optimized Express server;
├── package.json     # Dependencies;
├── netlify.toml     # Netlify configuration;
└── src/            # React source (if using React)`;
\`\`\`;
## 🌐 Live Deployment Options;
### Option 1: Replit Deployment (Recommended);
1. Go to the Deployments tab in Replit;
2. Select "Static Deployment"`;
3. Set public directory to: \`deployment-ready/public\`;
4. Click "Deploy";
### Option 2: Server Deployment`;
1. Run: \`cd deployment-ready && npm install\``;
2. Start server: \`node server.js\`;
3. Access at: http://0.0.0.0:3000;
### Option 3: Netlify Static`;
1. Upload \`deployment-ready/\` folder to Netlify`;
2. Set build command: \`echo "Static build"\``;
3. Set publish directory: \`public\`;
## 🔧 Configuration;
### Environment Variables`;
- \`PORT\`: Server port (default: 3000)`;
- \`NODE_ENV\`: Environment (production/development);
### Available Routes`;
- \`/\` - Main application`;
- \`/api/status\` - Health check`;
- \`/api/health\` - Server status;
## 🎯 Quick Start`;
\`\`\`bash;
cd deployment-ready;
npm install;
node server.js`;
\`\`\`;
## 📊 Features Included;
- ✅ Express server with security middleware;
- ✅ Static file serving with caching;
- ✅ API endpoints for health checks;
- ✅ SPA routing support;
- ✅ Error handling;
- ✅ Netlify configuration;
- ✅ Mobile-responsive design;
## 🔒 Security Features;
- X-Frame-Options: DENY;
- X-Content-Type-Options: nosniff;
- X-XSS-Protection enabled;
- Static file caching;
## 🌍 Access Points;
- **Main Site**: http://0.0.0.0:3000;
- **Health Check**: http://0.0.0.0:3000/api/health;
- **Status**: http://0.0.0.0:3000/api/status;
---;
Generated: ${new Date().toISOString()}`;
`;
    
    fs.writeFileSync(path.join(this.deploymentPath, 'DEPLOYMENT_GUIDE.md'), deploymentGuide);
    console.log('✅ Deployment guide created');
  }
}

// Run the deployment structure builder;
async function main() {
  const builder = new DeploymentStructureBuilder();
  await builder.buildDeploymentStructure();
  
  console.log('\n🎯 DEPLOYMENT STRUCTURE COMPLETE!');
  console.log('📁 Check deployment-ready/ folder');
  console.log('📖 Read DEPLOYMENT_GUIDE.md for instructions');
  console.log('🚀 Ready for live deployment!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DeploymentStructureBuilder;
`
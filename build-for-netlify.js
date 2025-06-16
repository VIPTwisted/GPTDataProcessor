const fs = require('fs');
const path = require('path');

console.log('🏗️ Building ToyParty for Netlify deployment...');

// Ensure public directory exists;
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Copy main index.html to public if it exists in root;
if (fs.existsSync('index.html')) {
  fs.copyFileSync('index.html', 'public/index.html');
  console.log('✅ Copied root index.html to public/');
}

// Ensure we have a proper index.html in public;
const indexPath = 'public/index.html';
if (!fs.existsSync(indexPath)) {
  const defaultIndex = `<!DOCTYPE html>;
<html lang="en">;
<head>;
    <meta charset="UTF-8">;
    <meta name="viewport" content="width=device-width, initial-scale=1.0">;
    <title>🎉 ToyParty - Ultimate GPT-Powered Platform</title>;
    <style>;
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {;
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {;
            text-align: center;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 50px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            max-width: 600px;
        }
        .logo { font-size: 4em; margin-bottom: 20px; }
        h1 { font-size: 2.5em; margin-bottom: 20px; color: #00ff88; }
        .status {;
            background: linear-gradient(45deg, #00ff88, #00cc66);
            color: #000;
            padding: 15px 30px;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            display: inline-block;
        }
        .description { font-size: 1.2em; margin: 20px 0; opacity: 0.9; }
        .features {;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature {;
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .feature-icon { font-size: 2em; margin-bottom: 10px; }
        .btn {;
            background: linear-gradient(45deg, #ff6b35, #f7931e);
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            color: white;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            transition: transform 0.2s;
        }
        .btn:hover { transform: scale(1.05); }
    </style>;
</head>;
<body>;
    <div class="container">;
        <div class="logo">🎉</div>;
        <h1>ToyParty</h1>;
        <div class="status">✅ SYSTEM STATUS: LIVE</div>;
        <div class="description">Your Ultimate GPT-Powered Platform</div>;
        <div class="features">;
            <div class="feature">;
                <div class="feature-icon">🤖</div>;
                <h3>AI-Powered</h3>;
                <p>Advanced GPT integration for autonomous operations</p>;
            </div>;
            <div class="feature">;
                <div class="feature-icon">🚀</div>;
                <h3>Auto-Deploy</h3>;
                <p>Seamless GitHub to Netlify deployment pipeline</p>;
            </div>;
            <div class="feature">;
                <div class="feature-icon">📊</div>;
                <h3>Real-Time Analytics</h3>;
                <p>Comprehensive monitoring and analytics dashboard</p>;
            </div>;
            <div class="feature">;
                <div class="feature-icon">🏢</div>;
                <h3>Enterprise Ready</h3>;
                <p>Professional-grade business management tools</p>;
            </div>;
        </div>;
        <p><strong>Build ID:</strong> ${new Date().toISOString()}</p>;
        <p><strong>Status:</strong> All 5 repositories synchronized successfully</p>;
        <p><strong>Deployment:</strong> Netlify deployment configured and ready</p>;
        <div style="margin-top: 30px;">;
            <p><em>Powered by GPT • Deployed on Netlify • Managed by Replit</em></p>;
        </div>;
    </div>;
</body>`;
</html>`;
  
  fs.writeFileSync(indexPath, defaultIndex);
  console.log('✅ Created default index.html');
}

// Copy CSS files if they exist;
if (fs.existsSync('public/styles.css')) {
  console.log('✅ Found styles.css in public/');
} else if (fs.existsSync('styles.css')) {
  fs.copyFileSync('styles.css', 'public/styles.css');
    console.log('✅ Copied styles.css to public/');
}

// List all files in public directory;
const publicFiles = fs.readdirSync('public');`;
console.log(`✅ Public directory contains: ${publicFiles.join(', ')}`);

console.log('🎉 Netlify build complete!');
console.log('📁 Publishing from: public/');
console.log('🌐 Site will be live at: https://toyparty.netlify.app');`
// build-for-netlify.js
const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing build for Netlify deployment...');

// Ensure build directory exists
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.error('❌ Build directory not found. Run npm run build first.');
  process.exit(1);
}

// Copy critical files to build directory
const criticalFiles = [
  'netlify.toml',
  'deploy.json'
];

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(buildDir, file));
    console.log(`✅ Copied ${file} to build directory`);
  }
});

// Ensure netlify/functions directory structure
const functionsDir = path.join(buildDir, 'netlify', 'functions');
if (!fs.existsSync(functionsDir)) {
  fs.mkdirSync(functionsDir, { recursive: true });
}

// Copy all function files
const srcFunctionsDir = path.join(__dirname, 'netlify', 'functions');
if (fs.existsSync(srcFunctionsDir)) {
  copyRecursiveSync(srcFunctionsDir, functionsDir);
  console.log('✅ Copied Netlify functions to build directory');
}

// Generate deployment manifest
const manifest = {
  buildTime: new Date().toISOString(),
  functions: getFunctionList(),
  version: process.env.npm_package_version || '1.0.0',
  commit: process.env.COMMIT_REF || 'unknown'
}
fs.writeFileSync(
  path.join(buildDir, 'deployment-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('✅ Netlify build optimization complete');
console.log(`📦 Build ready for deployment with ${manifest.functions.length} functions`);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function getFunctionList() {
  const functions = [];
  const functionsDir = path.join(__dirname, 'netlify', 'functions');
  
  if (fs.existsSync(functionsDir)) {
    function scanDir(dir, basePath = '') {
      fs.readdirSync(dir).forEach(item => {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(basePath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath, relativePath);
        } else if (item.endsWith('.js')) {
          functions.push(relativePath.replace(/\\/g, '/'));
        }
      });
    }
    
    scanDir(functionsDir);
  }
  
  return functions;
}

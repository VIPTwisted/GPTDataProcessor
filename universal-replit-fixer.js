const fs = require('fs');
const { execSync } = require('child_process');

class UniversalReplitFixer {
  constructor() {
    this.fixes = [];
  }

  async fixAll() {
    console.log('🔧 UNIVERSAL REPLIT FIXER STARTING...');

    const fixTasks = [
      () => this.fixGitIssues(),
      () => this.fixNodeModules(),
      () => this.fixPackageJson(),
      () => this.validateEnvironment(),
      () => this.fixPermissions()
    ];

    for (const task of fixTasks) {
      try {
        await task();
      } catch (error) {
        console.error(`⚠️ Fix task failed: ${error.message}`);
      }
    }

    console.log(`✅ Universal fix completed! Applied ${this.fixes.length} fixes.`);
    return this.fixes;
  }

  fixGitIssues() {
    console.log('🔐 Fixing git issues...');

    const lockFiles = ['.git/index.lock', '.git/config.lock', '.git/HEAD.lock'];

    lockFiles.forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        this.fixes.push(`Removed ${file}`);
      }
    });

    try {
      execSync('pkill -f git', { stdio: 'ignore' });
      this.fixes.push('Killed hanging git processes');
    } catch (error) {
      // Ignore
    }
  }

  fixNodeModules() {
    console.log('📦 Checking node_modules...');

    if (!fs.existsSync('node_modules') && fs.existsSync('package.json')) {
      try {
        execSync('npm install', { stdio: 'inherit' });
        this.fixes.push('Installed missing node_modules');
      } catch (error) {
        console.log('⚠️ Could not install node_modules');
      }
    }
  }

  fixPackageJson() {
    console.log('📋 Checking package.json...');

    if (!fs.existsSync('package.json')) {
      const basicPackage = {
        name: "toyparty-system",
        version: "1.0.0",
        main: "simple-server.js",
        scripts: {
          start: "node simple-server.js"
        }
      }
      fs.writeFileSync('package.json', JSON.stringify(basicPackage, null, 2));
      this.fixes.push('Created basic package.json');
    }
  }

  validateEnvironment() {
    console.log('🔍 Validating environment...');

    const requiredEnvs = ['GITHUB_TOKEN', 'NETLIFY_ACCESS_TOKEN'];
    const missing = requiredEnvs.filter(env => !process.env[env]);

    if (missing.length > 0) {
      console.log(`⚠️ Missing environment variables: ${missing.join(', ')}`);
    } else {
      this.fixes.push('Environment variables validated');
    }
  }

  fixPermissions() {
    console.log('🔒 Fixing permissions...');

    try {
      execSync('chmod +x *.js', { stdio: 'ignore' });
      this.fixes.push('Fixed file permissions');
    } catch (error) {
      // Ignore permission errors in sandbox
    }
  }
}

if (require.main === module) {
  const fixer = new UniversalReplitFixer();
  fixer.fixAll();
}

module.exports = UniversalReplitFixer;
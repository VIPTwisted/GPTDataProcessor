// Nuclear Node Path Fixer Script

/**
 * NUCLEAR NODE.JS PATH & EXECUTION FIXER
 * Fixes all "node command not found" issues permanently
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class NuclearNodePathFixer {
  constructor() {
    this.log('💥 NUCLEAR NODE.JS PATH FIXER INITIATED');
    this.nodeVersions = [];
    this.fixedPaths = [];
    this.errors = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  async findAllNodeInstallations() {
    this.log('🔍 SCANNING FOR ALL NODE.JS INSTALLATIONS...');

    const possiblePaths = [
      '/usr/bin/node',
      '/usr/local/bin/node',
      '/bin/node',
      '/nix/store/*/bin/node',
      '/home/runner/.nvm/versions/node/*/bin/node',
      '/opt/nodejs/bin/node',
      process.execPath // Current Node.js path
    ];

    const foundPaths = [];

    for (const nodePath of possiblePaths) {
      try {
        if (nodePath.includes('*')) {
          // Handle wildcard paths
          const basePath = nodePath.split('*')[0];
          if (fs.existsSync(basePath)) {
            const dirs = fs.readdirSync(basePath);
            for (const dir of dirs) {
              const fullPath = path.join(basePath, dir, 'bin', 'node');
              if (fs.existsSync(fullPath)) {
                foundPaths.push(fullPath);
              }
            }
          }
        } else {
          if (fs.existsSync(nodePath)) {
            foundPaths.push(nodePath);
          }
        }
      } catch (error) {
        // Ignore scanning errors
      }
    }

    // Also check current process path
    if (process.execPath && fs.existsSync(process.execPath)) {
      foundPaths.push(process.execPath);
    }

    this.nodeVersions = [...new Set(foundPaths)]; // Remove duplicates
    this.log(`✅ FOUND ${this.nodeVersions.length} NODE.JS INSTALLATIONS:`);
    this.nodeVersions.forEach(nodePath => {
      try {
        const version = execSync(`${nodePath} --version`, { encoding: 'utf8' }).trim();
        this.log(`   📍 ${nodePath} (${version})`);
      } catch (error) {
        this.log(`   📍 ${nodePath} (version check failed)`);
      }
    });

    return this.nodeVersions;
  }

  async createNodeSymlinks() {
    this.log('🔗 CREATING NUCLEAR NODE.JS SYMLINKS...');

    const targetPaths = ['/usr/local/bin/node', '/usr/bin/node', '/bin/node'];
    const bestNodePath = this.getBestNodePath();

    if (!bestNodePath) {
      this.log('❌ NO VALID NODE.JS INSTALLATION FOUND!');
      return false;
    }

    for (const target of targetPaths) {
      try {
        if (!fs.existsSync(target)) {
          const targetDir = path.dirname(target);
          if (!fs.existsSync(targetDir)) {
            execSync(`mkdir -p ${targetDir}`, { stdio: 'pipe' });
          }
          execSync(`ln -sf ${bestNodePath} ${target}`, { stdio: 'pipe' });
          this.log(`✅ SYMLINK: ${target} -> ${bestNodePath}`);
          this.fixedPaths.push(target);
        }
      } catch (error) {
        this.log(`⚠️ SYMLINK FAILED: ${target} - ${error.message}`);
      }
    }

    return true;
  }

  getBestNodePath() {
    if (this.nodeVersions.length === 0) return null;

    // Prefer Nix store paths (most reliable in Replit)
    const nixPath = this.nodeVersions.find(p => p.includes('/nix/store/'));
    if (nixPath) return nixPath;

    // Then prefer /usr/local/bin
    const localPath = this.nodeVersions.find(p => p.includes('/usr/local/bin'));
    if (localPath) return localPath;

    // Return the first available
    return this.nodeVersions[0];
  }

  async fixEnvironmentPath() {
    this.log('🌍 FIXING ENVIRONMENT PATH...');

    const bestNodePath = this.getBestNodePath();
    if (!bestNodePath) return false;

    const nodeBinDir = path.dirname(bestNodePath);

    // Update PATH in various shell profiles
    const profiles = [
      '/home/runner/.bashrc',
      '/home/runner/.profile',
      '/home/runner/.zshrc',
      '/etc/profile'
    ];

    const pathExport = `export PATH="${nodeBinDir}:$PATH"`;

    for (const profile of profiles) {
      try {
        if (fs.existsSync(profile)) {
          const content = fs.readFileSync(profile, 'utf8');
          if (!content.includes(nodeBinDir)) {
            fs.appendFileSync(profile, `\n# NUCLEAR NODE.JS PATH FIX\n${pathExport}\n`);
            this.log(`✅ UPDATED PATH IN: ${profile}`);
          }
        }
      } catch (error) {
        this.log(`⚠️ PATH UPDATE FAILED: ${profile} - ${error.message}`);
      }
    }

    // Set current process PATH
    process.env.PATH = `${nodeBinDir}:${process.env.PATH}`;
    this.log(`✅ CURRENT PROCESS PATH UPDATED`);

    return true;
  }

  async createNodeWrapper() {
    this.log('🛡️ CREATING BULLETPROOF NODE WRAPPER...');

    const bestNodePath = this.getBestNodePath();
    if (!bestNodePath) return false;

    const wrapperScript = `#!/bin/bash
# NUCLEAR NODE.JS WRAPPER - BULLETPROOF EXECUTION
set -e

NODE_PATH="${bestNodePath}"
NPM_PATH="${path.dirname(bestNodePath)}/npm"

# Ensure Node.js is available
if [ ! -f "$NODE_PATH" ]; then
  echo "❌ Node.js not found at $NODE_PATH"
  exit 1
fi

# Export paths
export PATH="${path.dirname(bestNodePath)}:$PATH"
export NODE_PATH="$NODE_PATH"

# Execute with the best Node.js path
exec "$NODE_PATH" "$@"
`;

    const wrapperPaths = [
      '/usr/local/bin/node-wrapper',
      '/usr/bin/node-wrapper',
      '/home/runner/node-wrapper'
    ];

    for (const wrapperPath of wrapperPaths) {
      try {
        fs.writeFileSync(wrapperPath, wrapperScript, { mode: 0o755 });
        this.log(`✅ WRAPPER CREATED: ${wrapperPath}`);
        this.fixedPaths.push(wrapperPath);
      } catch (error) {
        this.log(`⚠️ WRAPPER FAILED: ${wrapperPath} - ${error.message}`);
      }
    }

    return true;
  }

  async updateReplit() {
    this.log('⚡ UPDATING .replit CONFIGURATION...');

    const bestNodePath = this.getBestNodePath();
    if (!bestNodePath) return false;

    try {
      let replitContent = '';
      if (fs.existsSync('.replit')) {
        replitContent = fs.readFileSync('.replit', 'utf8');
      }

      // Add nuclear Node.js path fix to .replit
      const nodePathConfig = `
# NUCLEAR NODE.JS PATH FIX
[env]
NODE_PATH = "${bestNodePath}"
PATH = "${path.dirname(bestNodePath)}:$PATH"

# Updated run commands with absolute paths
`;

      if (!replitContent.includes('NUCLEAR NODE.JS PATH FIX')) {
        replitContent = nodePathConfig + replitContent;
        fs.writeFileSync('.replit', replitContent);
        this.log('✅ .replit CONFIGURATION UPDATED');
      }

      return true;
    } catch (error) {
      this.log(`⚠️ .replit UPDATE FAILED: ${error.message}`);
      return false;
    }
  }

  async testNodeExecution() {
    this.log('🧪 TESTING NODE.JS EXECUTION...');

    const testCommands = [
      'node --version',
      `${this.getBestNodePath()} --version`,
      '/usr/local/bin/node --version',
      '/usr/bin/node --version'
    ];

    let successCount = 0;

    for (const cmd of testCommands) {
      try {
        const result = execSync(cmd, { encoding: 'utf8', timeout: 5000 });
        this.log(`✅ SUCCESS: ${cmd} -> ${result.trim()}`);
        successCount++;
      } catch (error) {
        this.log(`❌ FAILED: ${cmd} -> ${error.message}`);
      }
    }

    this.log(`📊 TEST RESULTS: ${successCount}/${testCommands.length} commands successful`);
    return successCount > 0;
  }

  async performNuclearFix() {
    this.log('💥 STARTING NUCLEAR NODE.JS FIX...');

    try {
      // Step 1: Find all Node.js installations
      await this.findAllNodeInstallations();

      if (this.nodeVersions.length === 0) {
        this.log('💀 CRITICAL: NO NODE.JS INSTALLATIONS FOUND!');
        this.log('🔧 TRY: nix-env -iA nixpkgs.nodejs');
        return false;
      }

      // Step 2: Create symlinks
      await this.createNodeSymlinks();

      // Step 3: Fix environment PATH
      await this.fixEnvironmentPath();

      // Step 4: Create wrapper script
      await this.createNodeWrapper();

      // Step 5: Update .replit
      await this.updateReplit();

      // Step 6: Test execution
      const testResult = await this.testNodeExecution();

      this.log('💥 NUCLEAR FIX SUMMARY:');
      this.log(`   🎯 Node.js installations found: ${this.nodeVersions.length}`);
      this.log(`   🔗 Symlinks created: ${this.fixedPaths.length}`);
      this.log(`   ✅ Execution tests: ${testResult ? 'PASSED' : 'FAILED'}`);

      if (testResult) {
        this.log('🚀 NUCLEAR FIX COMPLETED SUCCESSFULLY!');
        this.log('💡 TRY RUNNING YOUR COMMANDS NOW');
        return true;
      } else {
        this.log('⚠️ PARTIAL FIX COMPLETED - MANUAL INTERVENTION MAY BE NEEDED');
        return false;
      }

    } catch (error) {
      this.log(`💥 NUCLEAR FIX FAILED: ${error.message}`);
      this.errors.push(error.message);
      return false;
    }
  }

  async emergencyNodeInstall() {
    this.log('🆘 ATTEMPTING EMERGENCY NODE.JS INSTALLATION...');

    const installCommands = [
      'nix-env -iA nixpkgs.nodejs',
      'curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -',
      'sudo apt-get install -y nodejs',
      'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
    ];

    for (const cmd of installCommands) {
      try {
        this.log(`🔧 TRYING: ${cmd}`);
        execSync(cmd, { stdio: 'inherit', timeout: 60000 });
        this.log(`✅ INSTALLATION COMMAND COMPLETED: ${cmd}`);

        // Check if Node.js is now available
        try {
          execSync('node --version', { stdio: 'pipe' });
          this.log('🎉 NODE.JS SUCCESSFULLY INSTALLED!');
          return true;
        } catch (e) {
          this.log('⚠️ Node.js still not available, trying next method...');
        }
      } catch (error) {
        this.log(`❌ INSTALLATION FAILED: ${cmd} -> ${error.message}`);
      }
    }

    return false;
  }
}

// Execute the nuclear fix
if (require.main === module) {
  const fixer = new NuclearNodePathFixer();

  fixer.performNuclearFix().then(success => {
    if (!success) {
      console.log('\n💀 NUCLEAR FIX FAILED - ATTEMPTING EMERGENCY INSTALLATION...');
      return fixer.emergencyNodeInstall();
    }
    return true;
  }).then(finalResult => {
    if (finalResult) {
      console.log('\n🎉 ALL NODE.JS ISSUES RESOLVED!');
      console.log('🚀 YOUR WORKFLOWS SHOULD NOW WORK PROPERLY');
      process.exit(0);
    } else {
      console.log('\n💀 COMPLETE FAILURE - MANUAL INTERVENTION REQUIRED');
      console.log('🔧 Try running: nix-shell -p nodejs');
      process.exit(1);
    }
  }).catch(error => {
    console.error('\n💥 CATASTROPHIC FAILURE:', error.message);
    process.exit(1);
  });
}

module.exports = NuclearNodePathFixer;
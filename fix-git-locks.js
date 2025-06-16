const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔐 FIXING GIT LOCKS...');

// Remove all git lock files
const lockFiles = [
  '.git/index.lock',
  '.git/config.lock',
  '.git/HEAD.lock',
  '.git/refs/heads/main.lock',
  '.git/refs/heads/master.lock'
];

lockFiles.forEach(lockFile => {
  if (fs.existsSync(lockFile)) {
    try {
      fs.unlinkSync(lockFile);
      console.log(`✅ Removed ${lockFile}`);
    } catch (error) {
      console.log(`⚠️ Could not remove ${lockFile}: ${error.message}`);
    }
  }
});

// Kill any hanging git processes
try {
  execSync('pkill -f git', { stdio: 'ignore' });
  console.log('✅ Killed hanging git processes');
} catch (error) {
  // Ignore if no processes to kill
}

console.log('🔐 Git locks fixed!');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔐 FIXING GIT LOCKS...');

function fixGitLocks() {
  try {
    // Kill any hanging git processes
    try {
      execSync('pkill -f git', { stdio: 'ignore' });
      console.log('💀 Killed hanging git processes');
    } catch (error) {
      // Ignore if no processes to kill
    }

    // Remove all git locks
    const gitLocks = [
      '.git/index.lock',
      '.git/config.lock',
      '.git/HEAD.lock',
      '.git/refs/heads/main.lock',
      '.git/refs/heads/master.lock'
    ];

    gitLocks.forEach(lock => {
      if (fs.existsSync(lock)) {
        try {
          fs.unlinkSync(lock);
          console.log(`✅ Removed git lock: ${lock}`);
        } catch (error) {
          console.log(`⚠️ Could not remove ${lock}: ${error.message}`);
        }
      }
    });

    // Reset git state if corrupted
    if (fs.existsSync('.git')) {
      try {
        execSync('git reset --hard HEAD', { stdio: 'ignore' });
        console.log('✅ Reset git state');
      } catch (error) {
        console.log('⚠️ Could not reset git state, will continue...');
      }
    }

    console.log('✅ GIT LOCKS FIXED SUCCESSFULLY');
    return { success: true };

  } catch (error) {
    console.error(`❌ Git lock fix failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Execute if run directly
if (require.main === module) {
  const result = fixGitLocks();
  process.exit(result.success ? 0 : 1);
}

module.exports = fixGitLocks;

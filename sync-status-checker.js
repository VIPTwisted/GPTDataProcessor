
const { getGitHubToken, getNetlifySecrets, validateAllSecrets } = require('./universal-secret-loader.js');
const fs = require('fs');
const https = require('https');

class SyncStatusChecker {
  constructor() {
    this.githubToken = getGitHubToken();
    this.netlifySecrets = getNetlifySecrets();
    this.results = {
      github: { status: 'unknown', details: {} },
      netlify: { status: 'unknown', details: {} },
      overall: { status: 'unknown', issues: [] }
    }
  }

  async checkGitHubConnection() {
    console.log('🔍 Testing GitHub Connection...');
    
    if (!this.githubToken) {
      this.results.github.status = 'failed';
      this.results.github.details.error = 'GitHub token not found in secrets';
      console.log('❌ GitHub token missing');
      return false;
    }

    try {
      const response = await this.makeGitHubRequest('/user');
      if (response.login) {
        this.results.github.status = 'connected';
        this.results.github.details = {
          username: response.login,
          name: response.name,
          public_repos: response.public_repos,
          private_repos: response.total_private_repos
        }
        console.log(`✅ GitHub connected as: ${response.login}`);
        return true;
      }
    } catch (error) {
      this.results.github.status = 'failed';
      this.results.github.details.error = error.message;
      console.log(`❌ GitHub connection failed: ${error.message}`);
      return false;
    }
  }

  async checkRepositories() {
    console.log('🔍 Testing Repository Access...');
    
    if (!fs.existsSync('deploy.json')) {
      console.log('❌ deploy.json not found');
      return false;
    }

    const config = JSON.parse(fs.readFileSync('deploy.json', 'utf8'));
    const repoResults = [];

    for (const repo of config.repos) {
      try {
        const response = await this.makeGitHubRequest(`/repos/${repo.repo_owner}/${repo.repo_name}`);
        repoResults.push({
          name: repo.repo_name,
          status: 'accessible',
          permissions: {
            push: response.permissions?.push || false,
            admin: response.permissions?.admin || false
          }
        });
        console.log(`✅ ${repo.repo_name}: Accessible`);
      } catch (error) {
        repoResults.push({
          name: repo.repo_name,
          status: 'failed',
          error: error.message
        });
        console.log(`❌ ${repo.repo_name}: ${error.message}`);
      }
    }

    this.results.github.repositories = repoResults;
    return repoResults.every(r => r.status === 'accessible');
  }

  async checkNetlifyConnection() {
    console.log('🔍 Testing Netlify Connection...');
    
    if (!this.netlifySecrets.token) {
      this.results.netlify.status = 'failed';
      this.results.netlify.details.error = 'Netlify token not found in secrets';
      console.log('❌ Netlify token missing');
      return false;
    }

    try {
      const response = await this.makeNetlifyRequest('/sites');
      this.results.netlify.status = 'connected';
      this.results.netlify.details = {
        sites_count: response.length,
        sites: response.slice(0, 5).map(site => ({
          name: site.name,
          url: site.ssl_url || site.url,
          updated_at: site.updated_at
        }))
      }
      console.log(`✅ Netlify connected with ${response.length} sites`);
      return true;
    } catch (error) {
      this.results.netlify.status = 'failed';
      this.results.netlify.details.error = error.message;
      console.log(`❌ Netlify connection failed: ${error.message}`);
      return false;
    }
  }

  async makeGitHubRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.github.com',
        path: endpoint,
        headers: {
          'Authorization': `token ${this.githubToken}`,
          'User-Agent': 'ToyParty-Sync-Checker',
          'Accept': 'application/vnd.github.v3+json'
        }
      }
      const req = https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
  }

  async makeNetlifyRequest(endpoint) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.netlify.com',
        path: `/api/v1${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.netlifySecrets.token}`,
          'Content-Type': 'application/json'
        }
      }
      const req = https.get(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
  }

  async runFullDiagnostic() {
    console.log('🚀 STARTING SYNC DIAGNOSTIC...\n');

    const githubOK = await this.checkGitHubConnection();
    const reposOK = githubOK ? await this.checkRepositories() : false;
    const netlifyOK = await this.checkNetlifyConnection();

    // Overall assessment
    if (githubOK && reposOK && netlifyOK) {
      this.results.overall.status = 'healthy';
      console.log('\n🎉 ALL SYSTEMS OPERATIONAL');
    } else {
      this.results.overall.status = 'issues_detected';
      
      if (!githubOK) this.results.overall.issues.push('GitHub connection failed');
      if (!reposOK) this.results.overall.issues.push('Repository access issues');
      if (!netlifyOK) this.results.overall.issues.push('Netlify connection failed');
      
      console.log('\n⚠️ ISSUES DETECTED');
      this.results.overall.issues.forEach(issue => console.log(`   ❌ ${issue}`));
    }

    console.log('\n📊 DIAGNOSTIC REPORT:');
    console.log(JSON.stringify(this.results, null, 2));

    return this.results;
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new SyncStatusChecker();
  checker.runFullDiagnostic()
    .then(results => {
      process.exit(results.overall.status === 'healthy' ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Diagnostic failed:', error.message);
      process.exit(1);
    });
}

module.exports = SyncStatusChecker;


///usr/bin/env node
const fs = require('fs');
const path = require('path');

function buildEnv() {
  const brandId = process.argv[2] || 'toyparty';
  
  const env = {
    REACT_APP_BRAND_ID: brandId,
    REACT_APP_API_BASE: 'https://api.toyparty.com',
    REACT_APP_REBRAND_THEME: 'true',
    REACT_APP_LANGUAGE_DEFAULT: 'en',
    REACT_APP_GPT_TIER: 'premium',
    REACT_APP_WEBHOOK_BASE: '/.netlify/functions',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-***',
    NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN || '',
    NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID || ''
  }
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync('.env', envContent);
  
  console.log('✅ .env generated for brand:', brandId);
  console.log('📄 Environment variables:');
  console.log(envContent);
  
  // Also create brand-specific config
  const brandConfigPath = `brands/brand-${brandId}/config.json`;
  if (!fs.existsSync(path.dirname(brandConfigPath))) {
    fs.mkdirSync(path.dirname(brandConfigPath), { recursive: true });
  }
  
  const brandConfig = {
    id: brandId,
    name: brandId.charAt(0).toUpperCase() + brandId.slice(1),
    primaryColor: brandId === 'toyparty' ? '#ff0066' : '#6a00ff',
    logo: `/logos/${brandId}.svg`,
    domain: `${brandId}.com`,
    features: ['dashboard', 'lms', 'webhooks', 'multilingual', 'gpt-tiers']
  }
  fs.writeFileSync(brandConfigPath, JSON.stringify(brandConfig, null, 2));
  console.log(`✅ Brand config created: ${brandConfigPath}`);
}

if (require.main === module) {
  buildEnv();
}

module.exports = { buildEnv }
const fs = require('fs');
const path = require('path');

// Default environment configuration
const defaultEnv = {
  BRAND_ID: 'toyparty',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-***',
  DB_URL: 'https://api.toyparty.com',
  REBRAND_THEME: 'true',
  NODE_ENV: 'production',
  NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID || '',
  NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN || '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  // White-label specific configs
  BRAND_NAME: 'ToyParty',
  BRAND_DOMAIN: 'toyparty.com',
  BRAND_THEME_COLOR: '#ff6b6b',
  BRAND_LOGO_URL: '/assets/toyparty-logo.png'
}
// Brand-specific configurations
const brandConfigs = {
  toyparty: {
    BRAND_NAME: 'ToyParty',
    BRAND_DOMAIN: 'toyparty.com',
    BRAND_THEME_COLOR: '#ff6b6b',
    BRAND_LOGO_URL: '/assets/toyparty-logo.png',
    DB_URL: 'https://api.toyparty.com'
  },
  honeyglow: {
    BRAND_NAME: 'HoneyGlow',
    BRAND_DOMAIN: 'honeyglow.com',
    BRAND_THEME_COLOR: '#ffd700',
    BRAND_LOGO_URL: '/assets/honeyglow-logo.png',
    DB_URL: 'https://api.honeyglow.com'
  },
  vibevault: {
    BRAND_NAME: 'VibeVault',
    BRAND_DOMAIN: 'vibevault.com',
    BRAND_THEME_COLOR: '#8a2be2',
    BRAND_LOGO_URL: '/assets/vibevault-logo.png',
    DB_URL: 'https://api.vibevault.com'
  }
}
function buildEnv(brandId = 'toyparty') {
  console.log(`🔧 Building .env for brand: ${brandId}`);
  
  // Start with default environment
  const env = { ...defaultEnv }
  // Override with brand-specific config if it exists
  if (brandConfigs[brandId]) {
    Object.assign(env, brandConfigs[brandId]);
    env.BRAND_ID = brandId;
  } else {
    console.warn(`⚠️ Brand '${brandId}' not found, using default toyparty config`);
  }
  
  // Convert to .env format
  const envContent = Object.entries(env)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  // Write .env file
  fs.writeFileSync('.env', envContent);
  
  // Also create brand-specific .env file
  fs.writeFileSync(`.env.${brandId}`, envContent);
  
  console.log('✅ .env generated successfully:');
  console.log('─'.repeat(40));
  console.log(envContent);
  console.log('─'.repeat(40));
  
  // Create brand config JSON for frontend
  const brandConfig = {
    id: brandId,
    name: env.BRAND_NAME,
    domain: env.BRAND_DOMAIN,
    themeColor: env.BRAND_THEME_COLOR,
    logoUrl: env.BRAND_LOGO_URL,
    apiUrl: env.DB_URL
  }
  // Ensure brands directory exists
  const brandsDir = path.join('brands', `brand-${brandId}`);
  if (!fs.existsSync(brandsDir)) {
    fs.mkdirSync(brandsDir, { recursive: true });
  }
  
  // Write brand config
  fs.writeFileSync(
    path.join(brandsDir, 'config.json'),
    JSON.stringify(brandConfig, null, 2)
  );
  
  console.log(`✅ Brand config saved to: ${brandsDir}/config.json`);
  
  return { env, brandConfig }
}

// CLI usage
if (require.main === module) {
  const brandId = process.argv[2] || 'toyparty';
  buildEnv(brandId);
}

module.exports = { buildEnv, brandConfigs }
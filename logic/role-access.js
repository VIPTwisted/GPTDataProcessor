
export const ROLE_ACCESS = {
  admin: [
    'dashboard', 
    'playbooks', 
    'lms', 
    'mission', 
    'rewards', 
    'webhooks', 
    'gpt-tiers', 
    'multilingual', 
    'analytics',
    'system-health',
    'user-management',
    'brand-config'
  ],
  manager: [
    'dashboard', 
    'playbooks', 
    'lms', 
    'mission', 
    'rewards', 
    'analytics',
    'team-management'
  ],
  rep: [
    'dashboard', 
    'lms', 
    'campaigns', 
    'store', 
    'rewards',
    'personal-analytics'
  ],
  guest: [
    'dashboard'
  ],
  api: [
    'webhooks',
    'gpt-agent',
    'data-export'
  ]
}
export const FEATURE_PERMISSIONS = {
  'webhook-dispatch': ['admin', 'api'],
  'gpt-multilang': ['admin', 'manager', 'rep'],
  'tier-upgrade': ['admin'],
  'brand-switch': ['admin'],
  'system-monitor': ['admin', 'manager']
}
export const canAccess = (role, section) => {
  if (!role || !section) return false;
  return ROLE_ACCESS[role]?.includes(section) || false;
}
export const canUseFeature = (role, feature) => {
  if (!role || !feature) return false;
  return FEATURE_PERMISSIONS[feature]?.includes(role) || false;
}
export const getRoleLevel = (role) => {
  const levels = { guest: 0, rep: 1, manager: 2, admin: 3, api: 4 }
  return levels[role] || 0;
}
export const hasMinimumRole = (userRole, requiredRole) => {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}
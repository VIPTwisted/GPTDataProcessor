
import React from 'react';
import { useUser } from '../../context/AuthContext';
import { canAccess, canUseFeature } from '../../../logic/role-access';

const RoleLock = ({ section, feature, children, fallback = null, showMessage = false }) => {
  const { user, role } = useUser();

  // Check section access
  if (section && !canAccess(role, section)) {
    if (showMessage) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            🔒 Access restricted. Required role for "{section}".
          </p>
        </div>
      );
    }
    return fallback;
  }

  // Check feature access
  if (feature && !canUseFeature(role, feature)) {
    if (showMessage) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">
            🚫 Feature "{feature}" not available for your role.
          </p>
        </div>
      );
    }
    return fallback;
  }

  return children;
};

export default RoleLock;

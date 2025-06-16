
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenantAuth } from '../hooks/useTenantAuth';

const brands = [
  { id: 'toyparty', name: 'ToyParty', color: '#E11D48' },
  { id: 'honeyglow', name: 'HoneyGlow', color: '#F59E0B' },
  { id: 'vibevault', name: 'VibeVault', color: '#8B5CF6' }
];

const BrandSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, userBrand, brandId } = useTenantAuth();

  // Only show brand switcher to admins
  if (!isAdmin) return null;

  const currentPath = location.pathname.replace(`/${brandId}`, '');

  const handleBrandChange = (newBrandId) => {
    navigate(`/${newBrandId}${currentPath}`);
  };

  return (
    <div className="mb-6 flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Switch Brand:
      </label>
      <select
        value={brandId || ''}
        onChange={(e) => handleBrandChange(e.target.value)}
        className="px-3 py-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Select Brand...</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      {brandId && (
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: brands.find(b => b.id === brandId)?.color }}
        />
      )}
    </div>
  );
};

export default BrandSwitcher;

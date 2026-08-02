'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { JOB_CATEGORIES, JOB_TYPES, SHIFT_REQUIREMENTS, SECURITY_CLEARANCE, CERTIFICATIONS } from '@/lib/constants';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  category?: string;
  type?: string;
  shift?: string;
  clearance?: string;
  certifications?: string;
  isOpen?: boolean;
  onClose?: () => void;
  basePath?: string;
}

export function FilterSidebar({
  category,
  type,
  shift,
  clearance,
  certifications,
  isOpen = true,
  onClose,
  basePath = '/',
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFilterCount = [category, type, shift, clearance, certifications].filter(Boolean).length;

  // Handle filter change - updates URL without page reload
  const handleFilterChange = (filterKey: string, filterValue: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filterValue) {
      params.set(filterKey, filterValue);
    } else {
      params.delete(filterKey);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${basePath}?${queryString}` : basePath;

    // Use router.replace to update URL without reload or scroll jump
    router.replace(newUrl, { scroll: false });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-72 lg:w-auto bg-[#0f172a]/95 border-r lg:border-r-0 border-white/10 z-50 lg:z-auto transition-transform duration-300 overflow-y-auto shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Filters</h2>
              {activeFilterCount > 0 && (
                <p className="text-xs text-silver-400 mt-1">
                  {activeFilterCount} active
                </p>
              )}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <X className="w-5 h-5 text-silver-300" />
              </button>
            )}
          </div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => router.replace(basePath, { scroll: false })}
              className="block w-full px-4 py-2 text-center text-sm font-medium text-ice-400 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
            >
              Clear All Filters
            </button>
          )}

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('category', null)}
                className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                  !category
                    ? 'bg-ice-500 text-white'
                    : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Categories
              </button>
              {JOB_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat)}
                  className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                    category === cat
                      ? 'bg-ice-500 text-white'
                      : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Employment Type</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('type', null)}
                className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                  !type
                    ? 'bg-ice-500 text-white'
                    : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Types
              </button>
              {JOB_TYPES.map((jobType) => (
                <button
                  key={jobType}
                  onClick={() => handleFilterChange('type', jobType)}
                  className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                    type === jobType
                      ? 'bg-ice-500 text-white'
                      : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {jobType}
                </button>
              ))}
            </div>
          </div>

          {/* Shift Requirements */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Shift Requirements</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('shift', null)}
                className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                  !shift
                    ? 'bg-ice-500 text-white'
                    : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Shifts
              </button>
              {SHIFT_REQUIREMENTS.map((shiftReq) => (
                <button
                  key={shiftReq}
                  onClick={() => handleFilterChange('shift', shiftReq)}
                  className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                    shift === shiftReq
                      ? 'bg-ice-500 text-white'
                      : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {shiftReq}
                </button>
              ))}
            </div>
          </div>

          {/* Security Clearance */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Security Clearance</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('clearance', null)}
                className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                  !clearance
                    ? 'bg-ice-500 text-white'
                    : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Clearances
              </button>
              {SECURITY_CLEARANCE.map((clearanceLevel) => (
                <button
                  key={clearanceLevel}
                  onClick={() => handleFilterChange('clearance', clearanceLevel)}
                  className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                    clearance === clearanceLevel
                      ? 'bg-ice-500 text-white'
                      : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {clearanceLevel}
                </button>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Certifications</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('certifications', null)}
                className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                  !certifications
                    ? 'bg-ice-500 text-white'
                    : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                All Certifications
              </button>
              {CERTIFICATIONS.map((cert) => (
                <button
                  key={cert}
                  onClick={() => handleFilterChange('certifications', cert)}
                  className={`block w-full text-left px-3 py-1.5 text-xs rounded-lg transition-[background-color,border-color] ${
                    certifications === cert
                      ? 'bg-ice-500 text-white'
                      : 'bg-white/5 text-silver-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cert}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

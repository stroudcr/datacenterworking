'use client';

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
}

export function FilterSidebar({
  category,
  type,
  shift,
  clearance,
  certifications,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const activeFilterCount = [category, type, shift, clearance, certifications].filter(Boolean).length;

  const buildUrl = (filters: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const queryString = params.toString();
    return queryString ? `/?${queryString}` : '/';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-72 lg:w-auto glass border-r lg:border-r-0 border-white/10 z-50 lg:z-auto transition-transform duration-300 overflow-y-auto ${
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
                className="lg:hidden p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-silver-300" />
              </button>
            )}
          </div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <a
              href="/"
              className="block w-full px-4 py-2 text-center text-sm font-medium text-ice-400 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear All Filters
            </a>
          )}

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Category</h3>
            <div className="space-y-2">
              <a
                href={buildUrl({ type, shift, clearance, certifications })}
                className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !category
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                All Categories
              </a>
              {JOB_CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={buildUrl({ type, shift, clearance, certifications, category: cat })}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                    category === cat
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Employment Type */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Employment Type</h3>
            <div className="space-y-2">
              <a
                href={buildUrl({ category, shift, clearance, certifications })}
                className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !type
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                All Types
              </a>
              {JOB_TYPES.map((jobType) => (
                <a
                  key={jobType}
                  href={buildUrl({ category, shift, clearance, certifications, type: jobType })}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                    type === jobType
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {jobType}
                </a>
              ))}
            </div>
          </div>

          {/* Shift Requirements */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Shift Requirements</h3>
            <div className="space-y-2">
              <a
                href={buildUrl({ category, type, clearance, certifications })}
                className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !shift
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                All Shifts
              </a>
              {SHIFT_REQUIREMENTS.map((shiftReq) => (
                <a
                  key={shiftReq}
                  href={buildUrl({ category, type, clearance, certifications, shift: shiftReq })}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                    shift === shiftReq
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {shiftReq}
                </a>
              ))}
            </div>
          </div>

          {/* Security Clearance */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Security Clearance</h3>
            <div className="space-y-2">
              <a
                href={buildUrl({ category, type, shift, certifications })}
                className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !clearance
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                All Clearances
              </a>
              {SECURITY_CLEARANCE.map((clearanceLevel) => (
                <a
                  key={clearanceLevel}
                  href={buildUrl({ category, type, shift, certifications, clearance: clearanceLevel })}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                    clearance === clearanceLevel
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {clearanceLevel}
                </a>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Certifications</h3>
            <div className="space-y-2">
              <a
                href={buildUrl({ category, type, shift, clearance })}
                className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                  !certifications
                    ? 'bg-ice-500 text-white'
                    : 'glass text-silver-300 hover:bg-white/10'
                }`}
              >
                All Certifications
              </a>
              {CERTIFICATIONS.map((cert) => (
                <a
                  key={cert}
                  href={buildUrl({ category, type, shift, clearance, certifications: cert })}
                  className={`block px-3 py-1.5 text-xs rounded-lg transition-all ${
                    certifications === cert
                      ? 'bg-ice-500 text-white'
                      : 'glass text-silver-300 hover:bg-white/10'
                  }`}
                >
                  {cert}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

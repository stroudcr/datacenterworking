'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { ResourceCategory, ResourceTag } from '@/lib/resources-data';

interface ResourceFilterBarProps {
  categories: ResourceCategory[];
  tags: ResourceTag[];
  selectedCategory: ResourceCategory | 'All';
  selectedTags: ResourceTag[];
  onCategoryChange: (category: ResourceCategory | 'All') => void;
  onTagToggle: (tag: ResourceTag) => void;
  onClearFilters: () => void;
}

export function ResourceFilterBar({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters,
}: ResourceFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = selectedCategory !== 'All' || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button (Mobile) */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass-hover text-silver-300"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full bg-ice-500 text-white text-xs">
              {selectedTags.length + (selectedCategory !== 'All' ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-silver-400 hover:text-white transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filters Container */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
        {/* Category Filter */}
        <div className="glass p-4 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Category</h3>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="hidden lg:flex items-center gap-1 text-xs text-silver-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('All')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedCategory === 'All'
                  ? 'bg-ice-500 text-white'
                  : 'glass-hover text-silver-300'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-ice-500 text-white'
                    : 'glass-hover text-silver-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div className="glass p-4 rounded-lg space-y-3">
          <h3 className="text-sm font-semibold text-white">Tags</h3>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-ice-500 to-ice-600 text-white border border-ice-400'
                      : 'glass-hover text-silver-300 border border-silver-500/20'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

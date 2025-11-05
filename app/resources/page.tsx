'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { ResourceCard } from '@/components/ResourceCard';
import { ResourceFilterBar } from '@/components/ResourceFilterBar';
import {
  FileText,
  BookOpen,
  TrendingUp,
  Award,
  Lightbulb,
} from 'lucide-react';
import {
  resources,
  getAllCategories,
  getAllTags,
  ResourceCategory,
  ResourceTag,
} from '@/lib/resources-data';

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');
  const [selectedTags, setSelectedTags] = useState<ResourceTag[]>([]);

  const categories = getAllCategories();
  const tags = getAllTags();

  // Filter resources based on selected filters
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // Category filter
      if (selectedCategory !== 'All' && resource.category !== selectedCategory) {
        return false;
      }

      // Tags filter (resource must have ALL selected tags)
      if (selectedTags.length > 0) {
        const hasAllTags = selectedTags.every((tag) => resource.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedTags]);

  const handleCategoryChange = (category: ResourceCategory | 'All') => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: ResourceTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedTags([]);
  };

  const categoryIcons = {
    'Industry Reports': TrendingUp,
    'Career Guides': BookOpen,
    'Certifications': Award,
    'News': FileText,
    'Best Practices': Lightbulb,
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-ice-500 to-ice-600 mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Resources &{' '}
            <span className="animated-gradient bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-silver-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            In-depth guides, industry reports, and career resources to help you succeed in the data center industry.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Filter Bar */}
                <ResourceFilterBar
                  categories={categories}
                  tags={tags}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onCategoryChange={handleCategoryChange}
                  onTagToggle={handleTagToggle}
                  onClearFilters={handleClearFilters}
                />

                {/* Quick Stats */}
                <GlassCard>
                  <h3 className="text-sm font-semibold text-white mb-3">Browse by Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = categoryIcons[category] || FileText;
                      const count = resources.filter((r) => r.category === category).length;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                            selectedCategory === category
                              ? 'bg-ice-500/20 text-ice-400'
                              : 'hover:bg-white/5 text-silver-400'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{category}</span>
                          </div>
                          <span className="text-xs">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            </aside>

            {/* Main Content - Resource Grid */}
            <main className="lg:col-span-3">
              <div className="space-y-8">
                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCategory !== 'All' ? selectedCategory : 'All Resources'}
                  </h2>
                  <p className="text-silver-400">
                    {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
                  </p>
                </div>

                {/* All Resources */}
                {filteredResources.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredResources.length === 0 && (
                  <GlassCard className="text-center py-12">
                    <FileText className="w-12 h-12 text-silver-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                    <p className="text-silver-400 mb-6">
                      Try adjusting your filters
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-2 rounded-lg glass-hover text-ice-400 font-medium"
                    >
                      Clear all filters
                    </button>
                  </GlassCard>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-black/10 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <GlassCard className="text-center p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Find Your Next Opportunity?
            </h2>
            <p className="text-lg text-silver-300 mb-6">
              Browse thousands of data center jobs from top employers.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-ice-500 to-ice-600 text-white font-semibold hover:from-ice-600 hover:to-ice-700 transition-all"
            >
              Browse Jobs
            </a>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

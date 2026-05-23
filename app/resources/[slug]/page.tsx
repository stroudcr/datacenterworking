import { notFound } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { ShareButton } from '@/components/ShareButton';
import { TableOfContents } from '@/components/TableOfContents';
import { Newsletter } from '@/components/Newsletter';
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getResourceBySlug, resources } from '@/lib/resources-data';
import { SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site-config';

// Revalidate page every hour
export const revalidate = 3600;

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return {
      title: 'Resource Not Found',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = resource.title;
  const description = resource.description;
  const url = absoluteUrl(`/resources/${slug}`);

  const ogImage = absoluteUrl('/images/og-image.jpg');

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: 'article',
      publishedTime: resource.date,
      modifiedTime: resource.date,
      authors: resource.author ? [resource.author] : undefined,
      tags: resource.tags,
      section: resource.category,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resource.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@workindatacenter',
      images: [ogImage],
    },
  };
}

// Generate static params for all resources
export async function generateStaticParams() {
  return resources.map((resource) => ({
    slug: resource.slug,
  }));
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  // Get related resources (same category, excluding current)
  const relatedResources = resources
    .filter((r) => r.category === resource.category && r.slug !== resource.slug)
    .slice(0, 3);

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Industry Reports':
        return 'from-blue-500 to-cyan-500';
      case 'Career Guides':
        return 'from-green-500 to-emerald-500';
      case 'Certifications':
        return 'from-purple-500 to-pink-500';
      case 'News':
        return 'from-orange-500 to-amber-500';
      case 'Best Practices':
        return 'from-indigo-500 to-blue-500';
      default:
        return 'from-ice-500 to-silver-500';
    }
  };

  // Add IDs to H2 headings for Table of Contents anchor links
  const contentWithIds = resource.content.replace(/<h2>/g, (match, offset) => {
    const index = (resource.content.substring(0, offset).match(/<h2>/g) || []).length;
    return `<h2 id="section-${index}">`;
  });

  // Calculate word count for Article schema
  const wordCount = resource.content.replace(/<[^>]*>/g, '').split(/\s+/).length;

  // Article structured data (Schema.org)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.description,
    datePublished: resource.date,
    dateModified: resource.date,
    author: {
      '@type': 'Organization',
      name: resource.author || `${SITE_NAME} Team`,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/NavLogo.png'),
      },
    },
    articleSection: resource.category,
    keywords: resource.tags.join(', '),
    wordCount,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/resources/${slug}`),
    },
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Resources',
        item: absoluteUrl('/resources'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: resource.title,
        item: absoluteUrl(`/resources/${slug}`),
      },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Back Button */}
      <section className="py-6 px-4 border-b border-silver-500/20">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-silver-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>
      </section>

      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-black/10">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getCategoryColor(resource.category)} text-white text-sm font-semibold`}>
                {resource.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {resource.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-silver-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(resource.date), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {resource.readTime}
              </div>
              {resource.author && (
                <div className="flex items-center gap-2">
                  <span>By {resource.author}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass text-xs text-ice-400 border border-ice-500/30"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p className="text-lg text-silver-300 leading-relaxed">
              {resource.description}
            </p>

            {/* Share Button */}
            <div className="flex items-center gap-3 pt-4">
              <ShareButton title={resource.title} text={resource.description} />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Sidebar */}
            <aside className="lg:col-span-1 order-1 lg:order-1">
              <TableOfContents content={resource.content} />
            </aside>

            {/* Main Article Content */}
            <main className="lg:col-span-3 order-2 lg:order-2">
              <GlassCard>
                <div
                  className="prose prose-invert max-w-none
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:scroll-mt-24
                    [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3
                    [&_strong]:text-white [&_strong]:font-semibold
                    [&_p]:text-silver-300 [&_p]:leading-relaxed [&_p]:mb-4
                    text-silver-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: contentWithIds }}
                />
              </GlassCard>
            </main>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 px-4 bg-gradient-to-b from-black/10 to-transparent">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Unlock More Insider Data Center Insights
            </h2>
            <p className="text-lg text-silver-300">
              Subscribe Now and Stay Ahead of the Curve!
            </p>
          </div>
          <Newsletter showHeader={false} buttonText="Subscribe for More Guides" />
        </div>
      </section>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-6 h-6 text-ice-400" />
              <h2 className="text-2xl font-bold text-white">Related Resources</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedResources.map((related) => (
                <Link key={related.id} href={`/resources/${related.slug}`}>
                  <GlassCard hover className="h-full">
                    <div className="space-y-3">
                      <span className="px-3 py-1 rounded-full glass text-xs text-ice-400 border border-ice-500/30 inline-block">
                        {related.category}
                      </span>
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-silver-400 line-clamp-3">
                        {related.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-silver-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(related.date), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {related.readTime}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

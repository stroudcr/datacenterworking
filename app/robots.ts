import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://workindatacenter.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        // OpenAI ChatGPT crawler - allows crawling for ChatGPT search and citations
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        // OpenAI GPTBot - allows content to be used in AI training
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        // Google's main crawler
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
      {
        // Bing crawler (used by SearchGPT)
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

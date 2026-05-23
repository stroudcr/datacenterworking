import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const privatePaths = [
    '/api/',
    '/dashboard/',
    '/admin/',
    '/applications/',
    '/jobs/manage/',
    '/login',
    '/register',
    '/post-job/success',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // OpenAI ChatGPT crawler - allows crawling for ChatGPT search and citations
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // OpenAI GPTBot - allows content to be used in AI training
        userAgent: 'GPTBot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Google's main crawler
        userAgent: 'Googlebot',
        allow: '/',
        disallow: privatePaths,
      },
      {
        // Bing crawler (used by SearchGPT)
        userAgent: 'Bingbot',
        allow: '/',
        disallow: privatePaths,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}

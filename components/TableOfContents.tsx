'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { List } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract H2 headings from content (browser only)
    if (typeof window === 'undefined') return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2');

    const items: TOCItem[] = Array.from(headings).map((heading, index) => {
      const text = heading.textContent || '';
      const id = `section-${index}`;
      return { id, text, level: 2 };
    });

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    // Track active section on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    // Observe all h2 elements
    const headings = document.querySelectorAll('h2[id^="section-"]');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const mobileTableOfContents = document.querySelector<HTMLDetailsElement>(
        '[data-mobile-table-of-contents]'
      );
      if (mobileTableOfContents) {
        mobileTableOfContents.open = false;
      }

      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (tocItems.length === 0) return null;

  const navigation = (
    <nav>
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left text-sm transition-colors w-full py-1 px-2 rounded hover:bg-white/5 ${
                activeId === item.id
                  ? 'text-ice-400 font-medium'
                  : 'text-silver-400 hover:text-white'
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <details
        data-mobile-table-of-contents
        className="group lg:hidden rounded-xl glass border border-silver-500/20"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-white [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2 font-semibold">
            <List className="w-5 h-5 text-ice-400" />
            Table of Contents
          </span>
          <span className="text-ice-400 transition-transform group-open:rotate-180" aria-hidden="true">
            ↓
          </span>
        </summary>
        <div className="max-h-[60vh] overflow-y-auto border-t border-silver-500/20 p-4">
          {navigation}
        </div>
      </details>

      <div className="hidden lg:block lg:sticky lg:top-24">
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <List className="w-5 h-5 text-ice-400" />
            <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
          </div>
          {navigation}
        </GlassCard>
      </div>
    </>
  );
}

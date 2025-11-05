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
    // Extract H2 headings from content
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

  return (
    <div className="lg:sticky lg:top-24">
      <GlassCard>
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-ice-400" />
          <h2 className="text-lg font-semibold text-white">Table of Contents</h2>
        </div>
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
      </GlassCard>
    </div>
  );
}

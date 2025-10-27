import { Check } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  badge,
  ctaText = 'Get Started',
  ctaLink = '/post-job',
}: PricingCardProps) {
  return (
    <div
      className={`relative glass rounded-2xl p-8 transition-all duration-300 hover:shadow-glass-hover ${
        highlighted ? 'border-2 border-ice-500 shadow-glass-hover' : ''
      }`}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold shadow-lg">
            {badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-bold text-white">${price}</span>
        </div>
        <p className="text-sm text-silver-400 mt-2">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-ice-400 flex-shrink-0 mt-0.5" />
            <span className="text-silver-300 text-sm leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link href={ctaLink} className="block">
        <Button
          variant={highlighted ? 'primary' : 'secondary'}
          size="lg"
          fullWidth
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
}

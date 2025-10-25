# DataCenter Jobs - Premium Data Center Job Board

A modern, glassmorphism-styled job board built with Next.js 16 for data center professionals. Features Stripe payments, PostgreSQL database, and a beautiful UI with icy blues and silver tones.

## Features

### Core Functionality
- 🔐 **Universal Authentication** - Single login for employers and job seekers
- 💳 **Stripe Integration** - $249 base listings, $149 featured upgrades
- 🎯 **10 Job Categories** - Specialized data center categories
- ⭐ **Featured Jobs** - Premium placement for 7 days
- 🔍 **Advanced Search** - Filter by category, search, and sort
- 📧 **Email Alerts** - Newsletter subscription system
- 👥 **User Dashboards** - Separate views for employers and job seekers
- 🛡️ **Admin Panel** - Moderate and remove job postings

### Design
- 🎨 **Glassmorphism UI** - Modern frosted glass effects
- 🌊 **Animated Gradients** - Icy blue and silver theme
- 📱 **Fully Responsive** - Mobile-first design
- ⚡ **Fast Performance** - Built on Next.js 16 with Turbopack

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Stripe
- **Authentication**: Custom JWT-based auth
- **Styling**: Tailwind CSS with custom glassmorphism utilities
- **Email**: Resend
- **Validation**: Zod + React Hook Form
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── jobs/          # Job CRUD operations
│   │   └── stripe/        # Stripe webhook handler
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── post-job/          # Job posting form
│   ├── jobs/[id]/         # Job detail pages
│   ├── dashboard/         # User dashboards
│   ├── admin/             # Admin panel
│   └── page.tsx           # Homepage with job listings
├── components/            # Reusable UI components
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Prisma client
│   ├── stripe.ts         # Stripe utilities
│   ├── constants.ts      # App constants
│   └── validations.ts    # Zod schemas
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (test mode for development)
- Resend account (for emails)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/datacenter_jobs?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
```

3. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)

2. **Get your API keys** from the Stripe Dashboard

3. **Set up webhook** for production:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`

4. **Test locally with Stripe CLI**:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Database Schema

### Key Models

- **User** - Employers, job seekers, and admins
- **Job** - Job listings with status, featured flag, and expiration
- **Application** - Job applications from seekers
- **SavedJob** - Bookmarked jobs
- **Payment** - Stripe payment records
- **Newsletter** - Email subscription preferences

## Job Categories

1. Data Center Operations & Production
2. Critical Facilities & Maintenance
3. Engineering & Design
4. Construction & Project Management
5. IT, Cloud & Network Infrastructure
6. Security & Compliance
7. Management & Executive Leadership
8. Sales, Business Development & Account Management
9. Emerging Technologies & Specialty Roles
10. Support Functions

## Pricing

- **Base Listing**: $249 for 30 days
- **Featured Upgrade**: +$149 for:
  - Homepage placement for 7 days
  - Priority in search results
  - Social media promotion
  - Highlighted in email alerts

## User Roles

### Job Seekers
- Browse and search jobs
- Save favorite jobs
- Apply to jobs
- Track applications
- Subscribe to email alerts

### Employers
- Post job listings
- Manage active jobs
- View application count
- Upgrade to featured
- Dashboard with analytics

### Admins
- View all jobs
- Moderate/remove postings
- View user activity
- Access admin panel

## Development

### Creating an Admin User

Run this in your database or create a script:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'admin@yourdomain.com';
```

### Adding Test Data

```bash
npx prisma studio
```

This opens Prisma Studio where you can manually add test jobs and users.

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**

2. **Connect to Vercel**
   - Import your repository
   - Add environment variables
   - Deploy

3. **Set up PostgreSQL**
   - Use Vercel Postgres or external provider
   - Update `DATABASE_URL`

4. **Run migrations**

```bash
npx prisma migrate deploy
```

5. **Configure Stripe webhook** with your production URL

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Railway
- Fly.io
- AWS Amplify
- DigitalOcean App Platform

## Customization

### Changing Colors

Edit `tailwind.config.ts` and `app/globals.css`:

```typescript
// tailwind.config.ts
colors: {
  ice: { /* Your blue shades */ },
  silver: { /* Your gray shades */ },
}
```

### Adding More Categories

Edit `lib/constants.ts`:

```typescript
export const JOB_CATEGORIES = [
  'Your Category',
  // ...
];
```

### Modifying Pricing

Edit `lib/constants.ts`:

```typescript
export const PRICING = {
  BASE_LISTING: 24900, // cents
  FEATURED_UPGRADE: 14900, // cents
  // ...
};
```

## Security

- JWT tokens stored in httpOnly cookies
- Passwords hashed with bcrypt
- CSRF protection on all mutations
- Stripe webhooks verified with signatures
- Input validation with Zod
- SQL injection protection via Prisma

## Performance

- Server-side rendering for SEO
- Optimized database queries with indexes
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Turbopack for fast HMR

## Support

For issues or questions:
1. Check existing issues
2. Create a new issue with details
3. Include error logs and environment info

## License

MIT License - feel free to use for personal or commercial projects.

## Roadmap

- [ ] Job seeker profiles
- [ ] Resume upload and parsing
- [ ] Company pages
- [ ] Advanced analytics dashboard
- [ ] Email notifications system
- [ ] Social media sharing
- [ ] Salary insights
- [ ] Job alerts with filters
- [ ] Application tracking for seekers
- [ ] Bulk job imports

---

Built with ❄️ by the DataCenter Jobs team

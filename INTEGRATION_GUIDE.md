# EAIC Portal - Integration & Deployment Guide

## Overview

The EAIC (Eastern Africa Integrated College) portal is a full-stack web application featuring:
- Public landing page with academic information
- Admin dashboard for managing content and applications
- Student portal for checking grades, fees, and timetables
- Seamless authentication with demo mode for testing

## Architecture

```
src/
├── pages/              # Main page components
│   ├── Index.tsx       # Landing page
│   ├── Academics.tsx   # Programs page
│   ├── About.tsx       # About college
│   ├── Auth.tsx        # Authentication (demo + Supabase)
│   ├── AdminDashboard.tsx  # Admin portal
│   └── StudentDashboard.tsx # Student portal
├── components/         # Reusable components
│   ├── ui/            # UI components (cards, buttons, etc.)
│   ├── sections/      # Page sections
│   ├── student/       # Student portal components
│   ├── hero-section.tsx
│   └── footer.tsx
├── utils/
│   └── demoAuth.ts    # Demo authentication system
├── integrations/
│   └── supabase/      # Supabase client
└── index.css          # Global styles with design tokens
```

## Current Features

### Public Pages
- ✅ Landing page with TIVET programs overview
- ✅ Academics page with program details
- ✅ About page with staff information
- ✅ Contact page with location and contact details
- ✅ News and gallery pages
- ✅ Admissions and fees information

### Admin Dashboard
- ✅ Demo login system
- ✅ Dashboard overview with statistics
- ✅ News and events management
- ✅ Student admissions tracking
- ✅ Payment monitoring
- ✅ Gallery management
- ✅ Contact messages
- ✅ Demo data with realistic scenarios

### Student Portal
- ✅ Demo login system
- ✅ Dashboard with academic overview
- ✅ Results and grades display
- ✅ Fee structure and payment history
- ✅ Timetable view
- ✅ Exam booking interface
- ✅ Announcements
- ✅ Student profile
- ✅ Demo data with sample records

## Demo Mode

### How It Works
The application includes a client-side demo authentication system (`src/utils/demoAuth.ts`) that:
- Stores session data in localStorage
- Provides instant access without database requirements
- Falls back to Supabase when configured

### Using Demo Credentials
1. Visit `/auth`
2. Click demo credential buttons to auto-fill
3. Admin: `admin@eaic.ac.ke` / `Admin@2024`
4. Student: `student@eaic.ac.ke` / `Student@2024`

## Deployment

### Prerequisites
- Node.js 16+
- npm or yarn
- Vercel account (optional, but recommended)

### Local Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Transitioning from Demo to Production

### Step 1: Set Up Supabase (Optional)
```bash
# Create Supabase project at supabase.com
# Get your credentials from project settings
```

### Step 2: Configure Environment Variables
Update `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Create Database Tables
Required tables in Supabase:
- `profiles` - User profiles
- `user_roles` - User role assignments
- `students` - Student information
- `news_events` - News and events
- `gallery_images` - Gallery images
- `contact_messages` - Contact form submissions
- `admissions` - Admission applications
- `payments` - Payment records

### Step 4: Update Authentication
The Auth page automatically uses Supabase when credentials are provided. Demo mode becomes a fallback.

### Step 5: Customize Demo Data
Edit `/src/utils/demoAuth.ts` to update demo credentials, or modify `AdminDashboard.tsx` and `StudentDashboard.tsx` to update demo data.

## Performance Optimizations

- ✅ Lazy loading of components
- ✅ Optimized images and assets
- ✅ Design token-based styling
- ✅ Responsive Tailwind CSS
- ✅ Local storage for demo data

## Security Considerations

### Demo Mode
- ⚠️ Demo credentials are public - DO NOT use in production
- ⚠️ Demo data is stored in localStorage (client-side)
- ✅ Demo mode only activates with specific credentials

### Production Mode
- ✅ Uses Supabase authentication
- ✅ HTTP-only cookies for session management
- ✅ Row-level security (if configured)
- ✅ Password hashing on backend
- ✅ Input validation and sanitization

## Customization

### Change College Information
Update in multiple files:
- `/public/index.html` - Meta tags and schema
- `/src/components/footer.tsx` - Footer content
- `/src/components/hero-section.tsx` - Hero messaging
- `/src/components/sections/quick-intro.tsx` - College description

### Update Design Colors
Modify `/src/index.css` design tokens:
```css
--primary: your-color;
--accent: your-color;
--background: your-color;
```

### Customize Programs
Edit `/src/pages/Academics.tsx` to update:
- Program names and descriptions
- Course offerings
- Program duration and certifications

### Update Logo and Images
Replace image files in `/src/assets/`:
- `hero-digischool.jpg`
- `gallery-digital-classroom.jpg`
- `gallery-coding-lab.jpg`
- `gallery-outdoor-tech.jpg`

## Troubleshooting

### Dashboards Not Loading
1. Check if demo session is active: `localStorage.getItem('eaic_demo_session')`
2. Clear localStorage and try again
3. Verify environment variables are set

### Styling Issues
1. Rebuild CSS: `npm run build`
2. Clear browser cache
3. Check design tokens in `src/index.css`

### Database Connection Errors
1. Verify Supabase URL and key
2. Check network connectivity
3. Review Supabase RLS policies
4. Check browser console for detailed errors

## Support & Maintenance

### Regular Updates
- Keep dependencies updated: `npm update`
- Monitor Supabase service status
- Review error logs and user feedback

### Backup Strategy
- Regular Supabase backups
- Database export schedule
- Code versioning with Git

## Next Steps

1. Deploy to Vercel
2. Set up custom domain
3. Configure email notifications
4. Set up payment integration (M-Pesa)
5. Implement analytics
6. Add social media integration
7. Set up automated backups

## Support

For issues or questions:
- Review the DEMO_CREDENTIALS.md file
- Check component documentation
- Visit Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs

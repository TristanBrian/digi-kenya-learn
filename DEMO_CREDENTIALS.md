# EAIC Portal - Demo Credentials

## Quick Start

The EAIC (Eastern Africa Integrated College) portal includes demo credentials for testing both the Admin and Student dashboards without requiring a live database setup.

## Demo Credentials

### Admin Dashboard
- **Email:** `admin@eaic.ac.ke`
- **Password:** `Admin@2024`
- **Role:** Administrator
- **Access:** Full admin dashboard with demo data for news, admissions, payments, and student management

### Student Portal
- **Email:** `student@eaic.ac.ke`
- **Password:** `Student@2024`
- **Role:** Student
- **Access:** Student dashboard with timetable, exam booking, results, fees, and announcements

## How to Use

1. Navigate to `/auth` (Authentication page)
2. Click the "Sign In" tab
3. Choose either the Admin or Student demo credential button to auto-fill the login form
4. Click "Sign In"
5. You'll be redirected to the respective dashboard

## Demo Data Included

### Admin Dashboard Contains:
- News and events listings
- Student admissions applications
- Payment records
- Student information management
- Timetables and announcements

### Student Portal Contains:
- Personal profile and enrollment information
- Academic results and grades
- Fee structure and payment history
- Timetable and class schedules
- Exam booking interface
- Announcements and notifications

## Features

- **No Database Required:** Demo credentials use client-side local storage
- **Instant Access:** No email verification needed
- **Full Functionality:** Complete demo experience of both dashboards
- **Market-Ready Design:** Professional, modern interface

## Production Setup

To transition from demo mode to production:

1. Set up Supabase or your authentication provider
2. Configure the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables
3. Update the Auth page to remove demo credentials
4. Implement real database connections in AdminDashboard and StudentDashboard components

## Notes

- Demo credentials are for marketplace preview and testing only
- All data is stored locally and resets on page refresh for demo accounts
- Real Supabase authentication will take priority when configured
- Demo users cannot access production data

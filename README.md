# TruckDeal

A truck dealership website with a public inventory and a password protected admin dashboard for managing listings. Built with Next.js, Tailwind CSS, and Supabase.

## What it does

The public site opens straight on the inventory, where visitors can search and filter trucks, open any listing to see a swipeable photo gallery and full specs, and reach you through the contact page. The admin dashboard at `/admin` lets you add, edit, and delete trucks, upload photos straight from your phone, and mark listings as available or featured. Photos are optimized in the browser before upload, so they stay sharp while loading fast on slow connections.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a Supabase project, then copy `.env.example` to `.env.local` and fill in your values:
   ```
   cp .env.example .env.local
   ```

3. In the Supabase SQL editor, run the schema in `lib/supabase-schema.sql` to create the `trucks` table.

4. In Supabase Storage, create a public bucket named `truck-images`.

5. Run the dev server:
   ```
   npm run dev
   ```

## Admin access

The dashboard lives at `/admin`. The password comes from the `ADMIN_PASSWORD` environment variable and defaults to `admin123` if you do not set one. Set a strong password before going live, since anyone with the password can change your inventory.

## Deploying

Push this repository to GitHub and import it into Vercel. Add the four environment variables from `.env.example` in the Vercel project settings, and deploy.

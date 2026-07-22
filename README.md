# Suramya Production Studio - Premium Website & CRM Roster

This is a premium wedding photography & cinematography studio website built for **Suramya Production** (Nanakheda, Ujjain, Madhya Pradesh), featuring a custom luxury wedding magazine design and a local-first lead CRM, calendar planner, blog editor, services/packages manager, and secure client galleries.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19)
- **Database**: SQLite database running via Prisma (Easily migratable to PostgreSQL/Supabase by changing connection string)
- **Styling**: Tailwind CSS v4 (Luxury warm light editorial theme)
- **Icons**: Lucide Icons
- **Authentication**: JWT secured HTTP-only cookie session cookies

---

## Local Setup & Installation

Follow these steps to run the application on your computer:

### 1. Install Dependencies
Clone the repository and run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="SuramyaSecretKey2026!!!"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize & Seed Database
Build the local SQLite database schema and run the seed script to preload settings, admin users, services, packages, and mock galleries:
```bash
# Push schema model definition to dev.db
npx prisma db push

# Populate initial business contents and default admin user
node prisma/seed.js
```

### 4. Run Development Server
Boot up the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the live website.

---

## Admin Portal & CRM Access

To manage inquiries, write blogs, or block calendar dates, navigate to `/admin/login` on the running instance:

- **Login URL**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `Suramya@2026`

### Key Admin Modules
1. **Overview**: Live stats check-ins of active pipeline, revenue collections, and source trends.
2. **Lead CRM**: Tabular roster with statuses (New, Booked, Negotiation), invoice details, and file export/import in CSV format.
3. **Calendar**: Visual monthly calendar displaying shoot dates and conflict alerts if the same date has double-bookings.
4. **Media Library**: Server upload workspace supporting images and video uploads. Links are copied with one click to use in the editors.
5. **CMS Editors**: Unified CRUD panels for Portfolio, Services, Packages, Testimonials, and Blogs.
6. **Global Settings**: Content editors for phone numbers, taglines, business hours, and announcement bar settings.

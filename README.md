# Velora Marketplace — Phase 3

This Phase 3 package is built directly from the Phase 2B ZIP that was tested in the browser.

## What is real now

- Email/password account creation
- Password hashing with bcrypt
- Signed HTTP-only login session
- Prisma database
- SQLite local persistence for easy Mac testing
- Host profiles
- Real listing submission
- Pending-review listing status
- Real image upload to `public/uploads`
- Saved host dashboard inventory
- Database-driven homepage and Explore page
- Saved favorites
- Persistent availability data models
- Confirmation page proving the listing was written to the database

## First-time setup on Mac

Inside the Phase 3 folder, run these commands one at a time:

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Then open:

http://localhost:3000/sign-up

Create an account, then create an asset at:

http://localhost:3000/host/listings/new

After clicking **Submit for review**, Velora redirects to a database confirmation page. The listing also remains in `/host/dashboard` after refresh and after restarting the development server.

## Why SQLite for this milestone

SQLite is a real persistent database and lets us verify the complete backend flow on your Mac without creating a cloud database account yet. The Prisma models are structured so the production migration to PostgreSQL is straightforward.

## Next production milestone

- Managed PostgreSQL
- Cloud image storage
- Admin listing approval / rejection
- Real availability calendar
- Booking engine
- Stripe Connect payments and host payouts


## Party Rides update

Velora now includes a sixth marketplace category: **Party Rides**.

Supported types:
- Limousine
- Party Bus
- Sprinter / VIP Van
- Stretch SUV
- Chauffeur / Luxury Vehicle

Party Rides use hourly pricing and can store:
- passenger capacity
- professional driver included
- minimum booking hours
- overtime hourly rate
- pickup/drop-off availability

After replacing your Phase 3 folder with this version, run:

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

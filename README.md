This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org)
- **Database & Authentication**: [Supabase](https://supabase.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://radix-ui.com)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide](https://lucide.dev)

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or newer)
- npm, yarn, pnpm, or bun
- A Supabase account and project

## Features implemented

- [x] Add a new lead
- [x] Edit a lead
- [x] Delete a lead
- [x] Search for a lead
- [x] Filter leads by company, name, email with string like
- [x] Filter leads by engagement and stage
- [x] Sort leads by company, name and stage
- [x] Export leads in the UI (filtered/paginated) to CSV
- [x] Pagination

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repository-url>
cd lead-management-system
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optionally, reach out to get the env variables.

4. **Set up Supabase database**

Create a table in your Supabase project called `leads` with the following schema:

```sql
create table leads (
  id bigint primary key,
  name text not null,
  email text not null,
  company text not null,
  stage integer not null default 1,
  engaged boolean not null default false,
  lastContacted text,
  initials text,
  created_at timestamp with time zone default now()
);
```

Don't forget to turn off RLS row level security in the `leads` table.

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

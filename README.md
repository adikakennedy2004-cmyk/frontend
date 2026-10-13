# Mwangaza

A scholarship discovery and online application demo for young people. Applicants
can browse sample opportunities, filter by subject area, check eligibility, and
submit an application to Supabase.

> **Demo data:** The scholarship providers, awards, eligibility details, and
> deadlines shown in this project are examples, not verified offers. Applicants
> should confirm details directly with the official sponsor before applying.

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set your Supabase project URL and
   publishable (formerly anon) key. The project URL should look like
   `https://your-project.supabase.co`; do not append `/rest/v1`.

3. In the Supabase Dashboard, open **SQL Editor** and run
   [`supabase/schema.sql`](./supabase/schema.sql). This creates the example
   opportunities and the application table. Public visitors can submit
   applications, but the row-level security policy does not grant them access
   to read applicant details.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open <http://localhost:3000>.

## Checks

```bash
npm run lint
npm run build
```

Submitted applications are stored in the `scholarship_applications` table and
can be reviewed securely in the Supabase Dashboard. Keep the publishable key
in `.env`; never put a Supabase secret or service-role key in a `NEXT_PUBLIC_`
variable.

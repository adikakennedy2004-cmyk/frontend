create table if not exists public.scholarship_opportunities (
  slug text primary key,
  title text not null,
  provider text not null,
  category text not null check (category in ('STEM', 'Leadership', 'Creative', 'Research')),
  award text not null,
  deadline date not null,
  location text not null,
  summary text not null,
  eligibility text not null,
  created_at timestamptz not null default now()
);

alter table public.scholarship_opportunities enable row level security;

drop policy if exists "Anyone can browse example scholarships"
  on public.scholarship_opportunities;
create policy "Anyone can browse example scholarships"
  on public.scholarship_opportunities
  for select
  to anon, authenticated
  using (true);

grant select on public.scholarship_opportunities to anon, authenticated;

insert into public.scholarship_opportunities
  (slug, title, provider, category, award, deadline, location, summary, eligibility)
values
  (
    'bright-minds-stem',
    'Bright Minds STEM Scholarship',
    'Mwangaza Education Fund',
    'STEM',
    'Up to KSh 120,000',
    '2026-11-30',
    'Kenya',
    'A boost for curious students ready to turn big STEM ideas into real-world change.',
    'Kenyan students entering or currently pursuing an undergraduate STEM degree.'
  ),
  (
    'next-generation-leaders',
    'Next Generation Leaders Award',
    'The Jirani Initiative',
    'Leadership',
    'KSh 85,000',
    '2026-12-15',
    'East Africa',
    'For young community builders who are already showing up and making a difference.',
    'East African students aged 18–25 with a community project or leadership role.'
  ),
  (
    'future-coders-grant',
    'Future Coders Grant',
    'Code for Tomorrow',
    'STEM',
    'Up to KSh 60,000',
    '2027-01-10',
    'East Africa',
    'Helping aspiring developers access the training, equipment, and education they need.',
    'East African students studying computer science, software engineering, or IT.'
  ),
  (
    'creative-voices-bursary',
    'Creative Voices Bursary',
    'Imani Arts Collective',
    'Creative',
    'KSh 50,000',
    '2027-01-31',
    'Kenya',
    'Backing the next generation of storytellers, designers, and cultural changemakers.',
    'Kenyan students enrolled in design, film, music, visual arts, or communications.'
  ),
  (
    'community-research-fellowship',
    'Community Research Fellowship',
    'Open Horizons Foundation',
    'Research',
    'Up to KSh 100,000',
    '2027-02-15',
    'East Africa',
    'A little funding and a lot of encouragement for research rooted in local communities.',
    'Undergraduate and postgraduate students conducting community-led research.'
  ),
  (
    'first-in-family-scholarship',
    'First in the Family Scholarship',
    'Pamoja Student Trust',
    'Leadership',
    'Up to KSh 90,000',
    '2027-02-28',
    'Kenya',
    'Making the path to higher education a little more possible for first-generation students.',
    'Kenyan undergraduate applicants who will be the first in their family to attend university.'
  )
on conflict (slug) do nothing;

create table if not exists public.scholarship_applications (
  id uuid primary key default gen_random_uuid(),
  scholarship_slug text not null references public.scholarship_opportunities(slug) on delete restrict,
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 1 and 32),
  country text not null check (char_length(country) between 1 and 80),
  institution text not null check (char_length(institution) between 1 and 160),
  study_level text not null check (
    study_level in ('Secondary school', 'Certificate or diploma', 'Undergraduate', 'Postgraduate')
  ),
  course text not null check (char_length(course) between 1 and 120),
  personal_statement text not null check (char_length(personal_statement) between 40 and 1200),
  consent_given boolean not null default true check (consent_given),
  status text not null default 'received' check (status in ('received', 'in_review', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.scholarship_applications enable row level security;

drop policy if exists "Anyone can submit a scholarship application"
  on public.scholarship_applications;
create policy "Anyone can submit a scholarship application"
  on public.scholarship_applications
  for insert
  to anon, authenticated
  with check (true);

revoke all on public.scholarship_applications from public, anon, authenticated;
grant insert (
  scholarship_slug,
  full_name,
  email,
  phone,
  country,
  institution,
  study_level,
  course,
  personal_statement
) on public.scholarship_applications to anon, authenticated;

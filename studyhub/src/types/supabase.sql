-- Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- Users are handled by auth.users

create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  start timestamptz not null,
  end timestamptz,
  color text,
  created_at timestamptz default now()
);

create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  text text,
  file_url text,
  created_at timestamptz default now()
);

create table if not exists public.qcm_questions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  question text not null,
  options text[] not null,
  answer_index int not null,
  created_at timestamptz default now()
);

create table if not exists public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  front text not null,
  back text not null,
  created_at timestamptz default now()
);

create table if not exists public.summaries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Storage bucket
-- Create a bucket named 'courses' in Supabase Storage Dashboard and set RLS to allow owner read/write.

-- RLS
alter table public.events enable row level security;
alter table public.courses enable row level security;
alter table public.qcm_questions enable row level security;
alter table public.flashcards enable row level security;
alter table public.summaries enable row level security;

create policy "Users can manage own events" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own courses" on public.courses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own qcm" on public.qcm_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own flashcards" on public.flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own summaries" on public.summaries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
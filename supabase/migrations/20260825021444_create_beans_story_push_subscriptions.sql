create table public.beans_story_push_subscriptions (
  id bigint generated always as identity primary key,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table public.beans_story_push_subscriptions enable row level security;

create policy "allow all (anon)" on public.beans_story_push_subscriptions
  for all
  using (true)
  with check (true);

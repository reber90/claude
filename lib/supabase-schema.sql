create table if not exists trucks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  title text not null,
  make text not null,
  model text not null,
  year integer not null,
  price numeric,
  mileage integer,
  condition text default 'Good',
  transmission text default 'Automatic',
  fuel_type text default 'Gasoline',
  drivetrain text default '4WD',
  engine text,
  color text,
  vin text,
  description text,
  features text[] default '{}',
  images text[] default '{}',
  is_available boolean default true,
  is_featured boolean default false
);

alter table trucks enable row level security;

create policy "Public can view available trucks" on trucks
  for select using (is_available = true);

create policy "Service role full access" on trucks
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public) values ('truck-images', 'truck-images', true)
on conflict do nothing;

create policy "Public can view truck images" on storage.objects
  for select using (bucket_id = 'truck-images');

create policy "Service role can upload images" on storage.objects
  for insert with check (bucket_id = 'truck-images' and auth.role() = 'service_role');

create policy "Service role can delete images" on storage.objects
  for delete using (bucket_id = 'truck-images' and auth.role() = 'service_role');

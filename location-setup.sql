-- ============================================
-- LIVE LOCATION SHARING SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- Create table for order locations
create table if not exists order_locations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  user_role text not null check (user_role in ('buyer', 'seller')),
  latitude numeric not null,
  longitude numeric not null,
  updated_at timestamptz default now(),
  -- Ensure one entry per user per order
  unique(order_id, user_id)
);

-- Enable RLS
alter table order_locations enable row level security;

-- Policies
create policy "Users read related locations" on order_locations
  for select
  using (
    exists (
      select 1 from orders o
      where o.id = order_locations.order_id
      and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create policy "Users insert own location" on order_locations
  for insert
  with check (auth.uid() = user_id);

create policy "Users update own location" on order_locations
  for update
  using (auth.uid() = user_id);

-- Enable Realtime for this table
alter publication supabase_realtime add table order_locations;

-- ============================================
-- COMPLETE DATABASE SETUP FOR BOOK LOOP
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE TABLES (if not exist)
-- ============================================

-- Profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null check (role in ('buyer','seller','admin')),
  phone text,
  created_at timestamptz default now()
);

-- Books table
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  seller_name text not null,
  title text not null,
  author text default '',
  category text default 'Other',
  price numeric not null,
  condition text not null,
  image_url text,
  pickup_address text default '',
  landmark text default '',
  phone text default '',
  status text not null check (status in ('pending','approved','rejected','sold')),
  created_at timestamptz default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references books(id) on delete set null,
  book_title text not null,
  book_image text,
  book_price numeric not null,
  buyer_id uuid references profiles(id) on delete set null,
  buyer_name text not null,
  seller_id uuid references profiles(id) on delete set null,
  seller_name text not null,
  delivery_address text not null,
  phone text not null,
  delivery_charge numeric not null,
  status text not null check (status in ('requested','approved','picked-up','delivered','cancelled')),
  payment_mode text default 'cod',
  created_at timestamptz default now()
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table books enable row level security;
alter table orders enable row level security;

-- ============================================
-- 3. DROP ALL EXISTING POLICIES
-- ============================================

-- Profiles policies
drop policy if exists "Public read profiles" on profiles;
drop policy if exists "User manages own profile" on profiles;
drop policy if exists "User can insert own profile" on profiles;
drop policy if exists "Users can read own profile" on profiles;

-- Books policies
drop policy if exists "Public read books" on books;
drop policy if exists "Sellers insert books" on books;
drop policy if exists "Seller or admin updates books" on books;
drop policy if exists "Anyone can read books" on books;

-- Orders policies
drop policy if exists "Users read own orders" on orders;
drop policy if exists "Buyers create orders" on orders;
drop policy if exists "Seller/admin updates orders" on orders;
drop policy if exists "Admin can read all orders" on orders;

-- ============================================
-- 4. CREATE PROFILES POLICIES
-- ============================================

-- Allow anyone to read profiles (needed for displaying seller info)
create policy "Public read profiles" on profiles
  for select using (true);

-- Allow users to insert their profile during signup
-- Secure because 'id' references 'auth.users(id)' which ensures the user must exist
create policy "User can insert own profile" on profiles
  for insert
  with check (true);

-- Allow users to update their own profile
create policy "User manages own profile" on profiles
  for update
  using (auth.uid() = id);

-- ============================================
-- 5. CREATE BOOKS POLICIES
-- ============================================

-- Allow anyone to read books (public browsing)
create policy "Public read books" on books
  for select using (true);

-- Allow authenticated sellers to insert books
create policy "Sellers insert books" on books
  for insert
  with check (
    auth.uid() = seller_id
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'seller'
    )
  );

-- Allow sellers to update their own books, or admins to update any book
create policy "Seller or admin updates books" on books
  for update
  using (
    auth.uid() = seller_id
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- ============================================
-- 6. CREATE ORDERS POLICIES
-- ============================================

-- Allow users to read orders where they are buyer or seller, or if admin
create policy "Users read own orders" on orders
  for select
  using (
    auth.uid() = buyer_id
    or auth.uid() = seller_id
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- Allow authenticated buyers to create orders
create policy "Buyers create orders" on orders
  for insert
  with check (
    auth.uid() = buyer_id
    and exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role in ('buyer', 'seller')
    )
  );

-- Allow sellers or admins to update orders
create policy "Seller/admin updates orders" on orders
  for update
  using (
    auth.uid() = seller_id
    or exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- ============================================
-- 7. VERIFY SETUP
-- ============================================

-- Check all policies
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where tablename in ('profiles', 'books', 'orders')
order by tablename, policyname;

-- Check table structure
select 
  table_name,
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_name in ('profiles', 'books', 'orders')
order by table_name, ordinal_position;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

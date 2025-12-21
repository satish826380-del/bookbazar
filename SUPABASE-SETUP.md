# 📚 Book Loop - Supabase Setup Guide

This guide will help you set up Supabase for the Book Loop application from scratch.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in the details:
   - **Project Name**: `book-loop` (or any name you prefer)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose the closest region to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be ready

---

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Go to **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

---

### Step 3: Configure Environment Variables

1. In your project root (`c:\Users\s\Desktop\book-loop`), create or update the `.env.local` file:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase URL and anon key
3. **Save the file**

---

### Step 4: Set Up the Database

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **"New query"**
3. Open the `database-setup.sql` file from this project
4. **Copy all the SQL code** from that file
5. **Paste it** into the Supabase SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. You should see a success message and a table showing all the policies created

---

### Step 5: Verify the Setup

1. In Supabase, go to **Table Editor** in the sidebar
2. You should see three tables:
   - ✅ **profiles** - User profiles
   - ✅ **books** - Book listings
   - ✅ **orders** - Order records

3. Click on each table to verify the columns are created correctly

---

### Step 6: Test the Application

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8080 in your browser

3. Try to **Sign Up** with a new account:
   - The app should create a user in Supabase Auth
   - A profile should be automatically created in the `profiles` table

4. If you're a **seller**, try listing a book
5. If you're a **buyer**, try browsing books

---

## 🗂️ Database Schema Overview

### **profiles** table
Stores user information and roles.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | User ID (references auth.users) |
| `email` | text | User email |
| `name` | text | User's display name |
| `role` | text | `buyer`, `seller`, or `admin` |
| `phone` | text | Contact number |
| `created_at` | timestamp | Account creation time |

### **books** table
Stores book listings from sellers.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique book ID |
| `seller_id` | uuid | References profiles(id) |
| `seller_name` | text | Seller's name |
| `title` | text | Book title |
| `author` | text | Book author |
| `category` | text | Book category |
| `price` | numeric | Book price |
| `condition` | text | Book condition |
| `image_url` | text | Book cover image |
| `pickup_address` | text | Pickup location |
| `phone` | text | Contact number |
| `status` | text | `pending`, `approved`, `rejected`, `sold` |
| `created_at` | timestamp | Listing creation time |

### **orders** table
Stores order/purchase records.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Unique order ID |
| `book_id` | uuid | References books(id) |
| `book_title` | text | Book title (snapshot) |
| `book_image` | text | Book image (snapshot) |
| `book_price` | numeric | Book price (snapshot) |
| `buyer_id` | uuid | References profiles(id) |
| `buyer_name` | text | Buyer's name |
| `seller_id` | uuid | References profiles(id) |
| `seller_name` | text | Seller's name |
| `delivery_address` | text | Delivery address |
| `phone` | text | Contact number |
| `delivery_charge` | numeric | Delivery fee |
| `status` | text | `requested`, `approved`, `picked-up`, `delivered`, `cancelled` |
| `payment_mode` | text | Payment method (default: `cod`) |
| `created_at` | timestamp | Order creation time |

---

## 🔒 Security (Row Level Security)

All tables have **Row Level Security (RLS)** enabled with the following policies:

### Profiles
- ✅ Anyone can **read** profiles (to display seller info)
- ✅ Users can **insert** their own profile during signup
- ✅ Users can **update** their own profile

### Books
- ✅ Anyone can **read** books (public browsing)
- ✅ Sellers can **insert** books (must have seller role)
- ✅ Sellers can **update** their own books
- ✅ Admins can **update** any book

### Orders
- ✅ Users can **read** orders where they are buyer or seller
- ✅ Admins can **read** all orders
- ✅ Buyers can **create** orders
- ✅ Sellers and admins can **update** orders

---

## 🛠️ Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure your `.env.local` file exists and has the correct values. Restart the dev server after creating/updating the file.

### Issue: "User can't insert books"
**Solution**: Make sure the user's `role` in the `profiles` table is set to `seller`. You can update this manually in Supabase Table Editor.

### Issue: "Profile not created after signup"
**Solution**: Check if there's a database trigger or if the profile creation logic is in your signup code. You may need to manually create the profile after signup.

---

## 📝 Next Steps

After setup is complete:

1. ✅ Test user signup/login
2. ✅ Test book listing (as seller)
3. ✅ Test book browsing (as buyer)
4. ✅ Test order creation
5. ✅ Customize the app as needed

---

## 🆘 Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Check the `database-setup.sql` file for the complete schema

---

**Happy coding! 🚀**

# 📚 Book Loop

A modern book marketplace where users can buy and sell used books locally.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with Supabase
- 📖 **Book Listings** - Sellers can list books with details, images, and pricing
- 🛒 **Book Browsing** - Buyers can browse and search for books
- 📦 **Order Management** - Track orders from request to delivery
- 👤 **User Profiles** - Manage your account and view your listings/orders
- 🎨 **Modern UI** - Built with React, TypeScript, and Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A Supabase account ([sign up free](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd book-loop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Follow the detailed guide in [`SUPABASE-SETUP.md`](./SUPABASE-SETUP.md)
   
   Quick version:
   - Create a Supabase project
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase URL and anon key
   - Run the SQL from `database-setup.sql` in Supabase SQL Editor

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod

## 📁 Project Structure

```
book-loop/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and configurations
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── database-setup.sql  # Supabase database schema
├── SUPABASE-SETUP.md   # Detailed Supabase setup guide
└── .env.local.example  # Environment variables template
```

## 🗄️ Database Schema

The app uses three main tables:

- **profiles** - User information and roles (buyer/seller/admin)
- **books** - Book listings with details and status
- **orders** - Order records with delivery tracking

See [`database-setup.sql`](./database-setup.sql) for the complete schema and RLS policies.

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Role-based access control (buyer, seller, admin)
- Protected API routes

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

- Check [`SUPABASE-SETUP.md`](./SUPABASE-SETUP.md) for setup help
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)

---

**Built with ❤️ using React, TypeScript, and Supabase**
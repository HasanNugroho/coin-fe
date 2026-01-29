# DompetKu - Smart Personal Finance

A production-ready personal finance application built with React 19, TypeScript, and modern web technologies.

## Features

✅ **Authentication System**
- Login/Register with JWT simulation
- Protected routes
- Token refresh mechanism

✅ **Kantong System (Core Feature)**
- Create and manage multiple pockets/kantongs
- Categorize by: Daily Needs, Bills, Lifestyle, Emergency, Savings, Investment
- Lock/unlock kantongs
- Visual color coding
- Balance tracking per kantong

✅ **Transaction Management**
- Add, edit, delete transactions
- Income and expense tracking
- Category-based organization
- Kantong-based allocation
- Transaction filtering

✅ **Dashboard**
- Total balance overview
- Free cash display
- Income vs Expense charts
- Balance per kantong visualization
- Monthly trends

✅ **Reports & Analytics**
- Expense by category (pie chart)
- Expense by kantong (bar chart)
- Monthly summary with detailed tables
- Interactive charts with Recharts

## Tech Stack

- **React 19** - Latest React with client-side rendering
- **TypeScript** - Strict type checking
- **Vite** - Fast build tool
- **React Router DOM v7** - Routing
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client (for future backend integration)
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible UI primitives
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Login Credentials

Use these demo credentials to login:

- **Email**: `demo@coin.app`
- **Password**: `demo123`

Or create a new account via the Register page.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Radix-based UI components (Button, Input, Dialog, etc.)
│   ├── layout/          # Layout components (Navbar, Layout)
│   ├── charts/          # Chart components (IncomeExpenseChart, KantongBalanceChart)
│   └── common/          # Shared components (KantongCard, TransactionDialog, etc.)
├── pages/
│   ├── auth/            # Login & Register pages
│   ├── dashboard/       # Dashboard page
│   ├── kantong/         # Kantong management page
│   ├── transactions/    # Transaction management page
│   └── reports/         # Reports & analytics page
├── services/
│   ├── api.ts           # Axios instance with interceptors
│   ├── auth.service.ts  # Authentication API (dummy)
│   ├── kantong.service.ts    # Kantong CRUD API (dummy)
│   ├── transaction.service.ts # Transaction CRUD API (dummy)
│   └── report.service.ts      # Reports API (dummy)
├── store/
│   ├── auth.store.ts    # Authentication state (Zustand)
│   └── finance.store.ts # Finance data state (Zustand)
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   ├── cn.ts            # Tailwind class merger
│   └── format.ts        # Currency and date formatters
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Architecture Principles

✅ **Clean Separation of Concerns**
- Services handle all data fetching (with dummy APIs)
- Stores manage application state
- Components only handle rendering and user interaction
- No business logic in UI components

✅ **Predictable State Management**
- Zustand for global state (auth, finance data)
- React Hook Form for form state
- No prop drilling

✅ **Type Safety**
- Strict TypeScript configuration
- Comprehensive type definitions
- Zod schemas for runtime validation

✅ **Scalability**
- Ready for real backend integration
- Service layer abstracts API calls
- Easy to swap dummy services with real HTTP calls

## Key Concepts

### Kantong System

Money must live in a **Kantong** (pocket). This is inspired by Bank Jago's pocket system.

**Rules:**
- **Main kantong** = free cash for daily use
- **Saving kantong** = locked (cannot be used for expenses)
- **Allocation kantong** = budgeted money
- Expenses cannot exceed kantong balance
- Income always goes to main kantong

### Transaction Flow

1. **Income**: Always credited to main kantong
2. **Expense**: Must select a kantong (locked kantongs unavailable)
3. **Balance**: Updated per kantong, not globally

## Dummy Data

All data is simulated via service layer with `setTimeout` to mimic API latency:

- Authentication responses (tokens, user data)
- Kantong list with sample pockets
- Transaction history
- Dashboard statistics
- Report analytics

**No hardcoded data in components** - everything comes from services.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Future Enhancements

- [ ] Connect to real backend API
- [ ] Add budget tracking
- [ ] Recurring transactions
- [ ] Export reports to PDF/CSV
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Mobile app (React Native)

## License

MIT

---

**Built with ❤️ as a greenfield project showcasing clean architecture and modern React patterns.**

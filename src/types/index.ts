export type KantongCategory =
    | 'Daily Needs'
    | 'Bills'
    | 'Lifestyle'
    | 'Emergency'
    | 'Savings'
    | 'Investment'
    | 'Custom';

export type KantongType = 'main' | 'allocation' | 'saving';

export interface Kantong {
    id: string;
    name: string;
    category: KantongCategory;
    type: KantongType;
    balance: number;
    isLocked: boolean;
    color?: string;
}

export type TransactionCategory =
    | 'Food'
    | 'Transport'
    | 'Shopping'
    | 'Salary'
    | 'Freelance'
    | 'Bills'
    | 'Entertainment'
    | 'Custom';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string;
    category: TransactionCategory;
    kantongId: string;
    note?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role?: 'user' | 'admin';
}

export interface UserProfile {
    id: string;
    email: string;
    phone?: string;
    telegramId?: string;
    baseSalary?: number;
    salaryCycle: 'monthly' | 'weekly' | 'bi-weekly';
    salaryDay: number;
    currency: string;
    role: 'user' | 'admin';
}

export interface AdminUser {
    id: string;
    email: string;
    phone?: string;
    role: string;
    status: 'active' | 'disabled';
    createdAt: string;
}

export interface Category {
    id: string;
    name: string;
    type: 'transaction' | 'kantong';
    isDefault: boolean;
}

export interface DefaultKantongTemplate {
    id: string;
    name: string;
    category: KantongCategory;
    initialBalance?: number;
    isLocked: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface DashboardStats {
    totalBalance: number;
    freeCash: number;
    totalIncome: number;
    totalExpense: number;
    monthlyData: {
        month: string;
        income: number;
        expense: number;
    }[];
    kantongBalances: {
        name: string;
        balance: number;
        color: string;
    }[];
}

export interface ReportData {
    expenseByCategory: {
        category: string;
        amount: number;
    }[];
    expenseByKantong: {
        kantong: string;
        amount: number;
    }[];
    monthlySummary: {
        month: string;
        income: number;
        expense: number;
        balance: number;
    }[];
}

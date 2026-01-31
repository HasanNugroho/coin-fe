export type KantongType = 'main' | 'allocation' | 'saving' | 'debt' | 'system';

export interface Kantong {
    id: string;
    user_id: string;
    name: string;
    type: KantongType;
    category_id?: string | null;
    balance: number;
    is_default: boolean;
    is_active: boolean;
    is_locked: boolean;
    icon?: string | null;
    icon_color?: string | null;
    background_color?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
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

export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionSource = 'manual' | 'bot' | 'llm';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string;
    category: TransactionCategory;
    kantongId: string;
    platformId?: string;
    source?: TransactionSource;
    note?: string;
    linkedTransactionId?: string;
    liabilityId?: string;
}

export type PlatformType = 'bank' | 'ewallet' | 'cash' | 'credit';

export interface Platform {
    id: string;
    name: string;
    type: PlatformType;
    isSystem: boolean;
}

export interface AllocationRule {
    id: string;
    targetKantongId: string;
    priority: 'high' | 'medium' | 'low';
    type: 'percentage' | 'nominal';
    value: number;
    isActive: boolean;
}

export interface Liability {
    id: string;
    name: string;
    type: 'credit' | 'installment' | 'paylater';
    totalAmount: number;
    paidAmount: number;
    dueDate: string;
    note?: string;
}

export interface SavingTarget {
    id: string;
    name: string;
    kantongId: string;
    targetAmount: number;
    deadline: string;
    note?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    telegramId?: string;
    currency?: string;
    baseSalary?: number;
    salaryCycle?: 'daily' | 'weekly' | 'monthly';
    salaryDay?: number;
    language?: 'id' | 'en';
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    role?: 'user' | 'admin';
}

export interface UserProfile extends User {
    is_active: boolean;
    created_at: string;
    updated_at: string;
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
    type: 'transaction' | 'pocket' | string;
    transaction_type: 'income' | 'expense' | string;
    description?: string;
    icon?: string;
    color?: string;
    is_default: boolean;
    parent_id?: string | null;
    user_id?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface DefaultKantongTemplate {
    id: string;
    name: string;
    category_id?: string;
    initialBalance?: number;
    is_locked: boolean;
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

export type PocketTemplateType = 'main' | 'saving' | 'allocation';

export interface PocketTemplate {
    id: string;
    name: string;
    type: PocketTemplateType;
    category_id: string;
    is_default: boolean;
    is_active: boolean;
    order: number;
    icon?: string;
    icon_color?: string;
    background_color?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CreatePocketTemplateRequest {
    name: string;
    type: PocketTemplateType;
    category_id: string;
    is_default?: boolean;
    is_active?: boolean;
    order?: number;
    icon?: string;
    icon_color?: string;
    background_color?: string;
}

export interface UpdatePocketTemplateRequest {
    name?: string;
    type?: PocketTemplateType;
    category_id?: string;
    is_default?: boolean;
    is_active?: boolean;
    order?: number;
    icon?: string;
    icon_color?: string;
    background_color?: string;
}

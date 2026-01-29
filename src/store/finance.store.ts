import { create } from 'zustand';
import type { Kantong, Transaction, DashboardStats, ReportData } from '../types';
import { kantongService } from '../services/kantong.service';
import { transactionService } from '../services/transaction.service';
import { reportService } from '../services/report.service';

interface FinanceState {
    kantongs: Kantong[];
    transactions: Transaction[];
    dashboardStats: DashboardStats | null;
    reportData: ReportData | null;
    isLoading: boolean;
    error: string | null;

    fetchKantongs: () => Promise<void>;
    createKantong: (kantong: Omit<Kantong, 'id'>) => Promise<void>;
    updateKantong: (id: string, updates: Partial<Kantong>) => Promise<void>;
    deleteKantong: (id: string) => Promise<void>;

    fetchTransactions: (filters?: {
        startDate?: string;
        endDate?: string;
        category?: string;
        kantongId?: string;
        type?: string;
    }) => Promise<void>;
    createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    fetchDashboardStats: (month?: string, year?: string) => Promise<void>;
    fetchReportData: (startDate: string, endDate: string) => Promise<void>;

    clearError: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    kantongs: [],
    transactions: [],
    dashboardStats: null,
    reportData: null,
    isLoading: false,
    error: null,

    fetchKantongs: async () => {
        set({ isLoading: true, error: null });
        try {
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch kantongs',
                isLoading: false,
            });
        }
    },

    createKantong: async (kantong) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.create(kantong);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    updateKantong: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.update(id, updates);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteKantong: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await kantongService.delete(id);
            const kantongs = await kantongService.getAll();
            set({ kantongs, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete kantong',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchTransactions: async (filters) => {
        set({ isLoading: true, error: null });
        try {
            const transactions = await transactionService.getAll(filters);
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch transactions',
                isLoading: false,
            });
        }
    },

    createTransaction: async (transaction) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.create(transaction);
            const transactions = await transactionService.getAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    updateTransaction: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.update(id, updates);
            const transactions = await transactionService.getAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteTransaction: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await transactionService.delete(id);
            const transactions = await transactionService.getAll();
            set({ transactions, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete transaction',
                isLoading: false,
            });
            throw error;
        }
    },

    fetchDashboardStats: async (month, year) => {
        set({ isLoading: true, error: null });
        try {
            const dashboardStats = await reportService.getDashboardStats(month, year);
            set({ dashboardStats, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats',
                isLoading: false,
            });
        }
    },

    fetchReportData: async (startDate, endDate) => {
        set({ isLoading: true, error: null });
        try {
            const reportData = await reportService.getReportData(startDate, endDate);
            set({ reportData, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch report data',
                isLoading: false,
            });
        }
    },

    clearError: () => set({ error: null }),
}));

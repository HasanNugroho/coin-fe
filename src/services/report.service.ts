import type { DashboardStats, ReportData } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
    async getDashboardStats(_month?: string, _year?: string): Promise<DashboardStats> {
        await delay(700);

        return {
            totalBalance: 36670000,
            freeCash: 5420000,
            totalIncome: 18000000,
            totalExpense: 2900000,
            monthlyData: [
                { month: 'Sep', income: 15000000, expense: 3200000 },
                { month: 'Oct', income: 15500000, expense: 2800000 },
                { month: 'Nov', income: 16000000, expense: 3500000 },
                { month: 'Dec', income: 17000000, expense: 2700000 },
                { month: 'Jan', income: 18000000, expense: 2900000 },
            ],
            kantongBalances: [
                { name: 'Main Wallet', balance: 5420000, color: '#3b82f6' },
                { name: 'Monthly Bills', balance: 2500000, color: '#ef4444' },
                { name: 'Emergency Fund', balance: 10000000, color: '#f59e0b' },
                { name: 'Vacation Savings', balance: 3750000, color: '#8b5cf6' },
                { name: 'Investment Fund', balance: 15000000, color: '#10b981' },
            ],
        };
    },

    async getReportData(_startDate: string, _endDate: string): Promise<ReportData> {
        await delay(700);

        return {
            expenseByCategory: [
                { category: 'Food', amount: 1500000 },
                { category: 'Transport', amount: 750000 },
                { category: 'Shopping', amount: 2000000 },
                { category: 'Bills', amount: 1200000 },
                { category: 'Entertainment', amount: 800000 },
            ],
            expenseByKantong: [
                { kantong: 'Main Wallet', amount: 4250000 },
                { kantong: 'Monthly Bills', amount: 1200000 },
                { kantong: 'Vacation Savings', amount: 800000 },
            ],
            monthlySummary: [
                { month: 'Sep 2025', income: 15000000, expense: 3200000, balance: 11800000 },
                { month: 'Oct 2025', income: 15500000, expense: 2800000, balance: 12700000 },
                { month: 'Nov 2025', income: 16000000, expense: 3500000, balance: 12500000 },
                { month: 'Dec 2025', income: 17000000, expense: 2700000, balance: 14300000 },
                { month: 'Jan 2026', income: 18000000, expense: 2900000, balance: 15100000 },
            ],
        };
    },
};

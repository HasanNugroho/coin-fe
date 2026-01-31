import { api } from './api';
import type { Transaction, CreateTransactionRequest, UpdateTransactionRequest } from '../types';
import { handleApiError } from '../utils/error-handler';

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export const transactionService = {
    async listAll(limit: number = 100, skip: number = 0): Promise<Transaction[]> {
        try {
            const response = await api.get<ApiResponse<Transaction[]>>('/v1/transactions', {
                params: { limit, skip },
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            handleApiError(error);
        }
    },

    async listByPocket(pocketId: string, limit: number = 100, skip: number = 0): Promise<Transaction[]> {
        try {
            const response = await api.get<ApiResponse<Transaction[]>>(
                `/v1/transactions/pocket/${pocketId}`,
                { params: { limit, skip } }
            );
            return response.data.data || [];
        } catch (error) {
            console.error(`Failed to fetch transactions for pocket ${pocketId}:`, error);
            handleApiError(error);
        }
    },

    async getById(id: string): Promise<Transaction> {
        try {
            const response = await api.get<ApiResponse<Transaction>>(`/v1/transactions/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to fetch transaction ${id}:`, error);
            handleApiError(error);
        }
    },

    async create(transaction: CreateTransactionRequest): Promise<Transaction> {
        try {
            const response = await api.post<ApiResponse<Transaction>>('/v1/transactions', transaction);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create transaction:', error);
            handleApiError(error);
        }
    },

    async update(id: string, updates: UpdateTransactionRequest): Promise<Transaction> {
        try {
            const response = await api.put<ApiResponse<Transaction>>(`/v1/transactions/${id}`, updates);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to update transaction ${id}:`, error);
            handleApiError(error);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/v1/transactions/${id}`);
        } catch (error) {
            console.error(`Failed to delete transaction ${id}:`, error);
            handleApiError(error);
        }
    },
};

import type { Kantong } from '../types';
import api from './api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const kantongService = {
    async getAll(): Promise<Kantong[]> {
        try {
            const response = await api.get<ApiResponse<Kantong[]>>('/v1/pockets');
            return response.data.data || [];
        } catch (error) {
            throw error instanceof Error ? error : new Error('Failed to fetch kantongs');
        }
    },

    async getById(id: string): Promise<Kantong | null> {
        try {
            const response = await api.get<ApiResponse<Kantong>>(`/v1/pockets/${id}`);
            return response.data.data || null;
        } catch (error) {
            const axiosError = error as { response?: { status: number } };
            if (axiosError?.response?.status === 404) {
                return null;
            }
            throw error instanceof Error ? error : new Error('Failed to fetch kantong');
        }
    },

    async create(kantong: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Kantong> {
        try {
            const response = await api.post<ApiResponse<Kantong>>('/v1/pockets', kantong);
            return response.data.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error('Failed to create kantong');
        }
    },

    async update(id: string, updates: Partial<Kantong>): Promise<Kantong> {
        try {
            const response = await api.put<ApiResponse<Kantong>>(`/v1/pockets/${id}`, updates);
            return response.data.data;
        } catch (error) {
            throw error instanceof Error ? error : new Error('Failed to update kantong');
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/v1/pockets/${id}`);
        } catch (error) {
            throw error instanceof Error ? error : new Error('Failed to delete kantong');
        }
    },
};

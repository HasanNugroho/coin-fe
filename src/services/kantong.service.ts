import type { Kantong } from '../types';
import api from './api';
import { handleApiError } from '../utils/error-handler';

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
            console.error('Failed to fetch kantongs:', error);
            handleApiError(error);
        }
    },

    async getById(id: string): Promise<Kantong | null> {
        try {
            const response = await api.get<ApiResponse<Kantong>>(`/v1/pockets/${id}`);
            return response.data.data || null;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axiosError = error as any;
            if (axiosError?.response?.status === 404) {
                return null;
            }
            console.error(`Failed to fetch kantong ${id}:`, error);
            handleApiError(error);
        }
    },

    async create(kantong: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<Kantong> {
        try {
            const response = await api.post<ApiResponse<Kantong>>('/v1/pockets', kantong);
            return response.data.data;
        } catch (error) {
            console.error('Failed to create kantong:', error);
            handleApiError(error);
        }
    },

    async update(id: string, updates: Partial<Kantong>): Promise<Kantong> {
        try {
            const response = await api.put<ApiResponse<Kantong>>(`/v1/pockets/${id}`, updates);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to update kantong ${id}:`, error);
            handleApiError(error);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(`/v1/pockets/${id}`);
        } catch (error) {
            console.error(`Failed to delete kantong ${id}:`, error);
            handleApiError(error);
        }
    },
};

import api from './api';
import type { AdminPlatform, CreateAdminPlatformRequest, UpdateAdminPlatformRequest } from '../types';

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface ListResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T[];
}

export const adminPlatformService = {
    async listPlatforms(limit = 100, skip = 0): Promise<AdminPlatform[]> {
        const response = await api.get<ListResponse<AdminPlatform>>(
            `/v1/platforms?limit=${limit}&skip=${skip}`
        );
        return response.data.data;
    },

    async getPlatformById(id: string): Promise<AdminPlatform> {
        const response = await api.get<ApiResponse<AdminPlatform>>(
            `/v1/platforms/${id}`
        );
        return response.data.data;
    },

    async createPlatform(payload: CreateAdminPlatformRequest): Promise<AdminPlatform> {
        const response = await api.post<ApiResponse<AdminPlatform>>(
            '/v1/platforms/admin',
            payload
        );
        return response.data.data;
    },

    async updatePlatform(id: string, payload: UpdateAdminPlatformRequest): Promise<AdminPlatform> {
        const response = await api.put<ApiResponse<AdminPlatform>>(
            `/v1/platforms/admin/${id}`,
            payload
        );
        return response.data.data;
    },

    async deletePlatform(id: string): Promise<void> {
        await api.delete(`/v1/platforms/admin/${id}`);
    },
};

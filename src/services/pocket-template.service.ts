import api from './api';
import type { PocketTemplate, CreatePocketTemplateRequest, UpdatePocketTemplateRequest } from '../types';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const pocketTemplateService = {
    async createPocketTemplate(data: CreatePocketTemplateRequest): Promise<PocketTemplate> {
        try {
            const response = await api.post<ApiResponse<PocketTemplate>>(
                '/v1/pocket-templates',
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to create pocket template:', error);
            throw error;
        }
    },

    async getPocketTemplateById(id: string): Promise<PocketTemplate> {
        try {
            const response = await api.get<ApiResponse<PocketTemplate>>(
                `/v1/pocket-templates/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to get pocket template:', error);
            throw error;
        }
    },

    async updatePocketTemplate(id: string, data: UpdatePocketTemplateRequest): Promise<PocketTemplate> {
        try {
            const response = await api.put<ApiResponse<PocketTemplate>>(
                `/v1/pocket-templates/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to update pocket template:', error);
            throw error;
        }
    },

    async deletePocketTemplate(id: string): Promise<void> {
        try {
            await api.delete(`/v1/pocket-templates/${id}`);
        } catch (error) {
            console.error('Failed to delete pocket template:', error);
            throw error;
        }
    },

    async listPocketTemplates(limit: number = 10, skip: number = 0): Promise<PocketTemplate[]> {
        try {
            const response = await api.get<ApiResponse<PocketTemplate[]>>(
                '/v1/pocket-templates',
                {
                    params: { limit, skip },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch pocket templates:', error);
            throw error;
        }
    },

    async listActivePocketTemplates(limit: number = 10, skip: number = 0): Promise<PocketTemplate[]> {
        try {
            const response = await api.get<ApiResponse<PocketTemplate[]>>(
                '/v1/pocket-templates/active',
                {
                    params: { limit, skip },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch active pocket templates:', error);
            throw error;
        }
    },

    async listPocketTemplatesByType(
        type: 'main' | 'saving' | 'allocation',
        limit: number = 10,
        skip: number = 0
    ): Promise<PocketTemplate[]> {
        try {
            const response = await api.get<ApiResponse<PocketTemplate[]>>(
                `/v1/pocket-templates/type/${type}`,
                {
                    params: { limit, skip },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch pocket templates by type:', error);
            throw error;
        }
    },
};

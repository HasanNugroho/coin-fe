import api from './api';
import type { Category } from '../types';

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface CreateCategoryRequest {
    name: string;
    type: 'transaction' | 'pocket';
    is_default?: boolean;
    parent_id?: string;
    transaction_type?: 'income' | 'expense' | string;
    description?: string;
    icon?: string;
    color?: string;
}

interface UpdateCategoryRequest {
    name?: string;
    type?: 'transaction' | 'pocket';
    is_default?: boolean;
    parent_id?: string;
    transaction_type?: 'income' | 'expense' | string;
    description?: string;
    icon?: string;
    color?: string;
}

export const categoryService = {
    async createCategory(data: CreateCategoryRequest): Promise<Category> {
        try {
            const response = await api.post<ApiResponse<Category>>(
                '/v1/categories',
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to create category:', error);
            throw error;
        }
    },

    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const response = await api.get<ApiResponse<Category>>(
                `/v1/categories/${id}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to get category:', error);
            return null;
        }
    },

    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
        try {
            const response = await api.put<ApiResponse<Category>>(
                `/v1/categories/${id}`,
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to update category:', error);
            throw error;
        }
    },

    async deleteCategory(id: string): Promise<void> {
        try {
            await api.delete(`/v1/categories/${id}`);
        } catch (error) {
            console.error('Failed to delete category:', error);
            throw error;
        }
    },

    async listCategories(limit: number = 100, skip: number = 0): Promise<Category[]> {
        try {
            const response = await api.get<ApiResponse<Category[]>>(
                '/v1/categories',
                {
                    params: { limit, skip },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            return [];
        }
    },

    async listCategoriesByType(
        type: 'transaction' | 'pocket',
        limit: number = 100,
        skip: number = 0
    ): Promise<Category[]> {
        try {
            const response = await api.get<ApiResponse<Category[]>>(
                `/v1/categories/type/${type}`,
                {
                    params: { limit, skip },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch categories by type:', error);
            return [];
        }
    },

    async listSubcategories(parentId: string): Promise<Category[]> {
        try {
            const response = await api.get<ApiResponse<Category[]>>(
                `/v1/categories/subcategories/${parentId}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            return [];
        }
    },
};

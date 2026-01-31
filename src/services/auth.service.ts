import type { AuthResponse, LoginRequest, RegisterRequest, User, UserProfile } from '../types';
import api from './api';
import { handleApiError } from '../utils/error-handler';

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

interface LoginResponse {
    user: User;
    token_pair: {
        access_token: string;
        refresh_token: string;
    };
}

interface RefreshTokenResponse {
    access_token: string;
}

interface ValidateTokenResponse {
    valid: boolean;
    user_id: string;
}

interface ListUsersResponse {
    users?: User[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await api.post<ApiResponse<LoginResponse>>(
                '/v1/auth/login',
                data
            );

            const { user, token_pair } = response.data.data;
            return {
                user: {
                    ...user,
                    role: user.role || 'user',
                },
                tokens: {
                    accessToken: token_pair.access_token,
                    refreshToken: token_pair.refresh_token,
                },
            };
        } catch (error) {
            console.error('Failed to login:', error);
            handleApiError(error);
        }
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await api.post<ApiResponse<{ user: User; token_pair: { access_token: string; refresh_token: string } }>>(
                '/v1/auth/register',
                data
            );

            const { user, token_pair } = response.data.data;
            return {
                user: {
                    ...user,
                    role: user.role || 'user',
                },
                tokens: {
                    accessToken: token_pair.access_token,
                    refreshToken: token_pair.refresh_token,
                },
            };
        } catch (error) {
            console.error('Failed to register:', error);
            handleApiError(error);
        }
    },

    async refresh(refreshToken: string): Promise<AuthResponse> {
        try {
            const response = await api.post<ApiResponse<RefreshTokenResponse>>(
                '/v1/auth/refresh',
                { refresh_token: refreshToken }
            );

            if (response.status !== 200) {
                throw new Error(response.data.message);
            }

            const newAccessToken = response.data.data.access_token;

            const meResponse = await api.get<ApiResponse<UserProfile>>(
                '/v1/auth/me',
                {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                }
            );

            const user = meResponse.data.data;
            return {
                user: {
                    ...user,
                    role: user.role || 'user',
                },
                tokens: {
                    accessToken: newAccessToken,
                    refreshToken: refreshToken,
                },
            };
        } catch (error) {
            console.error('Failed to refresh token:', error);
            handleApiError(error);
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/v1/auth/logout');
        } catch (error) {
            console.error('Failed to logout:', error);
            handleApiError(error);
        }
    },

    async getCurrentUser(): Promise<UserProfile> {
        try {
            const response = await api.get<ApiResponse<UserProfile>>('/v1/auth/me');
            return response.data.data;
        } catch (error) {
            console.error('Failed to get current user:', error);
            handleApiError(error);
        }
    },

    async getProfile(): Promise<UserProfile> {
        try {
            const response = await api.get<ApiResponse<UserProfile>>('/v1/users/profile');
            return response.data.data;
        } catch (error) {
            console.error('Failed to get profile:', error);
            handleApiError(error);
        }
    },

    async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
        try {
            const response = await api.put<ApiResponse<UserProfile>>(
                '/v1/users/profile',
                data
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to update profile:', error);
            handleApiError(error);
        }
    },

    async listUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
        try {
            const response = await api.get<ApiResponse<User[] | ListUsersResponse>>(
                '/v1/users',
                { params: { page, limit } }
            );

            const data = response.data.data as ListUsersResponse | User[];
            const users = Array.isArray(data) ? data : data.users || [];
            const pagination = Array.isArray(data)
                ? { page, limit, total: 0, totalPages: 0 }
                : data.pagination || { page, limit, total: 0, totalPages: 0 };

            return { users, pagination };
        } catch (error) {
            console.error('Failed to list users:', error);
            handleApiError(error);
        }
    },

    async getUser(id: string): Promise<User> {
        try {
            const response = await api.get<ApiResponse<User>>(`/v1/users/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to get user ${id}:`, error);
            handleApiError(error);
        }
    },

    async deleteUser(id: string): Promise<void> {
        try {
            await api.delete(`/v1/users/${id}`);
        } catch (error) {
            console.error(`Failed to delete user ${id}:`, error);
            handleApiError(error);
        }
    },

    async disableUser(id: string): Promise<void> {
        try {
            await api.post(`/v1/users/${id}/disable`);
        } catch (error) {
            console.error(`Failed to disable user ${id}:`, error);
            handleApiError(error);
        }
    },

    async enableUser(id: string): Promise<void> {
        try {
            await api.post(`/v1/users/${id}/enable`);
        } catch (error) {
            console.error(`Failed to enable user ${id}:`, error);
            handleApiError(error);
        }
    },

    async validateToken(token: string): Promise<ValidateTokenResponse> {
        try {
            const response = await api.get<ApiResponse<ValidateTokenResponse>>(
                '/v1/auth/validate',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.data;
        } catch (error) {
            console.error('Failed to validate token:', error);
            handleApiError(error);
        }
    },
};

import { create } from 'zustand';
import type { User, AuthTokens } from '../types';
import { authService } from '../services/auth.service';
import { setAuthToken } from '../services/api';

interface AuthState {
    user: User | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login({ email, password });
            setAuthToken(response.tokens.accessToken);
            set({
                user: response.user,
                tokens: response.tokens,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Login failed',
                isLoading: false,
            });
            throw error;
        }
    },

    register: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.register({ email, password, name });
            setAuthToken(response.tokens.accessToken);
            set({
                user: response.user,
                tokens: response.tokens,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Registration failed',
                isLoading: false,
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            await authService.logout();
            setAuthToken(null);
            set({
                user: null,
                tokens: null,
                isAuthenticated: false,
                error: null,
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) return;

        try {
            const response = await authService.refresh(tokens.refreshToken);
            setAuthToken(response.tokens.accessToken);
            set({
                user: response.user,
                tokens: response.tokens,
            });
        } catch (error) {
            set({
                user: null,
                tokens: null,
                isAuthenticated: false,
            });
            setAuthToken(null);
        }
    },

    clearError: () => set({ error: null }),
}));

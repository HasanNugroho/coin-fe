import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, UserProfile } from '../types';
import { authService } from '../services/auth.service';
import { setAuthToken, setRefreshToken } from '../services/api';

const STORAGE_KEY = 'auth-session';

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
    fetchProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    restoreSession: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
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
                    setRefreshToken(response.tokens.refreshToken);
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
                    setRefreshToken(response.tokens.refreshToken);
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
                } catch (error) {
                    console.error('Logout error:', error);
                }
                setAuthToken(null);
                set({
                    user: null,
                    tokens: null,
                    isAuthenticated: false,
                    error: null,
                });
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
                } catch {
                    set({
                        user: null,
                        tokens: null,
                        isAuthenticated: false,
                    });
                    setAuthToken(null);
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const profile = await authService.getCurrentUser();
                    set({
                        user: profile,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to fetch profile',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            updateProfile: async (data: Partial<UserProfile>) => {
                set({ isLoading: true, error: null });
                try {
                    const updatedProfile = await authService.updateProfile(data);
                    set({
                        user: updatedProfile,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to update profile',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            restoreSession: async () => {
                const { tokens } = get();
                if (!tokens?.accessToken) return;

                try {
                    const validation = await authService.validateToken(tokens.accessToken);
                    if (validation.valid) {
                        setAuthToken(tokens.accessToken);
                        setRefreshToken(tokens.refreshToken);
                        set({ isAuthenticated: true });
                    } else {
                        set({
                            user: null,
                            tokens: null,
                            isAuthenticated: false,
                        });
                        setAuthToken(null);
                        setRefreshToken(null);
                    }
                } catch {
                    set({
                        user: null,
                        tokens: null,
                        isAuthenticated: false,
                    });
                    setAuthToken(null);
                    setRefreshToken(null);
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                user: state.user,
                tokens: state.tokens,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

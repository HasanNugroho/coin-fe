import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const DUMMY_USER = {
    id: '1',
    email: 'demo@coin.app',
    name: 'Demo User',
    role: 'admin' as const,
};

const DUMMY_TOKENS = {
    accessToken: 'dummy-access-token-' + Date.now(),
    refreshToken: 'dummy-refresh-token-' + Date.now(),
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
    async login(data: LoginRequest): Promise<AuthResponse> {
        await delay(800);

        if (data.email === 'demo@coin.app' && data.password === 'demo123') {
            return {
                user: DUMMY_USER,
                tokens: DUMMY_TOKENS,
            };
        }

        throw new Error('Invalid credentials');
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        await delay(800);

        return {
            user: {
                id: '1',
                email: data.email,
                name: data.name,
            },
            tokens: DUMMY_TOKENS,
        };
    },

    async refresh(refreshToken: string): Promise<AuthResponse> {
        await delay(500);

        return {
            user: DUMMY_USER,
            tokens: {
                accessToken: 'dummy-access-token-refreshed-' + Date.now(),
                refreshToken: refreshToken,
            },
        };
    },

    async logout(): Promise<void> {
        await delay(300);
    },
};

import { create } from 'zustand';
import type { AdminPlatform, CreateAdminPlatformRequest, UpdateAdminPlatformRequest } from '../types';
import { adminPlatformService } from '../services/admin-platform.service';
import { toast } from 'sonner';

interface AdminPlatformState {
    platforms: AdminPlatform[];
    isLoading: boolean;
    error: string | null;

    fetchPlatforms: () => Promise<void>;
    createPlatform: (payload: CreateAdminPlatformRequest) => Promise<void>;
    updatePlatform: (id: string, payload: UpdateAdminPlatformRequest) => Promise<void>;
    deletePlatform: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useAdminPlatformStore = create<AdminPlatformState>((set) => ({
    platforms: [],
    isLoading: false,
    error: null,

    fetchPlatforms: async () => {
        set({ isLoading: true, error: null });
        try {
            const platforms = await adminPlatformService.listPlatforms();
            set({ platforms, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch platforms';
            set({ error: message, isLoading: false });
            toast.error(message);
        }
    },

    createPlatform: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await adminPlatformService.createPlatform(payload);
            const platforms = await adminPlatformService.listPlatforms();
            set({ platforms, isLoading: false });
            toast.success('Platform created successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create platform';
            set({ error: message, isLoading: false });
            toast.error(message);
            throw error;
        }
    },

    updatePlatform: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            await adminPlatformService.updatePlatform(id, payload);
            const platforms = await adminPlatformService.listPlatforms();
            set({ platforms, isLoading: false });
            toast.success('Platform updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update platform';
            set({ error: message, isLoading: false });
            toast.error(message);
            throw error;
        }
    },

    deletePlatform: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await adminPlatformService.deletePlatform(id);
            const platforms = await adminPlatformService.listPlatforms();
            set({ platforms, isLoading: false });
            toast.success('Platform deleted successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete platform';
            set({ error: message, isLoading: false });
            toast.error(message);
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

import { create } from 'zustand';
import type { UserProfile } from '../types';
import { profileService } from '../services/profile.service';

interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const profile = await profileService.getProfile();
            set({ profile, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch profile',
                isLoading: false,
            });
        }
    },

    updateProfile: async (updates) => {
        set({ isLoading: true, error: null });
        try {
            const profile = await profileService.updateProfile(updates);
            set({ profile, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update profile',
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));

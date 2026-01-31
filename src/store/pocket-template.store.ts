import { create } from 'zustand';
import type { PocketTemplate, CreatePocketTemplateRequest, UpdatePocketTemplateRequest } from '../types';
import { pocketTemplateService } from '../services/pocket-template.service';

interface PocketTemplateState {
    templates: PocketTemplate[];
    activeTemplates: PocketTemplate[];
    currentTemplate: PocketTemplate | null;
    isLoading: boolean;
    error: string | null;

    fetchPocketTemplates: (limit?: number, skip?: number) => Promise<void>;
    fetchActivePocketTemplates: (limit?: number, skip?: number) => Promise<void>;
    fetchPocketTemplatesByType: (type: 'main' | 'saving' | 'allocation', limit?: number, skip?: number) => Promise<void>;
    fetchPocketTemplateById: (id: string) => Promise<void>;
    createPocketTemplate: (data: CreatePocketTemplateRequest) => Promise<void>;
    updatePocketTemplate: (id: string, data: UpdatePocketTemplateRequest) => Promise<void>;
    deletePocketTemplate: (id: string) => Promise<void>;
    clearError: () => void;
    clearCurrentTemplate: () => void;
}

export const usePocketTemplateStore = create<PocketTemplateState>((set) => ({
    templates: [],
    activeTemplates: [],
    currentTemplate: null,
    isLoading: false,
    error: null,

    fetchPocketTemplates: async (limit = 10, skip = 0) => {
        set({ isLoading: true, error: null });
        try {
            const templates = await pocketTemplateService.listPocketTemplates(limit, skip);
            set({ templates, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pocket templates';
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },

    fetchActivePocketTemplates: async (limit = 10, skip = 0) => {
        set({ isLoading: true, error: null });
        try {
            const activeTemplates = await pocketTemplateService.listActivePocketTemplates(limit, skip);
            set({ activeTemplates, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch active pocket templates';
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },

    fetchPocketTemplatesByType: async (type, limit = 10, skip = 0) => {
        set({ isLoading: true, error: null });
        try {
            const templates = await pocketTemplateService.listPocketTemplatesByType(type, limit, skip);
            set({ templates, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pocket templates by type';
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },

    fetchPocketTemplateById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const currentTemplate = await pocketTemplateService.getPocketTemplateById(id);
            set({ currentTemplate, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pocket template';
            set({
                error: errorMessage,
                isLoading: false,
            });
        }
    },

    createPocketTemplate: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newTemplate = await pocketTemplateService.createPocketTemplate(data);
            set((state) => ({
                templates: [...state.templates, newTemplate],
                isLoading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create pocket template';
            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    updatePocketTemplate: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedTemplate = await pocketTemplateService.updatePocketTemplate(id, data);
            set((state) => ({
                templates: state.templates.map((t) => (t.id === id ? updatedTemplate : t)),
                currentTemplate: state.currentTemplate?.id === id ? updatedTemplate : state.currentTemplate,
                isLoading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update pocket template';
            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    deletePocketTemplate: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await pocketTemplateService.deletePocketTemplate(id);
            set((state) => ({
                templates: state.templates.filter((t) => t.id !== id),
                currentTemplate: state.currentTemplate?.id === id ? null : state.currentTemplate,
                isLoading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete pocket template';
            set({
                error: errorMessage,
                isLoading: false,
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
    clearCurrentTemplate: () => set({ currentTemplate: null }),
}));

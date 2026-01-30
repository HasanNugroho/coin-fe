import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Language = 'id' | 'en';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'id',
            setLanguage: (lang: Language) => set({ language: lang }),
            toggleLanguage: () =>
                set((state) => ({
                    language: state.language === 'id' ? 'en' : 'id',
                })),
        }),
        {
            name: 'language-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

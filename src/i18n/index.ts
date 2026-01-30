import type { Language } from '../store/language.store';
import idTranslations from './id.json';
import enTranslations from './en.json';

type TranslationKeys = typeof idTranslations;

const translations: Record<Language, TranslationKeys> = {
    id: idTranslations,
    en: enTranslations,
};

export function getTranslation(language: Language): TranslationKeys {
    return translations[language] || translations.id;
}

export function t(language: Language, key: string, defaultValue?: string): string {
    const translation = getTranslation(language);
    const keys = key.split('.');
    let value: unknown = translation;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, unknown>)[k];
        } else {
            return defaultValue || key;
        }
    }

    return typeof value === 'string' ? value : defaultValue || key;
}

export { idTranslations, enTranslations };

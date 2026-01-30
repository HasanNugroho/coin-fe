import { useLanguageStore } from '../../store/language.store';
import { Button } from '../ui/button';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore();

    return (
        <div className="flex gap-2">
            <Button
                variant={language === 'id' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('id')}
                className="text-xs"
            >
                🇮🇩 ID
            </Button>
            <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="text-xs"
            >
                🇬🇧 EN
            </Button>
        </div>
    );
}

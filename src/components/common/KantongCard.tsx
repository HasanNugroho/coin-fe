import { Lock, Unlock } from 'lucide-react';
import type { Kantong } from '../../types';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '../../utils/format';
import * as LucideIcons from 'lucide-react';

interface KantongCardProps {
    kantong: Kantong;
    onClick?: () => void;
}

export function KantongCard({ kantong, onClick }: KantongCardProps) {
    const { language } = useLanguageStore();
    const isInactive = !kantong.is_active;
    const borderColor = kantong.background_color || '#3b82f6';
    const CategoryIcon = kantong.icon && LucideIcons[kantong.icon as keyof typeof LucideIcons];

    return (
        <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${isInactive ? 'opacity-60' : ''}`}
            onClick={onClick}
            style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {CategoryIcon && <CategoryIcon className="h-5 w-5" style={{ color: borderColor }} />}
                    <span>{kantong.name}</span>
                </CardTitle>
                {kantong.is_locked ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                ) : (
                    <Unlock className="h-4 w-4 text-gray-400" />
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-2xl font-bold">{formatCurrency(kantong.balance)}</div>
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${kantong.type === 'main'
                                ? 'bg-blue-100 text-blue-800'
                                : kantong.type === 'saving'
                                    ? 'bg-green-100 text-green-800'
                                    : kantong.type === 'allocation'
                                        ? 'bg-purple-100 text-purple-800'
                                        : kantong.type === 'debt'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {t(language, `kantong.type.${kantong.type}`)}
                    </span>
                    {isInactive && (
                        <span className="text-xs text-gray-500 font-medium">
                            {t(language, 'kantong.inactive')}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
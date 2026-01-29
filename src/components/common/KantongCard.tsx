import { Lock, Unlock } from 'lucide-react';
import type { Kantong } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '../../utils/format';

interface KantongCardProps {
    kantong: Kantong;
    onClick?: () => void;
}

export function KantongCard({ kantong, onClick }: KantongCardProps) {
    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-lg"
            onClick={onClick}
            style={{ borderLeftWidth: '4px', borderLeftColor: kantong.color || '#3b82f6' }}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kantong.name}</CardTitle>
                {kantong.isLocked ? (
                    <Lock className="h-4 w-4 text-gray-400" />
                ) : (
                    <Unlock className="h-4 w-4 text-gray-400" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(kantong.balance)}</div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500">{kantong.category}</p>
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${kantong.type === 'main'
                                ? 'bg-blue-100 text-blue-800'
                                : kantong.type === 'saving'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                            }`}
                    >
                        {kantong.type}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

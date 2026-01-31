import { useState, useMemo } from 'react';
import { X, Lock, Edit2, Plus, ArrowRightLeft, Search, ArrowUp, ArrowDown } from 'lucide-react';
import type { Kantong } from '../../types';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { formatCurrency } from '../../utils/format';
import { KantongDialog } from './KantongDialog';
import { AddMoneyModal } from './AddMoneyModal';
import { TransferMoneyModal } from './TransferMoneyModal';
import * as LucideIcons from 'lucide-react';

// DUMMY DATA - Frontend only, no backend integration yet
const DUMMY_TRANSACTIONS = [
    { id: '1', date: new Date(2025, 0, 28), title: 'Gaji Bulanan', amount: 5000000, description: 'Salary' },
    { id: '2', date: new Date(2025, 0, 25), title: 'Belanja Groceries', amount: -250000, description: 'Supermarket' },
    { id: '3', date: new Date(2025, 0, 20), title: 'Bonus Proyek', amount: 1000000, description: 'Project bonus' },
    { id: '4', date: new Date(2024, 11, 28), title: 'Gaji Bulanan', amount: 5000000, description: 'Salary' },
    { id: '5', date: new Date(2024, 11, 15), title: 'Belanja Online', amount: -500000, description: 'Shopping' },
    { id: '6', date: new Date(2024, 10, 30), title: 'Gaji Bulanan', amount: 5000000, description: 'Salary' },
];

interface Transaction {
    id: string;
    date: Date;
    title: string;
    amount: number;
    description?: string;
}

interface TransactionGroup {
    month: string;
    total: number;
    transactions: Transaction[];
}

interface KantongDetailProps {
    kantong: Kantong;
    onClose: () => void;
    onEdit: (kantong: Kantong) => void;
    allKantongs: Kantong[];
}

export function KantongDetail({ kantong, onClose, onEdit, allKantongs }: KantongDetailProps) {
    const { language } = useLanguageStore();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

    const isMainPocket = kantong.type === 'main';
    const isLocked = kantong.is_locked;
    const isInactive = !kantong.is_active;

    // Filter and sort transactions
    const filteredTransactions = useMemo(() => {
        const filtered = DUMMY_TRANSACTIONS.filter((t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort
        if (sortBy === 'date-desc') {
            filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
        } else if (sortBy === 'date-asc') {
            filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
        } else if (sortBy === 'amount-desc') {
            filtered.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'amount-asc') {
            filtered.sort((a, b) => a.amount - b.amount);
        }

        return filtered;
    }, [searchQuery, sortBy]);

    // Group transactions by month
    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: TransactionGroup } = {};

        filteredTransactions.forEach((transaction) => {
            const monthKey = `${transaction.date.getFullYear()}-${transaction.date.getMonth()}`;
            const monthName = getMonthName(transaction.date, language);

            if (!groups[monthKey]) {
                groups[monthKey] = {
                    month: monthName,
                    total: 0,
                    transactions: [],
                };
            }

            groups[monthKey].transactions.push(transaction);
            groups[monthKey].total += transaction.amount;
        });

        return Object.values(groups).sort((a, b) => {
            const aDate = a.transactions[0]?.date || new Date();
            const bDate = b.transactions[0]?.date || new Date();
            return bDate.getTime() - aDate.getTime();
        });
    }, [filteredTransactions, language]);

    const handleEditSubmit = async (data: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
        onEdit({ ...kantong, ...data });
        setIsEditMode(false);
    };

    const CategoryIcon = kantong.icon && LucideIcons[kantong.icon as keyof typeof LucideIcons];

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
            <div className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl overflow-y-auto bg-white shadow-lg">
                {/* Header */}
                <div className="sticky top-0 border-b bg-white p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                                    style={{
                                        backgroundColor: kantong.background_color || '#e0f2fe',
                                        color: kantong.icon_color || '#3b82f6',
                                    }}
                                >
                                    {CategoryIcon ? <CategoryIcon className="h-6 w-6" /> : '💰'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{kantong.name}</h2>
                                    <p className="text-sm text-gray-500">{t(language, `kantong.type.${kantong.type}`)}</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="border-b p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">{t(language, 'kantong.balance')}</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(kantong.balance)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">{t(language, 'kantong.category')}</p>
                                <p className="text-sm font-medium text-gray-900">{kantong.category_id || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">{t(language, 'common.status')}</p>
                                <div className="flex items-center gap-2">
                                    {isLocked && <Lock className="h-4 w-4 text-yellow-600" />}
                                    <span
                                        className={`text-sm font-medium ${isInactive
                                            ? 'text-gray-500'
                                            : isLocked
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                            }`}
                                    >
                                        {isInactive
                                            ? t(language, 'kantong.inactive')
                                            : isLocked
                                                ? t(language, 'kantong.isLocked')
                                                : t(language, 'common.active')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isMainPocket && (
                            <div className="rounded-md bg-blue-50 p-3">
                                <p className="text-xs text-blue-800">{t(language, 'kantong.mainPocketInfo')}</p>
                            </div>
                        )}

                        {isLocked && (
                            <div className="rounded-md bg-yellow-50 p-3">
                                <p className="text-xs text-yellow-800">{t(language, 'kantong.lockedPocketInfo')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-b p-6">
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsEditMode(true)}
                            disabled={isMainPocket || isLocked}
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            {t(language, 'kantong.editKantong')}
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={() => setIsAddMoneyOpen(true)}
                            disabled={isInactive}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            {t(language, 'kantong.addMoney')}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setIsTransferOpen(true)}
                            disabled={isInactive}
                        >
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            {t(language, 'kantong.transfer')}
                        </Button>
                    </div>
                </div>

                {/* Transactions Section */}
                <div className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">{t(language, 'transaction.title')}</h3>

                    {/* Search and Sort */}
                    <div className="mb-4 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder={t(language, 'common.search')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('date-desc')}
                                className={`flex items-center gap-1 rounded px-3 py-2 text-sm ${sortBy === 'date-desc'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <ArrowDown className="h-3 w-3" />
                                {t(language, 'kantong.dateDesc')}
                            </button>
                            <button
                                onClick={() => setSortBy('date-asc')}
                                className={`flex items-center gap-1 rounded px-3 py-2 text-sm ${sortBy === 'date-asc'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <ArrowUp className="h-3 w-3" />
                                {t(language, 'kantong.dateAsc')}
                            </button>
                            <button
                                onClick={() => setSortBy('amount-desc')}
                                className={`flex items-center gap-1 rounded px-3 py-2 text-sm ${sortBy === 'amount-desc'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t(language, 'kantong.amountDesc')}
                            </button>
                            <button
                                onClick={() => setSortBy('amount-asc')}
                                className={`flex items-center gap-1 rounded px-3 py-2 text-sm ${sortBy === 'amount-asc'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t(language, 'kantong.amountAsc')}
                            </button>
                        </div>
                    </div>

                    {/* Transactions List */}
                    {groupedTransactions.length === 0 ? (
                        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">{t(language, 'transaction.noTransactions')}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {groupedTransactions.map((group) => (
                                <div key={`${group.transactions[0]?.date.getFullYear()}-${group.transactions[0]?.date.getMonth()}`}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-900">{group.month}</h4>
                                        <span className={`text-sm font-medium ${group.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {group.total >= 0 ? '+' : ''}{formatCurrency(group.total)}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {group.transactions.map((transaction) => (
                                            <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{transaction.title}</p>
                                                    <p className="text-xs text-gray-500">{transaction.date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}</p>
                                                </div>
                                                <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <KantongDialog
                open={isEditMode}
                onOpenChange={setIsEditMode}
                kantong={kantong}
                onSubmit={handleEditSubmit}
            />
            <AddMoneyModal open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen} kantong={kantong} />
            <TransferMoneyModal open={isTransferOpen} onOpenChange={setIsTransferOpen} kantong={kantong} allKantongs={allKantongs} />
        </>
    );
}

function getMonthName(date: Date, language: string): string {
    const now = new Date();
    const isCurrentMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

    if (isCurrentMonth) {
        return language === 'id' ? 'Bulan Ini' : 'This Month';
    }

    const monthNames = language === 'id'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

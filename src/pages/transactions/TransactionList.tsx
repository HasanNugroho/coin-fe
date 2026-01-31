import { useEffect, useState, useMemo, useRef } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Edit, Search } from 'lucide-react';
import { useFinanceStore } from '../../store/finance.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { TransactionDialog } from '../../components/common/TransactionDialog';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Transaction, CreateTransactionRequest } from '../../types';

type SortOption = 'dateDesc' | 'dateAsc' | 'amountDesc' | 'amountAsc';

export function TransactionList() {
    const {
        transactions,
        kantongs,
        fetchTransactions,
        fetchKantongs,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading,
        error,
        selectedPocketId,
        setSelectedPocketId,
    } = useFinanceStore();
    const { language } = useLanguageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('dateDesc');
    const [filterPocketId, setFilterPocketId] = useState<string | null>(selectedPocketId);

    // Use ref to track if initial fetch has been done
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        // Only fetch on mount or when filterPocketId changes
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchTransactions(filterPocketId),
                    fetchKantongs()
                ]);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
        hasFetchedRef.current = true;
    }, [filterPocketId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCreateOrUpdate = async (data: CreateTransactionRequest) => {
        if (selectedTransaction) {
            await updateTransaction(selectedTransaction.id, data);
        } else {
            await createTransaction(data);
        }
        setSelectedTransaction(undefined);
        setIsDialogOpen(false);
    };

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            await deleteTransaction(id);
        }
    };

    const handleNewTransaction = () => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    };

    const getPocketName = (pocketId: string | null) => {
        if (!pocketId) return 'Unknown';
        return kantongs.find((k) => k.id === pocketId)?.name || 'Unknown';
    };

    const getTransactionTypeLabel = (type: string) => {
        const typeMap: Record<string, string> = {
            'INCOME': t(language, 'transaction.types.INCOME'),
            'EXPENSE': t(language, 'transaction.types.EXPENSE'),
            'TRANSFER': t(language, 'transaction.types.TRANSFER'),
            'DEBT_PAYMENT': t(language, 'transaction.types.DEBT_PAYMENT'),
            'WITHDRAW': t(language, 'transaction.types.WITHDRAW'),
        };
        return typeMap[type] || type;
    };

    const getTransactionIcon = (type: string) => {
        const isIncome = type === 'INCOME';
        const bgColor = isIncome ? 'bg-green-100' : 'bg-red-100';
        const iconColor = isIncome ? 'text-green-600' : 'text-red-600';

        return (
            <div className={`rounded-full p-2 ${bgColor}`}>
                {isIncome ? (
                    <ArrowUpCircle className={`h-5 w-5 ${iconColor}`} />
                ) : (
                    <ArrowDownCircle className={`h-5 w-5 ${iconColor}`} />
                )}
            </div>
        );
    };

    const getAmountColor = (type: string) => {
        return type === 'INCOME' ? 'text-green-600' : 'text-red-600';
    };

    const getAmountSign = (type: string) => {
        return type === 'INCOME' ? '+' : '-';
    };

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions];

        result = result.filter((tx) => {
            const matchesSearch =
                !searchQuery ||
                (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (tx.ref && tx.ref.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });

        result.sort((a, b) => {
            switch (sortBy) {
                case 'dateDesc':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'dateAsc':
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                case 'amountDesc':
                    return b.amount - a.amount;
                case 'amountAsc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        return result;
    }, [transactions, searchQuery, sortBy]);

    const groupedTransactions = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {};

        filteredAndSortedTransactions.forEach((tx) => {
            const date = new Date(tx.date);
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const txMonth = date.getMonth();
            const txYear = date.getFullYear();

            let groupKey: string;
            if (txMonth === currentMonth && txYear === currentYear) {
                groupKey = t(language, 'transaction.thisMonth');
            } else {
                groupKey = date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                    month: 'long',
                    year: 'numeric',
                });
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(tx);
        });

        return groups;
    }, [filteredAndSortedTransactions, language]);

    if (isLoading && transactions.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">{t(language, 'common.loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rest of the JSX remains the same */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t(language, 'transaction.title')}</h1>
                    <p className="mt-2 text-gray-600">
                        {language === 'id' ? 'Lacak pendapatan dan pengeluaran Anda' : 'Track your income and expenses'}
                    </p>
                </div>
                <Button onClick={handleNewTransaction}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t(language, 'transaction.addTransaction')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t(language, 'transaction.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-3">
                        <div className="flex-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {t(language, 'common.search')}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t(language, 'transaction.searchByNote')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {t(language, 'transaction.sortBy')}
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="dateDesc">{t(language, 'transaction.dateNewest')}</option>
                                <option value="dateAsc">{t(language, 'transaction.dateOldest')}</option>
                                <option value="amountDesc">{t(language, 'transaction.amountHighest')}</option>
                                <option value="amountAsc">{t(language, 'transaction.amountLowest')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {t(language, 'transaction.filterByPocket')}
                            </label>
                            <select
                                value={filterPocketId || ''}
                                onChange={(e) => {
                                    const value = e.target.value || null;
                                    setFilterPocketId(value);
                                    setSelectedPocketId(value);
                                }}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">{language === 'id' ? 'Semua Kantong' : 'All Pockets'}</option>
                                {kantongs.map((pocket) => (
                                    <option key={pocket.id} value={pocket.id}>
                                        {pocket.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                            {t(language, 'transaction.loadingError')}: {error}
                        </div>
                    )}

                    {filteredAndSortedTransactions.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center">
                            <p className="text-gray-500">
                                {filterPocketId
                                    ? t(language, 'transaction.noTransactionsForPocket')
                                    : t(language, 'transaction.noTransactions')}
                            </p>
                            <Button className="mt-4" onClick={handleNewTransaction}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t(language, 'transaction.addTransaction')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedTransactions).map(([groupName, groupTransactions]) => (
                                <div key={groupName}>
                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">{groupName}</h3>
                                    <div className="space-y-2">
                                        {groupTransactions.map((transaction) => (
                                            <div
                                                key={transaction.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {getTransactionIcon(transaction.type)}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {getTransactionTypeLabel(transaction.type)}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <span>{formatDate(transaction.date)}</span>
                                                            <span>•</span>
                                                            <span>{getPocketName(transaction.pocket_to || transaction.pocket_from)}</span>
                                                        </div>
                                                        {transaction.note && (
                                                            <p className="text-sm text-gray-600">{transaction.note}</p>
                                                        )}
                                                        {transaction.ref && (
                                                            <p className="text-xs text-gray-500">
                                                                {t(language, 'transaction.ref')}: {transaction.ref}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className={`text-lg font-semibold ${getAmountColor(transaction.type)}`}>
                                                        {getAmountSign(transaction.type)}
                                                        {formatCurrency(transaction.amount)}
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(transaction)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(transaction.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <TransactionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                transaction={selectedTransaction}
                onSubmit={handleCreateOrUpdate}
            />
        </div>
    );
}
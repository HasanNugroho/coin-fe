import { useEffect, useState } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Edit } from 'lucide-react';
import { useFinanceStore } from '../../store/finance.store';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { TransactionDialog } from '../../components/common/TransactionDialog';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Transaction } from '../../types';

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
    } = useFinanceStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

    useEffect(() => {
        fetchTransactions();
        fetchKantongs();
    }, [fetchTransactions, fetchKantongs]);

    const handleCreateOrUpdate = async (data: Omit<Transaction, 'id'>) => {
        if (selectedTransaction) {
            await updateTransaction(selectedTransaction.id, data);
        } else {
            await createTransaction(data);
        }
        setSelectedTransaction(undefined);
    };

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    const handleNewTransaction = () => {
        setSelectedTransaction(undefined);
        setIsDialogOpen(true);
    };

    const getKantongName = (kantongId: string) => {
        return kantongs.find((k) => k.id === kantongId)?.name || 'Unknown';
    };

    if (isLoading && transactions.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="mt-2 text-gray-600">Track your income and expenses</p>
                </div>
                <Button onClick={handleNewTransaction}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Transaction
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length === 0 ? (
                        <div className="flex h-32 flex-col items-center justify-center">
                            <p className="text-gray-500">No transactions yet</p>
                            <Button className="mt-4" onClick={handleNewTransaction}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Transaction
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`rounded-full p-2 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? (
                                                <ArrowUpCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <ArrowDownCircle className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.category}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{formatDate(transaction.date)}</span>
                                                <span>•</span>
                                                <span>{getKantongName(transaction.kantongId)}</span>
                                            </div>
                                            {transaction.note && (
                                                <p className="text-sm text-gray-400">{transaction.note}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p
                                            className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}
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

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Transaction, TransactionCategory, TransactionType } from '../../types';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFinanceStore } from '../../store/finance.store';

const transactionSchema = z.object({
    type: z.string(),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    date: z.string(),
    category: z.string(),
    kantongId: z.string(),
    platformId: z.string().optional(),
    source: z.string().optional(),
    note: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction?: Transaction;
    onSubmit: (data: Omit<Transaction, 'id'>) => Promise<void>;
}

const categories: TransactionCategory[] = [
    'Food',
    'Transport',
    'Shopping',
    'Salary',
    'Freelance',
    'Bills',
    'Entertainment',
    'Custom',
];

const types: TransactionType[] = ['income', 'expense', 'transfer'];

export function TransactionDialog({ open, onOpenChange, transaction, onSubmit }: TransactionDialogProps) {
    const { kantongs, platforms, fetchKantongs, fetchPlatforms } = useFinanceStore();

    useEffect(() => {
        if (open) {
            if (kantongs.length === 0) fetchKantongs();
            if (platforms.length === 0) fetchPlatforms();
        }
    }, [open, kantongs.length, platforms.length, fetchKantongs, fetchPlatforms]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: transaction || {
            type: 'expense',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            category: 'Food',
            kantongId: kantongs[0]?.id || '',
            platformId: '',
            source: 'manual',
            note: '',
        },
    });

    const selectedType = watch('type');
    const selectedCategory = watch('category');
    const selectedKantongId = watch('kantongId');

    const availableKantongs = selectedType === 'expense'
        ? kantongs.filter((k) => !k.isLocked)
        : kantongs.filter((k) => k.type === 'main');

    const handleFormSubmit = async (data: TransactionFormData) => {
        await onSubmit(data as Omit<Transaction, 'id'>);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{transaction ? 'Edit Transaction' : 'New Transaction'}</DialogTitle>
                    <DialogDescription>
                        {transaction ? 'Update transaction details' : 'Record a new income or expense'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={selectedType} onValueChange={(value) => setValue('type', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0"
                            {...register('amount', { valueAsNumber: true })}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" {...register('date')} />
                        {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => setValue('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="kantongId">Kantong</Label>
                        <Select
                            value={selectedKantongId}
                            onValueChange={(value) => setValue('kantongId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select kantong" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableKantongs.map((kantong) => (
                                    <SelectItem key={kantong.id} value={kantong.id}>
                                        {kantong.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedType === 'income' && (
                            <p className="text-xs text-gray-500">Income goes to main kantong only</p>
                        )}
                        {selectedType === 'expense' && (
                            <p className="text-xs text-gray-500">Locked kantongs are not available</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="platformId">Platform (Optional)</Label>
                        <Select
                            value={watch('platformId') || ''}
                            onValueChange={(value) => setValue('platformId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((platform) => (
                                    <SelectItem key={platform.id} value={platform.id}>
                                        {platform.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        <Select
                            value={watch('source') || 'manual'}
                            onValueChange={(value) => setValue('source', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manual">Manual</SelectItem>
                                <SelectItem value="bot">Bot</SelectItem>
                                <SelectItem value="llm">LLM</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input id="note" placeholder="Add a note..." {...register('note')} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : transaction ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

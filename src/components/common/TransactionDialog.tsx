import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { Transaction, TransactionType, CreateTransactionRequest, Category } from '../../types';
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
import { t } from '@/i18n';
import { useLanguageStore } from '@/store/language.store';
import { categoryService } from '@/services/category.service';
import { getErrorMessage } from '../../utils/error-handler';

const transactionSchema = z.object({
    type: z.string(),
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    date: z.string(),
    pocket_from: z.string().nullable().optional(),
    pocket_to: z.string().nullable().optional(),
    category_id: z.string().nullable().optional(),
    platform_id: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    ref: z.string().nullable().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction?: Transaction;
    onSubmit: (data: CreateTransactionRequest) => Promise<void>;
}

const types: TransactionType[] = ['INCOME', 'EXPENSE', 'TRANSFER', 'DEBT_PAYMENT', 'WITHDRAW'];

export function TransactionDialog({ open, onOpenChange, transaction, onSubmit }: TransactionDialogProps) {
    const { language } = useLanguageStore();
    const { kantongs, platforms, fetchKantongs, fetchPlatforms } = useFinanceStore();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Combine data fetching into single effect
    useEffect(() => {
        if (!open) return;

        const fetchData = async () => {
            const promises = [];

            if (kantongs.length === 0) promises.push(fetchKantongs());
            if (platforms.length === 0) promises.push(fetchPlatforms());

            // Fetch categories
            setLoadingCategories(true);
            promises.push(
                categoryService.listCategoriesByType('pocket')
                    .then(setCategories)
                    .catch((error) => {
                        console.error('Failed to fetch categories:', error);
                        setCategories([]);
                    })
                    .finally(() => setLoadingCategories(false))
            );

            await Promise.all(promises);
        };

        fetchData();
    }, [open, kantongs.length, platforms.length, fetchKantongs, fetchPlatforms]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: transaction ? {
            type: transaction.type,
            amount: transaction.amount,
            date: transaction.date ? new Date(transaction.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            pocket_from: transaction.pocket_from,
            pocket_to: transaction.pocket_to,
            category_id: transaction.category_id,
            platform_id: transaction.platform_id,
            note: transaction.note,
            ref: transaction.ref,
        } : {
            type: 'EXPENSE',
            amount: 0,
            date: new Date().toISOString().slice(0, 16),
            pocket_from: null,
            pocket_to: null,
            category_id: null,
            platform_id: null,
            note: null,
            ref: null,
        },
    });

    const selectedType = watch('type');
    const selectedCategory = watch('category_id');

    // Memoize filtered kantongs to prevent unnecessary recalculations
    const availableKantongs = useMemo(() => {
        if (selectedType === 'EXPENSE' || selectedType === 'WITHDRAW') {
            return kantongs.filter((k) => !k.is_locked && k.is_active);
        }
        return kantongs.filter((k) => k.type === 'main' && k.is_active);
    }, [kantongs, selectedType]);

    const handleFormSubmit = useCallback(async (data: TransactionFormData) => {
        try {
            const dateObject = new Date(data.date);
            const formattedDate = dateObject.toISOString();
            const submitData: CreateTransactionRequest = {
                type: data.type as TransactionType,
                amount: data.amount,
                date: formattedDate,
                pocket_from: data.pocket_from || null,
                pocket_to: data.pocket_to || null,
                category_id: data.category_id || null,
                platform_id: data.platform_id || null,
                note: data.note || null,
                ref: data.ref || null,
            };
            await onSubmit(submitData);
            toast.success(
                transaction
                    ? t(language, 'messages.updateSuccess')
                    : t(language, 'messages.createSuccess')
            );
            onOpenChange(false);
        } catch (error) {
            const errorMsg = getErrorMessage(
                error,
                transaction
                    ? t(language, 'messages.updateFailed')
                    : t(language, 'messages.createFailed')
            );
            toast.error(errorMsg);
        }
    }, [onSubmit, onOpenChange, transaction, language]);

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
                            step="0.01"
                            placeholder="0"
                            {...register('amount', { valueAsNumber: true })}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">{t(language, 'transaction.date')}</Label>
                        <Input
                            id="date"
                            type="datetime-local"
                            {...register('date')}
                            max={new Date().toISOString().slice(0, 16)}
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                    </div>

                    {(selectedType === 'EXPENSE' || selectedType === 'WITHDRAW' || selectedType === 'DEBT_PAYMENT') && (
                        <div className="space-y-2">
                            <Label htmlFor="pocket_from">From Pocket</Label>
                            <Select
                                value={watch('pocket_from') || ''}
                                onValueChange={(value) => setValue('pocket_from', value || null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pocket" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableKantongs.map((kantong) => (
                                        <SelectItem key={kantong.id} value={kantong.id}>
                                            {kantong.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {(selectedType === 'INCOME' || selectedType === 'TRANSFER') && (
                        <div className="space-y-2">
                            <Label htmlFor="pocket_to">To Pocket</Label>
                            <Select
                                value={watch('pocket_to') || ''}
                                onValueChange={(value) => setValue('pocket_to', value || null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pocket" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableKantongs.map((kantong) => (
                                        <SelectItem key={kantong.id} value={kantong.id}>
                                            {kantong.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedType === 'TRANSFER' && (
                        <div className="space-y-2">
                            <Label htmlFor="pocket_from_transfer">From Pocket</Label>
                            <Select
                                value={watch('pocket_from') || ''}
                                onValueChange={(value) => setValue('pocket_from', value || null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select pocket" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kantongs.filter((k) => !k.is_locked && k.is_active).map((kantong) => (
                                        <SelectItem key={kantong.id} value={kantong.id}>
                                            {kantong.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="category_id">{t(language, 'kantong.category')}</Label>
                        <Select
                            value={selectedCategory || ''}
                            onValueChange={(value) => setValue('category_id', value || null)}
                            disabled={loadingCategories}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={loadingCategories ? t(language, 'common.loading') : t(language, 'transaction.selectCategory')} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="platform_id">Platform (Optional)</Label>
                        <Select
                            value={watch('platform_id') || ''}
                            onValueChange={(value) => setValue('platform_id', value || null)}
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
                        <Label htmlFor="note">Note (Optional)</Label>
                        <Input id="note" placeholder="Add a note..." {...register('note')} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ref">Reference (Optional)</Label>
                        <Input id="ref" placeholder="External reference" {...register('ref')} />
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

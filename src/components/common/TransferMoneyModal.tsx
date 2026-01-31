import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Kantong } from '../../types';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
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

const transferMoneySchema = z.object({
    targetKantongId: z.string().min(1, 'Target pocket is required'),
    amount: z.number().min(1, 'Amount must be greater than 0'),
    description: z.string().optional(),
});

type TransferMoneyFormData = z.infer<typeof transferMoneySchema>;

interface TransferMoneyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kantong: Kantong;
    allKantongs: Kantong[];
}

export function TransferMoneyModal({ open, onOpenChange, kantong, allKantongs }: TransferMoneyModalProps) {
    const { language } = useLanguageStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<TransferMoneyFormData>({
        resolver: zodResolver(transferMoneySchema),
        defaultValues: {
            targetKantongId: '',
            amount: 0,
            description: '',
        },
    });

    const selectedTargetId = watch('targetKantongId');

    // Filter out current kantong from target options
    const availableTargets = allKantongs.filter((k) => k.id !== kantong.id && k.is_active);

    const handleFormSubmit = async (data: TransferMoneyFormData) => {
        setIsSubmitting(true);
        try {
            // DUMMY HANDLER - No backend integration yet
            console.warn('Transfer money from kantong:', kantong.id, 'to:', data.targetKantongId, 'amount:', data.amount);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to transfer money:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset();
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t(language, 'kantong.transfer')}</DialogTitle>
                    <DialogDescription>
                        {t(language, 'kantong.transferFrom')} <span className="font-semibold">{kantong.name}</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="targetKantongId">{t(language, 'kantong.targetPocket')}</Label>
                        <Select
                            value={selectedTargetId}
                            onValueChange={(value) => setValue('targetKantongId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t(language, 'kantong.selectTargetPocket')} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTargets.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">{t(language, 'kantong.noActivePockets')}</div>
                                ) : (
                                    availableTargets.map((target) => (
                                        <SelectItem key={target.id} value={target.id}>
                                            {target.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.targetKantongId && <p className="text-sm text-red-600">{errors.targetKantongId.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">{t(language, 'transaction.amount')}</Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0"
                            {...register('amount', { valueAsNumber: true })}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t(language, 'transaction.note')} ({t(language, 'common.optional')})</Label>
                        <Input
                            id="description"
                            placeholder={language === 'id' ? 'Catatan (opsional)' : 'Note (optional)'}
                            {...register('description')}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            {t(language, 'common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !selectedTargetId}>
                            {isSubmitting ? t(language, 'common.saving') : t(language, 'common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

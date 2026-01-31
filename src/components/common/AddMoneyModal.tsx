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

const addMoneySchema = z.object({
    amount: z.number().min(1, 'Amount must be greater than 0'),
    description: z.string().optional(),
});

type AddMoneyFormData = z.infer<typeof addMoneySchema>;

interface AddMoneyModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kantong: Kantong;
}

export function AddMoneyModal({ open, onOpenChange, kantong }: AddMoneyModalProps) {
    const { language } = useLanguageStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddMoneyFormData>({
        resolver: zodResolver(addMoneySchema),
        defaultValues: {
            amount: 0,
            description: '',
        },
    });

    const handleFormSubmit = async (data: AddMoneyFormData) => {
        setIsSubmitting(true);
        try {
            // DUMMY HANDLER - No backend integration yet
            console.warn('Add money to kantong:', kantong.id, data);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            reset();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to add money:', error);
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
                    <DialogTitle>{t(language, 'kantong.addMoney')}</DialogTitle>
                    <DialogDescription>
                        {t(language, 'kantong.addMoneyTo')} <span className="font-semibold">{kantong.name}</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? t(language, 'common.saving') : t(language, 'common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

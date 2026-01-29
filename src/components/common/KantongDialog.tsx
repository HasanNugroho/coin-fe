import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Kantong, KantongCategory, KantongType } from '../../types';
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

const kantongSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    category: z.string(),
    type: z.string(),
    balance: z.number().min(0, 'Balance must be positive'),
    isLocked: z.boolean(),
    color: z.string().optional(),
});

type KantongFormData = z.infer<typeof kantongSchema>;

interface KantongDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kantong?: Kantong;
    onSubmit: (data: Omit<Kantong, 'id'>) => Promise<void>;
}

const categories: KantongCategory[] = [
    'Daily Needs',
    'Bills',
    'Lifestyle',
    'Emergency',
    'Savings',
    'Investment',
    'Custom',
];

const types: KantongType[] = ['main', 'allocation', 'saving'];

const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
];

export function KantongDialog({ open, onOpenChange, kantong, onSubmit }: KantongDialogProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<KantongFormData>({
        resolver: zodResolver(kantongSchema),
        defaultValues: kantong || {
            name: '',
            category: 'Daily Needs',
            type: 'allocation',
            balance: 0,
            isLocked: false,
            color: '#3b82f6',
        },
    });

    const selectedCategory = watch('category');
    const selectedType = watch('type');
    const selectedColor = watch('color');

    const handleFormSubmit = async (data: KantongFormData) => {
        await onSubmit(data as Omit<Kantong, 'id'>);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{kantong ? 'Edit Kantong' : 'Create New Kantong'}</DialogTitle>
                    <DialogDescription>
                        {kantong ? 'Update your kantong details' : 'Add a new pocket to organize your money'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="e.g., Vacation Fund" {...register('name')} />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
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
                        <Label htmlFor="balance">Initial Balance</Label>
                        <Input
                            id="balance"
                            type="number"
                            placeholder="0"
                            {...register('balance', { valueAsNumber: true })}
                        />
                        {errors.balance && <p className="text-sm text-red-600">{errors.balance.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`h-8 w-8 rounded-full border-2 ${selectedColor === color.value ? 'border-gray-900' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setValue('color', color.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isLocked"
                            className="h-4 w-4 rounded border-gray-300"
                            {...register('isLocked')}
                        />
                        <Label htmlFor="isLocked" className="cursor-pointer">
                            Lock this kantong (prevent expenses)
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : kantong ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Kantong, KantongType, Category } from '../../types';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { categoryService } from '../../services/category.service';
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
import { IconPicker } from '../ui/iconPicker';

const kantongSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be at most 255 characters'),
    type: z.enum(['main', 'allocation', 'saving', 'debt', 'system']),
    category_id: z.string().optional().nullable(),
    icon: z.string().max(100, 'Icon must be at most 100 characters').optional().nullable(),
    icon_color: z.string().max(50, 'Icon color must be at most 50 characters').optional().nullable(),
    background_color: z.string().max(50, 'Background color must be at most 50 characters').optional().nullable(),
    is_active: z.boolean().optional(),
});

type KantongFormData = z.infer<typeof kantongSchema>;

interface KantongDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    kantong?: Kantong;
    onSubmit: (data: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => Promise<void>;
}

const types: KantongType[] = ['allocation', 'saving', 'debt'];

const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' },
];

export function KantongDialog({ open, onOpenChange, kantong, onSubmit }: KantongDialogProps) {
    const { language } = useLanguageStore();
    const isEditMode = !!kantong;
    const isMainPocket = kantong?.type === 'main';
    const isLocked = kantong?.is_locked;

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

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
            type: 'allocation',
            category_id: null,
            icon: null,
            icon_color: '#3b82f6',
            background_color: '#3b82f6',
            is_active: true,
        },
    });

    const selectedType = watch('type');
    const selectedCategory = watch('category_id');
    const selectedIconColor = watch('icon_color') || '#3b82f6';
    const selectedBackgroundColor = watch('background_color') || '#3b82f6';

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await categoryService.listCategoriesByType('pocket');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleFormSubmit = async (data: KantongFormData) => {
        const submitData: Omit<Kantong, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'> = {
            name: data.name,
            type: data.type,
            category_id: data.category_id || null,
            balance: 0,
            is_default: false,
            is_active: data.is_active !== undefined ? data.is_active : true,
            is_locked: kantong?.is_locked || false,
            icon: data.icon || null,
            icon_color: data.icon_color || null,
            background_color: data.background_color || null,
        };
        await onSubmit(submitData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? t(language, 'kantong.editKantong') : t(language, 'kantong.createKantong')}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? t(language, 'kantong.editDescription') : t(language, 'kantong.createDescription')}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t(language, 'kantong.name')}</Label>
                        <Input
                            id="name"
                            placeholder={language === 'id' ? 'Contoh: Dana Liburan' : 'e.g., Vacation Fund'}
                            {...register('name')}
                            disabled={isMainPocket || isLocked}
                        />
                        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">{t(language, 'kantong.pocketType')}</Label>
                        <Select
                            value={selectedType}
                            onValueChange={(value) => setValue('type', value as KantongType)}
                            disabled={isMainPocket || isLocked}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t(language, 'kantong.selectType')} />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {t(language, `kantong.type.${type}`)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">{t(language, 'kantong.category')}</Label>
                        <Select
                            value={selectedCategory || ''}
                            onValueChange={(value) => setValue('category_id', value || null)}
                            disabled={loadingCategories || isMainPocket || isLocked}
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
                        <Label htmlFor="icon">{t(language, 'kantong.icon')}</Label>
                        <IconPicker
                            value={watch('icon') || ''}
                            onChange={(icon) => setValue('icon', icon)}
                            language={language}
                        />
                        {errors.icon && <p className="text-sm text-red-600">{errors.icon.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>{t(language, 'kantong.iconColor')}</Label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`h-8 w-8 rounded-full border-2 transition-all ${selectedIconColor === color.value ? 'border-gray-900 ring-2 ring-offset-2' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setValue('icon_color', color.value)}
                                    disabled={isMainPocket || isLocked}
                                    title={color.name}
                                />
                            ))}
                            <div className="relative h-8 w-8">
                                <input
                                    type="color"
                                    value={selectedIconColor}
                                    onChange={(e) => setValue('icon_color', e.target.value)}
                                    disabled={isMainPocket || isLocked}
                                    className="h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer"
                                    title={language === 'id' ? 'Pilih warna custom' : 'Pick custom color'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>{t(language, 'kantong.backgroundColor')}</Label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`h-8 w-8 rounded-full border-2 transition-all ${selectedBackgroundColor === color.value ? 'border-gray-900 ring-2 ring-offset-2' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    onClick={() => setValue('background_color', color.value)}
                                    disabled={isMainPocket || isLocked}
                                    title={color.name}
                                />
                            ))}
                            <div className="relative h-8 w-8">
                                <input
                                    type="color"
                                    value={selectedBackgroundColor}
                                    onChange={(e) => setValue('background_color', e.target.value)}
                                    disabled={isMainPocket || isLocked}
                                    className="h-8 w-8 rounded-full border-2 border-gray-300 cursor-pointer"
                                    title={language === 'id' ? 'Pilih warna custom' : 'Pick custom color'}
                                />
                            </div>
                        </div>
                    </div>

                    {isMainPocket && (
                        <div className="rounded-md bg-blue-50 p-3">
                            <p className="text-sm text-blue-800">{t(language, 'kantong.mainPocketInfo')}</p>
                        </div>
                    )}

                    {isLocked && (
                        <div className="rounded-md bg-yellow-50 p-3">
                            <p className="text-sm text-yellow-800">{t(language, 'kantong.lockedPocketInfo')}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t(language, 'common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isSubmitting || isMainPocket || isLocked}>
                            {isSubmitting ? t(language, 'common.saving') : isEditMode ? t(language, 'common.update') : t(language, 'common.create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
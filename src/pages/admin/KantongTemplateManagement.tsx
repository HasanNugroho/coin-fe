import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminStore } from '../../store/admin.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { DefaultKantongTemplate, KantongCategory } from '../../types';

const kantongTemplateSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    category: z.string(),
    initialBalance: z.number().min(0).optional(),
    isLocked: z.boolean(),
});

type KantongTemplateFormData = z.infer<typeof kantongTemplateSchema>;

const categories: KantongCategory[] = [
    'Daily Needs',
    'Bills',
    'Lifestyle',
    'Emergency',
    'Savings',
    'Investment',
    'Custom',
];

export function KantongTemplateManagement() {
    const { language } = useLanguageStore();
    const {
        kantongTemplates,
        fetchKantongTemplates,
        updateKantongTemplates,
    } = useAdminStore();
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchKantongTemplates();
    }, [fetchKantongTemplates]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<KantongTemplateFormData>({
        resolver: zodResolver(kantongTemplateSchema) as any,
        defaultValues: {
            name: '',
            category: 'Daily Needs',
            initialBalance: 0,
            isLocked: false,
        },
    });

    const selectedCategory = watch('category');

    const handleFormSubmit = async (data: KantongTemplateFormData) => {
        try {
            let updated: DefaultKantongTemplate[];
            if (editingId) {
                updated = kantongTemplates.map((t) =>
                    t.id === editingId
                        ? { ...t, ...data, category: data.category as KantongCategory }
                        : t
                );
            } else {
                updated = [
                    ...kantongTemplates,
                    {
                        id: Date.now().toString(),
                        ...data,
                        category: data.category as KantongCategory,
                    },
                ];
            }
            await updateKantongTemplates(updated);
            setEditingId(null);
            reset();
        } catch (error) {
            console.error('Failed to save template:', error);
        }
    };

    const handleEdit = (template: DefaultKantongTemplate) => {
        setEditingId(template.id);
        setValue('name', template.name);
        setValue('category', template.category);
        setValue('initialBalance', template.initialBalance || 0);
        setValue('isLocked', template.isLocked);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            try {
                const updated = kantongTemplates.filter((t) => t.id !== id);
                await updateKantongTemplates(updated);
            } catch (error) {
                console.error('Failed to delete template:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'admin.kantongTemplate')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Kelola template kantong default untuk pengguna baru' : 'Manage default kantong templates for new users'}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {editingId ? t(language, 'admin.editTemplate') : t(language, 'admin.addTemplate')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{language === 'id' ? 'Nama Kantong' : 'Kantong Name'}</Label>
                                <Input id="name" placeholder="e.g., Main Wallet" {...register('name')} />
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">{t(language, 'kantong.category')}</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={(value) => setValue('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t(language, 'transaction.selectCategory')} />
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
                                <Label htmlFor="initialBalance">{language === 'id' ? 'Saldo Awal (Opsional)' : 'Initial Balance (Optional)'}</Label>
                                <Input
                                    id="initialBalance"
                                    type="number"
                                    placeholder="0"
                                    {...register('initialBalance', { valueAsNumber: true })}
                                />
                                {errors.initialBalance && (
                                    <p className="text-sm text-red-600">{errors.initialBalance.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isLocked"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('isLocked')}
                                />
                                <Label htmlFor="isLocked" className="cursor-pointer">
                                    {language === 'id' ? 'Terkunci secara default' : 'Locked by default'}
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? `${t(language, 'common.save')}...` : editingId ? t(language, 'common.edit') : t(language, 'common.add')}
                                </Button>
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditingId(null);
                                            reset();
                                        }}
                                    >
                                        {t(language, 'common.cancel')}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>{language === 'id' ? 'Template' : 'Templates'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {kantongTemplates.length === 0 ? (
                            <div className="flex h-32 items-center justify-center">
                                <p className="text-gray-500">{language === 'id' ? 'Tidak ada template yang ditentukan' : 'No templates defined'}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {kantongTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                    >
                                        <div>
                                            <p className="font-medium">{template.name}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <span>{template.category}</span>
                                                {template.isLocked && <span>• {language === 'id' ? 'Terkunci' : 'Locked'}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(template)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(template.id)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

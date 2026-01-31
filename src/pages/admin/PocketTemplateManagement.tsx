import { useEffect, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePocketTemplateStore } from '../../store/pocket-template.store';
import { useLanguageStore } from '../../store/language.store';
import { categoryService } from '../../services/category.service';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { PocketTemplate, Category } from '../../types';
import { IconPicker } from '@/components/ui/iconPicker';
import * as LucideIcons from 'lucide-react';

const pocketTemplateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
    type: z.enum(['main', 'saving', 'allocation']),
    category_id: z.string().min(1, 'Category is required'),
    is_default: z.boolean().default(false),
    is_active: z.boolean().default(true),
    order: z.number().int().min(0).max(10000).default(0),
    icon: z.string().max(100).optional().or(z.literal('')),
    icon_color: z.string().max(50).optional().or(z.literal('')),
    background_color: z.string().max(50).optional().or(z.literal('')),
});

type PocketTemplateFormData = z.infer<typeof pocketTemplateSchema>;

export function PocketTemplateManagement() {
    const { language } = useLanguageStore();
    const {
        templates,
        fetchPocketTemplates,
        createPocketTemplate,
        updatePocketTemplate,
        deletePocketTemplate,
    } = usePocketTemplateStore();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        fetchPocketTemplates(100, 0);
        loadCategories();
    }, [fetchPocketTemplates]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const cats = await categoryService.listCategoriesByType('pocket', 100, 0);
            setCategories(cats);
        } catch (error) {
            console.error('Failed to load categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PocketTemplateFormData>({
        resolver: zodResolver(pocketTemplateSchema),
        defaultValues: {
            name: '',
            type: 'saving',
            category_id: '',
            is_active: true,
            icon: '',
            icon_color: '',
            background_color: '',
            order: 0,
            is_default: false,
        },
    });

    const selectedType = watch('type');
    const selectedCategory = watch('category_id');

    const handleFormSubmit = async (data: PocketTemplateFormData) => {
        try {
            const submitData = {
                name: data.name,
                type: data.type,
                category_id: data.category_id,
                is_default: data.is_default,
                is_active: data.is_active,
                order: data.order,
                icon: data.icon,
                icon_color: data.icon_color,
                background_color: data.background_color,
            };

            if (editingId) {
                await updatePocketTemplate(editingId, submitData);
            } else {
                await createPocketTemplate(submitData);
            }
            setEditingId(null);
            reset();
        } catch (error) {
            console.error('Failed to save template:', error);
        }
    };

    const handleEdit = (template: PocketTemplate) => {
        setEditingId(template.id);
        setValue('name', template.name);
        setValue('type', template.type);
        setValue('category_id', template.category_id);
        setValue('is_default', template.is_default);
        setValue('is_active', template.is_active);
        setValue('order', template.order);
        setValue('icon', template.icon);
        setValue('icon_color', template.icon_color);
        setValue('background_color', template.background_color);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            try {
                await deletePocketTemplate(id);
            } catch (error) {
                console.error('Failed to delete template:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{language === 'id' ? 'Template Kantong' : 'Pocket Templates'}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Kelola template kantong untuk pengguna' : 'Manage pocket templates for users'}</p>
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
                                <Label htmlFor="name">{language === 'id' ? 'Nama' : 'Name'}</Label>
                                <Input id="name" placeholder="e.g., Emergency Fund" {...register('name')} />
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">{language === 'id' ? 'Tipe' : 'Type'}</Label>
                                <Select value={selectedType} onValueChange={(value) => setValue('type', value as 'main' | 'saving' | 'allocation')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t(language, 'transaction.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="main">main</SelectItem>
                                        <SelectItem value="saving">saving</SelectItem>
                                        <SelectItem value="allocation">allocation</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">{t(language, 'kantong.category')}</Label>
                                <Select value={selectedCategory} onValueChange={(value) => setValue('category_id', value)}>
                                    <SelectTrigger disabled={loadingCategories}>
                                        <SelectValue placeholder={loadingCategories ? 'Loading...' : t(language, 'transaction.selectCategory')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && <p className="text-sm text-red-600">{errors.category_id.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">{language === 'id' ? 'Urutan' : 'Order'}</Label>
                                <Input id="order" type="number" min="0" max="10000" {...register('order', { valueAsNumber: true })} />
                                {errors.order && <p className="text-sm text-red-600">{errors.order.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">{language === 'id' ? 'Ikon' : 'Icon'}</Label>
                                <IconPicker
                                    value={watch('icon') || ''}
                                    onChange={(icon) => setValue('icon', icon)}
                                    language={language}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon_color">{language === 'id' ? 'Warna Ikon' : 'Icon Color'}</Label>
                                <Input id="icon_color" type="color" {...register('icon_color')} />
                                {errors.icon_color && <p className="text-sm text-red-600">{errors.icon_color.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="background_color">{language === 'id' ? 'Warna Latar' : 'Background Color'}</Label>
                                <Input id="background_color" type="color" {...register('background_color')} />
                                {errors.background_color && <p className="text-sm text-red-600">{errors.background_color.message}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('is_active')}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    {language === 'id' ? 'Aktif' : 'Active'}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('is_default')}
                                />
                                <Label htmlFor="is_default" className="cursor-pointer">
                                    {language === 'id' ? 'Default' : 'Default'}
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
                        {templates.length === 0 ? (
                            <div className="flex h-32 items-center justify-center">
                                <p className="text-gray-500">{language === 'id' ? 'Tidak ada template yang ditentukan' : 'No templates defined'}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {templates.map((template) => {
                                    const CategoryIcon = template.icon && LucideIcons[template.icon as keyof typeof LucideIcons]
                                    return (
                                        <div
                                            key={template.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                {CategoryIcon && (
                                                    <div
                                                        className="p-2 rounded-md flex items-center justify-center"
                                                        style={{ backgroundColor: template.icon_color || '#e5e7eb' }}
                                                    >
                                                        <CategoryIcon
                                                            className="h-5 w-5"
                                                            style={{ color: template.icon_color ? '#fff' : '#374151' }}
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{template.name}</p>
                                                    {template.type && (
                                                        <p className="text-sm text-gray-500">{template.type}</p>
                                                    )}
                                                    <div className="flex gap-2 mt-1">
                                                        {template.is_default && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {language === 'id' ? 'Default' : 'Default'}
                                                            </span>
                                                        )}
                                                        {!template.is_active && (
                                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                                {language === 'id' ? 'Tidak Aktif' : 'Inactive'}
                                                            </span>
                                                        )}

                                                    </div>
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
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

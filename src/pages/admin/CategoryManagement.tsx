import { useEffect, useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { Category } from '../../types';
import * as LucideIcons from 'lucide-react';
import { IconPicker } from '@/components/ui/iconPicker';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['transaction', 'pocket']),
    is_default: z.boolean().default(false),
    parent_id: z.string().optional(),
    transaction_type: z.enum(['income', 'expense']).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryManagement() {
    const { language } = useLanguageStore();
    const {
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        isLoading: storeLoading,
        error: storeError,
    } = useAdminStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'transaction' | 'pocket'>('transaction');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            type: 'transaction',
            is_default: false,
            parent_id: undefined,
            transaction_type: undefined,
            description: '',
            icon: '',
            color: '#000000',
        },
    });

    const categoryType = watch('type');

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            // Clean up empty strings to undefined
            const cleanData = {
                ...data,
                parent_id: data.parent_id || undefined,
                transaction_type: data.transaction_type || undefined,
                description: data.description || undefined,
                icon: data.icon || undefined,
                color: data.color || undefined,
            };

            if (editingId) {
                await updateCategory(editingId, cleanData);
                setEditingId(null);
            } else {
                await createCategory(cleanData);
            }
            reset();
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setValue('name', category.name);
        setValue('type', category.type as 'transaction' | 'pocket');
        setValue('is_default', category.is_default);
        setValue('parent_id', category.parent_id || undefined);
        setValue('transaction_type', (category.transaction_type as 'income' | 'expense') || undefined);
        setValue('description', category.description || '');
        setValue('icon', category.icon || '');
        setValue('color', category.color || '#000000');
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCategory(id);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete category:', error);
        }
    };

    const filteredCategories = categories.filter((c) => c.type === selectedType);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'admin.categories')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Kelola kategori transaksi dan kantong' : 'Manage transaction and pocket categories'}</p>
            </div>

            {storeError && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{storeError}</p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {editingId ? (language === 'id' ? 'Edit Kategori' : 'Edit Category') : (language === 'id' ? 'Tambah Kategori' : 'Add Category')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{language === 'id' ? 'Nama Kategori' : 'Category Name'}</Label>
                                <Input id="name" placeholder={language === 'id' ? 'Contoh: Makanan' : 'e.g., Food'} {...register('name')} />
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">{language === 'id' ? 'Tipe Kategori' : 'Category Type'}</Label>
                                <Select value={categoryType} onValueChange={(value) => setValue('type', value as 'transaction' | 'pocket')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={language === 'id' ? 'Pilih tipe' : 'Select type'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transaction">{language === 'id' ? 'Transaksi' : 'Transaction'}</SelectItem>
                                        <SelectItem value="pocket">{language === 'id' ? 'Kantong' : 'Pocket'}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent_id">{language === 'id' ? 'Kategori Induk (Opsional)' : 'Parent Category (Optional)'}</Label>
                                <Select value={watch('parent_id') || 'none'} onValueChange={(value) => setValue('parent_id', value === 'none' ? undefined : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={language === 'id' ? 'Tidak ada' : 'None'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">{language === 'id' ? 'Tidak ada' : 'None'}</SelectItem>
                                        {filteredCategories
                                            .filter(cat => !cat.parent_id && cat.id !== editingId)
                                            .map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="transaction_type">{language === 'id' ? 'Tipe Transaksi (Opsional)' : 'Transaction Type (Optional)'}</Label>
                                <Select
                                    value={watch('transaction_type') || 'none'}
                                    onValueChange={(value) =>
                                        setValue('transaction_type', value === 'none' ? undefined : (value as 'income' | 'expense'))
                                    }>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            {language === 'id' ? 'Tidak ada' : 'None'}
                                        </SelectItem>
                                        <SelectItem value="income">
                                            {language === 'id' ? 'Pendapatan' : 'Income'}
                                        </SelectItem>
                                        <SelectItem value="expense">
                                            {language === 'id' ? 'Pengeluaran' : 'Expense'}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    {language === 'id' ? 'Deskripsi (Opsional)' : 'Description (Optional)'}
                                </Label>
                                <Input
                                    id="description"
                                    {...register('description')}
                                    placeholder={language === 'id' ? 'Masukkan deskripsi' : 'Enter description'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">
                                    {language === 'id' ? 'Ikon (Opsional)' : 'Icon (Optional)'}
                                </Label>
                                <IconPicker
                                    value={watch('icon') || ''}
                                    onChange={(icon) => setValue('icon', icon)}
                                    language={language}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="color">
                                    {language === 'id' ? 'Warna (Opsional)' : 'Color (Optional)'}
                                </Label>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        id="color"
                                        type="color"
                                        {...register('color')}
                                        className="w-20 h-10"
                                    />
                                    <Input
                                        type="text"
                                        value={watch('color') || '#000000'}
                                        onChange={(e) => setValue('color', e.target.value)}
                                        placeholder="#000000"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('is_default')}
                                />
                                <Label htmlFor="is_default" className="cursor-pointer">
                                    {language === 'id' ? 'Tetapkan sebagai default' : 'Set as default'}
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex-1" disabled={isSubmitting || storeLoading}>
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
                        <CardTitle>{t(language, 'admin.categories')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as 'transaction' | 'pocket')}>
                            <TabsList>
                                <TabsTrigger value="transaction">{language === 'id' ? 'Transaksi' : 'Transaction'}</TabsTrigger>
                                <TabsTrigger value="pocket">{language === 'id' ? 'Kantong' : 'Pocket'}</TabsTrigger>
                            </TabsList>

                            <TabsContent value={selectedType} className="mt-4">
                                {filteredCategories.length === 0 ? (
                                    <div className="flex h-32 items-center justify-center">
                                        <p className="text-gray-500">{t(language, 'messages.noResults')}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredCategories.map((category) => {
                                            const CategoryIcon = category.icon && LucideIcons[category.icon as keyof typeof LucideIcons];

                                            return (
                                                <div
                                                    key={category.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {CategoryIcon && (
                                                            <div
                                                                className="p-2 rounded-md flex items-center justify-center"
                                                                style={{ backgroundColor: category.color || '#e5e7eb' }}
                                                            >
                                                                <CategoryIcon
                                                                    className="h-5 w-5"
                                                                    style={{ color: category.color ? '#fff' : '#374151' }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{category.name}</p>
                                                            {category.description && (
                                                                <p className="text-sm text-gray-500">{category.description}</p>
                                                            )}
                                                            <div className="flex gap-2 mt-1">
                                                                {category.is_default && (
                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                        {language === 'id' ? 'Default' : 'Default'}
                                                                    </span>
                                                                )}
                                                                {category.parent_id && (
                                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                                        {language === 'id' ? 'Sub-kategori' : 'Subcategory'}
                                                                    </span>
                                                                )}
                                                                {category.transaction_type && (
                                                                    <span className={`text-xs px-2 py-1 rounded ${category.transaction_type === 'income'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {category.transaction_type === 'income'
                                                                            ? (language === 'id' ? 'Pendapatan' : 'Income')
                                                                            : (language === 'id' ? 'Pengeluaran' : 'Expense')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEdit(category)}
                                                            disabled={storeLoading}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeleteConfirm(category.id)}
                                                            disabled={storeLoading}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="border-red-200 bg-white max-w-md w-full mx-4">
                        <CardHeader>
                            <CardTitle className="text-red-800">
                                {language === 'id' ? 'Konfirmasi Hapus' : 'Confirm Delete'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-gray-600">
                                {language === 'id'
                                    ? 'Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.'
                                    : 'Are you sure you want to delete this category? This action cannot be undone.'}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    {language === 'id' ? 'Batal' : 'Cancel'}
                                </Button>
                                <Button
                                    onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={storeLoading}
                                >
                                    {language === 'id' ? 'Hapus' : 'Delete'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
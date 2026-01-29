import { useEffect, useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminStore } from '../../store/admin.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { Category } from '../../types';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['transaction', 'kantong']),
    isDefault: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CategoryManagement() {
    const {
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useAdminStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'transaction' | 'kantong'>('transaction');

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
            isDefault: false,
        },
    });

    const categoryType = watch('type');

    const handleFormSubmit = async (data: CategoryFormData) => {
        try {
            if (editingId) {
                await updateCategory(editingId, data);
                setEditingId(null);
            } else {
                await createCategory(data);
            }
            reset();
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setValue('name', category.name);
        setValue('type', category.type);
        setValue('isDefault', category.isDefault);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
    };

    const filteredCategories = categories.filter((c) => c.type === selectedType);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
                <p className="mt-2 text-gray-600">Manage transaction and kantong categories</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {editingId ? 'Edit Category' : 'Add Category'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input id="name" placeholder="e.g., Food" {...register('name')} />
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={categoryType} onValueChange={(value) => setValue('type', value as 'transaction' | 'kantong')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transaction">Transaction</SelectItem>
                                        <SelectItem value="kantong">Kantong</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('isDefault')}
                                />
                                <Label htmlFor="isDefault" className="cursor-pointer">
                                    Set as default
                                </Label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Add'}
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
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as 'transaction' | 'kantong')}>
                            <TabsList>
                                <TabsTrigger value="transaction">Transaction</TabsTrigger>
                                <TabsTrigger value="kantong">Kantong</TabsTrigger>
                            </TabsList>

                            <TabsContent value={selectedType} className="mt-4">
                                {filteredCategories.length === 0 ? (
                                    <div className="flex h-32 items-center justify-center">
                                        <p className="text-gray-500">No categories found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium">{category.name}</p>
                                                        {category.isDefault && (
                                                            <p className="text-xs text-gray-500">Default</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(category.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

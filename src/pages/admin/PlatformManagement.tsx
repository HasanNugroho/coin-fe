import { useEffect, useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminPlatformStore } from '../../store/admin-platform.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import type { AdminPlatformType } from '../../types';

const platformSchema = z.object({
    name: z.string().min(1, 'Platform name is required').max(255, 'Platform name must be at most 255 characters'),
    type: z.enum(['BANK', 'E_WALLET', 'CASH', 'ATM']),
    is_active: z.boolean().default(true),
});

type PlatformFormData = z.infer<typeof platformSchema>;

export function PlatformManagement() {
    const { language } = useLanguageStore();
    const {
        platforms,
        fetchPlatforms,
        createPlatform,
        updatePlatform,
        deletePlatform,
        isLoading: storeLoading,
        error: storeError,
    } = useAdminPlatformStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchPlatforms();
    }, [fetchPlatforms]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PlatformFormData>({
        resolver: zodResolver(platformSchema),
        defaultValues: {
            name: '',
            type: 'BANK',
            is_active: true,
        },
    });

    const platformType = watch('type');

    const handleFormSubmit = async (data: PlatformFormData) => {
        try {
            if (editingId) {
                await updatePlatform(editingId, data);
                setEditingId(null);
            } else {
                await createPlatform(data);
            }
            reset();
        } catch (error) {
            console.error('Failed to save platform:', error);
        }
    };

    const handleEdit = (platform: typeof platforms[0]) => {
        setEditingId(platform.id);
        setValue('name', platform.name);
        setValue('type', platform.type);
        setValue('is_active', platform.is_active);
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePlatform(id);
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Failed to delete platform:', error);
        }
    };

    const getPlatformTypeLabel = (type: AdminPlatformType): string => {
        const typeMap: Record<AdminPlatformType, string> = {
            BANK: language === 'id' ? 'Bank' : 'Bank',
            E_WALLET: language === 'id' ? 'E-Wallet' : 'E-Wallet',
            CASH: language === 'id' ? 'Tunai' : 'Cash',
            ATM: language === 'id' ? 'ATM' : 'ATM',
        };
        return typeMap[type];
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'admin.platforms')}</h1>
                <p className="mt-2 text-gray-600">
                    {language === 'id' ? 'Kelola platform yang digunakan untuk transaksi' : 'Manage platforms used for transactions'}
                </p>
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
                            {editingId ? t(language, 'admin.editPlatform') : t(language, 'admin.addPlatform')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t(language, 'admin.platformName')}</Label>
                                <Input
                                    id="name"
                                    placeholder={language === 'id' ? 'Contoh: BCA' : 'e.g., BCA'}
                                    {...register('name')}
                                />
                                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">{t(language, 'admin.platformType')}</Label>
                                <Select value={platformType} onValueChange={(value) => setValue('type', value as AdminPlatformType)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={language === 'id' ? 'Pilih tipe' : 'Select type'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BANK">Bank</SelectItem>
                                        <SelectItem value="E_WALLET">E-Wallet</SelectItem>
                                        <SelectItem value="CASH">{language === 'id' ? 'Tunai' : 'Cash'}</SelectItem>
                                        <SelectItem value="ATM">ATM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="h-4 w-4 rounded border-gray-300"
                                    {...register('is_active')}
                                />
                                <Label htmlFor="is_active" className="cursor-pointer">
                                    {t(language, 'admin.active')}
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
                        <CardTitle>{t(language, 'admin.platforms')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {platforms.length === 0 ? (
                            <div className="flex h-32 items-center justify-center">
                                <p className="text-gray-500">{t(language, 'admin.noPlatforms')}</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        className={`flex items-center justify-between rounded-lg border p-3 ${platform.is_active
                                                ? 'border-gray-200 hover:bg-gray-50'
                                                : 'border-gray-200 bg-gray-50 opacity-60'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{platform.name}</p>
                                            <div className="flex gap-2 mt-1 items-center">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {getPlatformTypeLabel(platform.type)}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${platform.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {platform.is_active ? t(language, 'admin.active') : t(language, 'admin.inactive')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(platform)}
                                                disabled={storeLoading}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteConfirm(platform.id)}
                                                disabled={storeLoading}
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
                                {t(language, 'admin.confirmDeletePlatform')}
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteConfirm(null)}
                                >
                                    {t(language, 'common.cancel')}
                                </Button>
                                <Button
                                    onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={storeLoading}
                                >
                                    {t(language, 'common.delete')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

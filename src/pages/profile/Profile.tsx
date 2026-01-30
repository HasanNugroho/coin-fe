import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/auth.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional().refine(
        (val) => !val || /^[+\d\s\-()]+$/.test(val),
        'Invalid phone number format'
    ),
    telegramId: z.string().optional(),
    baseSalary: z.number().min(0, 'Salary must be positive').optional(),
    salaryCycle: z.enum(['daily', 'weekly', 'monthly']),
    salaryDay: z.number().min(1).max(28, 'Day must be between 1-28'),
    currency: z.string().min(3).max(3),
    language: z.enum(['id', 'en']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function Profile() {
    const { user, fetchProfile, updateProfile, isLoading, error, clearError } = useAuthStore();
    const { language } = useLanguageStore();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: user || {
            name: '',
            email: '',
            phone: '',
            telegramId: '',
            baseSalary: 0,
            salaryCycle: 'monthly',
            salaryDay: 1,
            currency: 'IDR',
            language: 'id',
        },
    });

    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('phone', user.phone || '');
            setValue('telegramId', user.telegramId || '');
            setValue('baseSalary', user.baseSalary || 0);
            setValue('salaryCycle', (user.salaryCycle || 'monthly') as 'daily' | 'weekly' | 'monthly');
            setValue('salaryDay', user.salaryDay || 1);
            setValue('currency', user.currency || 'IDR');
            setValue('language', (user.language || 'id') as 'id' | 'en');
        }
    }, [user, setValue]);

    const selectedCycle = watch('salaryCycle');

    const handleFormSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile(data);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    if (isLoading && !user) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">{t(language, 'common.loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'profile.title')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Kelola profil keuangan pribadi Anda' : 'Manage your personal finance profile'}</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{language === 'id' ? 'Informasi Pribadi' : 'Personal Information'}</CardTitle>
                        <CardDescription>{language === 'id' ? 'Lihat dan edit detail profil Anda' : 'View and edit your profile details'}</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)}>{t(language, 'profile.editProfile')}</Button>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t(language, 'profile.name')}</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    disabled={!isEditing}
                                    {...register('name')}
                                    className={!isEditing ? 'bg-gray-50' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    disabled={!isEditing}
                                    {...register('email')}
                                    className={!isEditing ? 'bg-gray-50' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+62812345678"
                                    disabled={!isEditing}
                                    {...register('phone')}
                                    className={!isEditing ? 'bg-gray-50' : ''}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-600">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telegramId">Telegram ID</Label>
                                <Input
                                    id="telegramId"
                                    placeholder="@yourhandle"
                                    disabled={!isEditing}
                                    {...register('telegramId')}
                                    className={!isEditing ? 'bg-gray-50' : ''}
                                />
                                {errors.telegramId && (
                                    <p className="text-sm text-red-600">{errors.telegramId.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Input
                                    id="currency"
                                    placeholder="IDR"
                                    disabled={!isEditing}
                                    {...register('currency')}
                                    className={!isEditing ? 'bg-gray-50' : ''}
                                />
                                {errors.currency && (
                                    <p className="text-sm text-red-600">{errors.currency.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="language">{language === 'id' ? 'Bahasa' : 'Language'}</Label>
                                <Select
                                    value={watch('language')}
                                    onValueChange={(value) =>
                                        setValue('language', value as 'id' | 'en')
                                    }
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger disabled={!isEditing}>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="id">🇮🇩 Indonesian</SelectItem>
                                        <SelectItem value="en">🇬🇧 English</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.language && (
                                    <p className="text-sm text-red-600">{errors.language.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="mb-4 text-lg font-semibold">Salary Information (Optional)</h3>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="baseSalary">Base Salary</Label>
                                    <Input
                                        id="baseSalary"
                                        type="number"
                                        placeholder="0"
                                        disabled={!isEditing}
                                        {...register('baseSalary', { valueAsNumber: true })}
                                        className={!isEditing ? 'bg-gray-50' : ''}
                                    />
                                    {errors.baseSalary && (
                                        <p className="text-sm text-red-600">{errors.baseSalary.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salaryCycle">Salary Cycle</Label>
                                    <Select
                                        value={selectedCycle}
                                        onValueChange={(value) =>
                                            setValue('salaryCycle', value as 'daily' | 'weekly' | 'monthly')
                                        }
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger disabled={!isEditing}>
                                            <SelectValue placeholder="Select cycle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salaryDay">Salary Day</Label>
                                    <Input
                                        id="salaryDay"
                                        type="number"
                                        min="1"
                                        max="28"
                                        placeholder="1"
                                        disabled={!isEditing}
                                        {...register('salaryDay', { valueAsNumber: true })}
                                        className={!isEditing ? 'bg-gray-50' : ''}
                                    />
                                    {errors.salaryDay && (
                                        <p className="text-sm text-red-600">{errors.salaryDay.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {isEditing && (
                            <div className="flex gap-3 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        clearError();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {user?.role === 'admin' && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Admin Role</CardTitle>
                        <CardDescription className="text-blue-700">
                            You have administrator access to the system
                        </CardDescription>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}

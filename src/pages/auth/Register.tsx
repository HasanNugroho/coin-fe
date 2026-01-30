import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wallet } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
    const navigate = useNavigate();
    const { register: registerUser, error, clearError } = useAuthStore();
    const { language } = useLanguageStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        clearError();
        try {
            await registerUser(data.email, data.password, data.name);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration failed:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                        <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">
                        {language === 'id' ? 'Buat Akun' : 'Create an Account'}
                    </CardTitle>
                    <CardDescription>
                        {language === 'id' ? 'Mulai kelola keuangan Anda hari ini' : 'Start managing your finances today'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t(language, 'auth.name')}</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={language === 'id' ? 'Nama Lengkap' : 'John Doe'}
                                {...register('name')}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t(language, 'auth.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t(language, 'auth.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">{t(language, 'auth.confirmPassword')}</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? `${t(language, 'auth.register')}...` : t(language, 'auth.register')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600">
                            {t(language, 'auth.alreadyHaveAccount')}
                        </span>
                        <Link to="/login" className="text-blue-600 hover:underline">
                            {t(language, 'auth.signIn')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

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

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const { login, error, clearError } = useAuthStore();
    const { language } = useLanguageStore();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'demo@coin.app',
            password: 'demo123',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        clearError();
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed:', err);
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
                        {language === 'id' ? 'Selamat datang di DompetKu' : 'Welcome to DompetKu'}
                    </CardTitle>
                    <CardDescription>
                        {t(language, 'auth.signIn')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t(language, 'auth.email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="demo@coin.app"
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
                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? `${t(language, 'auth.signIn')}...` : t(language, 'auth.signIn')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-600">
                            {t(language, 'auth.dontHaveAccount')}
                        </span>
                        <Link to="/register" className="text-blue-600 hover:underline">
                            {t(language, 'auth.register')}
                        </Link>
                    </div>
                    <div className="mt-4 rounded-md bg-blue-50 p-3">
                        <p className="text-xs text-blue-800">
                            <strong>{language === 'id' ? 'Kredensial Demo:' : 'Demo credentials:'}</strong><br />
                            Email: demo@coin.app<br />
                            Password: demo123
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { useEffect } from 'react';
import { Users, Wallet2, Receipt, TrendingUp } from 'lucide-react';
import { useAdminStore } from '../../store/admin.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
    const { language } = useLanguageStore();
    const { dashboardStats, fetchDashboardStats, isLoading } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading || !dashboardStats) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">{t(language, 'common.loading')}</div>
            </div>
        );
    }

    const stats = [
        {
            title: language === 'id' ? 'Total Pengguna' : 'Total Users',
            value: dashboardStats.totalUsers,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: language === 'id' ? 'Pengguna Aktif' : 'Active Users',
            value: dashboardStats.activeUsers,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: language === 'id' ? 'Total Kantong' : 'Total Kantong',
            value: dashboardStats.totalKantong,
            icon: Wallet2,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            title: language === 'id' ? 'Total Transaksi' : 'Total Transactions',
            value: dashboardStats.totalTransactions,
            icon: Receipt,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'admin.dashboard')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Ringkasan sistem dan statistik' : 'System overview and statistics'}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`rounded-full p-2 ${stat.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{language === 'id' ? 'Pertumbuhan Pengguna' : 'User Growth'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardStats.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#3b82f6"
                                name="Active Users"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}

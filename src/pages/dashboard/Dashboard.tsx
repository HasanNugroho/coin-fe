import { useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../store/finance.store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { IncomeExpenseChart } from '../../components/charts/IncomeExpenseChart';
import { KantongBalanceChart } from '../../components/charts/KantongBalanceChart';
import { formatCurrency } from '../../utils/format';
import { DatePickerWithRange } from '@/components/common/DatePickerWithRange';

export function Dashboard() {
    const { dashboardStats, fetchDashboardStats, isLoading } = useFinanceStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading || !dashboardStats) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Balance',
            value: dashboardStats.totalBalance,
            icon: DollarSign,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Free Cash',
            value: dashboardStats.freeCash,
            icon: Wallet,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Income',
            value: dashboardStats.totalIncome,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-100',
        },
        {
            title: 'Total Expense',
            value: dashboardStats.totalExpense,
            icon: TrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of your financial status</p>
            </div>

            <div className="flex justify-end">
                <DatePickerWithRange />
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
                                <div className="text-2xl font-bold">{formatCurrency(stat.value)}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expense</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <IncomeExpenseChart data={dashboardStats.monthlyData} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Balance per Kantong</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <KantongBalanceChart data={dashboardStats.kantongBalances} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

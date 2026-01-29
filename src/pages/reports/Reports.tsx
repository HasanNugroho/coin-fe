import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinanceStore } from '../../store/finance.store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { formatCurrency } from '../../utils/format';

export function Reports() {
    const { reportData, fetchReportData, isLoading } = useFinanceStore();

    useEffect(() => {
        const startDate = '2025-09-01';
        const endDate = '2026-01-31';
        fetchReportData(startDate, endDate);
    }, [fetchReportData]);

    if (isLoading || !reportData) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">Loading reports...</div>
            </div>
        );
    }

    const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                <p className="mt-2 text-gray-600">Analyze your spending patterns</p>
            </div>

            <Tabs defaultValue="category" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="category">By Category</TabsTrigger>
                    <TabsTrigger value="kantong">By Kantong</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="category" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Expense by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={reportData.expenseByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="amount"
                                        >
                                            {reportData.expenseByCategory.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Category Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {reportData.expenseByCategory.map((item, index) => (
                                        <div key={item.category} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm font-medium">{item.category}</span>
                                            </div>
                                            <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="kantong" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense by Kantong</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.expenseByKantong}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="kantong" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="amount" fill="#3b82f6" name="Expense" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="monthly" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.monthlySummary}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                                    <Bar dataKey="balance" fill="#3b82f6" name="Balance" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-2 text-left font-medium">Month</th>
                                            <th className="pb-2 text-right font-medium">Income</th>
                                            <th className="pb-2 text-right font-medium">Expense</th>
                                            <th className="pb-2 text-right font-medium">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.monthlySummary.map((item) => (
                                            <tr key={item.month} className="border-b">
                                                <td className="py-2">{item.month}</td>
                                                <td className="py-2 text-right text-green-600">
                                                    {formatCurrency(item.income)}
                                                </td>
                                                <td className="py-2 text-right text-red-600">
                                                    {formatCurrency(item.expense)}
                                                </td>
                                                <td className="py-2 text-right font-semibold text-blue-600">
                                                    {formatCurrency(item.balance)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useFinanceStore } from '../../store/finance.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import type { Liability } from '../../types';

export default function LiabilityManagement() {
    const { liabilities, isLoading, error, fetchLiabilities, createLiability, updateLiability, deleteLiability } = useFinanceStore();
    const [formData, setFormData] = useState<Omit<Liability, 'id'>>({
        name: '',
        type: 'credit',
        totalAmount: 0,
        paidAmount: 0,
        dueDate: '',
        note: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchLiabilities();
    }, [fetchLiabilities]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || formData.totalAmount <= 0 || !formData.dueDate) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (editingId) {
                await updateLiability(editingId, formData);
                setEditingId(null);
            } else {
                await createLiability(formData);
            }
            setFormData({
                name: '',
                type: 'credit',
                totalAmount: 0,
                paidAmount: 0,
                dueDate: '',
                note: '',
            });
        } catch (err) {
            console.error('Error saving liability:', err);
        }
    };

    const handleEdit = (liability: Liability) => {
        setFormData({
            name: liability.name,
            type: liability.type,
            totalAmount: liability.totalAmount,
            paidAmount: liability.paidAmount,
            dueDate: liability.dueDate,
            note: liability.note,
        });
        setEditingId(liability.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this liability?')) {
            try {
                await deleteLiability(id);
            } catch (err) {
                console.error('Error deleting liability:', err);
            }
        }
    };

    const getProgressPercentage = (paid: number, total: number) => {
        return total > 0 ? Math.round((paid / total) * 100) : 0;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Liabilities</h1>
                <p className="text-gray-600 mt-2">Manage credit cards, installments, and paylater obligations</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Edit Liability' : 'Add Liability'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Credit Card BCA"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'credit' | 'installment' | 'paylater' })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit">Credit Card</SelectItem>
                                    <SelectItem value="installment">Installment</SelectItem>
                                    <SelectItem value="paylater">PayLater</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="totalAmount">Total Amount</Label>
                            <Input
                                id="totalAmount"
                                type="number"
                                value={formData.totalAmount}
                                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) })}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="paidAmount">Paid Amount</Label>
                            <Input
                                id="paidAmount"
                                type="number"
                                value={formData.paidAmount}
                                onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="note">Note (Optional)</Label>
                            <Input
                                id="note"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Add notes..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {editingId ? 'Update' : 'Add'} Liability
                            </Button>
                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            name: '',
                                            type: 'credit',
                                            totalAmount: 0,
                                            paidAmount: 0,
                                            dueDate: '',
                                            note: '',
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Active Liabilities</h3>
                        {liabilities.length === 0 ? (
                            <p className="text-gray-500">No liabilities recorded</p>
                        ) : (
                            <div className="space-y-3">
                                {liabilities.map((liability) => {
                                    const progress = getProgressPercentage(liability.paidAmount, liability.totalAmount);
                                    const remaining = liability.totalAmount - liability.paidAmount;
                                    return (
                                        <div key={liability.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium">{liability.name}</p>
                                                    <p className="text-sm text-gray-600 capitalize">{liability.type}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(liability)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(liability.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Rp {liability.paidAmount.toLocaleString('id-ID')} / Rp {liability.totalAmount.toLocaleString('id-ID')}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>Remaining: Rp {remaining.toLocaleString('id-ID')}</span>
                                                    <span>Due: {new Date(liability.dueDate).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

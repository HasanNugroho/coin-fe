import { useEffect, useState } from 'react';
import { useFinanceStore } from '../../store/finance.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import type { AllocationRule } from '../../types';

export default function AllocationManagement() {
    const { language } = useLanguageStore();
    const { kantongs, allocationRules, isLoading, error, fetchKantongs, fetchAllocationRules, createAllocationRule, updateAllocationRule, deleteAllocationRule } = useFinanceStore();
    const [formData, setFormData] = useState<Omit<AllocationRule, 'id'>>({
        targetKantongId: '',
        priority: 'medium',
        type: 'percentage',
        value: 0,
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchKantongs();
        fetchAllocationRules();
    }, [fetchKantongs, fetchAllocationRules]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.targetKantongId || formData.value <= 0) {
            alert('Please fill in all fields correctly');
            return;
        }

        try {
            if (editingId) {
                await updateAllocationRule(editingId, formData);
                setEditingId(null);
            } else {
                await createAllocationRule(formData);
            }
            setFormData({
                targetKantongId: '',
                priority: 'medium',
                type: 'percentage',
                value: 0,
            });
        } catch (err) {
            console.error('Error saving allocation rule:', err);
        }
    };

    const handleEdit = (rule: AllocationRule) => {
        setFormData({
            targetKantongId: rule.targetKantongId,
            priority: rule.priority,
            type: rule.type,
            value: rule.value,
        });
        setEditingId(rule.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            try {
                await deleteAllocationRule(id);
            } catch (err) {
                console.error('Error deleting allocation rule:', err);
            }
        }
    };

    const getKantongName = (id: string) => {
        return kantongs.find(k => k.id === id)?.name || 'Unknown';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t(language, 'allocation.title')}</h1>
                <p className="text-gray-600 mt-2">{t(language, 'allocation.settings')}</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? t(language, 'allocation.editRule') : t(language, 'allocation.addRule')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="kantong">{t(language, 'allocation.targetPocket')}</Label>
                            <Select value={formData.targetKantongId} onValueChange={(value) => setFormData({ ...formData, targetKantongId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t(language, 'transaction.selectKantong')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {kantongs.map((k) => (
                                        <SelectItem key={k.id} value={k.id}>
                                            {k.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="priority">{t(language, 'allocation.priority')}</Label>
                            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as 'high' | 'medium' | 'low' })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="high">{t(language, 'allocation.high')}</SelectItem>
                                    <SelectItem value="medium">{t(language, 'allocation.medium')}</SelectItem>
                                    <SelectItem value="low">{t(language, 'allocation.low')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="type">{t(language, 'allocation.type')}</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'percentage' | 'nominal' })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">{t(language, 'allocation.percentage')}</SelectItem>
                                    <SelectItem value="nominal">{t(language, 'allocation.nominal')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="value">{t(language, 'allocation.value')}</Label>
                            <Input
                                id="value"
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                placeholder={formData.type === 'percentage' ? '0-100' : '0'}
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {editingId ? t(language, 'common.edit') : t(language, 'common.add')} {t(language, 'allocation.addRule')}
                            </Button>
                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            targetKantongId: '',
                                            priority: 'medium',
                                            type: 'percentage',
                                            value: 0,
                                        });
                                    }}
                                >
                                    {t(language, 'common.cancel')}
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">{t(language, 'common.active')}</h3>
                        {allocationRules.length === 0 ? (
                            <p className="text-gray-500">{t(language, 'allocation.noRules')}</p>
                        ) : (
                            <div className="space-y-2">
                                {allocationRules
                                    .sort((a, b) => {
                                        const priorityOrder = { high: 0, medium: 1, low: 2 };
                                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                                    })
                                    .map((rule) => (
                                        <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex-1">
                                                <p className="font-medium">{getKantongName(rule.targetKantongId)}</p>
                                                <p className="text-sm text-gray-600">
                                                    {rule.type === 'percentage' ? `${rule.value}%` : `Rp ${rule.value.toLocaleString('id-ID')}`}
                                                    {' '}
                                                    <span className="capitalize">({t(language, `allocation.${rule.priority}`)} {t(language, 'allocation.priority')})</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEdit(rule)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDelete(rule.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

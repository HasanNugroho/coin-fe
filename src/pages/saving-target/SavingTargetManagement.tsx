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
import type { SavingTarget } from '../../types';

export default function SavingTargetManagement() {
    const { language } = useLanguageStore();
    const { kantongs, savingTargets, isLoading, error, fetchKantongs, fetchSavingTargets, createSavingTarget, updateSavingTarget, deleteSavingTarget } = useFinanceStore();
    const [formData, setFormData] = useState<Omit<SavingTarget, 'id'>>({
        name: '',
        kantongId: '',
        targetAmount: 0,
        deadline: '',
        note: '',
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchKantongs();
        fetchSavingTargets();
    }, [fetchKantongs, fetchSavingTargets]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.kantongId || formData.targetAmount <= 0 || !formData.deadline) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            if (editingId) {
                await updateSavingTarget(editingId, formData);
                setEditingId(null);
            } else {
                await createSavingTarget(formData);
            }
            setFormData({
                name: '',
                kantongId: '',
                targetAmount: 0,
                deadline: '',
                note: '',
            });
        } catch (err) {
            console.error('Error saving saving target:', err);
        }
    };

    const handleEdit = (target: SavingTarget) => {
        setFormData({
            name: target.name,
            kantongId: target.kantongId,
            targetAmount: target.targetAmount,
            deadline: target.deadline,
            note: target.note,
        });
        setEditingId(target.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            try {
                await deleteSavingTarget(id);
            } catch (err) {
                console.error('Error deleting saving target:', err);
            }
        }
    };

    const getKantongName = (id: string) => {
        return kantongs.find(k => k.id === id)?.name || 'Unknown';
    };

    const getKantongBalance = (id: string) => {
        return kantongs.find(k => k.id === id)?.balance || 0;
    };

    const getProgressPercentage = (current: number, target: number) => {
        return target > 0 ? Math.round((current / target) * 100) : 0;
    };

    const getDaysRemaining = (deadline: string) => {
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const diff = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">{t(language, 'savingTarget.title')}</h1>
                <p className="text-gray-600 mt-2">{language === 'id' ? 'Tetapkan dan lacak tujuan tabungan Anda' : 'Set and track your savings goals'}</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? t(language, 'savingTarget.editTarget') : t(language, 'savingTarget.addTarget')}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">{t(language, 'savingTarget.name')}</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Emergency Fund"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="kantong">{t(language, 'savingTarget.kantong')}</Label>
                            <Select value={formData.kantongId} onValueChange={(value) => setFormData({ ...formData, kantongId: value })}>
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
                            <Label htmlFor="targetAmount">{t(language, 'savingTarget.targetAmount')}</Label>
                            <Input
                                id="targetAmount"
                                type="number"
                                value={formData.targetAmount}
                                onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                                placeholder="0"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="deadline">{t(language, 'savingTarget.deadline')}</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="note">{t(language, 'savingTarget.note')} ({t(language, 'common.optional')})</Label>
                            <Input
                                id="note"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                placeholder="Add notes..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {editingId ? t(language, 'common.edit') : t(language, 'common.add')} {t(language, 'savingTarget.addTarget')}
                            </Button>
                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({
                                            name: '',
                                            kantongId: '',
                                            targetAmount: 0,
                                            deadline: '',
                                            note: '',
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
                        {savingTargets.length === 0 ? (
                            <p className="text-gray-500">{language === 'id' ? 'Belum ada target tabungan' : 'No saving targets yet'}</p>
                        ) : (
                            <div className="space-y-3">
                                {savingTargets.map((target) => {
                                    const currentBalance = getKantongBalance(target.kantongId);
                                    const progress = getProgressPercentage(currentBalance, target.targetAmount);
                                    const daysRemaining = getDaysRemaining(target.deadline);
                                    const isOverdue = daysRemaining < 0;

                                    return (
                                        <div key={target.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium">{target.name}</p>
                                                    <p className="text-sm text-gray-600">{getKantongName(target.kantongId)}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(target)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(target.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Rp {currentBalance.toLocaleString('id-ID')} / Rp {target.targetAmount.toLocaleString('id-ID')}</span>
                                                    <span className={progress >= 100 ? 'text-green-600 font-medium' : ''}>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${progress >= 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-600">
                                                    <span>{t(language, 'savingTarget.deadline')}: {new Date(target.deadline).toLocaleDateString('id-ID')}</span>
                                                    <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                                                        {isOverdue ? `${Math.abs(daysRemaining)} ${language === 'id' ? 'hari terlewat' : 'days overdue'}` : `${daysRemaining} ${language === 'id' ? 'hari tersisa' : 'days left'}`}
                                                    </span>
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

import { useEffect, useState } from 'react';
import { useFinanceStore } from '../../store/finance.store';
import { useAllocationStore } from '../../store/allocation.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { AllocationRuleForm } from '../../components/allocation/AllocationRuleForm';
import { AllocationRuleList } from '../../components/allocation/AllocationRuleList';
import { AllocationPreview } from '../../components/allocation/AllocationPreview';
import type { AllocationRule } from '../../types';

export default function AutoAllocationPage() {
    const { kantongs, fetchKantongs } = useFinanceStore();
    const { language } = useLanguageStore();
    const {
        rules,
        isLoading,
        error,
        fetchRules,
        addRule,
        updateRule,
        deleteRule,
        toggleRuleActive,
        clearError,
    } = useAllocationStore();

    const [formOpen, setFormOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AllocationRule | undefined>();
    const [previewIncome, setPreviewIncome] = useState(10000000);

    useEffect(() => {
        fetchKantongs();
        fetchRules();
    }, [fetchKantongs, fetchRules]);

    const handleAddRule = () => {
        setEditingRule(undefined);
        setFormOpen(true);
    };

    const handleEditRule = (rule: AllocationRule) => {
        setEditingRule(rule);
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: Omit<AllocationRule, 'id'>) => {
        try {
            if (editingRule) {
                await updateRule(editingRule.id, data);
            } else {
                await addRule(data);
            }
        } catch (err) {
            console.error('Error saving rule:', err);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (confirm(t(language, 'messages.confirmDelete'))) {
            try {
                await deleteRule(id);
            } catch (err) {
                console.error('Error deleting rule:', err);
            }
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await toggleRuleActive(id);
        } catch (err) {
            console.error('Error toggling rule:', err);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'allocation.settings')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Atur aturan alokasi pendapatan otomatis Anda' : 'Set up your automatic income allocation rules'}</p>
            </div>

            {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex justify-between items-center">
                <span>{error}</span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                >
                    ✕
                </Button>
            </div>
        )
    }

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <AllocationRuleList
                        rules={rules}
                        kantongs={kantongs}
                        onAdd={handleAddRule}
                        onEdit={handleEditRule}
                        onDelete={handleDeleteRule}
                        onToggleActive={handleToggleActive}
                        isLoading={isLoading}
                    />

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                                    1
                                </div>
                                <p>
                                    <strong>High Priority</strong> rules are applied first to your income
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">
                                    2
                                </div>
                                <p>
                                    <strong>Medium Priority</strong> rules are applied next
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                    3
                                </div>
                                <p>
                                    <strong>Low Priority</strong> rules are applied last
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2 border-t border-gray-200">
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                    ✓
                                </div>
                                <p>
                                    <strong>Remaining income</strong> goes to your Free Cash pocket
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Test Preview</h3>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="previewIncome">Income Amount</Label>
                            <Input
                                id="previewIncome"
                                type="number"
                                value={previewIncome}
                                onChange={(e) => setPreviewIncome(parseFloat(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                    </Card>

                    <AllocationPreview
                        rules={rules}
                        kantongs={kantongs}
                        incomeAmount={previewIncome}
                    />
                </div>
            </div>

            <AllocationRuleForm
                open={formOpen}
                onOpenChange={setFormOpen}
                rule={editingRule}
                kantongs={kantongs}
                onSubmit={handleFormSubmit}
            />
        </div >
    );
}

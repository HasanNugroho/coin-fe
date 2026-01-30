import type { AllocationRule, Kantong } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { AllocationRuleItem } from './AllocationRuleItem';

interface AllocationRuleListProps {
    rules: AllocationRule[];
    kantongs: Kantong[];
    onAdd: () => void;
    onEdit: (rule: AllocationRule) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
    isLoading: boolean;
}

export function AllocationRuleList({
    rules,
    kantongs,
    onAdd,
    onEdit,
    onDelete,
    onToggleActive,
    isLoading,
}: AllocationRuleListProps) {
    const getPriorityRules = (priority: 'high' | 'medium' | 'low') => {
        return rules.filter((r) => r.priority === priority);
    };

    const getPriorityLabel = (priority: string) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-700 bg-red-50 border-red-200';
            case 'medium':
                return 'text-yellow-700 bg-yellow-50 border-yellow-200';
            case 'low':
                return 'text-green-700 bg-green-50 border-green-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    const renderPrioritySection = (priority: 'high' | 'medium' | 'low') => {
        const priorityRules = getPriorityRules(priority);
        if (priorityRules.length === 0) return null;

        return (
            <div key={priority} className="space-y-3">
                <div className={`px-4 py-2 rounded-lg border ${getPriorityColor(priority)}`}>
                    <h3 className="font-semibold text-sm">
                        {getPriorityLabel(priority)} Priority
                    </h3>
                </div>
                <div className="space-y-2 pl-2">
                    {priorityRules.map((rule) => (
                        <AllocationRuleItem
                            key={rule.id}
                            rule={rule}
                            kantong={kantongs.find((k) => k.id === rule.targetKantongId)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleActive={onToggleActive}
                            isLoading={isLoading}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Allocation Rules</CardTitle>
                <Button onClick={onAdd} disabled={isLoading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                </Button>
            </CardHeader>
            <CardContent>
                {rules.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                            No allocation rules yet. Create one to get started.
                        </p>
                        <Button onClick={onAdd} disabled={isLoading}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Rule
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {renderPrioritySection('high')}
                        {renderPrioritySection('medium')}
                        {renderPrioritySection('low')}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

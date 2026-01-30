import type { AllocationRule, Kantong } from '../../types';
import { Button } from '../ui/button';
import { Edit2, Trash2 } from 'lucide-react';

interface AllocationRuleItemProps {
    rule: AllocationRule;
    kantong: Kantong | undefined;
    onEdit: (rule: AllocationRule) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string) => void;
    isLoading: boolean;
}

export function AllocationRuleItem({
    rule,
    kantong,
    onEdit,
    onDelete,
    onToggleActive,
    isLoading,
}: AllocationRuleItemProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority: string) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
    };

    const formatValue = () => {
        if (rule.type === 'percentage') {
            return `${rule.value}%`;
        }
        return `Rp ${rule.value.toLocaleString('id-ID')}`;
    };

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg border ${
                rule.isActive
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
        >
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="font-medium text-gray-900">
                            {kantong?.name || 'Unknown Pocket'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatValue()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(rule.priority)}`}>
                    {getPriorityLabel(rule.priority)}
                </span>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={() => onToggleActive(rule.id)}
                        disabled={isLoading}
                        className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-600">Active</span>
                </label>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(rule)}
                    disabled={isLoading}
                >
                    <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(rule.id)}
                    disabled={isLoading}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}

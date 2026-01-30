import type { AllocationRule, Kantong } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { formatCurrency } from '../../utils/format';

interface AllocationPreviewProps {
    rules: AllocationRule[];
    kantongs: Kantong[];
    incomeAmount: number;
}

export function AllocationPreview({
    rules,
    kantongs,
    incomeAmount,
}: AllocationPreviewProps) {
    const activeRules = rules.filter((r) => r.isActive);

    // Sort by priority
    const sortedRules = [...activeRules].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let remaining = incomeAmount;
    const allocations: Array<{
        kantongId: string;
        kantongName: string;
        amount: number;
        priority: string;
    }> = [];

    // Calculate allocations
    for (const rule of sortedRules) {
        const kantong = kantongs.find((k) => k.id === rule.targetKantongId);
        if (!kantong) continue;

        let amount = 0;
        if (rule.type === 'percentage') {
            amount = Math.floor(incomeAmount * (rule.value / 100));
        } else {
            amount = rule.value;
        }

        if (amount <= remaining) {
            allocations.push({
                kantongId: rule.targetKantongId,
                kantongName: kantong.name,
                amount,
                priority: rule.priority,
            });
            remaining -= amount;
        }
    }

    // Group by priority
    const highPriority = allocations.filter((a) => a.priority === 'high');
    const mediumPriority = allocations.filter((a) => a.priority === 'medium');
    const lowPriority = allocations.filter((a) => a.priority === 'low');

    const renderAllocationGroup = (
        title: string,
        items: typeof allocations,
        color: string
    ) => {
        if (items.length === 0) return null;

        return (
            <div className="space-y-2">
                <h4 className={`text-sm font-semibold ${color}`}>{title}</h4>
                {items.map((item) => (
                    <div key={item.kantongId} className="flex justify-between text-sm pl-4">
                        <span className="text-gray-700">{item.kantongName}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Allocation Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600">Income Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(incomeAmount)}
                    </p>
                </div>

                {activeRules.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No active allocation rules. All income will go to Free Cash.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {renderAllocationGroup(
                            'High Priority',
                            highPriority,
                            'text-red-600'
                        )}
                        {renderAllocationGroup(
                            'Medium Priority',
                            mediumPriority,
                            'text-yellow-600'
                        )}
                        {renderAllocationGroup(
                            'Low Priority',
                            lowPriority,
                            'text-green-600'
                        )}

                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700 font-medium">
                                    Remaining (Free Cash)
                                </span>
                                <span className="font-bold text-gray-900">
                                    {formatCurrency(remaining)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import type { AllocationRule } from '../types';

const DUMMY_ALLOCATION_RULES: AllocationRule[] = [
    {
        id: '1',
        targetKantongId: '2',
        priority: 'high',
        type: 'percentage',
        value: 30,
        isActive: true,
    },
    {
        id: '2',
        targetKantongId: '3',
        priority: 'medium',
        type: 'percentage',
        value: 20,
        isActive: true,
    },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const allocationService = {
    async getAll(): Promise<AllocationRule[]> {
        await delay(300);
        return [...DUMMY_ALLOCATION_RULES];
    },

    async getById(id: string): Promise<AllocationRule | null> {
        await delay(200);
        return DUMMY_ALLOCATION_RULES.find(r => r.id === id) || null;
    },

    async create(rule: Omit<AllocationRule, 'id'>): Promise<AllocationRule> {
        await delay(400);
        const newRule: AllocationRule = {
            ...rule,
            id: Date.now().toString(),
        };
        DUMMY_ALLOCATION_RULES.push(newRule);
        return newRule;
    },

    async update(id: string, updates: Partial<AllocationRule>): Promise<AllocationRule> {
        await delay(400);
        const index = DUMMY_ALLOCATION_RULES.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Allocation rule not found');

        DUMMY_ALLOCATION_RULES[index] = { ...DUMMY_ALLOCATION_RULES[index], ...updates };
        return DUMMY_ALLOCATION_RULES[index];
    },

    async delete(id: string): Promise<void> {
        await delay(300);
        const index = DUMMY_ALLOCATION_RULES.findIndex(r => r.id === id);
        if (index !== -1) {
            DUMMY_ALLOCATION_RULES.splice(index, 1);
        }
    },

    async previewAllocation(incomeAmount: number): Promise<{
        allocations: { kantongId: string; amount: number; priority: string }[];
        remaining: number;
    }> {
        await delay(300);
        const rules = await this.getAll();
        const sorted = rules.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        const allocations: { kantongId: string; amount: number; priority: string }[] = [];
        let remaining = incomeAmount;

        for (const rule of sorted) {
            const amount = rule.type === 'percentage'
                ? Math.floor(incomeAmount * (rule.value / 100))
                : rule.value;

            if (amount <= remaining) {
                allocations.push({
                    kantongId: rule.targetKantongId,
                    amount,
                    priority: rule.priority,
                });
                remaining -= amount;
            }
        }

        return { allocations, remaining };
    },
};

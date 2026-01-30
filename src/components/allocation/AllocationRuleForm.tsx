import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { AllocationRule, Kantong } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';

const allocationRuleSchema = z.object({
    targetKantongId: z.string().min(1, 'Please select a target pocket'),
    priority: z.enum(['high', 'medium', 'low']),
    type: z.enum(['percentage', 'nominal']),
    value: z.number().min(0.01, 'Value must be greater than 0'),
    isActive: z.boolean(),
});

type AllocationRuleFormData = z.infer<typeof allocationRuleSchema>;

interface AllocationRuleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    rule?: AllocationRule;
    kantongs: Kantong[];
    onSubmit: (data: Omit<AllocationRule, 'id'>) => Promise<void>;
}

export function AllocationRuleForm({
    open,
    onOpenChange,
    rule,
    kantongs,
    onSubmit,
}: AllocationRuleFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AllocationRuleFormData>({
        resolver: zodResolver(allocationRuleSchema),
        defaultValues: rule || {
            targetKantongId: '',
            priority: 'medium',
            type: 'percentage',
            value: 0,
            isActive: true,
        },
    });

    const allocationType = watch('type');
    const selectedKantongId = watch('targetKantongId');

    useEffect(() => {
        if (rule) {
            setValue('targetKantongId', rule.targetKantongId);
            setValue('priority', rule.priority);
            setValue('type', rule.type);
            setValue('value', rule.value);
            setValue('isActive', rule.isActive);
        }
    }, [rule, setValue]);

    const handleFormSubmit = async (data: AllocationRuleFormData) => {
        try {
            await onSubmit(data);
            reset();
            onOpenChange(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {rule ? 'Edit Allocation Rule' : 'Add Allocation Rule'}
                    </DialogTitle>
                    <DialogDescription>
                        {rule
                            ? 'Update how income is distributed to this pocket'
                            : 'Create a new rule for automatic income distribution'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="targetKantongId">Target Pocket</Label>
                        <Select
                            value={selectedKantongId}
                            onValueChange={(value) => setValue('targetKantongId', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select pocket" />
                            </SelectTrigger>
                            <SelectContent>
                                {kantongs.map((kantong) => (
                                    <SelectItem key={kantong.id} value={kantong.id}>
                                        {kantong.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.targetKantongId && (
                            <p className="text-sm text-red-600">{errors.targetKantongId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={watch('priority')}
                            onValueChange={(value) =>
                                setValue('priority', value as 'high' | 'medium' | 'low')
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label>Allocation Type</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="percentage"
                                    {...register('type')}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Percentage (%)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="nominal"
                                    {...register('type')}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">Nominal Amount</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="value">
                            {allocationType === 'percentage' ? 'Percentage (0-100)' : 'Amount (Rp)'}
                        </Label>
                        <Input
                            id="value"
                            type="number"
                            step={allocationType === 'percentage' ? '0.1' : '1'}
                            placeholder={allocationType === 'percentage' ? '0-100' : '0'}
                            {...register('value', { valueAsNumber: true })}
                        />
                        {errors.value && (
                            <p className="text-sm text-red-600">{errors.value.message}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            {...register('isActive')}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                            Active
                        </Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : rule ? 'Update' : 'Add'} Rule
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

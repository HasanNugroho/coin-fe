import { useEffect, useState } from 'react';
import { useFinanceStore } from '../../store/finance.store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card } from '../../components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import type { Platform } from '../../types';

export default function PlatformManagement() {
    const { platforms, isLoading, error, fetchPlatforms, createPlatform, updatePlatform, deletePlatform } = useFinanceStore();
    const [formData, setFormData] = useState<Omit<Platform, 'id'>>({
        name: '',
        type: 'bank',
        isSystem: false,
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlatforms();
    }, [fetchPlatforms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updatePlatform(editingId, formData);
                setEditingId(null);
            } else {
                await createPlatform(formData);
            }
            setFormData({ name: '', type: 'bank', isSystem: false });
        } catch (err) {
            console.error('Error saving platform:', err);
        }
    };

    const handleEdit = (platform: Platform) => {
        setFormData({
            name: platform.name,
            type: platform.type,
            isSystem: platform.isSystem,
        });
        setEditingId(platform.id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this platform?')) {
            try {
                await deletePlatform(id);
            } catch (err) {
                console.error('Error deleting platform:', err);
            }
        }
    };

    const customPlatforms = platforms.filter(p => !p.isSystem);
    const systemPlatforms = platforms.filter(p => p.isSystem);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Platform Management</h1>
                <p className="text-gray-600 mt-2">Manage payment platforms and methods</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Edit Platform' : 'Add Platform'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Platform Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Mandiri, LinkAja"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as 'bank' | 'ewallet' | 'cash' | 'credit' })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Bank</SelectItem>
                                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="credit">Credit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {editingId ? 'Update' : 'Add'} Platform
                            </Button>
                            {editingId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', type: 'bank', isSystem: false });
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    {systemPlatforms.length > 0 && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">System Platforms</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {systemPlatforms.map((platform) => (
                                    <div key={platform.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                                        <p className="font-medium text-sm">{platform.name}</p>
                                        <p className="text-xs text-gray-600 capitalize">{platform.type}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {customPlatforms.length > 0 && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Custom Platforms</h3>
                            <div className="space-y-2">
                                {customPlatforms.map((platform) => (
                                    <div key={platform.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                        <div>
                                            <p className="font-medium">{platform.name}</p>
                                            <p className="text-sm text-gray-600 capitalize">{platform.type}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(platform)}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(platform.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

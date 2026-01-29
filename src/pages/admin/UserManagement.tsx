import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAdminStore } from '../../store/admin.store';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate } from '../../utils/format';

export function UserManagement() {
    const { users, fetchUsers, updateUserStatus, isLoading } = useAdminStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            await updateUserStatus(userId, newStatus as 'active' | 'disabled');
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-2 text-gray-600">Manage system users and their status</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="flex h-32 items-center justify-center">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-left font-medium">Email</th>
                                        <th className="pb-3 text-left font-medium">Phone</th>
                                        <th className="pb-3 text-left font-medium">Role</th>
                                        <th className="pb-3 text-left font-medium">Status</th>
                                        <th className="pb-3 text-left font-medium">Created</th>
                                        <th className="pb-3 text-left font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3">{user.email}</td>
                                            <td className="py-3 text-gray-500">{user.phone || '-'}</td>
                                            <td className="py-3">
                                                <span
                                                    className={`rounded-full px-2 py-1 text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <div className="flex items-center gap-2">
                                                    {user.status === 'active' ? (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                            <span className="text-green-600">Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                            <span className="text-red-600">Disabled</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                                            <td className="py-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                    disabled={isLoading}
                                                >
                                                    {user.status === 'active' ? 'Disable' : 'Enable'}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../store/admin.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function UserManagement() {
    const { language } = useLanguageStore();
    const { users, fetchUsers, updateUserStatus, deleteUser, isLoading, error } = useAdminStore();
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleStatus = async (userId: string, isActive: boolean) => {
        const newStatus = isActive ? 'disabled' : 'active';
        try {
            await updateUserStatus(userId, newStatus);
        } catch (err) {
            console.error('Failed to update user status:', err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId);
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="text-gray-500">{t(language, 'common.loading')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t(language, 'admin.users')}</h1>
                <p className="mt-2 text-gray-600">{language === 'id' ? 'Kelola pengguna sistem dan status mereka' : 'Manage system users and their status'}</p>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{t(language, 'admin.users')} ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="flex h-32 items-center justify-center">
                            <p className="text-gray-500">{t(language, 'messages.noResults')}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-left font-medium">{t(language, 'auth.email')}</th>
                                        <th className="pb-3 text-left font-medium">{language === 'id' ? 'Nama' : 'Name'}</th>
                                        <th className="pb-3 text-left font-medium">{t(language, 'profile.phone')}</th>
                                        <th className="pb-3 text-left font-medium">{t(language, 'admin.role')}</th>
                                        <th className="pb-3 text-left font-medium">{t(language, 'admin.status')}</th>
                                        <th className="pb-3 text-left font-medium">{language === 'id' ? 'Aksi' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const isActive = user.is_active !== false;
                                        return (
                                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3">{user.email}</td>
                                                <td className="py-3">{user.name || '-'}</td>
                                                <td className="py-3 text-gray-500">{user.phone || '-'}</td>
                                                <td className="py-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                    >
                                                        {user.role || 'user'}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        {isActive ? (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <span className="text-green-600">{t(language, 'admin.active')}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                                <span className="text-red-600">{t(language, 'admin.disabled')}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(user.id, isActive)}
                                                            disabled={isLoading}
                                                        >
                                                            {isActive ? (language === 'id' ? 'Nonaktifkan' : 'Disable') : (language === 'id' ? 'Aktifkan' : 'Enable')}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteConfirm(user.id)}
                                                            disabled={isLoading}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {deleteConfirm && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="mb-4 text-sm text-red-800">
                            {language === 'id'
                                ? 'Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.'
                                : 'Are you sure you want to delete this user? This action cannot be undone.'}
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                {language === 'id' ? 'Batal' : 'Cancel'}
                            </Button>
                            <Button
                                onClick={() => deleteConfirm && handleDeleteUser(deleteConfirm)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {language === 'id' ? 'Hapus' : 'Delete'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

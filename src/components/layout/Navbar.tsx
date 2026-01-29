import { Link, useLocation } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, Wallet2, Receipt, BarChart3, User, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';

export function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/kantong', label: 'Kantong', icon: Wallet2 },
        { path: '/transactions', label: 'Transactions', icon: Receipt },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/admin', label: 'Admin', icon: Shield },
    ];

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Wallet className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">DompetKu</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive
                                            ? 'border-blue-600 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="mr-2 text-sm text-gray-700">{user?.name}</span>
                        {user?.role === 'admin' && (
                            <Link to="/admin">
                                <Button variant="outline" size="sm">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Admin
                                </Button>
                            </Link>
                        )}
                        <Link to="/profile">
                            <Button variant="ghost" size="sm">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

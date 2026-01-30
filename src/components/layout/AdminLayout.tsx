import { Outlet, Link, useLocation } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, Users, Settings, Package, User } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { Button } from '../ui/button';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from '@/lib/utils';


export function AdminLayout() {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { language } = useLanguageStore();

    const handleLogout = async () => {
        await logout();
    };

    const adminNavItems = [
        { path: '/admin', label: t(language, 'navigation.dashboard'), icon: LayoutDashboard },
        { path: '/admin/users', label: t(language, 'navigation.users'), icon: Users },
        { path: '/admin/categories', label: t(language, 'navigation.categories'), icon: Settings },
        { path: '/admin/kantong-template', label: t(language, 'navigation.kantong-template'), icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Wallet className="h-8 w-8 text-purple-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">DompetKu Admin</span>
                                <span className="ml-4 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                                    ADMIN
                                </span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {adminNavItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${isActive
                                                ? 'border-purple-600 text-gray-900'
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
                        {/* <div className="flex items-center">
                            <span className="mr-4 text-sm text-gray-700">{user?.name}</span>
                            <div className="mr-2">
                                <LanguageSwitcher />
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div> */}
                        <div className="flex items-center justify-end">
                            <DropdownMenu>

                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                                                {getInitials(user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>


                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        {user?.name}
                                    </DropdownMenuLabel>

                                    <DropdownMenuSeparator />

                                    {/* Language */}
                                    <DropdownMenuItem asChild>
                                        <div className="w-full">
                                            <LanguageSwitcher />
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            {t(language, "navigation.profile")}
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        {t(language, "navigation.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}

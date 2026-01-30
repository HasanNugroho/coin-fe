import { Link, useLocation } from 'react-router-dom';
import { Wallet, LogOut, LayoutDashboard, Wallet2, Receipt, BarChart3, User, Shield, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useLanguageStore } from '../../store/language.store';
import { t } from '../../i18n';
import { Button } from '../ui/button';
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

export function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { language } = useLanguageStore();

    const handleLogout = async () => {
        await logout();
    };

    const navItems = [
        { path: '/dashboard', label: t(language, 'navigation.dashboard'), icon: LayoutDashboard },
        { path: '/kantong', label: t(language, 'navigation.kantong'), icon: Wallet2 },
        { path: '/transactions', label: t(language, 'navigation.transactions'), icon: Receipt },
        { path: '/reports', label: t(language, 'navigation.reports'), icon: BarChart3 },
    ];

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
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
                                    <Link to="/settings/auto-allocation" className="flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        {t(language, "navigation.settings")}
                                    </Link>
                                </DropdownMenuItem>

                                {user?.role === "admin" && (
                                    <DropdownMenuItem asChild>
                                        <Link to="/admin" className="flex items-center">
                                            <Shield className="mr-2 h-4 w-4" />
                                            {t(language, "navigation.admin")}
                                        </Link>
                                    </DropdownMenuItem>
                                )}

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
    );
}

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SettingsDialog } from './SettingsDialog';
import { useState } from 'react';

export const UserProfile: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!user) return null;

    const initials = user.email
        ? user.email.substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="p-4 border-t border-slate-800">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-800 transition-colors outline-none group">
                    <Avatar className="h-9 w-9 border border-indigo-500/30">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-indigo-950 text-indigo-200">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left hidden md:block">
                        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {user.email}
                        </p>
                    </div>
                    <Settings className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors hidden md:block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem className="focus:bg-slate-800 focus:text-white cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="focus:bg-slate-800 focus:text-white cursor-pointer"
                        onClick={() => setIsSettingsOpen(true)}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={signOut} className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </div >
    );
};

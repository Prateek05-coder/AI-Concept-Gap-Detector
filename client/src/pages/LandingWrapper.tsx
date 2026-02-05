import React, { useState } from 'react';
import Onboarding from '../components/external/Onboarding';
import Auth from '../components/external/Auth';
import { ViewState } from '../lib/external-types';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

interface LandingWrapperProps {
    children: React.ReactNode;
}

const LandingWrapper: React.FC<LandingWrapperProps> = ({ children }) => {
    const [view, setView] = useState<ViewState>('ONBOARDING');
    const { session, loading } = useAuth();

    useEffect(() => {
        if (session) {
            setView('DASHBOARD');
        }
    }, [session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-[100dvh] bg-[#020617] text-slate-200">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    const renderView = () => {
        switch (view) {
            case 'ONBOARDING':
                return <Onboarding onComplete={() => setView('AUTH')} />;
            case 'AUTH':
                if (session) return <>{children}</>;
                return <Auth onLogin={() => { }} />;
            case 'DASHBOARD':
            case 'CHAT':
                if (!session) return <Auth onLogin={() => { }} />;
                return <>{children}</>;
            default:
                return <Onboarding onComplete={() => setView('AUTH')} />;
        }
    };

    return (
        <div className="w-full h-[100dvh] bg-[#020617] font-sans antialiased text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Global Desktop Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

            {/* Main View Container */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {renderView()}
            </div>
        </div>
    );
};

export default LandingWrapper;


import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface AuthProps {
    onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                toast({
                    title: "Confirmation mail sent",
                    description: "Kindly approve the confirmation email sent to your inbox.",
                });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLogin();
            }
        } catch (error: any) {
            toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            toast({
                title: "Google Login Error",
                description: error.message,
                variant: "destructive"
            });
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center p-6 relative bg-[#020617] overflow-y-auto absolute inset-0 z-50">
            <div className="w-full max-w-md mx-auto flex flex-col min-h-[600px]">
                {/* Background Decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full flex-1 flex flex-col">
                    <div className="w-full flex items-center mb-8">
                        <button className="p-2 rounded-full glass hover:bg-white/10 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="flex-1 text-center text-xl font-semibold text-white mr-9">
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            <p className="text-slate-400">
                                {isSignUp ? 'Please fill the details to create account' : 'Enter your details to sign in'}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleAuth}>
                            {/* Email Input */}
                            <div className="space-y-2 group">
                                <label className="text-sm text-slate-300 ml-1">Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="yourmail@gmail.com"
                                        className="w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-600 hover:border-slate-600"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2 group">
                                <label className="text-sm text-slate-300 ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-slate-600 hover:border-slate-600"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {!isSignUp && (
                                <div className="flex justify-end">
                                    <button type="button" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</button>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-slate-700"></div>
                                <span className="flex-shrink mx-4 text-slate-500 text-sm">Or {isSignUp ? 'sign up' : 'sign in'} with</span>
                                <div className="flex-grow border-t border-slate-700"></div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full py-3.5 glass rounded-xl flex items-center justify-center gap-3 text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-slate-500">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                >
                                    {isSignUp ? 'Sign In Now' : 'Sign Up Now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

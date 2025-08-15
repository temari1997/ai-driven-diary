import React, { useState, FormEvent } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthViewProps {
    onAuthSuccess: (user: User) => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const newUser = await authService.signUp(email, password);
                onAuthSuccess(newUser);
            } else if (mode === 'signin') {
                const user = await authService.signIn(email, password);
                onAuthSuccess(user);
            } else { // reset
                await authService.resetPassword(email);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setEmail('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-200 dark:from-gray-900 dark:via-purple-900/50 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/50 dark:bg-gray-800/50 p-8 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-mplus text-gray-800 dark:text-white">AI Diary</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {mode === 'signin' && 'Sign in to continue'}
                        {mode === 'signup' && 'Create a new account'}
                        {mode === 'reset' && 'Reset your password'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white/50 dark:bg-gray-700/50"
                        />
                    </div>
                    
                    {mode !== 'reset' && (
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white/50 dark:bg-gray-700/50"
                            />
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Processing...' : (
                                mode === 'signin' ? 'Sign In' :
                                mode === 'signup' ? 'Sign Up' : 'Send Reset Link'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    {mode === 'signin' && (
                        <p className="text-gray-600 dark:text-gray-400">
                            No account?{' '}
                            <button onClick={() => switchMode('signup')} className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                                Sign up
                            </button>
                        </p>
                    )}
                    {mode === 'signup' && (
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <button onClick={() => switchMode('signin')} className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                                Sign in
                            </button>
                        </p>
                    )}
                    {mode !== 'reset' && (
                         <p className="mt-2">
                             <button onClick={() => switchMode('reset')} className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                                Forgot your password?
                            </button>
                         </p>
                    )}
                     {mode === 'reset' && (
                         <p className="mt-2">
                             <button onClick={() => switchMode('signin')} className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
                                Back to Sign In
                            </button>
                         </p>
                    )}
                </div>
            </div>
        </div>
    );
};
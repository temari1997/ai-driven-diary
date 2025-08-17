import React, { useState, FormEvent } from 'react';
import { authService } from '../services/authService';

// The onAuthSuccess prop is removed, as auth state will be handled globally.
interface AuthViewProps {}

type AuthMode = 'signin' | 'signup' | 'reset';

export const AuthView: React.FC<AuthViewProps> = () => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthError = (err: any) => {
        // Firebase provides structured error codes, which can be used for i18n
        switch (err.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                setError('Invalid email or password.');
                break;
            case 'auth/email-already-in-use':
                setError('An account with this email already exists.');
                break;
            case 'auth/weak-password':
                setError('The password is too weak. Please use at least 6 characters.');
                break;
            default:
                setError(err.message || 'An unexpected error occurred.');
                break;
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                await authService.signUpWithEmail(email, password);
                // No need to call onAuthSuccess, the global listener will handle it.
            } else if (mode === 'signin') {
                await authService.signInWithEmail(email, password);
                // No need to call onAuthSuccess, the global listener will handle it.
            } else { // reset
                await authService.resetPassword(email);
            }
        } catch (err: any) {
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await authService.signInWithGoogle();
            // No need to call onAuthSuccess, the global listener will handle it.
        } catch (err: any) {
            handleAuthError(err);
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

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>
                </div>

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
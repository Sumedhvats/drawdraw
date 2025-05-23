"use client"
import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface AuthPageProps {
  isSignUp: boolean;
}

const AuthPage = ({ isSignUp }:{isSignUp :boolean}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Handle authentication logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      console.log('Form submitted:', { email, password, name });
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#13111C] to-[#0F0A1D]  flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">DrawDraw</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-gray-400">
            {isSignUp
              ? 'Start creating amazing drawings today'
              : 'Sign in to continue drawing'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-[#1C1E2D] p-8 rounded-2xl">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-[#14161F] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-[#14161F] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 bg-[#14161F] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <a
              href={isSignUp ? '/login' : '/signup'}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
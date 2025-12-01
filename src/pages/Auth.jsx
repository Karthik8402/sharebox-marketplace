import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Navigate } from "react-router-dom";
import { Share2, ArrowRight, Sparkles, ShieldCheck, Globe } from "lucide-react";

export default function Auth() {
  const { user, signInWithGoogle, error } = useAuth();
  const { currentTheme } = useTheme();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      {/* Left Panel - Visual/Brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-600">
        {/* Background Gradients & Patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 animate-gradient-xy"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        {/* Floating Shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 text-white">
          <div>
            <div className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Share2 className="w-8 h-8" />
              </div>
              ShareBox
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              Share your items,<br />
              <span className="text-blue-200">Connect with others.</span>
            </h1>
            <p className="text-lg text-blue-100 max-w-md">
              Join our community to donate items you no longer need or find valuable goods at great prices. Sustainable sharing starts here.
            </p>

            <div className="flex gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                <Globe className="w-4 h-4" />
                Global Community
              </div>
              <div className="flex items-center gap-2 text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                <ShieldCheck className="w-4 h-4" />
                Secure Platform
              </div>
            </div>
          </div>

          <div className="text-sm text-blue-200/60">
            © 2024 ShareBox Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        {/* Mobile Background Decoration */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${currentTheme === 'dark' ? 'bg-blue-500' : 'bg-blue-300'
            }`}></div>
          <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 ${currentTheme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
            }`}></div>
        </div>

        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className={`p-3 rounded-xl ${currentTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                }`}>
                <Share2 className="w-10 h-10" />
              </div>
            </div>
            <h2 className={`text-3xl font-bold tracking-tight ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
              Welcome Back
            </h2>
            <p className={`mt-2 text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
              Sign in to access your account and start sharing
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3 animate-fade-in">
                <div className="text-red-500 mt-0.5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={signInWithGoogle}
                className={`group relative w-full flex items-center justify-center gap-3 py-3.5 px-4 border text-sm font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${currentTheme === 'dark'
                    ? 'bg-white text-gray-900 hover:bg-gray-100 border-transparent'
                    : 'bg-gray-900 text-white hover:bg-gray-800 border-transparent shadow-lg shadow-gray-900/20'
                  }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
                <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-500' : 'bg-gray-50 text-gray-500'}`}>
                  Secure authentication powered by Firebase
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

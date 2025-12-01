import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    const { currentTheme } = useTheme();

    return (
        <div className={`min-h-screen pt-20 flex items-center justify-center transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="text-center px-4">
                <div className="relative mb-8">
                    <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-2xl font-bold px-6 py-2 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600 shadow-lg'
                            }`}>
                            Page Not Found
                        </div>
                    </div>
                </div>

                <p className={`text-lg mb-8 max-w-md mx-auto ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Oops! The page you're looking for seems to have gone missing. It might have been moved or deleted.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>

                    <Link
                        to="/items"
                        className={`flex items-center px-6 py-3 border-2 rounded-xl font-semibold transition-colors w-full sm:w-auto justify-center ${currentTheme === 'dark'
                                ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                                : 'border-gray-200 text-gray-700 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        <Search className="w-5 h-5 mr-2" />
                        Browse Items
                    </Link>
                </div>
            </div>
        </div>
    );
}

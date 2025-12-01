// src/components/Navbar.jsx - Modern Redesign
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LogOut,
  Plus,
  Home,
  List,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
  Bell,
  Settings,
  Heart,
  ShoppingBag,
  MessageCircle,
  Sun,
  Moon,
  Monitor,
  Palette,
  Sparkles
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, currentTheme, changeTheme, mounted } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const themeRef = useRef(null);

  // Handle scroll effect for floating navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/items", label: "Browse", icon: List },
  ];

  const userLinks = user ? [
    { path: "/add-item", label: "Add Item", icon: Plus },
  ] : [];

  const notifications = [
    { id: 1, message: "Your item 'Laptop' received a new inquiry", time: "2m ago", unread: true },
    { id: 2, message: "Item 'Textbook' was successfully donated", time: "1h ago", unread: true },
    { id: 3, message: "You have 3 new messages", time: "3h ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, gradient: 'from-yellow-400 to-orange-400' },
    { value: 'dark', label: 'Dark', icon: Moon, gradient: 'from-indigo-500 to-purple-600' },
    { value: 'system', label: 'System', icon: Monitor, gradient: 'from-blue-500 to-teal-500' }
  ];

  const getThemeIcon = () => {
    if (!mounted) return <Sun size={20} className="animate-pulse" />;
    const IconComponent = currentTheme === 'dark' ? Moon : Sun;
    return <IconComponent size={20} className={`transition-all duration-300 ${currentTheme === 'dark' ? 'text-indigo-400' : 'text-yellow-500'}`} />;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
      ? 'py-2 px-4 md:px-8'
      : 'py-0 px-0'
      }`}>
      <div className={`max-w-7xl mx-auto transition-all duration-500 ${scrolled || isOpen
        ? 'rounded-2xl glass-nav shadow-lg border border-gray-200/50 dark:border-white/10'
        : 'bg-transparent border-transparent backdrop-blur-[2px]'
        }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="group flex items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl rotate-0 group-hover:rotate-3 transition-transform duration-300 border border-gray-100 dark:border-gray-700"></div>
                  <span className="relative text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">S</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ShareBox
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {[...navLinks, ...userLinks].map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden ${isActive(path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon size={16} />
                      {label}
                    </span>
                    {isActive(path) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full"></span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full group">
                <div className="relative flex items-center bg-gray-100/50 dark:bg-gray-800/50 border border-transparent rounded-xl transition-all duration-300">
                  <Search className="ml-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none py-2 px-3 text-sm focus:ring-0 focus:outline-none placeholder-gray-500 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  {getThemeIcon()}
                </button>

                {isThemeOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 p-1 rounded-2xl glass-card shadow-xl animate-scale-in z-50">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          changeTheme(option.value);
                          setIsThemeOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${theme === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                          }`}
                      >
                        <option.icon size={16} />
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {user ? (
                <>
                  {/* Notifications */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      )}
                    </button>

                    {isNotificationOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl glass-card shadow-xl animate-scale-in z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700/50 bg-gray-100 dark:bg-gray-800/50">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((n) => (
                            <div key={n.id} className={`p-4 border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${n.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                              <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile */}
                  <div className="relative ml-2" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=fff`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <ChevronDown size={14} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl glass-card shadow-xl animate-scale-in z-50 p-1">
                        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700/50 mb-1 bg-gray-100 dark:bg-gray-800/50 rounded-t-xl">
                          <p className="font-semibold text-gray-900 dark:text-white truncate text-base">{user.displayName || 'User'}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                          <List size={16} /> Dashboard
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                          <User size={16} /> Profile
                        </Link>
                        <Link to="/chat" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                          <MessageCircle size={16} /> Messages
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-3 ml-4">
                  <Link
                    to="/auth"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 animate-fade-in-up">
            <div className="p-4 space-y-2">
              {[...navLinks, ...userLinks].map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(path)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex justify-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

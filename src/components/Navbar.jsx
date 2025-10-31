// src/components/Navbar.jsx - Complete Corrected Code
import React from "react";
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
  Palette
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

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

  // Handle scroll effect
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
    { path: "/dashboard", label: "Dashboard", icon: User },
  ] : [];

  const notifications = [
    { id: 1, message: "Your item 'Laptop' received a new inquiry", time: "2m ago", unread: true },
    { id: 2, message: "Item 'Textbook' was successfully donated", time: "1h ago", unread: true },
    { id: 3, message: "You have 3 new messages", time: "3h ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Enhanced theme options with descriptions
  const themeOptions = [
    { 
      value: 'light', 
      label: 'Light', 
      icon: Sun,
      description: 'Clean and bright interface',
      gradient: 'from-yellow-400 to-orange-400'
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: Moon,
      description: 'Easy on the eyes in low light',
      gradient: 'from-indigo-500 to-purple-600'
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: Monitor,
      description: 'Follows your device settings',
      gradient: 'from-blue-500 to-teal-500'
    }
  ];

  // Enhanced theme icon with animation
  const getThemeIcon = () => {
    if (!mounted) return <Sun size={20} className="animate-pulse" />;
    
    const IconComponent = currentTheme === 'dark' ? Moon : Sun;
    return (
      <IconComponent 
        size={20} 
        className={`transition-all duration-300 ${
          currentTheme === 'dark' 
            ? 'text-indigo-400 rotate-12' 
            : 'text-yellow-500 rotate-0'
        }`} 
      />
    );
  };

  return (
    // ✅ FIXED: Explicit theme handling for navbar background
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      currentTheme === 'dark'
        ? scrolled
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-gray-900/90 backdrop-blur-sm shadow-sm border-b border-gray-800'
        : scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo Section - Enhanced with theme-aware gradient */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="group flex items-center space-x-2"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-200 ${
                currentTheme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
                  : 'bg-gradient-to-br from-blue-600 to-indigo-600'
              }`}>
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className={`text-2xl font-bold bg-clip-text text-transparent transition-all duration-300 ${
                currentTheme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}>
                ShareBox
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? currentTheme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400 shadow-sm'
                        : 'bg-blue-50 text-blue-600 shadow-sm'
                      : currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search items, users, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-200 ${
                  currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50 placeholder-gray-400 text-gray-100'
                    : 'bg-gray-50/50 border-gray-200/50 placeholder-gray-500 text-gray-900'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    currentTheme === 'dark' 
                      ? 'text-gray-500 hover:text-gray-400' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">

            {/* Search Icon - Mobile */}
            <button className={`lg:hidden p-2 rounded-lg transition-colors ${
              currentTheme === 'dark'
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}>
              <Search size={20} />
            </button>

            {user ? (
              <>
                {/* User Actions - Desktop */}
                <div className="hidden md:flex items-center space-x-1">
                  {userLinks.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(path)
                          ? currentTheme === 'dark'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                          : currentTheme === 'dark'
                            ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                {/* Wishlist */}
                <button className={`hidden sm:flex p-2 rounded-lg transition-colors relative ${
                  currentTheme === 'dark'
                    ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/20'
                    : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                }`}>
                  <Heart size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Cart */}
                <button className={`hidden sm:flex p-2 rounded-lg transition-colors relative ${
                  currentTheme === 'dark'
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}>
                  <ShoppingBag size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </button>

                {/* Messages */}
                <button className={`hidden sm:flex p-2 rounded-lg transition-colors relative ${
                  currentTheme === 'dark'
                    ? 'text-gray-300 hover:text-green-400 hover:bg-green-900/20'
                    : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
                }`}>
                  <MessageCircle size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={`p-2 rounded-lg transition-colors relative ${
                      currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-blue-400 hover:bg-blue-900/20'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg border py-2 z-50 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <div className={`px-4 py-2 border-b ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <h3 className={`font-semibold ${
                          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 cursor-pointer border-l-4 transition-colors ${
                              notification.unread 
                                ? currentTheme === 'dark'
                                  ? 'border-blue-500 bg-blue-900/20 hover:bg-blue-800/30'
                                  : 'border-blue-500 bg-blue-50/30 hover:bg-blue-50'
                                : currentTheme === 'dark'
                                  ? 'border-transparent hover:bg-gray-700'
                                  : 'border-transparent hover:bg-gray-50'
                            }`}
                          >
                            <p className={`text-sm mb-1 ${
                              currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>{notification.message}</p>
                            <p className={`text-xs ${
                              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className={`px-4 py-2 border-t ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <button className={`text-sm font-medium transition-colors ${
                          currentTheme === 'dark' 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}>
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Theme Toggle */}
                <div className="relative" ref={themeRef}>
                  <button
                    onClick={() => setIsThemeOpen(!isThemeOpen)}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={`Current theme: ${theme} (${currentTheme})`}
                  >
                    {getThemeIcon()}
                  </button>

                  {/* Enhanced Theme Dropdown */}
                  {isThemeOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border py-2 z-50 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <div className={`px-4 py-2 border-b ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Palette size={16} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                          <span className={`text-sm font-medium ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>Appearance</span>
                        </div>
                      </div>
                      
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            console.log(`🎨 Theme dropdown: ${theme} → ${option.value}`);
                            changeTheme(option.value);
                            setIsThemeOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-all duration-200 group ${
                            theme === option.value
                              ? currentTheme === 'dark'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-blue-50 text-blue-600'
                              : currentTheme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${option.gradient} ${
                            theme === option.value ? 'shadow-sm' : 'opacity-70 group-hover:opacity-100'
                          } transition-all duration-200`}>
                            <option.icon size={14} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className={`text-xs ${
                              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{option.description}</div>
                          </div>
                          {theme === option.value && (
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              currentTheme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                            }`} />
                          )}
                        </button>
                      ))}
                      
                      <div className={`px-4 py-2 border-t mt-1 ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className={`text-xs ${
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Current: <span className={`font-medium ${
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>{currentTheme}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center space-x-2 p-1 rounded-xl transition-colors ${
                      currentTheme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=fff`}
                      alt={user.displayName || 'Profile'}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}
                    />
                    <ChevronDown size={16} className={`transition-all duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    } ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-lg border py-2 z-50 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <div className={`px-4 py-3 border-b ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <p className={`font-semibold ${
                          currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>{user.displayName || 'User'}</p>
                        <p className={`text-sm ${
                          currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link to="/profile" className={`flex items-center space-x-3 px-4 py-2 transition-colors ${
                          currentTheme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                          <User size={18} />
                          <span>Profile Settings</span>
                        </Link>
                        <Link to="/dashboard" className={`flex items-center space-x-3 px-4 py-2 transition-colors ${
                          currentTheme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                          <List size={18} />
                          <span>My Items</span>
                        </Link>
                        <Link to="/settings" className={`flex items-center space-x-3 px-4 py-2 transition-colors ${
                          currentTheme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}>
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </div>

                      <div className={`border-t py-1 ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <button
                          onClick={logout}
                          className={`flex items-center space-x-3 w-full px-4 py-2 transition-colors ${
                            currentTheme === 'dark'
                              ? 'text-red-400 hover:bg-red-900/20'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <LogOut size={18} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Theme Toggle for Non-Authenticated Users */}
                <div className="relative" ref={themeRef}>
                  <button
                    onClick={() => setIsThemeOpen(!isThemeOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                      currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={`Current theme: ${theme} (${currentTheme})`}
                  >
                    {getThemeIcon()}
                  </button>

                  {/* Theme Dropdown */}
                  {isThemeOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border py-2 z-50 ${
                      currentTheme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-100'
                    }`}>
                      <div className={`px-4 py-2 border-b ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Palette size={16} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                          <span className={`text-sm font-medium ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>Appearance</span>
                        </div>
                      </div>
                      
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            console.log(`🎨 Guest theme: ${theme} → ${option.value}`);
                            changeTheme(option.value);
                            setIsThemeOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-left text-sm transition-all duration-200 group ${
                            theme === option.value
                              ? currentTheme === 'dark'
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-blue-50 text-blue-600'
                              : currentTheme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${option.gradient} ${
                            theme === option.value ? 'shadow-sm' : 'opacity-70 group-hover:opacity-100'
                          } transition-all duration-200`}>
                            <option.icon size={14} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className={`text-xs ${
                              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{option.description}</div>
                          </div>
                          {theme === option.value && (
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              currentTheme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                            }`} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/auth"
                  className={`hidden sm:flex items-center px-4 py-2 font-medium transition-colors ${
                    currentTheme === 'dark'
                      ? 'text-gray-300 hover:text-gray-100'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className={`font-semibold px-6 py-2.5 rounded-xl text-white transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                    currentTheme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                currentTheme === 'dark'
                  ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden border-t backdrop-blur-md transition-colors duration-300 ${
            currentTheme === 'dark' 
              ? 'border-gray-800 bg-gray-900/95' 
              : 'border-gray-100 bg-white/95'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1">

              {/* Mobile Search */}
              <div className="relative mb-3">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors duration-300 ${
                    currentTheme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Mobile Theme Toggle */}
              <div className="mb-3">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className={`text-sm font-medium ${
                    currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Theme</span>
                  <div className="flex items-center space-x-2">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          console.log(`📱 Mobile theme: ${theme} → ${option.value}`);
                          changeTheme(option.value);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          theme === option.value
                            ? currentTheme === 'dark'
                              ? 'bg-blue-900/30 text-blue-400'
                              : 'bg-blue-100 text-blue-600'
                            : currentTheme === 'dark'
                              ? 'text-gray-400 hover:bg-gray-800'
                              : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        title={option.label}
                      >
                        <option.icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              {[...navLinks, ...userLinks].map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(path)
                      ? currentTheme === 'dark'
                        ? 'bg-blue-900/30 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : currentTheme === 'dark'
                        ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              ))}

              {user ? (
                <div className={`border-t pt-3 mt-3 ${
                  currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                }`}>
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=3B82F6&color=fff`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className={`font-medium ${
                        currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>{user.displayName}</p>
                      <p className={`text-sm ${
                        currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg transition-colors ${
                      currentTheme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className={`border-t pt-3 mt-3 ${
                  currentTheme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                }`}>
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-blue-600 text-white px-3 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                  >
                    Sign In / Register
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

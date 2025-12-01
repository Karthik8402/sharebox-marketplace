// src/pages/Home.jsx - Modern Redesign
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';
import {
  Gift,
  DollarSign,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Star,
  TrendingUp,
  CheckCircle,
  Play,
  Heart,
  ShoppingBag,
  Sparkles,
  Award,
  Clock,
  Eye,
  Timer,
  Trophy,
  Globe,
  Smartphone,
  Recycle
} from "lucide-react";

export default function Home() {
  const { currentTheme } = useTheme();
  const [stats, setStats] = useState({ donations: 0, trades: 0, users: 0 });
  const [isVisible, setIsVisible] = useState({});

  // Animate statistics counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ donations: 10000, trades: 50000, users: 5000 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Gift,
      title: "Donate with Impact",
      description: "Transform unused items into opportunities. Every donation creates a positive ripple effect.",
      color: "bg-emerald-500",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
      delay: "0ms"
    },
    {
      icon: DollarSign,
      title: "Smart Trading",
      description: "Intelligent pricing and secure transactions for your valuable electronics.",
      color: "bg-blue-500",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      delay: "100ms"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Join a thriving network of students who care about sustainability.",
      color: "bg-purple-500",
      span: "col-span-1 md:col-span-1 lg:col-span-1",
      delay: "200ms"
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "Advanced verification ensures safe transactions for everyone.",
      color: "bg-orange-500",
      span: "col-span-1 md:col-span-2 lg:col-span-2",
      delay: "300ms"
    }
  ];

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
      }`}>

      {/* Hero Section - Modern Gradient Mesh */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 animate-float ${currentTheme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'
            }`}></div>
          <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-30 animate-float ${currentTheme === 'dark' ? 'bg-purple-600' : 'bg-purple-400'
            }`} style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in-up">
            <Sparkles size={16} className="text-yellow-500" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              The #1 Student Marketplace
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className={`block ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Reimagine Campus
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Commerce & Sharing
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join 5,000+ students in the most sustainable way to trade, donate, and discover items on campus. Secure, verified, and community-driven.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/items"
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
            >
              Start Exploring
            </Link>
            <Link
              to="/add-item"
              className={`px-8 py-4 rounded-2xl font-semibold text-lg border transition-all hover:scale-105 active:scale-95 ${currentTheme === 'dark'
                ? 'border-gray-700 text-white hover:bg-gray-800'
                : 'border-gray-200 text-gray-900 hover:bg-white'
                }`}
            >
              List an Item
            </Link>
          </div>

          {/* Floating 3D Elements Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className={`relative rounded-3xl p-4 glass-card border-2 ${currentTheme === 'dark' ? 'border-gray-800' : 'border-white'
              }`}>
              <div className={`aspect-[16/9] rounded-2xl overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                {/* Abstract UI Representation */}
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                  <div className="grid grid-cols-3 gap-8 p-12 w-full max-w-4xl opacity-50 transform perspective-1000 rotate-x-12">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`aspect-[4/5] rounded-2xl ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } shadow-xl`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute -top-10 -right-10 p-4 rounded-2xl glass-card animate-float shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <DollarSign size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total Savings</div>
                  <div className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>$12,450</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 p-4 rounded-2xl glass-card animate-float shadow-xl" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Active Students</div>
                  <div className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>5,000+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className={`text-4xl font-bold mb-6 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why ShareBox?
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything you need to buy, sell, and donate on campus, all in one modern platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.span} group relative overflow-hidden rounded-3xl p-8 transition-all hover:scale-[1.02] ${currentTheme === 'dark'
                  ? 'bg-gray-900 hover:bg-gray-800'
                  : 'bg-white hover:bg-gray-50'
                  } border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full transition-transform group-hover:scale-150`}></div>

                <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <feature.icon size={24} />
                </div>

                <h3 className={`text-2xl font-bold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className={`flex items-center font-medium ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                  Learn more <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Stats Strip */}
      <section className={`py-20 border-y ${currentTheme === 'dark'
        ? 'bg-gray-900/50 border-gray-800'
        : 'bg-white border-gray-100'
        }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Items Donated", value: stats.donations, suffix: "+" },
              { label: "Trade Volume", value: stats.trades, prefix: "$", suffix: "+" },
              { label: "Active Users", value: stats.users, suffix: "+" },
              { label: "Campuses", value: "12", suffix: "" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                </div>
                <div className={`font-medium ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-900'
            }`}>
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                Ready to Join the Revolution?
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Start your journey towards a more sustainable and connected campus life today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/auth"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-gray-900 font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Create Free Account
                </Link>
                <Link
                  to="/items"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-colors"
                >
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

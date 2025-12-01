import { useTheme } from '../context/ThemeContext';
import { Users, Heart, Globe, Shield, Target, Sparkles } from 'lucide-react';

export default function About() {
    const { currentTheme } = useTheme();

    const stats = [
        { label: "Active Users", value: "10K+", icon: Users },
        { label: "Items Shared", value: "50K+", icon: Heart },
        { label: "Communities", value: "100+", icon: Globe },
        { label: "Trust Score", value: "4.9/5", icon: Shield },
    ];

    const values = [
        {
            title: "Community First",
            description: "We believe in the power of local communities helping each other.",
            icon: Users,
            color: "blue"
        },
        {
            title: "Sustainability",
            description: "Reducing waste by giving items a second life instead of throwing them away.",
            icon: Globe,
            color: "green"
        },
        {
            title: "Trust & Safety",
            description: "Building a secure platform where you can share with confidence.",
            icon: Shield,
            color: "purple"
        },
        {
            title: "Innovation",
            description: "Constantly improving the sharing experience for everyone.",
            icon: Sparkles,
            color: "orange"
        }
    ];

    return (
        <div className={`min-h-screen transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden py-20 sm:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0" />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
                        We're on a mission to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            connect the world
                        </span>
                    </h1>
                    <p className={`max-w-2xl mx-auto text-xl ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                        ShareBox is more than just a marketplace. It's a community movement to reduce waste, save money, and build stronger connections.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className={`py-12 border-y ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${currentTheme === 'dark' ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                    <p className={`max-w-2xl mx-auto ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        These principles guide every decision we make and every feature we build.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {values.map((value, index) => (
                        <div key={index} className={`p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${currentTheme === 'dark'
                                ? 'bg-gray-800 hover:bg-gray-750'
                                : 'bg-white hover:shadow-xl shadow-sm'
                            }`}>
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${currentTheme === 'dark'
                                    ? `bg-${value.color}-900/30 text-${value.color}-400`
                                    : `bg-${value.color}-50 text-${value.color}-600`
                                }`}>
                                <value.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                            <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section Placeholder */}
            <div className={`py-20 ${currentTheme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
                    <p className={`mb-12 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Built by passionate individuals dedicated to making a difference.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`p-6 rounded-2xl ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                } shadow-sm`}>
                                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
                                <h3 className="font-bold text-lg">Team Member {i}</h3>
                                <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                    Co-Founder
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

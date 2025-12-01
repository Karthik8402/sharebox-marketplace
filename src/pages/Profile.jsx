// src/pages/Profile.jsx - Modern Redesign
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import {
    User,
    Edit3,
    Camera,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Star,
    Package,
    IndianRupee,
    Gift,
    Heart,
    Eye,
    MessageCircle,
    Shield,
    Settings,
    Bell,
    Lock,
    Globe,
    Award,
    TrendingUp,
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    Save,
    X,
    Upload,
    Loader,
    Link as LinkIcon,
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Zap,
    Target,
    Activity,
    Sparkles,
    BadgeCheck
} from "lucide-react";

export default function Profile() {
    const { user } = useAuth();
    const { currentTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        displayName: "",
        bio: "",
        location: "",
        phone: "",
        website: "",
        socialLinks: {
            instagram: "",
            twitter: "",
            facebook: "",
            linkedin: ""
        },
        preferences: {
            emailNotifications: true,
            pushNotifications: true,
            marketingEmails: false,
            profileVisibility: "public"
        }
    });
    const [tempAvatar, setTempAvatar] = useState(null);
    const [stats, setStats] = useState({
        totalItems: 0,
        itemsSold: 0,
        itemsDonated: 0,
        totalEarnings: 0,
        rating: 0,
        reviews: 0,
        joinDate: null,
        profileViews: 0,
        responseRate: 0,
        responseTime: "< 1 hour"
    });

    const [recentActivity, setRecentActivity] = useState([
        { id: 1, type: 'sale', title: 'Sold "Laptop Stand"', time: '2 hours ago', icon: IndianRupee, color: 'green' },
        { id: 2, type: 'donation', title: 'Donated "Textbooks"', time: '5 hours ago', icon: Gift, color: 'blue' },
        { id: 3, type: 'listing', title: 'Listed "Headphones"', time: '1 day ago', icon: Package, color: 'purple' },
        { id: 4, type: 'review', title: 'Received 5-star review', time: '2 days ago', icon: Star, color: 'yellow' },
    ]);

    const [achievements, setAchievements] = useState([
        { id: 1, name: 'First Sale', description: 'Made your first sale', icon: IndianRupee, unlocked: true, color: 'green' },
        { id: 2, name: 'Generous Donor', description: 'Donated 5+ items', icon: Gift, unlocked: true, color: 'blue' },
        { id: 3, name: 'Top Seller', description: 'Sold 10+ items', icon: TrendingUp, unlocked: false, color: 'purple', progress: 50 },
        { id: 4, name: 'Trusted Member', description: '4.5+ rating with 20+ reviews', icon: BadgeCheck, unlocked: false, color: 'indigo', progress: 75 },
    ]);

    useEffect(() => {
        if (user) {
            loadProfileData();
            loadUserStats();
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setProfileData(prev => ({
                    ...prev,
                    displayName: userData.name || user.displayName || "",
                    bio: userData.bio || "",
                    location: userData.location || "",
                    phone: userData.phone || "",
                    website: userData.website || "",
                    socialLinks: userData.socialLinks || prev.socialLinks,
                    preferences: userData.preferences || prev.preferences
                }));
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    };

    const loadUserStats = async () => {
        setStats({
            totalItems: 12,
            itemsSold: 5,
            itemsDonated: 7,
            totalEarnings: 28550,
            rating: 4.8,
            reviews: 23,
            joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
            profileViews: 1247,
            responseRate: 95,
            responseTime: "< 1 hour"
        });
    };

    const handleAvatarUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            // Implement image upload logic here
            setTempAvatar(null);
        } catch (error) {
            console.error("Error uploading avatar:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await updateProfile(user, { displayName: profileData.displayName });
            await updateDoc(doc(db, "users", user.uid), {
                name: profileData.displayName,
                bio: profileData.bio,
                location: profileData.location,
                phone: profileData.phone,
                website: profileData.website,
                socialLinks: profileData.socialLinks,
                preferences: profileData.preferences,
                updatedAt: new Date()
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatJoinDate = (date) => {
        return date ? date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        }) : 'Recently';
    };

    const ProfileHeader = () => (
        <div className="relative overflow-hidden rounded-3xl">
            {/* Animated Background */}
            <div className={`absolute inset-0 transition-all duration-500 ${currentTheme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
                    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700'
                }`}>
                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${5 + Math.random() * 10}s`
                            }}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)]" />
            </div>

            {/* Content */}
            <div className="relative p-8 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
                        <div className={`relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden backdrop-blur border-4 transition-all duration-300 ${currentTheme === 'dark'
                                ? 'bg-gray-700/50 border-gray-500/50'
                                : 'bg-white/10 border-white/20'
                            }`}>
                            {user.photoURL || tempAvatar ? (
                                <img
                                    src={tempAvatar || user.photoURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-16 h-16 text-white/60" />
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="text-center">
                                    {uploading ? (
                                        <Loader className="w-6 h-6 animate-spin mx-auto mb-1" />
                                    ) : (
                                        <Camera className="w-6 h-6 mx-auto mb-1" />
                                    )}
                                    <span className="text-xs">Change</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (e) => setTempAvatar(e.target.result);
                                            reader.readAsDataURL(file);
                                            handleAvatarUpload(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {/* Verified Badge */}
                        <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-white dark:border-gray-900 shadow-lg">
                            <BadgeCheck className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-3xl lg:text-4xl font-bold">
                                        {profileData.displayName || user.displayName || 'ShareBox User'}
                                    </h1>
                                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                                </div>
                                <p className={`mb-2 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-100'
                                    }`}>{user.email}</p>
                                {profileData.location && (
                                    <div className={`flex items-center text-sm transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-100'
                                        }`}>
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {profileData.location}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`self-start sm:self-center px-6 py-3 backdrop-blur-xl border-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-lg ${currentTheme === 'dark'
                                        ? 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50'
                                        : 'bg-white/20 hover:bg-white/30 border-white/40 hover:border-white/60'
                                    }`}
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        {profileData.bio && (
                            <p className={`mb-6 text-sm lg:text-base leading-relaxed transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-50'
                                }`}>
                                {profileData.bio}
                            </p>
                        )}

                        {/* Quick Stats with Animation */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Items Listed', value: stats.totalItems, icon: Package },
                                { label: 'Rating', value: stats.rating, icon: Star },
                                { label: 'Response Rate', value: `${stats.responseRate}%`, icon: Zap },
                                { label: 'Member Since', value: formatJoinDate(stats.joinDate), icon: Calendar }
                            ].map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className="group relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative">
                                        <stat.icon className="w-5 h-5 mb-2 opacity-80 group-hover:scale-110 transition-transform duration-300" />
                                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                        <div className={`text-xs transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-200'
                                            }`}>{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const AnimatedStatCard = ({ title, icon: Icon, iconColor, children, delay = 0 }) => (
        <div
            className={`group rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                    : 'bg-white/80 border-gray-100 hover:bg-white'
                }`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>{title}</h3>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
                {children}
            </div>
        </div>
    );

    const StatsOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Activity Stats */}
            <AnimatedStatCard title="Activity" icon={Package} iconColor="from-blue-500 to-blue-600" delay={0}>
                <div className="space-y-4">
                    {[
                        { label: 'Total Items', value: stats.totalItems, color: 'text-gray-900 dark:text-gray-100' },
                        { label: 'Items Sold', value: stats.itemsSold, color: 'text-green-600' },
                        { label: 'Items Donated', value: stats.itemsDonated, color: 'text-blue-600' }
                    ].map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center">
                            <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{stat.label}</span>
                            <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </AnimatedStatCard>

            {/* Financial Stats */}
            <AnimatedStatCard title="Earnings" icon={IndianRupee} iconColor="from-green-500 to-emerald-600" delay={100}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Total Earnings</span>
                        <span className="font-bold text-lg text-green-600">₹{stats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>This Month</span>
                        <span className={`font-bold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>₹12,750</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Average/Item</span>
                        <span className={`font-bold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>₹{(stats.totalEarnings / stats.itemsSold || 0).toFixed(0)}</span>
                    </div>
                </div>
            </AnimatedStatCard>

            {/* Reputation Stats */}
            <AnimatedStatCard title="Reputation" icon={Star} iconColor="from-yellow-500 to-orange-500" delay={200}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Rating</span>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className={`font-bold text-lg transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                }`}>{stats.rating}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Reviews</span>
                        <span className={`font-bold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>{stats.reviews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>Response Rate</span>
                        <span className="font-bold text-green-600">{stats.responseRate}%</span>
                    </div>
                </div>
            </AnimatedStatCard>
        </div>
    );

    const ActivityTimeline = () => (
        <AnimatedStatCard title="Recent Activity" icon={Activity} iconColor="from-purple-500 to-pink-500">
            <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-300 hover:scale-105 ${currentTheme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                            }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className={`p-2 rounded-lg bg-${activity.color}-500/10`}>
                            <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`font-medium transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                }`}>{activity.title}</p>
                            <p className={`text-sm transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                }`}>{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </AnimatedStatCard>
    );

    const AchievementBadges = () => (
        <AnimatedStatCard title="Achievements" icon={Award} iconColor="from-indigo-500 to-purple-600" delay={100}>
            <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                    <div
                        key={achievement.id}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${achievement.unlocked
                                ? currentTheme === 'dark'
                                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
                                    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                                : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-50'
                            }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className={`p-3 rounded-lg bg-${achievement.color}-500/10 mb-3 inline-block`}>
                            <achievement.icon className={`w-6 h-6 text-${achievement.color}-600`} />
                        </div>
                        <h4 className={`font-bold text-sm mb-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>{achievement.name}</h4>
                        <p className={`text-xs transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{achievement.description}</p>

                        {!achievement.unlocked && achievement.progress && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                                    <span className={currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{achievement.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className={`bg-${achievement.color}-500 h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${achievement.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {achievement.unlocked && (
                            <div className="absolute top-2 right-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AnimatedStatCard>
    );

    const ProfileForm = () => (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className={`rounded-2xl shadow-lg border p-6 backdrop-blur-sm transition-all duration-300 ${currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white/80 border-gray-100'
                }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                            disabled={!isEditing}
                            placeholder=" "
                            className={`peer w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-transparent focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                                }`}
                        />
                        <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                            }`}>
                            Display Name
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            disabled={!isEditing}
                            placeholder=" "
                            className={`peer w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-transparent focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                                }`}
                        />
                        <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                            }`}>
                            Location
                        </label>
                    </div>
                </div>

                <div className="mt-6 relative">
                    <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder=" "
                        className={`peer w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${currentTheme === 'dark'
                                ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-transparent focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                            }`}
                    />
                    <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                        }`}>
                        Bio
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="relative">
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder=" "
                            className={`peer w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-transparent focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                                }`}
                        />
                        <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                            }`}>
                            Phone
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            placeholder=" "
                            className={`peer w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-transparent focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-transparent focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                                }`}
                        />
                        <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                            }`}>
                            Website
                        </label>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className={`rounded-2xl shadow-lg border p-6 backdrop-blur-sm transition-all duration-300 ${currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white/80 border-gray-100'
                }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(profileData.socialLinks).map(([platform, url]) => {
                        const icons = {
                            instagram: Instagram,
                            twitter: Twitter,
                            facebook: Facebook,
                            linkedin: Linkedin
                        };
                        const Icon = icons[platform];

                        return (
                            <div key={platform} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Icon className={`w-5 h-5 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`} />
                                </div>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setProfileData(prev => ({
                                        ...prev,
                                        socialLinks: { ...prev.socialLinks, [platform]: e.target.value }
                                    }))}
                                    disabled={!isEditing}
                                    placeholder={`https://${platform}.com/username`}
                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                            ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-blue-500 disabled:bg-gray-800 disabled:text-gray-500'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                                        }`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            loadProfileData();
                        }}
                        className={`px-6 py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${currentTheme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );

    const PrivacySettings = () => (
        <div className="space-y-6">
            {/* Notification Preferences */}
            <div className={`rounded-2xl shadow-lg border p-6 backdrop-blur-sm transition-all duration-300 ${currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white/80 border-gray-100'
                }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Notifications</h3>
                <div className="space-y-4">
                    {Object.entries(profileData.preferences).filter(([key]) => key.includes('otifications')).map(([key, value]) => (
                        <label key={key} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${currentTheme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                            }`}>
                            <div>
                                <div className={`font-medium capitalize transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                    }`}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </div>
                                <div className={`text-sm mt-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                    {key === 'emailNotifications' && 'Receive email updates about your items and messages'}
                                    {key === 'pushNotifications' && 'Get push notifications for important updates'}
                                    {key === 'marketingEmails' && 'Receive promotional emails and newsletters'}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    preferences: { ...prev.preferences, [key]: e.target.checked }
                                }))}
                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-300"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Privacy Settings */}
            <div className={`rounded-2xl shadow-lg border p-6 backdrop-blur-sm transition-all duration-300 ${currentTheme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white/80 border-gray-100'
                }`}>
                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Privacy</h3>
                <div className="space-y-4">
                    <div className="relative">
                        <select
                            value={profileData.preferences.profileVisibility}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, profileVisibility: e.target.value }
                            }))}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700/50 border-gray-600 text-gray-100 focus:border-blue-500'
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                }`}
                        >
                            <option value="public">Public - Anyone can view your profile</option>
                            <option value="registered">Registered Users - Only ShareBox members can view</option>
                            <option value="private">Private - Only you can view your profile</option>
                        </select>
                        <label className={`absolute left-4 -top-2.5 px-1 text-sm font-medium transition-all duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
                            }`}>
                            Profile Visibility
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                >
                    {loading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark'
                ? 'bg-gray-900'
                : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <ProfileHeader />

                {/* Navigation Tabs */}
                <div className="mt-8">
                    <nav className={`flex space-x-8 border-b-2 transition-colors duration-300 ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "stats", label: "Statistics", icon: TrendingUp },
                            { id: "settings", label: "Settings", icon: Settings }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`relative py-4 px-1 font-semibold text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 ${activeTab === id
                                        ? "text-blue-600"
                                        : currentTheme === 'dark'
                                            ? "text-gray-400 hover:text-gray-300"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Icon size={20} />
                                {label}
                                {activeTab === id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {activeTab === "profile" && <ProfileForm />}
                    {activeTab === "stats" && (
                        <div className="space-y-6">
                            <StatsOverview />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <ActivityTimeline />
                                <AchievementBadges />
                            </div>
                        </div>
                    )}
                    {activeTab === "settings" && <PrivacySettings />}
                </div>
            </div>

            {/* Add custom CSS for floating animation */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                    }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
}

// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // ✅ Add theme hook
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db} from "../services/firebase";
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
    DollarSign,
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
    Linkedin
} from "lucide-react";

export default function Profile() {
    const { user } = useAuth();
    const { currentTheme } = useTheme(); // ✅ Add theme hook
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
        // Mock stats - replace with actual Firebase queries
        setStats({
            totalItems: 12,
            itemsSold: 5,
            itemsDonated: 7,
            totalEarnings: 285.50,
            rating: 4.8,
            reviews: 23,
            joinDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
            profileViews: 1247,
            responseRate: 95,
            responseTime: "< 1 hour"
        });
    };

    // Replace Firebase Storage upload with ImgBB
    const handleAvatarUpload = async (file) => {
        if (!file) return;

        setUploading(true);
        try {
            // Use ImgBB instead of Firebase Storage
            const downloadURL = await uploadImage(file); // This uses ImgBB now

            await updateProfile(user, { photoURL: downloadURL });
            await updateDoc(doc(db, "users", user.uid), { photoURL: downloadURL });

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
        <div className={`rounded-2xl p-8 text-white relative overflow-hidden transition-all duration-300 ${
            currentTheme === 'dark' 
                ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600' 
                : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
        }`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
            <div className="relative">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden backdrop-blur border-4 transition-colors duration-300 ${
                            currentTheme === 'dark' 
                                ? 'bg-gray-700/50 border-gray-500/50' 
                                : 'bg-white/10 border-white/20'
                        }`}>
                            {user.photoURL || tempAvatar ? (
                                <img
                                    src={tempAvatar || user.photoURL}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-8 h-8 md:w-12 md:h-12 text-white/60" />
                                </div>
                            )}
                        </div>

                        {isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
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
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                    {profileData.displayName || user.displayName || 'ShareBox User'}
                                </h1>
                                <p className={`mb-1 transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-100'
                                }`}>{user.email}</p>
                                {profileData.location && (
                                    <div className={`flex items-center text-sm transition-colors duration-300 ${
                                        currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-100'
                                    }`}>
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {profileData.location}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`self-start sm:self-center px-6 py-3 backdrop-blur border rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    currentTheme === 'dark'
                                        ? 'bg-gray-700/50 hover:bg-gray-600/50 border-gray-500/50 hover:border-gray-400/50'
                                        : 'bg-white/10 hover:bg-white/20 border-white/30 hover:border-white/50'
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
                            <p className={`mt-4 text-sm md:text-base leading-relaxed transition-colors duration-300 ${
                                currentTheme === 'dark' ? 'text-gray-200' : 'text-blue-50'
                            }`}>
                                {profileData.bio}
                            </p>
                        )}

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.totalItems}</div>
                                <div className={`text-sm transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-200'
                                }`}>Items Listed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.rating}</div>
                                <div className={`text-sm transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-200'
                                }`}>Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.responseRate}%</div>
                                <div className={`text-sm transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-200'
                                }`}>Response Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{formatJoinDate(stats.joinDate)}</div>
                                <div className={`text-sm transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-300' : 'text-blue-200'
                                }`}>Member Since</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ProfileForm = () => (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                            disabled={!isEditing}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                            }`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Location
                        </label>
                        <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="City, State"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                            }`}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Bio
                    </label>
                    <textarea
                        rows={4}
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="Tell others about yourself, your interests, and what you're looking for on ShareBox..."
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                            currentTheme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                        }`}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="(555) 123-4567"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                            }`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Website
                        </label>
                        <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                        <div key={platform}>
                            <label className={`block text-sm font-medium mb-2 capitalize transition-colors duration-300 ${
                                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                {platform}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    {platform === 'instagram' && <Instagram className={`w-4 h-4 transition-colors duration-300 ${
                                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`} />}
                                    {platform === 'twitter' && <Twitter className={`w-4 h-4 transition-colors duration-300 ${
                                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`} />}
                                    {platform === 'facebook' && <Facebook className={`w-4 h-4 transition-colors duration-300 ${
                                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`} />}
                                    {platform === 'linkedin' && <Linkedin className={`w-4 h-4 transition-colors duration-300 ${
                                        currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                    }`} />}
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
                                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                        currentTheme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:text-gray-500'
                                    }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            loadProfileData(); // Reset form
                        }}
                        className={`px-6 py-3 border rounded-lg transition-colors duration-300 ${
                            currentTheme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );

    const StatsOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Activity Stats */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Activity</h3>
                    <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Total Items</span>
                        <span className={`font-semibold transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>{stats.totalItems}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Items Sold</span>
                        <span className="font-semibold text-green-600">{stats.itemsSold}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Items Donated</span>
                        <span className="font-semibold text-blue-600">{stats.itemsDonated}</span>
                    </div>
                </div>
            </div>

            {/* Financial Stats */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Earnings</h3>
                    <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Total Earnings</span>
                        <span className="font-semibold text-green-600">${stats.totalEarnings}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>This Month</span>
                        <span className={`font-semibold transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>$127.50</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Average/Item</span>
                        <span className={`font-semibold transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>${(stats.totalEarnings / stats.itemsSold || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Reputation Stats */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                    }`}>Reputation</h3>
                    <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Rating</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className={`font-semibold transition-colors duration-300 ${
                                currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>{stats.rating}</span>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Reviews</span>
                        <span className={`font-semibold transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>{stats.reviews}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className={`transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Response Rate</span>
                        <span className="font-semibold text-green-600">{stats.responseRate}%</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const PrivacySettings = () => (
        <div className="space-y-6">
            {/* Notification Preferences */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Notifications</h3>
                <div className="space-y-4">
                    {Object.entries(profileData.preferences).filter(([key]) => key.includes('otifications')).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between">
                            <div>
                                <div className={`font-medium capitalize transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                }`}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </div>
                                <div className={`text-sm transition-colors duration-300 ${
                                    currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Privacy Settings */}
            <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
                currentTheme === 'dark' 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-100'
            }`}>
                <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                    currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>Privacy</h3>
                <div className="space-y-4">
                    <div>
                        <label className={`block font-medium mb-2 transition-colors duration-300 ${
                            currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            Profile Visibility
                        </label>
                        <select
                            value={profileData.preferences.profileVisibility}
                            onChange={(e) => setProfileData(prev => ({
                                ...prev,
                                preferences: { ...prev.preferences, profileVisibility: e.target.value }
                            }))}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${
                                currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-300 text-gray-900'
                            }`}
                        >
                            <option value="public">Public - Anyone can view your profile</option>
                            <option value="registered">Registered Users - Only ShareBox members can view</option>
                            <option value="private">Private - Only you can view your profile</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen pt-20 transition-colors duration-300 ${
            currentTheme === 'dark' 
                ? 'bg-gray-900' 
                : 'bg-gray-50'
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Profile Header */}
                <ProfileHeader />

                {/* Navigation Tabs */}
                <div className="mt-8">
                    <nav className={`flex space-x-8 border-b transition-colors duration-300 ${
                        currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                        {[
                            { id: "profile", label: "Profile", icon: User },
                            { id: "stats", label: "Statistics", icon: TrendingUp },
                            { id: "settings", label: "Settings", icon: Settings }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                                    activeTab === id
                                        ? "border-blue-500 text-blue-600"
                                        : currentTheme === 'dark'
                                            ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                <Icon size={20} />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                    {activeTab === "profile" && <ProfileForm />}
                    {activeTab === "stats" && <StatsOverview />}
                    {activeTab === "settings" && <PrivacySettings />}
                </div>
            </div>
        </div>
    );
}

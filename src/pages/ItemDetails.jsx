// src/pages/ItemDetails.jsx - Professional UI/UX with Dark Mode
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getItemById } from "../services/itemService";
import { createTransaction } from "../services/transactionService";
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  MessageCircle,
  IndianRupee,
  Gift,
  CheckCircle,
  AlertCircle,
  User,
  Clock,
  Package,
  Star,
  Flag,
  Bookmark,
  X,
  Shield,
  Truck,
  MapPin,
  Calendar,
  Tag,
  Zap,
  ThumbsUp,
  Camera,
  ChevronLeft,
  ChevronRight,
  Play,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

export default function ItemDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    message: "",
    offeredPrice: 0,
    meetingPreference: "campus"
  });
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const viewsIncrementedRef = useRef(false); // Track if views already incremented

  // Use actual images array from item, prioritize imageURLs, then images, then single imageURL
  const images = item?.imageURLs && item.imageURLs.length > 0
    ? item.imageURLs
    : item?.images && item.images.length > 0
      ? item.images
      : (item?.imageURL ? [item.imageURL] : []);

  useEffect(() => {
    // Reset views incremented flag when item ID changes
    viewsIncrementedRef.current = false;
    loadItemDetails();
  }, [id]);

  useEffect(() => {
    // Add price drop alert simulation
    if (item && item.type === 'sale') {
      const timer = setTimeout(() => setShowPriceAlert(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [item]);

  const loadItemDetails = async () => {
    try {
      // Only increment views once per page load
      const shouldIncrementViews = !viewsIncrementedRef.current;
      const itemData = await getItemById(id, shouldIncrementViews ? user : null);

      if (itemData) {
        setItem(itemData);
        setRequestForm(prev => ({ ...prev, offeredPrice: itemData.price || 0 }));

        // Mark views as incremented
        if (shouldIncrementViews && user) {
          viewsIncrementedRef.current = true;
        }

        setSeller({
          name: itemData.ownerName,
          id: itemData.ownerId,
          rating: 4.8,
          responseRate: 95,
          joinDate: itemData.createdAt,
          itemsSold: 23,
          reviews: 45
        });
      }
    } catch (error) {
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async () => {
    if (!user) {
      alert("Please sign in to make a request");
      return;
    }

    if (user.uid === item.ownerId) {
      alert("You cannot request your own item");
      return;
    }

    setSubmitting(true);
    try {
      // Success animation
      setShowRequestModal(false);
      // Show success toast
      alert("🎉 Request sent successfully! Redirecting to chat...");

      // Redirect to chat with the new transaction ID
      const transactionId = await createTransaction({
        itemId: item.id,
        itemTitle: item.title,
        buyerId: user.uid,
        buyerName: user.displayName,
        sellerId: item.ownerId,
        sellerName: item.ownerName,
        type: item.type,
        message: requestForm.message,
        offeredPrice: item.type === 'sale' ? requestForm.offeredPrice : null,
        price: item.price
      });

      navigate(`/chat/${transactionId}`);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Error sending request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this ${item.type} on ShareBox: ${item.title}`,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
      alert("🔗 Link copied to clipboard!");
    }
  };

  const formatJoinDate = (date) => {
    if (!date) return 'Recently';
    const itemDate = date.toDate ? date.toDate() : new Date(date);
    return itemDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'new': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'excellent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'good': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-32 mb-8 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className={`h-96 rounded-2xl ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="flex gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`h-20 w-20 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className={`h-12 rounded w-3/4 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-6 rounded w-1/2 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-32 rounded ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-16 rounded ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-2xl mx-auto mb-6 flex items-center justify-center ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Package size={48} className={currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Item not found</h2>
            <p className={`mb-8 max-w-md mx-auto ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>The item you're looking for doesn't exist or has been removed from our marketplace.</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/items"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Browse Items
              </Link>
              <button
                onClick={() => navigate(-1)}
                className={`px-8 py-3 rounded-xl transition-colors font-semibold ${currentTheme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb Navigation */}
        <nav className={`flex items-center gap-2 text-sm mb-8 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/items" className={`transition-colors ${currentTheme === 'dark' ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>Items</Link>
          <ChevronRight size={16} />
          <span className="capitalize">{item.category}</span>
          <ChevronRight size={16} />
          <span className={`truncate max-w-32 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Image Gallery Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group">
              <div className={`relative aspect-square rounded-2xl overflow-hidden shadow-lg border transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                {item.imageURL ? (
                  <img
                    src={images[currentImageIndex] || item.imageURL}
                    alt={item.title}
                    className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-500"
                    onClick={() => setShowImageModal(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Package size={64} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No image available</p>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-lg backdrop-blur-sm border ${item.status === 'available'
                    ? 'bg-emerald-500/90 text-white border-emerald-400/50' :
                    item.status === 'pending'
                      ? 'bg-amber-500/90 text-white border-amber-400/50' :
                      'bg-gray-500/90 text-white border-gray-400/50'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${item.status === 'available' ? 'bg-emerald-300 animate-pulse' : 'bg-white/70'
                      }`}></div>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`px-4 py-2 rounded-xl font-bold shadow-lg backdrop-blur-sm border ${item.type === 'donation'
                    ? 'bg-green-500/90 text-white border-green-400/50'
                    : 'bg-blue-500/90 text-white border-blue-400/50'
                    }`}>
                    {item.type === 'donation' ? (
                      <div className="flex items-center gap-2">
                        <Gift size={18} />
                        FREE
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <IndianRupee size={18} />
                        ₹{item.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Trending Badge */}
                {(item.views > 50 || item.likes > 10) && (
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-orange-500/90 text-white px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm border border-orange-400/50 flex items-center gap-2">
                      <TrendingUp size={14} />
                      Trending
                    </div>
                  </div>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-6">
                    <div className="bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-semibold backdrop-blur-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                )}

                {/* Zoom Indicator */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm flex items-center gap-2">
                    <Camera size={14} />
                    Click to zoom
                  </div>
                </div>
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center transition-colors ${currentTheme === 'dark'
                        ? 'bg-gray-800/90 text-gray-200 hover:bg-gray-700'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                      }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full shadow-lg backdrop-blur-sm flex items-center justify-center transition-colors ${currentTheme === 'dark'
                        ? 'bg-gray-800/90 text-gray-200 hover:bg-gray-700'
                        : 'bg-white/90 text-gray-800 hover:bg-white'
                      }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                      ? 'border-blue-500 shadow-lg scale-105'
                      : currentTheme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img src={img} alt={`${item.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all font-semibold ${liked
                  ? currentTheme === 'dark'
                    ? 'bg-red-900/30 border-red-800 text-red-400 shadow-lg'
                    : 'bg-red-50 border-red-200 text-red-600 shadow-lg'
                  : currentTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-red-900/30 hover:border-red-800 hover:text-red-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600'
                  }`}
              >
                <Heart size={20} className={`mr-2 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'} ({item.likes || 0})
              </button>

              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all font-semibold ${bookmarked
                  ? currentTheme === 'dark'
                    ? 'bg-blue-900/30 border-blue-800 text-blue-400 shadow-lg'
                    : 'bg-blue-50 border-blue-200 text-blue-600 shadow-lg'
                  : currentTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-blue-900/30 hover:border-blue-800 hover:text-blue-400'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'
                  }`}
              >
                <Bookmark size={20} className={`mr-2 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved' : 'Save'}
              </button>

              <button
                onClick={handleShare}
                className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all font-semibold ${currentTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
              >
                <Share2 size={20} className="mr-2" />
                Share
              </button>

              <button className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all font-semibold ${currentTheme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-red-400 hover:bg-red-900/30 hover:border-red-800'
                : 'bg-white border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200'
                }`}>
                <Flag size={20} className="mr-2" />
                Report
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">

            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className={`text-4xl font-bold leading-tight mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h1>

                  {item.type === 'sale' && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`text-3xl font-bold ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>₹{item.price}</div>
                      {item.negotiable && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentTheme === 'dark' ? 'bg-orange-900/30 text-orange-300 border-orange-800' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                          <Zap size={16} />
                          <span className="font-semibold text-sm">Negotiable</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className={`flex items-center gap-6 text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span className="font-medium">{item.views || 0} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={16} />
                  <span className="font-medium">{item.likes || 0} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="font-medium">Listed {formatJoinDate(item.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Item Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Category</div>
                <div className={`font-bold text-lg capitalize ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.category}</div>
              </div>
              <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Condition</div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-bold text-sm border ${getConditionColor(item.condition)}`}>
                  {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className={`p-8 rounded-2xl border shadow-sm transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Package size={20} />
                Description
              </h3>
              <p className={`leading-relaxed text-base ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.description}</p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <Tag size={18} />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Information */}
            <div className={`p-8 rounded-2xl border shadow-sm transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <User size={20} />
                Seller Information
              </h3>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl">
                  {seller?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className={`font-bold text-xl ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{seller?.name || 'ShareBox User'}</div>
                  <div className={`mb-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Member since {formatJoinDate(seller?.joinDate || item.createdAt)}</div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{seller?.rating || 4.8}</span>
                    </div>
                    <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-semibold">{seller?.reviews || 45}</span> reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className={`p-4 rounded-xl ${currentTheme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <div className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{seller?.rating || 4.8}</div>
                  <div className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</div>
                </div>
                <div className={`p-4 rounded-xl ${currentTheme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <div className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{seller?.itemsSold || 23}</div>
                  <div className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Items Sold</div>
                </div>
                <div className={`p-4 rounded-xl ${currentTheme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                  <div className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>{seller?.responseRate || 95}%</div>
                  <div className={`text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Response Rate</div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-2 ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  <Shield size={16} />
                  <span className="font-medium">Verified Seller</span>
                </div>
                <div className={`flex items-center gap-2 ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  <CheckCircle size={16} />
                  <span className="font-medium">Fast Response</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="sticky bottom-8">
              {user && user.uid !== item.ownerId ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowRequestModal(true)}
                    disabled={item.status !== 'available'}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${item.status === 'available'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {item.status === 'available'
                      ? (
                        <div className="flex items-center justify-center gap-3">
                          <MessageCircle size={24} />
                          {item.type === 'donation' ? 'Request Item' : 'Make Offer'}
                        </div>
                      )
                      : 'No Longer Available'
                    }
                  </button>

                  {/* Quick Contact */}
                  <button
                    onClick={() => {
                      // Check if conversation exists logic would go here
                      // For now, just open the request modal as it starts the conversation
                      setShowRequestModal(true);
                    }}
                    className={`w-full py-3 rounded-xl border-2 transition-all font-semibold ${currentTheme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                  >
                    Quick Message Seller
                  </button>
                </div>
              ) : user && user.uid === item.ownerId ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl text-center border border-blue-200">
                  <div className="text-blue-700 font-bold text-lg mb-2">✨ This is your item</div>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <Package size={18} />
                    Manage in Dashboard
                  </Link>
                </div>
              ) : (
                <div className={`p-6 rounded-2xl text-center border transition-colors ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className={`font-bold text-lg mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to interact with this item</div>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <User size={18} />
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Request Modal - Enhanced */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transition-colors ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {item.type === 'donation' ? '🎁 Request Item' : '💰 Make Offer'}
                  </h3>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
                <p className="text-white/90 mt-2">Connect with the seller and make your request</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Item Preview */}
                <div className={`flex items-center gap-4 p-4 rounded-xl ${currentTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                  <img
                    src={item.imageURL || '/placeholder.jpg'}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                    <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.category} • {item.condition}</p>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                      {item.type === 'donation' ? 'FREE' : `₹${item.price}`}
                    </div>
                  </div>
                </div>

                {/* Offer Price for Sales */}
                {item.type === 'sale' && (
                  <div>
                    <label className={`block text-sm font-semibold mb-3 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Offer (₹) {item.negotiable && <span className={currentTheme === 'dark' ? 'text-green-400' : 'text-green-600'}>• Negotiable</span>}
                    </label>
                    <input
                      type="number"
                      value={requestForm.offeredPrice}
                      onChange={(e) => setRequestForm(prev => ({ ...prev, offeredPrice: Number(e.target.value) }))}
                      min="0"
                      max={item.price}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-semibold transition-colors ${currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900'
                        }`}
                      placeholder="Enter your offer"
                    />
                    {item.negotiable && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-700 font-medium">
                          💡 This item is negotiable. Feel free to make a reasonable offer!
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className={`block text-sm font-semibold mb-3 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message to Seller
                  </label>
                  <textarea
                    value={requestForm.message}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    placeholder={`Hi! I'm interested in your ${item.title}. ${item.type === 'sale' && item.negotiable ? 'Would you consider my offer?' : 'When would be a good time to pick it up?'}`}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-colors ${currentTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900'
                      }`}
                  />
                </div>

                {/* Quick Templates */}
                <div>
                  <div className={`text-sm font-semibold mb-3 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Quick Templates:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Can pick up today!",
                      "Flexible with timing",
                      "Cash ready",
                      "Fellow student 🎓"
                    ].map((template) => (
                      <button
                        key={template}
                        onClick={() => setRequestForm(prev => ({
                          ...prev,
                          message: prev.message + (prev.message ? ' ' : '') + template + '.'
                        }))}
                        className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${currentTheme === 'dark'
                            ? 'bg-blue-900/30 text-blue-300 border-blue-800 hover:bg-blue-900/50'
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                          }`}
                      >
                        + {template}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className={`flex-1 px-6 py-4 border-2 rounded-xl transition-all font-semibold ${currentTheme === 'dark'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRequest}
                    disabled={submitting}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageCircle size={20} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
              <img
                src={images[currentImageIndex] || item.imageURL}
                alt={item.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

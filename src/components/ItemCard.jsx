// src/components/ItemCard.jsx - Modern & Dark Mode Ready
import {
  IndianRupee,
  Gift,
  Heart,
  Eye,
  Share2,
  MessageCircle,
  Bookmark,
  User,
  Package,
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item, viewMode = "grid", onLike, onBookmark, onShare }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(item.id, !isLiked);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(item.id, !isBookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(item);
  };

  const timeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const itemDate = date.toDate ? date.toDate() : new Date(date);
    const diffInHours = Math.floor((now - itemDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return itemDate.toLocaleDateString();
  };

  const getConditionColor = (condition) => {
    const colors = {
      new: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      excellent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      good: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      fair: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    };
    return colors[condition] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  };

  if (viewMode === "list") {
    return (
      <Link to={`/item/${item?.id || '#'}`} className="block">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 p-4 h-24">
          <div className="flex items-center gap-4 h-full">
            <div className="relative flex-shrink-0">
              {item.imageURL ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate mr-2 text-sm">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${item.type === 'donation'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                  {item.type === 'donation' ? 'FREE' : `₹${item.price}`}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 truncate">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="capitalize truncate max-w-16">{item.category}</span>
                  <span>•</span>
                  <span className={`px-1 py-0.5 rounded ${getConditionColor(item.condition)} text-xs`}>
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Eye size={10} className="mr-1" />
                    {item.views || 0}
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View - Modern & Dark Mode Ready
  return (
    <Link to={`/item/${item?.id || '#'}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-300 group-hover:-translate-y-1 h-[420px] flex flex-col">

        {/* Image Container */}
        <div className="relative h-[200px] flex-shrink-0 overflow-hidden">
          {item.imageURL ? (
            <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700">
              <img
                src={item.imageURL}
                alt={item.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/10 ${item.type === 'donation'
              ? 'bg-emerald-500/90 text-white'
              : 'bg-blue-600/90 text-white'
              }`}>
              {item.type === 'donation' ? (
                <div className="flex items-center gap-1">
                  <Gift size={12} />
                  FREE
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <IndianRupee size={12} />
                  {item.price}
                </div>
              )}
            </span>

            {item.type === 'sale' && item.negotiable && (
              <span className="px-2 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full backdrop-blur-md shadow-lg border border-white/10">
                Negotiable
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleLike}
              className={`w-9 h-9 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 ${isLiked
                ? 'bg-red-500 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
                }`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleBookmark}
              className={`w-9 h-9 rounded-full backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20 ${isBookmarked
                ? 'bg-yellow-500 text-white'
                : 'bg-black/30 text-white hover:bg-black/50'
                }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 bg-black/30 text-white rounded-full backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-black/50 transition-all duration-200 hover:scale-110 border border-white/20"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-full backdrop-blur-md border border-white/10">
                  <Eye size={12} />
                  <span className="text-xs">{item.views || 0}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded-full backdrop-blur-md border border-white/10">
                  <Heart size={12} />
                  <span className="text-xs">{item.likes || 0}</span>
                </div>
              </div>

              <div className="px-2 py-1 bg-black/40 rounded-full backdrop-blur-md border border-white/10 text-xs">
                {timeAgo(item.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-5 flex-1 flex flex-col h-[220px]">

          {/* Title Section */}
          <div className="h-14 mb-2">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {item.title}
              </h3>
              <div className="ml-2 flex-shrink-0 pt-1">
                {item.status === 'available' && (
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="h-10 mb-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Category & Condition Section */}
          <div className="h-8 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg capitalize">
                {item.category}
              </span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Footer Section */}
          <div className="h-12 pt-3 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">
                  {item.ownerName ? item.ownerName.charAt(0).toUpperCase() : <User size={12} />}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
                  {item.ownerName || 'ShareBox User'}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-300 flex-shrink-0 group/btn"
              >
                <MessageCircle size={14} className="group-hover/btn:scale-110 transition-transform" />
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

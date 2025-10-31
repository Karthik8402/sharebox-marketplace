// src/components/ItemCard.jsx - PERFECTLY ALIGNED VERSION
import { 
  DollarSign, 
  Gift, 
  Heart, 
  Eye, 
  MapPin, 
  Calendar, 
  Star,
  Share2,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  User,
  Clock,
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
      new: "bg-green-100 text-green-800",
      excellent: "bg-blue-100 text-blue-800", 
      good: "bg-yellow-100 text-yellow-800",
      fair: "bg-orange-100 text-orange-800"
    };
    return colors[condition] || "bg-gray-100 text-gray-800";
  };

  if (viewMode === "list") {
    return (
      <Link to={`/item/${item.id}`} className="block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 p-4 h-24">
          <div className="flex items-center gap-4 h-full">
            <div className="relative flex-shrink-0">
              {item.imageURL ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.imageURL}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 truncate mr-2 text-sm">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                  item.type === 'donation' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.type === 'donation' ? 'FREE' : `₹${item.price}`}
                </span>
              </div>
              
              <p className="text-xs text-gray-600 mb-1 truncate">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="capitalize truncate max-w-16">{item.category}</span>
                  <span>•</span>
                  <span className={`px-1 py-0.5 rounded ${getConditionColor(item.condition)} text-xs`}>
                    {item.condition}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center text-xs text-gray-500">
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

  // Grid View - PERFECTLY ALIGNED VERSION
  return (
    <Link to={`/item/${item.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 group-hover:-translate-y-1 h-[420px] flex flex-col">
        
        {/* Image Container - FIXED: 200px */}
        <div className="relative h-[200px] flex-shrink-0">
          {item.imageURL ? (
            <div className="relative w-full h-full bg-gray-100 overflow-hidden">
              <img
                src={item.imageURL}
                alt={item.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              item.type === 'donation' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}>
              {item.type === 'donation' ? (
                <div className="flex items-center gap-1">
                  <Gift size={12} />
                  FREE
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <DollarSign size={12} />
                  ₹{item.price}
                </div>
              )}
            </span>

            {item.type === 'sale' && item.negotiable && (
              <span className="px-2 py-1 bg-orange-500/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                Negotiable
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleLike}
              className={`w-8 h-8 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={handleBookmark}
              className={`w-8 h-8 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                isBookmarked 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={handleShare}
              className="w-8 h-8 bg-white/80 text-gray-600 rounded-full backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200 hover:scale-110"
            >
              <Share2 size={14} />
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                  <Eye size={12} />
                  <span className="text-xs">{item.views || 0}</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm">
                  <Heart size={12} />
                  <span className="text-xs">{item.likes || 0}</span>
                </div>
              </div>
              
              <div className="px-2 py-1 bg-black/30 rounded-full backdrop-blur-sm text-xs">
                {timeAgo(item.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Content Container - FIXED: 220px total, perfectly structured */}
        <div className="p-5 flex-1 flex flex-col h-[220px]">
          
          {/* Title Section - FIXED: 56px */}
          <div className="h-14 mb-3">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors leading-7">
                {item.title}
              </h3>
              <div className="ml-2 flex-shrink-0">
                {item.status === 'available' && (
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          {/* Description Section - FIXED: 40px */}
          <div className="h-10 mb-3">
            <p className="text-gray-600 text-sm line-clamp-2 leading-5">
              {item.description}
            </p>
          </div>

          {/* Category & Condition Section - FIXED: 32px */}
          <div className="h-8 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg capitalize">
                {item.category}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Footer Section - FIXED: 64px */}
          <div className="h-16">
            {/* Seller & Contact Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-white" />
                </div>
                <span className="text-xs text-gray-600 font-medium truncate">
                  {item.ownerName || 'ShareBox User'}
                </span>
              </div>

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <MessageCircle size={12} />
                Contact
              </button>
            </div>

            {/* Tags Row - FIXED HEIGHT: Always shows even if empty */}
            <div className="h-6">
              {item.tags && item.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-xs rounded-full">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              ) : (
                /* Empty space to maintain alignment */
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

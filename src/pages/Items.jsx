// src/pages/Items.jsx
import { useState, useEffect, useCallback } from "react";
import {
    getAllItems,
    searchItems,
    getFilteredItems,
    toggleItemLike
} from "../services/itemService";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ItemCard from "../components/ItemCard";
import {
    Search,
    SlidersHorizontal,
    Grid3X3,
    List,
    ArrowUpDown,
    X,
    IndianRupee,
    Heart,
    Package,
    Loader
} from "lucide-react";
import { addTestItems } from "../utils/addTestData";

export default function Items() {
    const { user } = useAuth();
    const { currentTheme } = useTheme();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("newest");
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Filter states
    const [filters, setFilters] = useState({
        type: "all",
        category: "all",
        condition: "all",
        priceRange: { min: 0, max: 10000 }
    });

    const [activeFilters, setActiveFilters] = useState([]);

    // Load initial items
    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            handleFilterAndSearch();
        }
    }, [items, searchQuery, filters, sortBy]);

    const loadItems = async (loadMore = false) => {
        try {
            if (loadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const result = await getAllItems(loadMore ? lastDoc : null, 12);

            if (loadMore) {
                setItems(prev => [...prev, ...result.items]);
            } else {
                setItems(result.items);
            }

            setLastDoc(result.lastVisible);
            setHasMore(result.hasMore);
        } catch (error) {
            console.error("Error loading items:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleFilterAndSearch = useCallback(async () => {
        try {
            let filtered = [...items];

            // Apply search
            if (searchQuery.trim()) {
                filtered = await searchItems(searchQuery, filters);
            } else {
                // Apply filters
                if (filters.type !== "all") {
                    filtered = filtered.filter(item => item.type === filters.type);
                }
                if (filters.category !== "all") {
                    filtered = filtered.filter(item => item.category === filters.category);
                }
                if (filters.condition !== "all") {
                    filtered = filtered.filter(item => item.condition === filters.condition);
                }

                // Price filter
                if (filters.type === "sale" || filters.type === "all") {
                    filtered = filtered.filter(item =>
                        !item.price || (item.price >= filters.priceRange.min && item.price <= filters.priceRange.max)
                    );
                }
            }

            // Apply sorting
            filtered.sort((a, b) => {
                switch (sortBy) {
                    case "newest":
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case "oldest":
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case "price-low":
                        return (a.price || 0) - (b.price || 0);
                    case "price-high":
                        return (b.price || 0) - (a.price || 0);
                    case "title":
                        return a.title.localeCompare(b.title);
                    case "popular":
                        return (b.likes || 0) - (a.likes || 0);
                    default:
                        return 0;
                }
            });

            setFilteredItems(filtered);
            updateActiveFilters();
        } catch (error) {
            console.error("Error filtering items:", error);
        }
    }, [items, searchQuery, filters, sortBy]);

    const updateActiveFilters = () => {
        const active = [];
        if (filters.type !== "all") active.push({ key: "type", label: `Type: ${filters.type}`, value: filters.type });
        if (filters.category !== "all") active.push({ key: "category", label: `Category: ${filters.category}`, value: filters.category });
        if (filters.condition !== "all") active.push({ key: "condition", label: `Condition: ${filters.condition}`, value: filters.condition });
        if (searchQuery) active.push({ key: "search", label: `Search: "${searchQuery}"`, value: searchQuery });
        setActiveFilters(active);
    };

    const removeFilter = (filterKey) => {
        if (filterKey === "search") {
            setSearchQuery("");
        } else {
            setFilters(prev => ({
                ...prev,
                [filterKey]: "all"
            }));
        }
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setFilters({
            type: "all",
            category: "all",
            condition: "all",
            priceRange: { min: 0, max: 10000 }
        });
    };

    const handleItemLike = async (itemId, isLiked) => {
        if (!user) return;

        try {
            await toggleItemLike(itemId, user.uid, isLiked);
            // Update local state
            setItems(prev => prev.map(item =>
                item.id === itemId
                    ? { ...item, likes: (item.likes || 0) + (isLiked ? 1 : -1) }
                    : item
            ));
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleItemBookmark = async (itemId, isBookmarked) => {
        // TODO: Implement bookmarking
        console.log("Bookmark toggled:", itemId, isBookmarked);
    };

    const handleItemShare = async (item) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: item.description,
                    url: `${window.location.origin}/item/${item.id}`
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/item/${item.id}`);
        }
    };

    const categories = [
        "electronics", "books", "clothing", "furniture", "sports", "accessories", "other"
    ];

    const conditions = ["new", "excellent", "good", "fair"];

    if (loading) {
        return (
            <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className={`h-8 rounded w-48 mb-8 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                            }`}></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className={`h-80 rounded-xl transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                                    }`}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className={`text-4xl font-bold mb-4 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>Browse Items</h1>
                    <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Discover amazing items shared by your community. Filter by category, price, or condition to find exactly what you need.</p>
                </div>

                {/* Search and Filter Bar */}
                <div className={`rounded-2xl shadow-sm border p-6 mb-6 transition-colors duration-300 ${currentTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-100'
                    }`}>
                    <div className="flex flex-col lg:flex-row gap-4">

                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`} />
                            <input
                                type="text"
                                placeholder="Search items, categories, descriptions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                                    }`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${currentTheme === 'dark'
                                        ? 'text-gray-500 hover:text-gray-400'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-3">
                            <select
                                value={filters.type}
                                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                            >
                                <option value="all">All Types</option>
                                <option value="donation">Donations</option>
                                <option value="sale">For Sale</option>
                            </select>

                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className={`px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors duration-300 ${currentTheme === 'dark'
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <SlidersHorizontal size={20} />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className={`text-sm transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>Active filters:</span>
                            {activeFilters.map((filter) => (
                                <span
                                    key={filter.key}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-300 ${currentTheme === 'dark'
                                        ? 'bg-blue-900/30 text-blue-300'
                                        : 'bg-blue-50 text-blue-700'
                                        }`}
                                >
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter.key)}
                                        className={`rounded-full p-0.5 transition-colors duration-300 ${currentTheme === 'dark' ? 'hover:bg-blue-800/50' : 'hover:bg-blue-100'
                                            }`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className={`text-sm underline transition-colors duration-300 ${currentTheme === 'dark'
                                    ? 'text-gray-400 hover:text-gray-300'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <p className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            <span className={`font-semibold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                }`}>{filteredItems.length}</span> items found
                        </p>

                        {/* Stats Pills */}
                        <div className="hidden md:flex items-center gap-2">
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-300 ${currentTheme === 'dark'
                                ? 'bg-green-900/30 text-green-300'
                                : 'bg-green-50 text-green-700'
                                }`}>
                                <Heart size={14} />
                                <span>{filteredItems.filter(item => item.type === 'donation').length} free</span>
                            </div>
                            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-300 ${currentTheme === 'dark'
                                ? 'bg-blue-900/30 text-blue-300'
                                : 'bg-blue-50 text-blue-700'
                                }`}>
                                <IndianRupee size={14} />
                                <span>{filteredItems.filter(item => item.type === 'sale').length} for sale</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown size={16} className={`transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                }`} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-colors duration-300 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                    : 'bg-white border-gray-200 text-gray-900'
                                    }`}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="title">Alphabetical</option>
                                <option value="popular">Most Liked</option>
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className={`flex items-center rounded-lg p-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-md transition-colors duration-300 ${viewMode === "grid"
                                    ? currentTheme === 'dark'
                                        ? "bg-gray-700 shadow-sm text-gray-100"
                                        : "bg-white shadow-sm text-gray-900"
                                    : currentTheme === 'dark'
                                        ? "text-gray-400 hover:text-gray-300"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Grid3X3 size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-md transition-colors duration-300 ${viewMode === "list"
                                    ? currentTheme === 'dark'
                                        ? "bg-gray-700 shadow-sm text-gray-100"
                                        : "bg-white shadow-sm text-gray-900"
                                    : currentTheme === 'dark'
                                        ? "text-gray-400 hover:text-gray-300"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Items Grid/List */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <Package size={64} className={`mx-auto mb-4 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                }`} />
                            <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                }`}>No items found</h3>
                            <p className={`mb-6 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                : "space-y-4"
                        }>
                            {filteredItems.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    viewMode={viewMode}
                                    onLike={handleItemLike}
                                    onBookmark={handleItemBookmark}
                                    onShare={handleItemShare}
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={() => loadItems(true)}
                                    disabled={loadingMore}
                                    className={`border px-8 py-3 rounded-xl transition-colors duration-300 shadow-sm disabled:opacity-50 flex items-center gap-2 mx-auto ${currentTheme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700'
                                        : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        "Load More Items"
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Advanced Filter Modal */}
            {
                isFilterOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            }`}>
                            <div className={`sticky top-0 border-b px-6 py-4 rounded-t-2xl transition-colors duration-300 ${currentTheme === 'dark'
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-100'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <h2 className={`text-xl font-semibold transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                        }`}>Advanced Filters</h2>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className={`p-2 rounded-lg transition-colors duration-300 ${currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <X size={20} className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Condition Filter */}
                                <div>
                                    <h3 className={`font-medium mb-3 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                        }`}>Condition</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {["all", ...conditions].map(condition => (
                                            <button
                                                key={condition}
                                                onClick={() => setFilters(prev => ({ ...prev, condition }))}
                                                className={`p-3 text-left border rounded-xl transition-colors duration-300 ${filters.condition === condition
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                    : currentTheme === 'dark'
                                                        ? "border-gray-600 text-gray-300 hover:border-gray-500"
                                                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                {condition === "all" ? "Any Condition" : condition.charAt(0).toUpperCase() + condition.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h3 className={`font-medium mb-3 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                                        }`}>Price Range</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm mb-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>Min Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={filters.priceRange.min}
                                                onChange={(e) => setFilters(prev => ({
                                                    ...prev,
                                                    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                                                }))}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${currentTheme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm mb-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>Max Price</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={filters.priceRange.max}
                                                onChange={(e) => setFilters(prev => ({
                                                    ...prev,
                                                    priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                                                }))}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-300 ${currentTheme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                                                    : 'bg-white border-gray-200 text-gray-900'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Apply/Reset Buttons */}
                                <div className={`flex gap-3 pt-4 border-t transition-colors duration-300 ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                    }`}>
                                    <button
                                        onClick={clearAllFilters}
                                        className={`flex-1 px-4 py-3 border rounded-xl transition-colors duration-300 ${currentTheme === 'dark'
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Reset All
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

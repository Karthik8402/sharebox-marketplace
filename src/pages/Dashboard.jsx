// src/pages/Dashboard.jsx - Modern Redesign
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserItems, deleteItem, updateItem } from "../services/itemService";
import { Link } from "react-router-dom";
import {
  Trash2,
  Edit,
  Plus,
  TrendingUp,
  Package,
  IndianRupee,
  Gift,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  Filter,
  Download,
  Share2,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Search,
  Grid,
  List,
  X,
  ChevronDown,
  ExternalLink,
  Copy,
  Star,
  Sparkles,
  Zap,
  Target
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // ✅ NEW: Edit functionality states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  // ✅ NEW: Menu dropdown states
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    loadUserItems();
  }, [user]);

  const loadUserItems = async () => {
    try {
      const userItems = await getUserItems(user.uid);
      setItems(userItems);
    } catch (error) {
      console.error("Error loading user items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // ✅ NEW: Handle Edit Item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      description: item.description,
      price: item.price || 0,
      category: item.category,
      condition: item.condition,
      negotiable: item.negotiable || false
    });
    setShowEditModal(true);
    setOpenMenuId(null); // Close menu
  };

  // ✅ NEW: Save Edited Item
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    setUpdating(true);
    try {
      await updateItem(editingItem.id, {
        ...editForm,
        price: editingItem.type === 'sale' ? Number(editForm.price) : null
      });

      // Update local state
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...editForm, price: editingItem.type === 'sale' ? Number(editForm.price) : null }
          : item
      ));

      setShowEditModal(false);
      setEditingItem(null);
      alert("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ NEW: Menu functions
  const handleMenuClick = (itemId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleViewItem = (itemId) => {
    window.open(`/item/${itemId}`, '_blank');
    setOpenMenuId(null);
  };

  const handleCopyLink = (itemId) => {
    navigator.clipboard.writeText(`${window.location.origin}/item/${itemId}`);
    alert("Link copied to clipboard!");
    setOpenMenuId(null);
  };

  const handleMarkAs = (item, status) => {
    updateItem(item.id, { status });
    setItems(items.map(i => i.id === item.id ? { ...i, status } : i));
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Analytics calculations
  const analytics = {
    totalItems: items.length,
    activeItems: items.filter(item => item.status === 'available').length,
    soldItems: items.filter(item => item.status === 'sold').length,
    donatedItems: items.filter(item => item.type === 'donation').length,
    totalEarnings: items
      .filter(item => item.type === 'sale' && item.status === 'sold')
      .reduce((sum, item) => sum + (item.price || 0), 0),
    averagePrice: items.filter(item => item.type === 'sale').length > 0
      ? items.filter(item => item.type === 'sale').reduce((sum, item) => sum + (item.price || 0), 0) / items.filter(item => item.type === 'sale').length
      : 0,
    viewsCount: items.reduce((sum, item) => sum + (item.views || 0), 0),
    likesCount: items.reduce((sum, item) => sum + (item.likes || 0), 0)
  };

  // Filter items based on search and status
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-64 mb-8 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-32 rounded-xl ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              ))}
            </div>
            <div className={`h-96 rounded-xl ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, changeType, color, subtitle }) => (
    <div className={`group relative overflow-hidden p-6 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${currentTheme === 'dark'
      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
      : 'bg-white/80 border-gray-100 hover:bg-white'
      }`}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {change && (
            <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full ${changeType === 'increase'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
              <TrendingUp size={14} className="mr-1" />
              {change}%
            </div>
          )}
        </div>
        <h3 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{value}</h3>
        <p className={`text-sm font-medium transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>{title}</p>
        {subtitle && (
          <p className={`text-xs mt-1 transition-colors duration-300 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>{subtitle}</p>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Items"
          value={analytics.totalItems}
          change={12}
          changeType="increase"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtitle="Items you've listed"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Listings"
          value={analytics.activeItems}
          change={5}
          changeType="increase"
          color="bg-gradient-to-br from-green-500 to-emerald-600"
          subtitle="Currently available"
        />
        <StatCard
          icon={IndianRupee}
          title="Total Earnings"
          value={`₹${analytics.totalEarnings.toLocaleString()}`}
          change={23}
          changeType="increase"
          color="bg-gradient-to-br from-purple-500 to-indigo-600"
          subtitle="From completed sales"
        />
        <StatCard
          icon={Gift}
          title="Items Donated"
          value={analytics.donatedItems}
          color="bg-gradient-to-br from-orange-500 to-pink-500"
          subtitle="Free items shared"
        />
      </div>

      {/* Quick Actions */}
      <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
        <h3 className={`text-lg font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/add-item"
            className={`flex items-center p-4 rounded-xl transition-colors ${currentTheme === 'dark' ? 'bg-blue-900/20 hover:bg-blue-900/30' : 'bg-blue-50 hover:bg-blue-100'
              }`}
          >
            <Plus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h4 className={`font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Add New Item</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>List something new</p>
            </div>
          </Link>

          <button className={`flex items-center p-4 rounded-xl transition-colors ${currentTheme === 'dark' ? 'bg-green-900/20 hover:bg-green-900/30' : 'bg-green-50 hover:bg-green-100'
            }`}>
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h4 className={`font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>View Analytics</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Performance insights</p>
            </div>
          </button>

          <button className={`flex items-center p-4 rounded-xl transition-colors ${currentTheme === 'dark' ? 'bg-purple-900/20 hover:bg-purple-900/30' : 'bg-purple-50 hover:bg-purple-100'
            }`}>
            <Share2 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h4 className={`font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Share Profile</h4>
              <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Promote your items</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
        <h3 className={`text-lg font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
        <div className="space-y-4">
          {items.slice(0, 5).map((item, index) => (
            <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
              }`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${item.status === 'available' ? 'bg-green-500' :
                  item.status === 'sold' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}></div>
                <div>
                  <p className={`font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{item.title}</p>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.status === 'available' ? 'Listed' :
                      item.status === 'sold' ? 'Sold' : 'Updated'} • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {item.type === 'donation' ? 'Free' : `₹${item.price}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyItems = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className={`p-4 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${currentTheme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900'
                }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${currentTheme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-200 text-gray-900'
                }`}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>

            <div className={`flex items-center rounded-lg p-1 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${viewMode === "grid"
                  ? (currentTheme === 'dark' ? "bg-gray-600 shadow-sm text-white" : "bg-white shadow-sm text-gray-900")
                  : (currentTheme === 'dark' ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")
                  }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${viewMode === "list"
                  ? (currentTheme === 'dark' ? "bg-gray-600 shadow-sm text-white" : "bg-white shadow-sm text-gray-900")
                  : (currentTheme === 'dark' ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900")
                  }`}
              >
                <List size={18} />
              </button>
            </div>

            <button className={`p-2.5 border rounded-lg transition-colors ${currentTheme === 'dark'
              ? 'border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white'
              : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <div className={`text-center py-16 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
          <Package size={64} className={`mx-auto mb-4 ${currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {items.length === 0 ? "No items yet" : "No items match your search"}
          </h3>
          <p className={`mb-6 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {items.length === 0
              ? "Start by adding your first item to the marketplace"
              : "Try adjusting your search or filter criteria"
            }
          </p>
          <Link
            to="/add-item"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Your First Item
          </Link>
        </div>
      ) : (
        <div className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredItems.map((item) => (
            <div key={item.id} className={`rounded-xl shadow-sm border transition-all hover:shadow-md ${currentTheme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
              } ${viewMode === "list" ? "p-4" : "p-0 overflow-hidden"}`}>
              {viewMode === "grid" ? (
                // Grid View
                <>
                  {item.imageURL && (
                    <div className="relative">
                      <img
                        src={item.imageURL}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <div className="relative">
                          <button
                            onClick={(e) => handleMenuClick(item.id, e)}
                            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors text-gray-700"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === item.id && (
                            <div className={`absolute right-0 top-10 rounded-lg shadow-lg border py-2 min-w-[160px] z-10 ${currentTheme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-200'
                              }`}>
                              <button
                                onClick={() => handleViewItem(item.id)}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center ${currentTheme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                <ExternalLink size={14} className="mr-2" />
                                View Item
                              </button>
                              <button
                                onClick={() => handleEditItem(item)}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center ${currentTheme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                <Edit size={14} className="mr-2" />
                                Edit Item
                              </button>
                              <button
                                onClick={() => handleCopyLink(item.id)}
                                className={`w-full px-4 py-2 text-left text-sm flex items-center ${currentTheme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-50'
                                  }`}
                              >
                                <Copy size={14} className="mr-2" />
                                Copy Link
                              </button>
                              <hr className={`my-1 ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`} />
                              {item.status === 'available' && (
                                <button
                                  onClick={() => handleMarkAs(item, item.type === 'donation' ? 'taken' : 'sold')}
                                  className={`w-full px-4 py-2 text-left text-sm text-green-600 flex items-center ${currentTheme === 'dark' ? 'hover:bg-green-900/20' : 'hover:bg-green-50'
                                    }`}
                                >
                                  <CheckCircle size={14} className="mr-2" />
                                  Mark as {item.type === 'donation' ? 'Taken' : 'Sold'}
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setItemToDelete(item);
                                  setShowDeleteModal(true);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-sm text-red-600 flex items-center ${currentTheme === 'dark' ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                                  }`}
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete Item
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className={`font-semibold line-clamp-1 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'sold' || item.status === 'taken' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className={`text-sm mb-3 line-clamp-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.type === 'donation'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {item.type === 'donation' ? 'Free' : `₹${item.price}`}
                      </span>

                      <div className={`flex items-center gap-3 text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {item.views || 0}
                        </div>
                        <div className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {item.likes || 0}
                        </div>
                      </div>
                    </div>

                    <div className={`flex justify-between items-center pt-3 border-t ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark'
                            ? 'text-blue-400 hover:bg-blue-900/30'
                            : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleCopyLink(item.id)}
                          className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark'
                            ? 'text-gray-400 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <Share2 size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                          }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex items-center gap-4">
                  {item.imageURL && (
                    <img
                      src={item.imageURL}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                    <p className={`text-sm truncate ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'donation'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {item.type === 'donation' ? 'Free' : `₹${item.price}`}
                      </span>
                      <span className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'sold' || item.status === 'taken' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditItem(item)}
                        className={`p-1.5 rounded-md ${currentTheme === 'dark'
                          ? 'text-blue-400 hover:bg-blue-900/30'
                          : 'text-blue-600 hover:bg-blue-50'
                          }`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className={`p-1.5 rounded-md ${currentTheme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-600 hover:bg-red-50'
                          }`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen pt-20 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Welcome back, {user.displayName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Here's what's happening with your marketplace activity
              </p>
            </div>

            <Link
              to="/add-item"
              className="hidden sm:inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus size={20} className="mr-2" />
              Add Item
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className={`flex space-x-8 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : `border-transparent hover:border-gray-300 ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
            >
              <div className="flex items-center">
                <Activity size={20} className="mr-2" />
                Overview
              </div>
            </button>

            <button
              onClick={() => setActiveTab("items")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "items"
                ? "border-blue-500 text-blue-600"
                : `border-transparent hover:border-gray-300 ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
            >
              <div className="flex items-center">
                <Package size={20} className="mr-2" />
                My Items ({items.length})
              </div>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "analytics"
                ? "border-blue-500 text-blue-600"
                : `border-transparent hover:border-gray-300 ${currentTheme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                }`}
            >
              <div className="flex items-center">
                <BarChart3 size={20} className="mr-2" />
                Analytics
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "items" && renderMyItems()}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Overview */}
              <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <BarChart3 className="text-blue-600" size={20} />
                  Sales Overview
                </h3>
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {[35, 55, 40, 70, 50, 80, 65].map((height, i) => (
                    <div key={i} className={`w-full rounded-t-lg relative group transition-colors ${currentTheme === 'dark' ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-100 hover:bg-blue-200'
                      }`}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-500"
                        style={{ height: `${height}%` }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                          ₹{height * 100}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`flex justify-between mt-4 text-xs font-medium ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* Category Distribution */}
              <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                <h3 className={`text-lg font-semibold mb-6 flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <PieChart className="text-purple-600" size={20} />
                  Item Categories
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Electronics', count: 12, color: 'bg-blue-500' },
                    { label: 'Books', count: 8, color: 'bg-green-500' },
                    { label: 'Clothing', count: 5, color: 'bg-pink-500' },
                    { label: 'Furniture', count: 3, color: 'bg-orange-500' }
                  ].map((cat) => (
                    <div key={cat.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`font-medium ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{cat.label}</span>
                        <span className={currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>{cat.count} items</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div
                          className={`h-full ${cat.color} rounded-full`}
                          style={{ width: `${(cat.count / 28) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`mt-8 pt-6 border-t ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Total Items Listed</span>
                    <span className={`font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>28</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className={`p-6 rounded-xl shadow-sm border transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
              }`}>
              <h3 className={`text-lg font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Performance Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-green-900/10 border-green-900/30' : 'bg-green-50 border-green-100'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${currentTheme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                      <TrendingUp size={18} />
                    </div>
                    <span className={`font-semibold ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-900'}`}>High Demand</span>
                  </div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    Your electronics items are getting 40% more views than average.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      <Users size={18} />
                    </div>
                    <span className={`font-semibold ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>Profile Visits</span>
                  </div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    124 people visited your profile this week. Up 12% from last week.
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50 border-purple-100'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${currentTheme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                      <Star size={18} />
                    </div>
                    <span className={`font-semibold ${currentTheme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>Top Rated</span>
                  </div>
                  <p className={`text-sm ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    You've maintained a 5-star rating for the last 3 months!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ NEW: Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
              <div className={`sticky top-0 border-b px-6 py-4 rounded-t-2xl ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                }`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Edit Item</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                      }`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${currentTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${currentTheme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                      }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${currentTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                        }`}
                    >
                      <option value="electronics">Electronics</option>
                      <option value="books">Books</option>
                      <option value="clothing">Clothing</option>
                      <option value="furniture">Furniture</option>
                      <option value="sports">Sports</option>
                      <option value="accessories">Accessories</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Condition</label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm(prev => ({ ...prev, condition: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${currentTheme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                        }`}
                    >
                      <option value="new">New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>

                {editingItem.type === 'sale' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Price (₹)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${currentTheme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                          }`}
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.negotiable}
                          onChange={(e) => setEditForm(prev => ({ ...prev, negotiable: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={`ml-2 text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Price is negotiable</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className={`flex gap-3 pt-4 border-t ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className={`flex-1 px-4 py-3 border rounded-xl transition-colors ${currentTheme === 'dark'
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={updating}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

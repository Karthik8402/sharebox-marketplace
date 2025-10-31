// src/pages/Dashboard.jsx - Updated with Edit functionality
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserItems, deleteItem, updateItem } from "../services/itemService";
import { Link } from "react-router-dom";
import { 
  Trash2, 
  Edit, 
  Plus, 
  TrendingUp, 
  Package, 
  DollarSign, 
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
  Copy
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, change, changeType, color, subtitle }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp size={16} className="mr-1" />
            {change}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid - Same as before */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Package}
          title="Total Items"
          value={analytics.totalItems}
          change={12}
          changeType="increase"
          color="bg-blue-500"
          subtitle="Items you've listed"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Listings"
          value={analytics.activeItems}
          change={5}
          changeType="increase"
          color="bg-green-500"
          subtitle="Currently available"
        />
        <StatCard
          icon={DollarSign}
          title="Total Earnings"
          value={`₹${analytics.totalEarnings.toFixed(2)}`}
          change={23}
          changeType="increase"
          color="bg-purple-500"
          subtitle="From completed sales"
        />
        <StatCard
          icon={Gift}
          title="Items Donated"
          value={analytics.donatedItems}
          color="bg-orange-500"
          subtitle="Free items shared"
        />
      </div>

      {/* Quick Actions - Same as before */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/add-item"
            className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Add New Item</h4>
              <p className="text-sm text-gray-600">List something new</p>
            </div>
          </Link>
          
          <button className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">View Analytics</h4>
              <p className="text-sm text-gray-600">Performance insights</p>
            </div>
          </button>
          
          <button className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <Share2 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium text-gray-900">Share Profile</h4>
              <p className="text-sm text-gray-600">Promote your items</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity - Same as before */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {items.slice(0, 5).map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  item.status === 'available' ? 'bg-green-500' :
                  item.status === 'sold' ? 'bg-blue-500' : 'bg-gray-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {item.status === 'available' ? 'Listed' : 
                     item.status === 'sold' ? 'Sold' : 'Updated'} • 2 hours ago
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
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
      {/* Search and Filter Bar - Same as before */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <List size={18} />
              </button>
            </div>

            <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Items Grid/List - UPDATED */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {items.length === 0 ? "No items yet" : "No items match your search"}
          </h3>
          <p className="text-gray-600 mb-6">
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
            <div key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all ${
              viewMode === "list" ? "p-4" : "p-0 overflow-hidden"
            }`}>
              {viewMode === "grid" ? (
                // ✅ UPDATED Grid View
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
                            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {/* ✅ DROPDOWN MENU */}
                          {openMenuId === item.id && (
                            <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px] z-10">
                              <button
                                onClick={() => handleViewItem(item.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <ExternalLink size={14} className="mr-2" />
                                View Item
                              </button>
                              <button
                                onClick={() => handleEditItem(item)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Edit size={14} className="mr-2" />
                                Edit Item
                              </button>
                              <button
                                onClick={() => handleCopyLink(item.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Copy size={14} className="mr-2" />
                                Copy Link
                              </button>
                              <hr className="my-1" />
                              {item.status === 'available' && (
                                <button
                                  onClick={() => handleMarkAs(item, item.type === 'donation' ? 'taken' : 'sold')}
                                  className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center"
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
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
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
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'available' ? 'bg-green-100 text-green-800' :
                        item.status === 'sold' || item.status === 'taken' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.type === 'donation' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type === 'donation' ? 'Free' : `₹${item.price}`}
                      </span>
                      
                      <div className="flex items-center gap-3 text-sm text-gray-500">
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
                    
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleCopyLink(item.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // ✅ UPDATED List View
                <div className="flex items-center gap-4">
                  {item.imageURL && (
                    <img
                      src={item.imageURL}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{item.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'donation' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type === 'donation' ? 'Free' : `₹${item.price}`}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'available' ? 'bg-green-100 text-green-800' :
                      item.status === 'sold' || item.status === 'taken' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header - Same as before */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.displayName?.split(' ')[0] || 'User'}! 👋
              </h1>
              <p className="text-gray-600">
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

        {/* Navigation Tabs - Same as before */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Activity size={20} className="mr-2" />
                Overview
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("items")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "items"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Package size={20} className="mr-2" />
                My Items ({items.length})
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Coming Soon</h3>
            <p className="text-gray-600">Detailed analytics and insights will be available soon.</p>
          </div>
        )}

        {/* ✅ NEW: Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Item</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                    <select
                      value={editForm.condition}
                      onChange={(e) => setEditForm(prev => ({ ...prev, condition: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                        <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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

        {/* Delete Modal - Same as before */}
        {showDeleteModal && itemToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Delete Item
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteItem(itemToDelete.id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

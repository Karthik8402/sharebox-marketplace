// src/pages/AddItem.jsx - Professional UI/UX
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { createItem, uploadImage } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import {
    Upload,
    X,
    Image as ImageIcon,
    IndianRupee,
    Gift,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Camera,
    Tag,
    FileText,
    Package,
    Loader,
    Sparkles,
    Zap,
    Star,
    Shield,
    Info,
    Plus,
    Trash2,
    Eye,
    MessageCircle,
    Grid,
    Move
} from "lucide-react";

export default function AddItem() {
    const { user } = useAuth();
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [dragActive, setDragActive] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        type: "donation",
        title: "",
        description: "",
        category: "",
        condition: "good",
        price: "",
        negotiable: false,
        tags: [],
        contactMethod: "in-app"
    });

    // ✅ Multiple images support with ImgBB
    const [imageFiles, setImageFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [newTag, setNewTag] = useState("");

    const maxImages = 5;
    const maxFileSize = 32 * 1024 * 1024; // 32MB (ImgBB limit)
    const totalSteps = 4;

    // ✅ Categories data with enhanced styling
    const categories = [
        { value: "electronics", label: "Electronics", icon: "💻", color: "from-blue-500 to-purple-600" },
        { value: "books", label: "Books", icon: "📚", color: "from-green-500 to-teal-600" },
        { value: "clothing", label: "Clothing", icon: "👕", color: "from-pink-500 to-red-600" },
        { value: "furniture", label: "Furniture", icon: "🪑", color: "from-amber-500 to-orange-600" },
        { value: "sports", label: "Sports & Outdoors", icon: "⚽", color: "from-indigo-500 to-blue-600" },
        { value: "accessories", label: "Accessories", icon: "👜", color: "from-purple-500 to-pink-600" },
        { value: "other", label: "Other", icon: "📦", color: "from-gray-500 to-gray-600" }
    ];

    // ✅ Conditions data with enhanced styling
    const conditions = [
        { value: "new", label: "Brand New", description: "Never used, in original packaging", icon: "✨", color: "text-emerald-600" },
        { value: "excellent", label: "Like New", description: "Lightly used, no visible wear", icon: "⭐", color: "text-blue-600" },
        { value: "good", label: "Good", description: "Some signs of use, fully functional", icon: "👍", color: "text-amber-600" },
        { value: "fair", label: "Fair", description: "Well used but still works properly", icon: "🔧", color: "text-orange-600" }
    ];

    // ✅ Validation function
    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.title.trim()) newErrors.title = "Title is required";
                if (formData.title.length > 100) newErrors.title = "Title must be under 100 characters";
                if (!formData.description.trim()) newErrors.description = "Description is required";
                if (formData.description.length < 10) newErrors.description = "Description should be at least 10 characters";
                if (formData.description.length > 500) newErrors.description = "Description must be under 500 characters";
                break;
            case 2:
                if (!formData.category) newErrors.category = "Category is required";
                break;
            case 3:
                if (formData.type === "sale") {
                    if (!formData.price || formData.price <= 0) {
                        newErrors.price = "Price is required for items being sold";
                    } else if (formData.price > 100000) {
                        newErrors.price = "Price seems too high. Please verify.";
                    }
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Navigation functions
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // ✅ Input change handler
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    // ✅ Handle multiple file selection
    const handleFileSelect = (files) => {
        const fileList = Array.from(files);
        const validFiles = [];
        const newPreviews = [];
        const newErrors = [];

        fileList.forEach((file, index) => {
            // Check if we haven't exceeded max images
            if (imageFiles.length + validFiles.length >= maxImages) {
                newErrors.push(`Maximum ${maxImages} images allowed`);
                return;
            }

            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                newErrors.push(`${file.name} is not an image file`);
                return;
            }

            // Check file size (ImgBB allows up to 32MB)
            if (file.size > maxFileSize) {
                newErrors.push(`${file.name} is too large (max 32MB)`);
                return;
            }

            validFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = {
                    id: Math.random().toString(36).substr(2, 9),
                    file: file,
                    url: e.target.result,
                    name: file.name,
                    size: file.size,
                    uploaded: false,
                    uploading: false,
                    imageUrl: null,
                    error: null
                };

                newPreviews.push(preview);

                // Update state when all previews are loaded
                if (newPreviews.length === validFiles.length) {
                    setPreviewImages(prev => [...prev, ...newPreviews]);
                    setImageFiles(prev => [...prev, ...validFiles]);
                }
            };
            reader.readAsDataURL(file);
        });

        // Show errors if any
        if (newErrors.length > 0) {
            setErrors({ images: newErrors.join(', ') });
        } else {
            setErrors({ ...errors, images: "" });
        }
    };

    // ✅ Handle drag and drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files);
        }
    };

    // ✅ Remove specific image
    const removeImage = (imageId) => {
        const imageToRemove = previewImages.find(img => img.id === imageId);
        setPreviewImages(prev => prev.filter(img => img.id !== imageId));
        setImageFiles(prev => prev.filter(file => file !== imageToRemove?.file));
    };

    // ✅ Reorder images
    const moveImage = (fromIndex, toIndex) => {
        const newPreviews = [...previewImages];
        const newFiles = [...imageFiles];

        const [movedPreview] = newPreviews.splice(fromIndex, 1);
        newPreviews.splice(toIndex, 0, movedPreview);

        const [movedFile] = newFiles.splice(fromIndex, 1);
        newFiles.splice(toIndex, 0, movedFile);

        setPreviewImages(newPreviews);
        setImageFiles(newFiles);
    };

    // ✅ Tag management functions
    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // ✅ Upload multiple images to ImgBB using your existing function
    const uploadMultipleImagesToImgBB = async (files) => {
        const uploadPromises = files.map(async (file, index) => {
            try {
                // Update preview to show uploading
                setPreviewImages(prev => prev.map(img =>
                    img.file === file ? { ...img, uploading: true, error: null } : img
                ));

                // Use your existing uploadImage function
                const imageUrl = await uploadImage(file);

                // Update preview with success
                setPreviewImages(prev => prev.map(img =>
                    img.file === file
                        ? { ...img, uploading: false, uploaded: true, imageUrl }
                        : img
                ));

                // Update progress
                const progress = ((index + 1) / files.length) * 90; // Reserve 10% for final steps
                setUploadProgress(progress);

                return imageUrl;
            } catch (error) {
                console.error(`Error uploading image ${index}:`, error);

                // Update preview with error
                setPreviewImages(prev => prev.map(img =>
                    img.file === file
                        ? { ...img, uploading: false, uploaded: false, error: error.message }
                        : img
                ));

                throw error;
            }
        });

        try {
            const imageUrls = await Promise.all(uploadPromises);
            setUploadProgress(90);
            return imageUrls.filter(url => url !== null); // Filter out failed uploads
        } catch (error) {
            console.error("Error in batch upload:", error);
            throw error;
        }
    };

    // ✅ Handle submit with multiple images
    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setLoading(true);
        setUploadProgress(10);

        try {
            let imageURLs = [];

            if (imageFiles.length > 0) {
                // Upload all images to ImgBB
                imageURLs = await uploadMultipleImagesToImgBB(imageFiles);
            }

            setUploadProgress(95);

            // Create item with multiple image URLs
            await createItem({
                ...formData,
                ownerId: user.uid,
                ownerName: user.displayName || 'ShareBox User',
                price: formData.type === "sale" ? Number(formData.price) : null,
                imageURL: imageURLs[0] || "", // Primary image for backward compatibility
                imageURLs: imageURLs, // Array of all image URLs
                status: "available"
            });

            setUploadProgress(100);
            setShowSuccess(true);

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);

        } catch (error) {
            console.error("Error adding item:", error);
            setErrors({ submit: "Error adding item. Please try again." });
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    // ✅ Get step icon
    const getStepIcon = (step) => {
        switch (step) {
            case 1: return FileText;
            case 2: return Package;
            case 3: return formData.type === 'sale' ? IndianRupee : Gift;
            case 4: return Camera;
            default: return Package;
        }
    };

    // ✅ Render step function
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        {/* Step Header */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h2 className={`text-3xl font-bold mb-3 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Basic Information</h2>
                            <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tell us about your amazing item</p>
                        </div>

                        {/* Item Type Toggle - Enhanced */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "donation" }))}
                                className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.type === "donation"
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg dark:from-emerald-900/30 dark:to-teal-900/30"
                                    : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white'}`
                                    }`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${formData.type === "donation"
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-gray-300 dark:border-gray-600"
                                    }`}>
                                    {formData.type === "donation" && (
                                        <CheckCircle size={16} className="text-white absolute -top-0.5 -left-0.5" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                                        <Gift className="w-8 h-8 text-white" />
                                    </div>
                                    <div className={`font-bold text-xl mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Donate</div>
                                    <div className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Give it away free to help others</div>
                                    <div className="mt-3 text-sm text-emerald-600 font-medium">✨ Spread kindness</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "sale" }))}
                                className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.type === "sale"
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg dark:from-blue-900/30 dark:to-purple-900/30"
                                    : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white'}`
                                    }`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${formData.type === "sale"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                    }`}>
                                    {formData.type === "sale" && (
                                        <CheckCircle size={16} className="text-white absolute -top-0.5 -left-0.5" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                                        <IndianRupee className="w-8 h-8 text-white" />
                                    </div>
                                    <div className={`font-bold text-xl mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sell</div>
                                    <div className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Set a fair price for your item</div>
                                    <div className="mt-3 text-sm text-blue-600 font-medium">💰 Earn money</div>
                                </div>
                            </button>
                        </div>

                        {/* Title Input - Enhanced */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Item Title *
                                </label>
                                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formData.title.length}/100</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="title"
                                    maxLength={100}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., MacBook Pro 13-inch M2, Physics Textbook 2023, Winter Jacket..."
                                    className={`w-full px-6 py-4 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.title
                                        ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                        : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white text-gray-900'}`
                                        }`}
                                />
                                <div className="absolute right-4 top-4">
                                    <Sparkles size={20} className="text-gray-400" />
                                </div>
                            </div>
                            {errors.title && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{errors.title}</p>
                                </div>
                            )}
                        </div>

                        {/* Description - Enhanced */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Description *
                                </label>
                                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formData.description.length}/500</span>
                            </div>
                            <textarea
                                name="description"
                                rows={6}
                                maxLength={500}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your item's condition, features, and any important details that would help others understand what you're offering..."
                                className={`w-full px-6 py-4 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none ${errors.description
                                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                    : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white text-gray-900'}`
                                    }`}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{errors.description}</p>
                                </div>
                            )}

                            {/* Writing Tips */}
                            <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                                <div className="flex items-start gap-3">
                                    <Info size={18} className="text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className={`font-semibold mb-2 ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>💡 Writing Tips</h4>
                                        <ul className={`text-sm space-y-1 ${currentTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                                            <li>• Mention the item's condition honestly</li>
                                            <li>• Include any accessories or extras</li>
                                            <li>• Note any flaws or wear upfront</li>
                                            <li>• Explain why you're selling/donating</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Package className="w-10 h-10 text-white" />
                            </div>
                            <h2 className={`text-3xl font-bold mb-3 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Category & Condition</h2>
                            <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Help others find your item easily</p>
                        </div>

                        {/* Category Selection - Enhanced */}
                        <div className="space-y-4">
                            <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Choose Category *
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                                        className={`group relative p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.category === category.value
                                            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg dark:from-purple-900/30 dark:to-pink-900/30"
                                            : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white'}`
                                            }`}
                                    >
                                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all ${formData.category === category.value
                                            ? "border-purple-500 bg-purple-500"
                                            : "border-gray-300 dark:border-gray-600"
                                            }`}>
                                            {formData.category === category.value && (
                                                <CheckCircle size={14} className="text-white absolute -top-0.5 -left-0.5" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow`}>
                                                <span className="text-2xl">{category.icon}</span>
                                            </div>
                                            <div className={`font-bold text-sm ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{category.label}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.category && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{errors.category}</p>
                                </div>
                            )}
                        </div>

                        {/* Condition - Enhanced */}
                        <div className="space-y-4">
                            <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Item Condition
                            </label>
                            <div className="grid gap-4">
                                {conditions.map((condition) => (
                                    <button
                                        key={condition.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                                        className={`group p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-[1.02] ${formData.condition === condition.value
                                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:from-blue-900/30 dark:to-indigo-900/30"
                                            : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white'}`
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${formData.condition === condition.value ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700"
                                                }`}>
                                                {condition.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className={`font-bold text-lg mb-1 ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>{condition.label}</div>
                                                <div className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{condition.description}</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 transition-all ${formData.condition === condition.value
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-gray-300 dark:border-gray-600"
                                                }`}>
                                                {formData.condition === condition.value && (
                                                    <CheckCircle size={16} className="text-white absolute -m-0.5" />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tags - Enhanced */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                    Tags (Optional)
                                </label>
                                <span className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formData.tags.length}/5 tags</span>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Add tags like 'vintage', 'barely used', 'urgent'..."
                                    className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-200 text-gray-900'
                                        }`}
                                    maxLength={20}
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    disabled={formData.tags.length >= 5 || !newTag.trim()}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {formData.tags.map((tag, index) => (
                                        <div
                                            key={index}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-800 rounded-xl font-semibold"
                                        >
                                            <Tag size={14} />
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:bg-purple-200 rounded-full p-1 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Popular Tags Suggestions */}
                            <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                                <h4 className={`font-semibold mb-3 ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>💡 Popular Tags:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['urgent', 'barely used', 'vintage', 'premium', 'student-friendly', 'rare'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            type="button"
                                            onClick={() => {
                                                if (!formData.tags.includes(suggestion) && formData.tags.length < 5) {
                                                    setFormData(prev => ({ ...prev, tags: [...prev.tags, suggestion] }));
                                                }
                                            }}
                                            className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${currentTheme === 'dark'
                                                ? 'bg-gray-800 border-purple-700 text-purple-300 hover:bg-purple-900/30'
                                                : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-100'
                                                }`}
                                        >
                                            + {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className={`w-20 h-20 bg-gradient-to-br ${formData.type === 'sale' ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-600'} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                {formData.type === 'sale' ? (
                                    <IndianRupee className="w-10 h-10 text-white" />
                                ) : (
                                    <Gift className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <h2 className={`text-3xl font-bold mb-3 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {formData.type === 'sale' ? 'Set Your Price' : 'Donation Details'}
                            </h2>
                            <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {formData.type === 'sale' ? 'Price it fairly for quick sale' : 'Your generous donation details'}
                            </p>
                        </div>

                        {/* Price for Sales - Enhanced */}
                        {formData.type === "sale" && (
                            <div className={`p-8 rounded-3xl border-2 shadow-lg ${currentTheme === 'dark'
                                ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-800'
                                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                                }`}>
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className={`text-2xl font-bold mb-2 ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>💰 Pricing</h3>
                                        <p className={currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}>Set a fair price that attracts buyers</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                                            Your Price *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-green-600">
                                                ₹
                                            </div>
                                            <input
                                                type="number"
                                                name="price"
                                                min="0"
                                                max="100000"
                                                step="1"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                placeholder="0"
                                                className={`w-full pl-12 pr-6 py-4 text-2xl font-bold border-3 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${errors.price
                                                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                                                    : `border-green-200 hover:border-green-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`
                                                    }`}
                                            />
                                        </div>
                                        {errors.price && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                                <AlertCircle size={16} className="text-red-500" />
                                                <p className="text-sm text-red-700 dark:text-red-300 font-medium">{errors.price}</p>
                                            </div>
                                        )}

                                        {/* Negotiable Toggle */}
                                        <div className={`p-6 rounded-2xl border-2 ${currentTheme === 'dark' ? 'bg-gray-800 border-green-800' : 'bg-white border-green-200'
                                            }`}>
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="negotiable"
                                                        checked={formData.negotiable}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-14 h-8 rounded-full transition-all ${formData.negotiable ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}>
                                                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform top-1 absolute ${formData.negotiable ? 'translate-x-7' : 'translate-x-1'
                                                            }`}></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-bold flex items-center gap-2 ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>
                                                        <Zap size={18} />
                                                        Price is negotiable
                                                    </div>
                                                    <div className={`text-sm mt-1 ${currentTheme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                                                        Allow buyers to make counter-offers
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Pricing Tips */}
                                        <div className={`p-6 rounded-2xl border-2 ${currentTheme === 'dark' ? 'bg-gray-800 border-green-800' : 'bg-white border-green-200'
                                            }`}>
                                            <div className="flex items-start gap-3">
                                                <Star size={18} className="text-green-600 mt-1" />
                                                <div>
                                                    <h4 className={`font-bold mb-3 ${currentTheme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>💡 Pricing Tips</h4>
                                                    <ul className={`text-sm space-y-2 ${currentTheme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            Research similar items online for fair pricing
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            Consider depreciation based on usage and age
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            Price slightly higher if you're open to negotiation
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                            Be honest about condition to build trust
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Method - Enhanced */}
                        <div className="space-y-4">
                            <label className={`block text-lg font-bold ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                How should buyers contact you?
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "in-app" }))}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.contactMethod === "in-app"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white text-gray-700'}`
                                        }`}
                                >
                                    <MessageCircle size={20} />
                                    <span className="font-semibold">In-App Chat (Recommended)</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "phone" }))}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${formData.contactMethod === "phone"
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                        : `border-gray-200 hover:border-gray-300 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white text-gray-700'}`
                                        }`}
                                >
                                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">P</div>
                                    <span className="font-semibold">Phone Number</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Camera className="w-10 h-10 text-white" />
                            </div>
                            <h2 className={`text-3xl font-bold mb-3 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Photos</h2>
                            <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Showcase your item with great photos</p>
                        </div>

                        {/* Upload Area */}
                        <div
                            className={`relative border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${dragActive
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                                : `border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800`
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e.target.files)}
                                className="hidden"
                            />

                            <div className="space-y-4">
                                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Drag & Drop photos here
                                    </h3>
                                    <p className={`mb-6 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        or <label htmlFor="file-upload" className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">browse files</label> from your device
                                    </p>
                                </div>
                                <div className={`text-sm ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Supported formats: JPG, PNG, WEBP (Max 5 images, 32MB each)
                                </div>
                            </div>
                        </div>

                        {errors.images && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                <AlertCircle size={20} className="text-red-500" />
                                <p className="text-red-700 dark:text-red-300 font-medium">{errors.images}</p>
                            </div>
                        )}

                        {/* Image Previews */}
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {previewImages.map((img, index) => (
                                    <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                                        <img
                                            src={img.url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            {index > 0 && (
                                                <button
                                                    onClick={() => moveImage(index, index - 1)}
                                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="Move Left"
                                                >
                                                    <ArrowLeft size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors"
                                                title="Remove"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            {index < previewImages.length - 1 && (
                                                <button
                                                    onClick={() => moveImage(index, index + 1)}
                                                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="Move Right"
                                                >
                                                    <ArrowRight size={16} />
                                                </button>
                                            )}
                                        </div>

                                        {/* Status Indicators */}
                                        {img.uploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                        {img.uploaded && (
                                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                                <CheckCircle size={14} />
                                            </div>
                                        )}
                                        {img.error && (
                                            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center text-white text-center p-2 text-xs font-bold">
                                                Upload Failed
                                            </div>
                                        )}

                                        {/* Cover Label */}
                                        {index === 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-600/90 text-white text-xs font-bold py-1 text-center backdrop-blur-sm">
                                                Cover Photo
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {previewImages.length < maxImages && (
                                    <label className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${currentTheme === 'dark'
                                        ? 'border-gray-700 hover:border-gray-500 hover:bg-gray-800'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                        }`}>
                                        <Plus className={currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'} size={32} />
                                        <span className={`text-sm mt-2 font-medium ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Add More</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileSelect(e.target.files)}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Photo Tips */}
                        <div className={`p-4 rounded-xl border ${currentTheme === 'dark' ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                            <div className="flex items-start gap-3">
                                <Camera size={18} className="text-blue-600 mt-0.5" />
                                <div>
                                    <h4 className={`font-semibold mb-2 ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>📸 Photo Tips</h4>
                                    <ul className={`text-sm space-y-1 ${currentTheme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                                        <li>• Use good lighting (daylight is best)</li>
                                        <li>• Take photos from multiple angles</li>
                                        <li>• Show any damage or wear clearly</li>
                                        <li>• Clean the item before taking photos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen pt-20 pb-12 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium mb-2">
                        <span className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Step {currentStep} of {totalSteps}</span>
                        <span className="text-blue-600 font-bold">{Math.round((currentStep / totalSteps) * 100)}% Completed</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Main Card */}
                <div className={`rounded-3xl shadow-xl overflow-hidden transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                    }`}>
                    {/* Content Area */}
                    <div className="p-8 md:p-12">
                        {renderStep()}
                    </div>

                    {/* Footer Actions */}
                    <div className={`p-6 border-t flex justify-between items-center ${currentTheme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100'
                        }`}>
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 1 || loading}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${currentStep === 1
                                ? "opacity-0 pointer-events-none"
                                : currentTheme === 'dark'
                                    ? "text-gray-300 hover:bg-gray-700"
                                    : "text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Next Step
                                <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        {uploadProgress > 0 ? `Uploading ${Math.round(uploadProgress)}%` : 'Creating Item...'}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Publish Item
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`rounded-3xl p-8 max-w-sm w-full text-center transform transition-all scale-100 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Success!</h3>
                        <p className={`mb-6 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your item has been listed successfully.</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-green-500 h-2 rounded-full animate-[width_2s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

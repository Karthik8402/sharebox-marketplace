// src/pages/AddItem.jsx - COMPLETE & CORRECT CODE
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createItem, uploadImage } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import { 
    Upload,
    X,
    Image as ImageIcon,
    DollarSign,
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
            case 3: return formData.type === 'sale' ? DollarSign : Gift;
            case 4: return Camera;
            default: return Package;
        }
    };

    // ✅ Render step function - YOUR EXISTING CODE WORKS, JUST ADDING THE STEP 4
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Basic Information</h2>
                            <p className="text-gray-600 text-lg">Tell us about your amazing item</p>
                        </div>

                        {/* Item Type Toggle - Enhanced */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "donation" }))}
                                className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.type === "donation"
                                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-lg"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${formData.type === "donation"
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-gray-300"
                                    }`}>
                                    {formData.type === "donation" && (
                                        <CheckCircle size={16} className="text-white absolute -top-0.5 -left-0.5" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                                        <Gift className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-bold text-xl mb-2">Donate</div>
                                    <div className="text-gray-600">Give it away free to help others</div>
                                    <div className="mt-3 text-sm text-emerald-600 font-medium">✨ Spread kindness</div>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: "sale" }))}
                                className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.type === "sale"
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg"
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                                    }`}
                            >
                                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all ${formData.type === "sale"
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                    }`}>
                                    {formData.type === "sale" && (
                                        <CheckCircle size={16} className="text-white absolute -top-0.5 -left-0.5" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                                        <DollarSign className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-bold text-xl mb-2">Sell</div>
                                    <div className="text-gray-600">Set a fair price for your item</div>
                                    <div className="mt-3 text-sm text-blue-600 font-medium">💰 Earn money</div>
                                </div>
                            </button>
                        </div>

                        {/* Title Input - Enhanced */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-lg font-bold text-gray-800">
                                    Item Title *
                                </label>
                                <span className="text-sm text-gray-500">{formData.title.length}/100</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="title"
                                    maxLength={100}
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., MacBook Pro 13-inch M2, Physics Textbook 2023, Winter Jacket..."
                                    className={`w-full px-6 py-4 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.title ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                />
                                <div className="absolute right-4 top-4">
                                    <Sparkles size={20} className="text-gray-400" />
                                </div>
                            </div>
                            {errors.title && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 font-medium">{errors.title}</p>
                                </div>
                            )}
                        </div>

                        {/* Description - Enhanced */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-lg font-bold text-gray-800">
                                    Description *
                                </label>
                                <span className="text-sm text-gray-500">{formData.description.length}/500</span>
                            </div>
                            <textarea
                                name="description"
                                rows={6}
                                maxLength={500}
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your item's condition, features, and any important details that would help others understand what you're offering..."
                                className={`w-full px-6 py-4 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none ${errors.description ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
                                    }`}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 font-medium">{errors.description}</p>
                                </div>
                            )}

                            {/* Writing Tips */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <Info size={18} className="text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-800 mb-2">💡 Writing Tips</h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Category & Condition</h2>
                            <p className="text-gray-600 text-lg">Help others find your item easily</p>
                        </div>

                        {/* Category Selection - Enhanced */}
                        <div className="space-y-4">
                            <label className="block text-lg font-bold text-gray-800">
                                Choose Category *
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                                        className={`group relative p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-105 ${formData.category === category.value
                                            ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all ${formData.category === category.value
                                            ? "border-purple-500 bg-purple-500"
                                            : "border-gray-300"
                                            }`}>
                                            {formData.category === category.value && (
                                                <CheckCircle size={14} className="text-white absolute -top-0.5 -left-0.5" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow`}>
                                                <span className="text-2xl">{category.icon}</span>
                                            </div>
                                            <div className="font-bold text-sm">{category.label}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {errors.category && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                    <AlertCircle size={16} className="text-red-500" />
                                    <p className="text-sm text-red-700 font-medium">{errors.category}</p>
                                </div>
                            )}
                        </div>

                        {/* Condition - Enhanced */}
                        <div className="space-y-4">
                            <label className="block text-lg font-bold text-gray-800">
                                Item Condition
                            </label>
                            <div className="grid gap-4">
                                {conditions.map((condition) => (
                                    <button
                                        key={condition.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, condition: condition.value }))}
                                        className={`group p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-[1.02] ${formData.condition === condition.value
                                            ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                                            : "border-gray-200 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${formData.condition === condition.value ? "bg-blue-500 text-white" : "bg-gray-100"
                                                }`}>
                                                {condition.icon}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-bold text-lg mb-1">{condition.label}</div>
                                                <div className="text-gray-600">{condition.description}</div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 transition-all ${formData.condition === condition.value
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-gray-300"
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
                                <label className="block text-lg font-bold text-gray-800">
                                    Tags (Optional)
                                </label>
                                <span className="text-sm text-gray-500">{formData.tags.length}/5 tags</span>
                            </div>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    placeholder="Add tags like 'vintage', 'barely used', 'urgent'..."
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                <h4 className="font-semibold text-purple-800 mb-3">💡 Popular Tags:</h4>
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
                                            className="text-xs bg-white px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors border border-purple-200 text-purple-700"
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
                                    <DollarSign className="w-10 h-10 text-white" />
                                ) : (
                                    <Gift className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                                {formData.type === 'sale' ? 'Set Your Price' : 'Donation Details'}
                            </h2>
                            <p className="text-gray-600 text-lg">
                                {formData.type === 'sale' ? 'Price it fairly for quick sale' : 'Your generous donation details'}
                            </p>
                        </div>

                        {/* Price for Sales - Enhanced */}
                        {formData.type === "sale" && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl border-2 border-green-200 shadow-lg">
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-green-800 mb-2">💰 Pricing</h3>
                                        <p className="text-green-700">Set a fair price that attracts buyers</p>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-lg font-bold text-green-800">
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
                                                className={`w-full pl-12 pr-6 py-4 text-2xl font-bold border-3 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 ${errors.price ? "border-red-400 bg-red-50" : "border-green-200 bg-white hover:border-green-300"
                                                    }`}
                                            />
                                        </div>
                                        {errors.price && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                                <AlertCircle size={16} className="text-red-500" />
                                                <p className="text-sm text-red-700 font-medium">{errors.price}</p>
                                            </div>
                                        )}

                                        {/* Negotiable Toggle */}
                                        <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
                                            <label className="flex items-center gap-4 cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="negotiable"
                                                        checked={formData.negotiable}
                                                        onChange={handleInputChange}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-14 h-8 rounded-full transition-all ${formData.negotiable ? 'bg-green-500' : 'bg-gray-300'
                                                        }`}>
                                                        <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform top-1 absolute ${formData.negotiable ? 'translate-x-7' : 'translate-x-1'
                                                            }`}></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-green-800 flex items-center gap-2">
                                                        <Zap size={18} />
                                                        Price is negotiable
                                                    </div>
                                                    <div className="text-sm text-green-600 mt-1">
                                                        Allow buyers to make counter-offers
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Pricing Tips */}
                                        <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
                                            <div className="flex items-start gap-3">
                                                <Star size={18} className="text-green-600 mt-1" />
                                                <div>
                                                    <h4 className="font-bold text-green-800 mb-3">💡 Pricing Tips</h4>
                                                    <ul className="text-sm text-green-700 space-y-2">
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
                            <label className="block text-lg font-bold text-gray-800">
                                How should buyers contact you?
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "in-app" }))}
                                    className={`group p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-[1.02] ${formData.contactMethod === "in-app"
                                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${formData.contactMethod === "in-app"
                                            ? "bg-blue-500 text-white shadow-lg"
                                            : "bg-blue-100 text-blue-600"
                                            }`}>
                                            <MessageCircle size={24} />
                                        </div>
                                        <div className="font-bold text-lg mb-2">In-App Messaging</div>
                                        <div className="text-gray-600 text-sm">Safe and secure communication through ShareBox</div>
                                        <div className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600 font-medium">
                                            <Shield size={12} />
                                            Recommended
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: "email" }))}
                                    className={`group p-6 rounded-2xl border-3 transition-all duration-300 hover:scale-[1.02] ${formData.contactMethod === "email"
                                        ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg"
                                        : "border-gray-200 hover:border-gray-300 bg-white"
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${formData.contactMethod === "email"
                                            ? "bg-purple-500 text-white shadow-lg"
                                            : "bg-purple-100 text-purple-600"
                                            }`}>
                                            📧
                                        </div>
                                        <div className="font-bold text-lg mb-2">Email</div>
                                        <div className="text-gray-600 text-sm">Direct email communication using your registered email</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Free Item Celebration */}
                        {formData.type === "donation" && (
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border-2 border-orange-200 shadow-lg">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-bold text-orange-800 mb-3">Amazing Generosity!</h3>
                                    <p className="text-orange-700 text-lg">
                                        You're helping make education and campus life more affordable for everyone. Thank you for your kindness!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Camera className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Add Photos</h2>
                            <p className="text-gray-600 text-lg">Upload up to {maxImages} images (32MB each)</p>
                        </div>

                        {/* Upload Zone */}
                        <div className="space-y-6">
                            <div
                                className={`relative border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${dragActive
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105"
                                    : "border-gray-300 hover:border-gray-400 bg-white"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {imageFiles.length < maxImages ? (
                                    <div className="space-y-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                                {imageFiles.length === 0
                                                    ? "Drag and drop your images here"
                                                    : `Add more images (${imageFiles.length}/${maxImages})`
                                                }
                                            </p>
                                            <p className="text-gray-500 mb-4">or</p>
                                            <label className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold cursor-pointer shadow-lg">
                                                <Camera size={20} />
                                                Choose Images
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleFileSelect(e.target.files)}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-sm text-gray-500 mt-3">
                                                PNG, JPG, GIF, WebP up to 32MB each • Max {maxImages} images
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <p className="text-lg font-semibold text-gray-700">
                                            Maximum images reached ({maxImages}/{maxImages})
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Image Previews with Upload Status */}
                            {previewImages.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Your Images ({previewImages.length}/{maxImages})
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Move size={16} />
                                            Drag to reorder
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {previewImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className="relative group bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all"
                                                draggable={!image.uploading}
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", index.toString());
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                                                    const toIndex = index;
                                                    if (fromIndex !== toIndex) {
                                                        moveImage(fromIndex, toIndex);
                                                    }
                                                }}
                                            >
                                                {/* Status Badges */}
                                                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                                                    {index === 0 && (
                                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            PRIMARY
                                                        </span>
                                                    )}

                                                    {/* Upload Status */}
                                                    {image.uploading && (
                                                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                            <Loader size={10} className="animate-spin" />
                                                            Uploading
                                                        </span>
                                                    )}

                                                    {image.uploaded && (
                                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                            <CheckCircle size={10} />
                                                            Uploaded
                                                        </span>
                                                    )}

                                                    {image.error && (
                                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                            <AlertCircle size={10} />
                                                            Failed
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Remove Button */}
                                                {!image.uploading && (
                                                    <button
                                                        onClick={() => removeImage(image.id)}
                                                        className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}

                                                {/* Image */}
                                                <div className="relative">
                                                    <img
                                                        src={image.url}
                                                        alt={`Preview ${index + 1}`}
                                                        className={`w-full h-32 object-cover ${image.uploading ? 'opacity-50' : 'cursor-move'}`}
                                                    />

                                                    {/* Upload Progress Overlay */}
                                                    {image.uploading && (
                                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                            <Loader size={24} className="text-blue-600 animate-spin" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Image Info */}
                                                <div className="p-3">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {image.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(image.size / 1024 / 1024).toFixed(1)} MB
                                                    </p>
                                                    {image.error && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Upload failed
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Drag Handle */}
                                                {!image.uploading && (
                                                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Move size={16} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {loading && uploadProgress > 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Loader size={24} className="text-blue-600 animate-spin" />
                                            <span className="text-lg font-bold text-blue-900">
                                                Publishing your item...
                                            </span>
                                        </div>
                                        <span className="text-lg font-bold text-blue-700">{uploadProgress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-blue-700 text-sm mt-3">
                                        {uploadProgress < 10 ? "Preparing..." :
                                            uploadProgress < 90 ? "Uploading images to ImgBB..." :
                                                "Saving item details..."}
                                    </p>
                                </div>
                            )}

                            {/* Errors */}
                            {errors.images && (
                                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <AlertCircle size={18} className="text-red-500" />
                                    <p className="text-red-700 font-medium">{errors.images}</p>
                                </div>
                            )}

                            {errors.submit && (
                                <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={24} className="text-red-500" />
                                        <div>
                                            <h4 className="font-semibold text-red-800">Upload Failed</h4>
                                            <p className="text-red-700 mt-1">{errors.submit}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ImgBB Tips */}
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                                <div className="flex items-start gap-3">
                                    <Info size={18} className="text-amber-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-amber-800 mb-2">📸 ImgBB Upload Tips</h4>
                                        <ul className="text-sm text-amber-700 space-y-1">
                                            <li>• <strong>High resolution</strong> images work best</li>
                                            <li>• <strong>Up to 32MB</strong> per image supported</li>
                                            <li>• <strong>Multiple formats</strong> (JPG, PNG, GIF, WebP)</li>
                                            <li>• <strong>Fast CDN delivery</strong> worldwide</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Success Animation
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-md mx-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Success!</h2>
                    <p className="text-gray-700 text-lg mb-6">
                        Your item has been published successfully! Redirecting to your dashboard...
                    </p>
                    <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full animate-pulse w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Enhanced Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Add New Item
                        </h1>
                        <span className="text-lg text-gray-600 font-semibold">
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-6">
                        {[1, 2, 3, 4].map((step) => {
                            const StepIcon = getStepIcon(step);
                            return (
                                <div key={step} className="flex items-center">
                                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${step <= currentStep
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        <StepIcon size={24} />
                                        {step < currentStep && (
                                            <div className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle size={24} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    {step < totalSteps && (
                                        <div className={`hidden md:block w-24 h-1 mx-4 rounded-full transition-all duration-500 ${step < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                        <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">
                    {renderStep()}

                    {/* Enhanced Navigation */}
                    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${currentStep === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100 hover:shadow-lg"
                                }`}
                        >
                            <ArrowLeft size={24} />
                            Previous
                        </button>

                        {currentStep === totalSteps ? (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={24} className="animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={24} />
                                        Publish Item
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Continue
                                <ArrowRight size={24} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Enhanced Help Section */}
                <div className="mt-8 text-center">
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Info size={20} className="text-blue-600" />
                            <h3 className="font-bold text-gray-800">Need Help?</h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                            Check out our comprehensive guide to create the perfect listing
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                📖 Posting Guidelines
                            </a>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                📸 Photo Tips
                            </a>
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                💬 Get Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

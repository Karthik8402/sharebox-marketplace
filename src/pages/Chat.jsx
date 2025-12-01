// src/pages/Chat.jsx - Enhanced Modern UI/UX with Dynamic Content
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    getUserTransactions,
    getSellerTransactions,
    sendMessage,
    subscribeToMessages,
    getTransactionById
} from '../services/transactionService';
import {
    Send,
    User,
    MoreVertical,
    Phone,
    Video,
    Image as ImageIcon,
    ArrowLeft,
    Search,
    CheckCircle,
    Clock,
    Check,
    CheckCheck,
    Smile,
    Paperclip,
    X,
    Package,
    IndianRupee,
    Gift,
    Sparkles,
    MessageCircle
} from 'lucide-react';

export default function Chat() {
    const { transactionId } = useParams();
    const { user } = useAuth();
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Quick reply suggestions
    const quickReplies = [
        "Is this still available?",
        "What's the condition?",
        "Can we meet today?",
        "Thanks! 👍"
    ];

    // Load conversations
    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    // Load active conversation if transactionId is present
    useEffect(() => {
        if (transactionId && conversations.length > 0) {
            const conversation = conversations.find(c => c.id === transactionId);
            if (conversation) {
                setActiveConversation(conversation);
            } else {
                getTransactionById(transactionId).then(data => {
                    if (data) {
                        setActiveConversation(data);
                        if (!conversations.find(c => c.id === data.id)) {
                            setConversations(prev => [data, ...prev]);
                        }
                    }
                });
            }
        } else if (!transactionId) {
            setActiveConversation(null);
        }
    }, [transactionId, conversations]);

    // Subscribe to messages for active conversation
    useEffect(() => {
        let unsubscribe;
        if (activeConversation) {
            unsubscribe = subscribeToMessages(activeConversation.id, (msgs) => {
                setMessages(msgs);
                scrollToBottom();
            });
        } else {
            // Clear messages when no conversation is selected
            setMessages([]);
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [activeConversation]);

    // Auto-scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const [buyerTx, sellerTx] = await Promise.all([
                getUserTransactions(user.uid),
                getSellerTransactions(user.uid)
            ]);

            const all = [...buyerTx, ...sellerTx].sort((a, b) =>
                (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt)
            );

            const unique = all.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
            setConversations(unique);
        } catch (error) {
            console.error("Error loading conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e, quickReply = null) => {
        if (e) e.preventDefault();
        const messageText = quickReply || newMessage.trim();
        if (!messageText || !activeConversation) return;

        setSending(true);
        try {
            await sendMessage(activeConversation.id, {
                text: messageText,
                senderId: user.uid,
                senderName: user.displayName,
                type: 'text'
            });
            setNewMessage("");
            setShowEmojiPicker(false);
            inputRef.current?.focus();
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const getOtherPartyName = (conv) => {
        return user.uid === conv.buyerId ? conv.sellerName : conv.buyerName;
    };

    const getUnreadCount = (conv) => {
        // Placeholder for unread count logic
        return 0;
    };

    const formatTime = (date) => {
        if (!date) return '';
        const now = new Date();
        const msgDate = new Date(date);
        const diffInHours = (now - msgDate) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const filteredConversations = conversations.filter(c =>
        getOtherPartyName(c).toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 h-screen flex flex-col border-r transition-colors duration-300 ${activeConversation ? 'hidden md:flex' : 'flex'} ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                {/* Sidebar Header */}
                <div className={`p-6 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-2xl font-bold flex items-center gap-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            <MessageCircle className="w-6 h-6 text-blue-500" />
                            Messages
                        </h2>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            {conversations.length}
                        </div>
                    </div>
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                                }`}
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
                    {loading ? (
                        <div className="p-8 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse flex gap-3">
                                    <div className={`w-12 h-12 rounded-full ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    <div className="flex-1 space-y-2">
                                        <div className={`h-4 rounded w-3/4 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                        <div className={`h-3 rounded w-1/2 ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${currentTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <MessageCircle size={32} className={currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
                            </div>
                            <p className={`font-medium mb-1 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>No messages yet</p>
                            <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {searchTerm ? 'No results found' : 'Start a conversation by making an offer'}
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map(conv => {
                            const unreadCount = getUnreadCount(conv);
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => {
                                        setActiveConversation(conv);
                                        navigate(`/chat/${conv.id}`);
                                    }}
                                    className={`w-full p-4 flex items-start gap-3 transition-all duration-200 border-b ${currentTheme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                                        } ${activeConversation?.id === conv.id
                                            ? (currentTheme === 'dark' ? 'bg-blue-900/20 border-l-4 border-l-blue-500' : 'bg-blue-50 border-l-4 border-l-blue-600')
                                            : (currentTheme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50')
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {getOtherPartyName(conv).charAt(0)}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-semibold truncate ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                                                {getOtherPartyName(conv)}
                                            </h3>
                                            <span className={`text-xs ml-2 flex-shrink-0 ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {formatTime(conv.updatedAt || conv.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            {conv.type === 'donation' ? (
                                                <Gift size={12} className="text-emerald-500 flex-shrink-0" />
                                            ) : (
                                                <IndianRupee size={12} className="text-blue-500 flex-shrink-0" />
                                            )}
                                            <p className={`text-sm font-medium truncate ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {conv.itemTitle}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {conv.lastMessage || "Started a new request"}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {activeConversation ? (
                <div className={`flex-1 flex flex-col h-screen ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
                    {/* Chat Header */}
                    <div className={`p-4 border-b flex items-center justify-between shadow-sm backdrop-blur-sm ${currentTheme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <button
                                onClick={() => {
                                    setActiveConversation(null);
                                    navigate('/chat');
                                }}
                                className={`md:hidden p-2 -ml-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                                    {getOtherPartyName(activeConversation).charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-bold truncate ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {getOtherPartyName(activeConversation)}
                                </h3>
                                <p className={`text-xs truncate flex items-center gap-1 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {activeConversation.type === 'donation' ? (
                                        <Gift size={10} className="text-emerald-500" />
                                    ) : (
                                        <IndianRupee size={10} className="text-blue-500" />
                                    )}
                                    {activeConversation.itemTitle}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
                                <Phone size={18} />
                            </button>
                            <button className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
                                <Video size={18} />
                            </button>
                            <button className={`p-2 rounded-lg transition-colors ${currentTheme === 'dark' ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}>
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Transaction Info Card */}
                    <div className={`mx-4 mt-4 p-4 rounded-2xl border ${currentTheme === 'dark' ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${activeConversation.type === 'donation' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                                {activeConversation.type === 'donation' ? (
                                    <Gift className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <IndianRupee className="w-5 h-5 text-blue-500" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {activeConversation.type === 'donation' ? 'Free Item' : `₹${activeConversation.price || 'N/A'}`}
                                </p>
                                <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {activeConversation.status === 'pending' ? 'Pending' : 'Active'} • {formatTime(activeConversation.createdAt)}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate(`/item/${activeConversation.itemId}`)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${currentTheme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                View Item
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <Sparkles size={32} className="text-blue-500" />
                                </div>
                                <p className={`font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Start the conversation!
                                </p>
                                <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Send a message to get started
                                </p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMe = msg.senderId === user.uid;
                                const showAvatar = index === 0 || messages[index - 1].senderId !== msg.senderId;
                                const showTimestamp = index === messages.length - 1 || messages[index + 1].senderId !== msg.senderId;

                                return (
                                    <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                        {!isMe && showAvatar && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {getOtherPartyName(activeConversation).charAt(0)}
                                            </div>
                                        )}
                                        {!isMe && !showAvatar && <div className="w-8"></div>}
                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            <div className={`group relative px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${isMe
                                                ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-none'
                                                : (currentTheme === 'dark' ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800 border border-gray-200') + ' rounded-bl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                                {showTimestamp && (
                                                    <div className={`flex items-center gap-1 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                        <span className={`text-[10px] ${isMe ? 'text-blue-100' : (currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-400')}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </span>
                                                        {isMe && (
                                                            <CheckCheck size={12} className="text-blue-200" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                    {getOtherPartyName(activeConversation).charAt(0)}
                                </div>
                                <div className={`px-4 py-3 rounded-2xl ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="flex gap-1">
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }}></div>
                                        <div className={`w-2 h-2 rounded-full animate-bounce ${currentTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length === 0 && (
                        <div className={`px-4 py-2 border-t ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <p className={`text-xs font-medium mb-2 ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Quick replies:</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSendMessage(null, reply)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${currentTheme === 'dark'
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className={`p-4 border-t backdrop-blur-sm ${currentTheme === 'dark' ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <button
                                type="button"
                                className={`p-3 rounded-xl transition-all hover:scale-105 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 text-gray-400 hover:text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Paperclip size={20} />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                                        }`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-3 rounded-xl transition-all hover:scale-105 ${currentTheme === 'dark'
                                    ? 'bg-gray-700 text-gray-400 hover:text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Smile size={20} />
                            </button>
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={`hidden md:flex flex-1 items-center justify-center flex-col text-center p-8 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        <MessageCircle size={64} className={currentTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Select a conversation
                    </h3>
                    <p className={`text-lg max-w-md ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Choose a chat from the sidebar to start messaging
                    </p>
                </div>
            )}
        </div>
    );
}

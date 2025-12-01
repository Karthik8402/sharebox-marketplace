import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

export default function Contact() {
    const { currentTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSending(false);
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className={`min-h-screen py-12 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className={`max-w-2xl mx-auto text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Have questions about ShareBox? We're here to help. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className={`p-8 rounded-2xl ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-sm`}>
                            <h3 className="text-xl font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Email Us</h4>
                                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            support@sharebox.com
                                        </p>
                                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            partners@sharebox.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Call Us</h4>
                                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            +1 (555) 123-4567
                                        </p>
                                        <p className={`text-xs ${currentTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Mon-Fri from 8am to 5pm
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                                        }`}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Visit Us</h4>
                                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                            123 Sharing Street<br />
                                            New York, NY 10001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Chat Promo */}
                        <div className={`p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg`}>
                            <MessageSquare size={32} className="mb-4" />
                            <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
                            <p className="text-blue-100 mb-6">
                                Need immediate assistance? Our support team is available 24/7 to help you.
                            </p>
                            <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                                Start Chat
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className={`lg:col-span-2 p-8 rounded-2xl shadow-sm ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>

                        {sent ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-600 mb-2">Message Sent!</h3>
                                <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                    Thank you for contacting us. We'll get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="mt-8 px-6 py-2 text-blue-600 font-semibold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-gray-50 border-gray-200 text-gray-900'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${currentTheme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none ${currentTheme === 'dark'
                                                ? 'bg-gray-700 border-gray-600 text-white'
                                                : 'bg-gray-50 border-gray-200 text-gray-900'
                                            }`}
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {sending ? 'Sending Message...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

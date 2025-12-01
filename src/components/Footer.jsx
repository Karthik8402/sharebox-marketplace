import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
    const { currentTheme } = useTheme();

    return (
        <footer className={`border-t transition-colors duration-300 ${currentTheme === 'dark'
                ? 'bg-gray-900 border-gray-800 text-gray-300'
                : 'bg-white border-gray-200 text-gray-600'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                S
                            </div>
                            <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600`}>
                                ShareBox
                            </span>
                        </Link>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Connecting communities through sharing. Give what you don't need, find what you do.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                            <li><Link to="/items" className="hover:text-blue-500 transition-colors">Browse Items</Link></li>
                            <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/safety" className="hover:text-blue-500 transition-colors">Safety Tips</Link></li>
                            <li><Link to="/guidelines" className="hover:text-blue-500 transition-colors">Community Guidelines</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className={`font-semibold mb-4 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" />
                                <span>support@sharebox.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-blue-500" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-500" />
                                <span>123 Sharing Street, NY 10001</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={`mt-12 pt-8 border-t text-center text-sm ${currentTheme === 'dark' ? 'border-gray-800 text-gray-500' : 'border-gray-100 text-gray-400'
                    }`}>
                    <p className="flex items-center justify-center gap-1">
                        © {new Date().getFullYear()} ShareBox. Made with <Heart size={14} className="text-red-500 fill-current" /> for the community.
                    </p>
                </div>
            </div>
        </footer>
    );
}

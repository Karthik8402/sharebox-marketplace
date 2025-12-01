import { useTheme } from '../context/ThemeContext';
import { Lock, Eye, Database, ShieldCheck } from 'lucide-react';

export default function Privacy() {
    const { currentTheme } = useTheme();

    return (
        <div className={`min-h-screen py-12 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        We value your trust and are committed to protecting your personal information.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className={`p-6 rounded-xl text-center ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <Eye className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Transparency</h3>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            We are clear about what data we collect and why.
                        </p>
                    </div>
                    <div className={`p-6 rounded-xl text-center ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <Database className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">Data Security</h3>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Industry-standard encryption to keep your data safe.
                        </p>
                    </div>
                    <div className={`p-6 rounded-xl text-center ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                        <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-4" />
                        <h3 className="font-bold mb-2">User Control</h3>
                        <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            You have full control over your personal information.
                        </p>
                    </div>
                </div>

                <div className={`rounded-2xl shadow-sm overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                            <p className={`leading-relaxed mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                We collect information you provide directly to us, such as when you create an account, list an item, or communicate with other users. This may include:
                            </p>
                            <ul className={`list-disc pl-6 space-y-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li>Name and contact information</li>
                                <li>Profile information and photos</li>
                                <li>Transaction history</li>
                                <li>Communications with other users</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you related information, and to communicate with you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                We do not share your personal information with third parties except as described in this privacy policy. We may share information with other users as part of the transaction process (e.g., sharing your contact info with a seller once a deal is agreed upon).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                If you have any questions about this Privacy Policy, please contact us at privacy@sharebox.com.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

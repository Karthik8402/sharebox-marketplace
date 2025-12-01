import { useTheme } from '../context/ThemeContext';
import { Shield, FileText, AlertCircle } from 'lucide-react';

export default function Terms() {
    const { currentTheme } = useTheme();

    return (
        <div className={`min-h-screen py-12 transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                    <p className={`text-lg ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last updated: November 25, 2025
                    </p>
                </div>

                <div className={`rounded-2xl shadow-sm overflow-hidden ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="p-8 md:p-12 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                1. Acceptance of Terms
                            </h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                By accessing and using ShareBox, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. User Conduct</h2>
                            <p className={`leading-relaxed mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                You agree that you will not use the ShareBox platform to:
                            </p>
                            <ul className={`list-disc pl-6 space-y-2 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, or abusive.</li>
                                <li>Impersonate any person or entity or falsely state your affiliation with a person or entity.</li>
                                <li>Sell or distribute counterfeit or stolen items.</li>
                                <li>Engage in any fraudulent activity.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Privacy Policy</h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Your use of ShareBox is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Item Listings</h2>
                            <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                ShareBox does not claim ownership of the content you provide. However, by posting content, you grant ShareBox a worldwide, royalty-free license to use, reproduce, and display such content in connection with the service.
                            </p>
                        </section>

                        <div className={`p-6 rounded-xl border-l-4 border-blue-500 ${currentTheme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50'
                            }`}>
                            <h3 className="font-bold mb-2 flex items-center gap-2">
                                <AlertCircle size={20} className="text-blue-500" />
                                Disclaimer
                            </h3>
                            <p className={`text-sm ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                ShareBox is a platform for connecting users. We are not responsible for the quality, safety, or legality of items listed, or the truth or accuracy of listings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

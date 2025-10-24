// src/app/privacy-policy/page.tsx
"use client";
import React from 'react';

// Renamed the function component to 'Page' (The required name for the route component in App Router)
const Page: React.FC = () => {
    return (
        <div className="min-h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-6 md:p-12 font-sans">
            <div
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Privacy Policy for VyaparConnect CRM</h1>
                <p className="text-gray-500 dark:text-gray-400">Last Updated: July 26, 2024</p>

                <div className="prose dark:prose-invert prose-lg max-w-none mt-8 space-y-6">
                    <p>
                        Welcome to VyaparConnect CRM ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our CRM application (the "Service").
                    </p>

                    <h2 className="text-2xl font-bold pt-6">1. Information We Collect</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>
                            <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and company name, that you voluntarily give to us when you register for the Service.
                        </li>
                        <li>
                            <strong>WhatsApp Business API Credentials:</strong> To connect your WhatsApp Business account, we securely store necessary access tokens and identifiers provided by Meta. We do not store your Facebook password.
                        </li>
                        <li>
                            <strong>Data Processed on Your Behalf:</strong> As a CRM, our primary function is to process data that you control. This includes your customers' contact information (names, phone numbers), conversation history, and product catalog details that you manage through our Service. You are the controller of this data; we act as a processor on your behalf.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Information our servers automatically collect when you access the Service, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Service.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">2. How We Use Your Information</h2>
                    <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Create and manage your account.</li>
                        <li>Provide, operate, and maintain the Service.</li>
                        <li>Process your transactions and send you related information, including purchase confirmations and invoices.</li>
                        <li>Improve, personalize, and expand our Service.</li>
                        <li>Communicate with you, either directly or through one of our partners, for customer service, to provide you with updates and other information relating to the Service.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">3. Disclosure of Your Information</h2>
                    <p>We do not share, sell, rent, or trade your information, especially your end-customer data, with third parties for their commercial purposes. We may share information we have collected about you in certain situations:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>
                            <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                        </li>
                        <li>
                            <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data storage (cloud hosting), payment processing, and data analysis.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-bold pt-6">4. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">5. Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your own account information at any time by logging into your account settings. For data related to your customers that is processed by our Service, you are the data controller and are responsible for honoring their rights under applicable privacy laws.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">6. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>

                    <h2 className="text-2xl font-bold pt-6">7. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@vyaparconnect.com" className="text-blue-600 hover:underline">privacy@vyaparconnect.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Renamed the default export to 'Page'
export default Page;
import React from 'react';

export const UserBlockedPage: React.FC = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
                <p className="text-gray-700">
                    Your account has been <span className="font-semibold">blocked</span>. 
                    Please contact the administrator for further assistance.
                </p>
                <div className="mt-4">
                    <a
                        href="mailto:admin@example.com"
                        className="inline-block bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700"
                    >
                        Contact Administrator
                    </a>
                </div>
            </div>
        </div>
    );
};

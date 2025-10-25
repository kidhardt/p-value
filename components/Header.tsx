import React from 'react';

const SigmaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18 3.34152C18 3.1082 17.8946 2.88426 17.7121 2.71882C17.5296 2.55337 17.2886 2.4585 17.0353 2.4585H6C5.44772 2.4585 5 2.90621 5 3.4585V5.4585C5 6.01078 5.44772 6.4585 6 6.4585H14.8284L6.41421 13.7188C6.03914 14.0534 5.8516 14.5262 5.92211 15.0003L6.49789 18.5415C6.55938 18.9615 6.85194 19.3178 7.25211 19.4588L10.3017 20.4582C10.7436 20.6124 11.2334 20.4938 11.5858 20.177L18 14.4585V16.4585C18 17.0108 18.4477 17.4585 19 17.4585C19.5523 17.4585 20 17.0108 20 16.4585V4.4585C20 3.84365 19.4687 3.34152 18 3.34152Z" />
    </svg>
);


export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-center">
                <SigmaIcon className="w-8 h-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                    P-Value Misuse Assessor
                </h1>
            </div>
        </header>
    );
};
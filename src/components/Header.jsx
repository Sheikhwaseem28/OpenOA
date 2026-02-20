import React from 'react';
import { Wind, Menu } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="OpenOA Logo" className="h-10 w-auto" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                        OpenOA Dashboard
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;

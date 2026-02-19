import React from 'react';
import { Wind, Menu } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Wind className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                        OpenOA
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <a href="#" className="hover:text-blue-600 transition-colors">Dashboard</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Analysis</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
                    <a href="#" className="hover:text-blue-600 transition-colors">Settings</a>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="hidden md:flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        Get Started
                    </button>
                    <button className="md:hidden p-2 text-slate-600">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

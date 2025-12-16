import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Scan, List } from 'lucide-react';
import { clsx } from 'clsx';

const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-center text-blue-600">Fridge Inventory</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-20">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-safe">
                <Link
                    to="/"
                    className={clsx(
                        "flex flex-col items-center p-2 rounded-lg transition-colors",
                        location.pathname === '/' ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100"
                    )}
                >
                    <List size={24} />
                    <span className="text-xs mt-1">Inventory</span>
                </Link>
                <Link
                    to="/scan"
                    className={clsx(
                        "flex flex-col items-center p-2 rounded-lg transition-colors",
                        location.pathname === '/scan' ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:bg-gray-100"
                    )}
                >
                    <Scan size={24} />
                    <span className="text-xs mt-1">Scan</span>
                </Link>
            </nav>
        </div>
    );
};

export default Layout;

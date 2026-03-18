import type { ReactNode } from 'react';
import { CoreLoadLogo } from '../components/branding/CoreLoadLogo';
import { 
    LayoutDashboard, 
    Calculator, 
    BookOpen, 
    Globe, 
    Menu,
    LogOut,
    ChevronRight,
    FileBarChart,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (o: boolean) => void }) {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Projects', path: '/projects' },
        { icon: Calculator, label: 'New Calculation', path: '/app' },
        { icon: FileBarChart, label: 'Reports', path: '/reports' },
        { icon: Globe, label: 'Sizing Library', path: '/html-sitemap' },
        { icon: BookOpen, label: 'Engineering Blog', path: '/blog' },
    ];

    return (
        <aside className={`sidebar no-print ${isOpen ? 'open' : ''}`}>
            <Link to="/app" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
                <CoreLoadLogo className="h-8" variant="light" showText={false} />
                <span className="text-xl font-bold tracking-tight text-white">CoreLoad</span>
            </Link>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            location.pathname === item.path
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                        onClick={() => setIsOpen(false)}
                    >
                        <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'group-hover:text-white'} />
                        <span className="font-semibold text-sm">{item.label}</span>
                        {location.pathname === item.path && <ChevronRight size={14} className="ml-auto" />}
                    </Link>
                ))}
            </nav>


        </aside>
    );
}

export default function Layout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    
    // The landing page handles its own layout
    if (location.pathname === '/') {
        return <>{children}</>;
    }

    return (
        <div className="dashboard-wrapper font-sans no-print-bg">
            {/* Mobile Sidebar Overlay */}
            <div 
                className={`sidebar-backdrop ${isSidebarOpen ? 'open' : ''} lg:hidden`}
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
            />
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="main-content">
                <header className="header no-print">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 -ml-2 text-slate-600"
                    >
                        <Menu size={24} />
                    </button>
                    
                    <div className="flex-1 px-4">
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 text-slate-400 hover:text-slate-600" title="Exit to Landing Page">
                            <LogOut size={20} />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden p-4 lg:p-8">
                    {children}
                </main>

                <footer className="p-8 border-t border-slate-200 bg-white no-print">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
                        <p>© {new Date().getFullYear()} CoreLoad Software. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="/manual-j-calculator" className="hover:text-brand-blue transition-colors">Manual J</Link>
                            <Link to="/hvac-tonnage-calculator" className="hover:text-brand-blue transition-colors">Tonnage</Link>
                            <Link to="/btu-calculator" className="hover:text-brand-blue transition-colors">BTU</Link>
                            <Link to="/html-sitemap" className="hover:text-brand-blue transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Print Layout */}
            <div className="print-header hidden">
                <h1>CoreLoad — HVAC Load Report</h1>
                <p>Manual J Simplified Block Load Calculation</p>
            </div>
            <div className="print-footer hidden">
                <p>Generated by CoreLoad — coreload.app · For estimation purposes only.</p>
            </div>
        </div>
    );
}

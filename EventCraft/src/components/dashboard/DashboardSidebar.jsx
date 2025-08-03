import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Wrench, Package, Calendar, Home, Menu, X, BookOpen } from 'lucide-react';

const DashboardSidebar = ({
    activeSection,
    setActiveSection,
    isCollapsed,
    setIsCollapsed,
    onNavigateHome
}) => {
    const sidebarItems = [
        { id: 'services', label: 'Services Update', icon: Settings },
        { id: 'customization', label: 'Event Customization', icon: Wrench },
        { id: 'deals', label: 'Deals Update', icon: Package },
        { id: 'availability', label: 'Availability Update', icon: Calendar },
        { id: 'bookings', label: 'Bookings Management', icon: BookOpen }
    ];

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg min-h-screen transition-all duration-300 flex flex-col`}>
            {/* Header Section */}
            <div className="p-4 border-b flex items-center justify-between">
                {!isCollapsed && <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2"
                >
                    {isCollapsed ? <Menu size={20} /> : <X size={20} />}
                </Button>
            </div>

            {/* Back to Home Button */}
            <div className="p-4">
                <Button
                    onClick={onNavigateHome}
                    variant="outline"
                    size="sm"
                    className={`w-full mb-4 flex items-center ${isCollapsed ? 'justify-center px-2' : ''}`}
                >
                    <Home size={20} />
                    {!isCollapsed && <span className="ml-2">Back to Home</span>}
                </Button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-2 flex-1">
                <ul className="space-y-2">
                    {sidebarItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center w-full py-3 rounded-lg transition-colors 
                                        ${activeSection === item.id
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }
                                        ${isCollapsed ? 'justify-center px-2' : 'px-4 gap-3'}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <IconComponent size={20} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default DashboardSidebar;
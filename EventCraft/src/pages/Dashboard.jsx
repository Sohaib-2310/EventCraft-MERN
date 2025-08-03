import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ServicesUpdateSection from '@/components/dashboard/ServicesUpdateSection';
import EventCustomizationSection from '@/components/dashboard/EventCustomizationSection';
import DealsUpdateSection from '@/components/dashboard/DealsUpdateSection';
import AvailabilityUpdateSection from '@/components/dashboard/AvailabilityUpdateSection';
import BookingsManagementSection from '@/components/dashboard/BookingsManagementSection';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('services');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'services':
        return <ServicesUpdateSection />;
      case 'customization':
        return <EventCustomizationSection />;
      case 'deals':
        return <DealsUpdateSection />;
      case 'availability':
        return <AvailabilityUpdateSection />;
      case 'bookings':
        return <BookingsManagementSection />;
      default:
        return <ServicesUpdateSection />;
    }
  };

  // Scroll to top when the active section changes
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [activeSection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="flex w-full">
        {/* Sidebar Navigation */}
        <DashboardSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onNavigateHome={handleNavigateHome}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
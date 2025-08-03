import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Decode JWT to get role
  const getUserRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      return null;
    }
  };

  // Check token on load and when it changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        setUserRole(getUserRoleFromToken(token));
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };

    checkAuth();

    // Listen for login/logout changes from other components
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Packages', action: () => scrollToSection('deals') },
    { label: 'Gallery', action: () => scrollToSection('gallery') },
    { label: 'Availability', action: () => scrollToSection('availability') },
    { label: 'Contact Us', action: () => scrollToSection('contact') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
              Event
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Craft
              </span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </button>
              ))}

              {isAuthenticated ? (
                <>
                  {userRole === 'admin' && (
                    <Link to="/admin-dashboard">
                      <Button variant="outline" size="sm" className="mr-2">
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                  {userRole === 'user' && (
                    <Link to="/dashboard">
                      <Button variant="outline" size="sm" className="mr-2">
                        My Bookings
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-1" /> Profile
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-gray-700 hover:text-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-2">
                {isAuthenticated ? (
                  <>
                    {userRole === 'admin' && (
                      <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    {userRole === 'user' && (
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full mb-2">
                          My Bookings
                        </Button>
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-1" /> Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
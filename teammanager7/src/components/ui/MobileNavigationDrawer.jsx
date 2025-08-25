import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MobileNavigationDrawer = ({ 
  isOpen = false, 
  onClose = () => {},
  user = { name: 'John Doe', role: 'Coach' }
}) => {
  const location = useLocation();

  const navigationItems = [
    { label: 'Dashboard', path: '/team-dashboard', icon: 'LayoutDashboard' },
    { label: 'Players', path: '/player-profiles', icon: 'Users' },
    { label: 'Calendar', path: '/calendar-events', icon: 'Calendar' },
    { label: 'Payments', path: '/payment-management', icon: 'CreditCard' },
    { label: 'Results', path: '/match-results-statistics', icon: 'Trophy' },
  ];

  const isActive = (path) => location?.pathname === path;

  const handleLogout = () => {
    // Logout logic here
    console.log('Logging out...');
    onClose();
  };

  const handleProfileSettings = () => {
    // Profile settings logic here
    console.log('Opening profile settings...');
    onClose();
  };

  const handleNavClick = () => {
    onClose();
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1050 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border z-1100 md:hidden transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link 
              to="/team-dashboard" 
              className="flex items-center gap-2"
              onClick={handleNavClick}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="font-bold text-lg text-foreground">
                TeamManager7
              </span>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={20} color="white" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.role}</div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-smooth ${
                    isActive(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  {item?.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-1">
            <button
              onClick={handleProfileSettings}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-muted rounded-md transition-smooth"
            >
              <Icon name="Settings" size={20} />
              Profile Settings
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 text-sm text-destructive hover:bg-muted rounded-md transition-smooth"
            >
              <Icon name="LogOut" size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavigationDrawer;
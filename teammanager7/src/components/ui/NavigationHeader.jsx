import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationHeader = ({ 
  isDrawerOpen = false, 
  onDrawerToggle = () => {},
  user = { name: 'John Doe', role: 'Coach' }
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);

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
    setIsProfileOpen(false);
  };

  const handleProfileSettings = () => {
    // Profile settings logic here
    console.log('Opening profile settings...');
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border nav-shadow z-1000">
      <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onDrawerToggle}
            className="md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Icon name={isDrawerOpen ? 'X' : 'Menu'} size={20} />
          </Button>

          {/* Logo */}
          <Link to="/team-dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              TeamManager7
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                isActive(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              {item?.label}
            </Link>
          ))}
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <Button
            variant="ghost"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-2 py-1.5"
            aria-label="User menu"
          >
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-foreground">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.role}</div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </Button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md modal-shadow z-1200">
              <div className="p-2">
                <div className="px-2 py-1.5 border-b border-border mb-1">
                  <div className="text-sm font-medium text-popover-foreground">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.role}</div>
                </div>
                
                <button
                  onClick={handleProfileSettings}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-popover-foreground hover:bg-muted rounded-sm transition-smooth"
                >
                  <Icon name="Settings" size={16} />
                  Profile Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-destructive hover:bg-muted rounded-sm transition-smooth"
                >
                  <Icon name="LogOut" size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;
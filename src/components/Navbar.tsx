import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to log out');
      console.error('Logout error:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname !== '/') {
      navigate('/?section=' + sectionId);
    }
  };

  // Check for section parameter when landing on home page
  useEffect(() => {
    if (location.pathname === '/') {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        setTimeout(() => {
          scrollToSection(section);
        }, 100);
      }
    }
  }, [location]);

  const NavLink = ({ to, current, children }: { to: string; current: boolean; children: React.ReactNode }) => (
    <Link
      to={to}
      className={`text-gray-600 hover:text-nextrend-600 transition-colors ${
        current ? 'text-nextrend-600 font-medium' : ''
      }`}
    >
      {children}
    </Link>
  );

  const NavButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="text-gray-600 hover:text-nextrend-600 transition-colors"
    >
      {children}
    </button>
  );

  const MobileNavButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="block px-4 py-2 text-gray-600 hover:text-nextrend-600 transition-colors text-left w-full"
    >
      {children}
    </button>
  );

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-6 py-4 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center"
        >
          <img 
            src="/logo.png" 
            alt="NexTrend.AI Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>Dashboard</NavLink>
              <NavLink to="/profile" current={location.pathname === "/profile"}>Settings</NavLink>
              <button
                onClick={handleLogout}
                className="button-hover px-5 py-2 rounded-lg bg-nextrend-500 text-white font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavButton onClick={() => scrollToSection('features')}>About</NavButton>
              <NavButton onClick={() => scrollToSection('services')}>Services</NavButton>
              <Link 
                to="/login" 
                className="button-hover px-5 py-2 rounded-lg bg-nextrend-500 text-white font-medium"
              >
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-nextrend-600" />
          ) : (
            <Menu className="h-6 w-6 text-nextrend-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg animate-fade-in p-4">
          <div className="flex flex-col space-y-4 p-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:text-nextrend-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:text-nextrend-600 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="button-hover w-full text-center px-5 py-3 rounded-lg bg-nextrend-500 text-white font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavButton 
                  onClick={() => {
                    scrollToSection('features');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  About
                </MobileNavButton>
                <MobileNavButton 
                  onClick={() => {
                    scrollToSection('services');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Services
                </MobileNavButton>
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="button-hover w-full text-center px-5 py-3 rounded-lg bg-nextrend-500 text-white font-medium"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

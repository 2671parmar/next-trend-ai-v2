
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          className="flex items-center space-x-2 text-nextrend-600 transition-all"
        >
          <span className="text-xl font-bold tracking-tight">
            <span>NexTrend</span>
            <span className="text-nextrend-500">.AI</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
          <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>Dashboard</NavLink>
          <Link 
            to="/login" 
            className="button-hover px-5 py-2 rounded-lg bg-nextrend-500 text-white font-medium"
          >
            Log In
          </Link>
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
            <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="button-hover w-full text-center px-5 py-3 rounded-lg bg-nextrend-500 text-white font-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Link component
interface NavLinkProps {
  to: string;
  current: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, current, children }) => (
  <Link 
    to={to} 
    className={`font-medium transition-all hover:text-nextrend-500 ${
      current ? 'text-nextrend-500' : 'text-gray-700'
    }`}
  >
    {children}
  </Link>
);

// Mobile Nav Link component
interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="block py-2 px-4 text-gray-700 hover:bg-gray-50 hover:text-nextrend-500 rounded-md transition-colors"
  >
    {children}
  </Link>
);

export default Navbar;

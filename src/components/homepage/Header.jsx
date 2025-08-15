import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiMenu, FiChevronDown, FiX, FiUser, FiLogOut, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";

// Debounce function to limit how often we update filters
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Header = () => {
  const { user, loading, logout } = useAuth();
  const { updateFilters, products, loading: productsLoading } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const profileRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      updateFilters({ search: query, page: 1 });
      // Show no results message if no products match after search
      if (query && !productsLoading && products.length === 0) {
        setShowNoResults(true);
      } else {
        setShowNoResults(false);
      }
    }, 300),
    [updateFilters, products, productsLoading]
  );

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      updateFilters({ search: "" });
      setSearchFocused(false);
      setShowNoResults(false);
      
      // On mobile, show the products section after search
      if (window.innerWidth < 768) {
        setTimeout(() => {
          const productsSection = document.getElementById("products-section");
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/homepage");
  };

  const renderProfileImage = (size = 8) => {
    if (user?.photo && user.photo !== "no-image.png") {
      return (
        <img 
          src={user.photo} 
          alt={user.firstName} 
          className={`w-${size} h-${size} rounded-full border-2 border-white shadow-sm`}
        />
      );
    }
    return (
      <div className={`w-${size} h-${size} rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold`}>
        {user?.firstName?.[0]?.toUpperCase() || 'U'}
      </div>
    );
  };

  const renderAuthState = () => {
    if (loading) {
      return (
        <div className="hidden md:flex items-center space-x-3">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      );
    }

    return user ? (
      <div className="relative hidden md:block" ref={profileRef}>
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/30 transition-colors"
        >
          {renderProfileImage(8)}
          <span className="text-sm font-semibold text-gray-800">
            {user.firstName?.split(" ")[0] || 'User'}
          </span>
          <FiChevronDown 
            size={16} 
            className={`text-gray-600 transition-transform duration-200 ${
              isProfileOpen ? "transform rotate-180" : ""
            }`} 
          />
        </button>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div 
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200/80"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-xl">
                <div className="flex items-center space-x-3">
                  {renderProfileImage(10)}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.firstName || 'User'}</p>
                    <p className="text-xs text-gray-600 truncate">{user.email || ''}</p>
                  </div>
                </div>
              </div>

              {user.role === "admin" && (
                <NavLink 
                  to="/sk/admin/dashboard" 
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors"
                >
                  <FiUser className="mr-3 text-blue-500" size={16} />Admin Dashboard
                </NavLink>
              )}
              {user.role === "user" && (
                <NavLink 
                  to="/profile" 
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors"
                >
                  <FiUser className="mr-3 text-blue-500" size={16} /> My Profile
                </NavLink>
              )}
              {user.role === "user" && (
                <NavLink 
                  to="/my-ads" 
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors"
                >
                  <FiUser className="mr-3 text-blue-500" size={16} /> My Ads
                </NavLink>
              )}
              <button 
                onClick={handleLogout} 
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50/50 border-t border-gray-100 transition-colors"
              >
                <FiLogOut className="mr-3 text-blue-500" size={16} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ) : (
      <div className="hidden md:flex items-center space-x-3">
        <NavLink 
          to="/auth/login" 
          className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
        >
          Login
        </NavLink>
        <NavLink 
          to="/auth/register" 
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-md"
        >
          Register
        </NavLink>
      </div>
    );
  };

  return (
    <header className={`sticky top-0 z-50 bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-md ${
      isScrolled ? "shadow-sm" : ""
    } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 font-poppins">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to={user?.role === "admin" ? "/sk/admin/dashboard" : "/homepage"} className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-lg group-hover:shadow-md transition-all"
            >
              SK
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-base font-bold text-gray-800 tracking-tight">Swedru Konnect</p>
              <p className="text-xs text-gray-600">Local Marketplace</p>
            </div>
          </NavLink>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-8 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Find products, services..." 
                  value={searchQuery} 
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full px-4 py-2.5 text-sm border border-blue-300 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all" 
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>

            {/* No results message */}
            {showNoResults && searchFocused && (
              <motion.div 
                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-sm text-gray-600">No products found matching your search.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    updateFilters({ search: "" });
                    setShowNoResults(false);
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Side Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Sell Button - Desktop */}
            <motion.button 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-md"
              onClick={() => navigate("/sell")}
            >
              <FiPlus className="mr-1.5" size={16} />
              Sell Now
            </motion.button>

            {renderAuthState()}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-2 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery} 
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                className="w-full px-4 py-2 pl-10 text-sm border text-gray-800 border-blue-300 rounded-lg bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all" 
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            </div>
          </form>

          {/* No results message for mobile */}
          {showNoResults && searchFocused && (
            <motion.div 
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-gray-600">No products found matching your search.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  updateFilters({ search: "" });
                  setShowNoResults(false);
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              ref={menuRef} 
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/80"
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="px-3 py-2">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      {renderProfileImage(12)}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.firstName || 'User'}</p>
                        <p className="text-xs text-gray-600">{user.email || ''}</p>
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <NavLink 
                        to="/sk/admin/dashboard" 
                        className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors mb-1"
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    {user.role === "user" && (
                      <NavLink 
                        to="/profile" 
                        className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors mb-1"
                      >
                        My Profile
                      </NavLink>
                    )}
                    {user.role === "user" && (
                      <NavLink 
                        to="/my-ads" 
                        className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors mb-1"
                      >
                        My Ads
                      </NavLink>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center justify-center mt-2 px-4 py-2.5 text-red-600 hover:bg-red-50/80 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiLogOut className="mr-2" size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink 
                      to="/auth/login" 
                      className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors mb-1"
                    >
                      Login
                    </NavLink>
                    <NavLink 
                      to="/auth/register" 
                      className="block py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 rounded-lg transition-colors mb-1"
                    >
                      Register
                    </NavLink>
                  </>
                )}

                <motion.button 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => { navigate("/sell"); setIsMenuOpen(false); }}
                  className="w-full flex items-center justify-center mt-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  <FiPlus className="mr-2" size={16} /> Sell Now
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

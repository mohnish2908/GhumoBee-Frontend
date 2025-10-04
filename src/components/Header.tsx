import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import a from "../assets/a.png";
import b from "../assets/b.png";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const userState = useSelector((state: RootState) => state.user);
  const { token } = userState || {};

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Opportunities", href: "/opportunities" },
    // { name: "Plans", href: "/plans" },
    // { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={isDark ? b : a}
              alt="Site Logo"
              className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-honey ${
                  location.pathname === item.href
                    ? "text-honey"
                    : "text-charcoal dark:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {token ? (
              <Link
                to="/profile"
                className="px-6 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors"
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-charcoal dark:text-white hover:text-honey transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors"
                >
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Theme Toggle + Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-charcoal dark:text-white" />
              ) : (
                <Menu className="h-6 w-6 text-charcoal dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-700"
            >
              <div className="py-4 space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? "text-honey"
                        : "text-charcoal dark:text-white hover:text-honey"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {token ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 text-base font-medium transition-colors ${
                      location.pathname === "/profile"
                        ? "text-honey"
                        : "text-charcoal dark:text-white hover:text-honey"
                    }`}
                  >
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2 text-base font-medium transition-colors ${
                        location.pathname === "/signup"
                          ? "text-honey"
                          : "text-charcoal dark:text-white hover:text-honey"
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2 text-base font-medium transition-colors ${
                        location.pathname === "/login"
                          ? "text-honey"
                          : "text-charcoal dark:text-white hover:text-honey"
                      }`}
                    >
                      Log In
                    </Link>
                  </>
                )}
                <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/opportunities"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 text-center border border-honey text-honey hover:bg-honey hover:text-charcoal rounded-lg transition-colors"
                    >
                      Find Opportunities
                    </Link>
                    <Link
                      to="/create-opportunity"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-4 py-2 text-center bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors"
                    >
                      List Your Stay
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';
import a from "../assets/a.png";
import b from "../assets/b.png";
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
               <img
              src={b }
              alt="Site Logo"
              className="h-6 sm:h-8 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting travelers with meaningful volunteer opportunities worldwide. 
              Build communities, share cultures, and make a positive impact.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-gray-700 hover:bg-honey hover:text-charcoal rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-700 hover:bg-honey hover:text-charcoal rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-700 hover:bg-honey hover:text-charcoal rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-700 hover:bg-honey hover:text-charcoal rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-honey transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-honey transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="text-gray-300 hover:text-honey transition-colors">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link to="/create-opportunity" className="text-gray-300 hover:text-honey transition-colors">
                  List Your Stay
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-honey transition-colors">
                  Blog & Stories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-honey transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-honey transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-honey transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-honey transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-honey transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-honey transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@ghumobee.com"
                  className="text-gray-300 hover:text-honey transition-colors flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; 2025 GhumoBee. All rights reserved. Made with 🧡 for global community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
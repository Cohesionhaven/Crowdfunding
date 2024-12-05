import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store/store';
import { Wallet, Menu, X, User, Rocket, ChevronDown } from 'lucide-react';
import { useWeb3 } from '../../hooks/useWeb3';
import { Button } from '../ui/Button';
import { useAuth, UserButton } from '@clerk/clerk-react';

export const Header: React.FC = () => {
  const { address, isConnected } = useSelector((state: RootState) => state.wallet);
  const { connectWallet } = useWeb3();
  const { isSignedIn } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const menuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -20 },
  };

  return (
    <motion.header
      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Rocket className="h-8 w-8 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
                CrowdChain
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <motion.div
              className="relative"
              onHoverStart={() => setIsDropdownOpen(true)}
              onHoverEnd={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center text-white hover:text-pink-200 transition-colors">
                Explore <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                  >
                    <div className="py-1">
                      <Link
                        to="/trending"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        Trending Campaigns
                      </Link>
                      <Link
                        to="/categories"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      >
                        Categories
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <Link
              to="/create"
              className="text-white hover:text-pink-200 transition-colors"
            >
              Start a Campaign
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-pink-200 transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </>
            ) : (
              <Link to="/sign-in">
                <Button variant="outline">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleConnectWallet}
                isLoading={isConnecting}
                variant="primary"
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
              >
                <Wallet className="h-5 w-5 mr-2" />
                {isConnected
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Connect Wallet'}
              </Button>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-white hover:text-pink-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden py-4 space-y-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              transition={{ duration: 0.3 }}
            >
              <Link
                to="/trending"
                className="block px-4 py-2 text-white hover:bg-indigo-600 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending Campaigns
              </Link>
              <Link
                to="/categories"
                className="block px-4 py-2 text-white hover:bg-indigo-600 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/create"
                className="block px-4 py-2 text-white hover:bg-indigo-600 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Start a Campaign
              </Link>
              {isSignedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-white hover:bg-indigo-600 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-4">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  className="block px-4 py-2 text-white hover:bg-indigo-600 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <div className="px-4">
                <Button
                  onClick={handleConnectWallet}
                  isLoading={isConnecting}
                  variant="primary"
                  className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  {isConnected
                    ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                    : 'Connect Wallet'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

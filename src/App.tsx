import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Opportunities from './pages/Opportunities';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ViewOpportunity from './pages/ViewOpportunity';
import Apply from './pages/Apply';
import CreateOpportunity from './pages/CreateOpportunity';
import ForgotPasswordPage from './pages/ForgotPassword';
import PlansPage from './pages/Plans';
import CheckoutPage from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import PersonalInfo from './pages/PersonalInfo';
import RoleProfile from './pages/RoleProfile';
import TermAndConditions from './pages/TermAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SafetyGuideline from './pages/SafetyGuideline';

import { ThemeProvider } from './contexts/ThemeContext';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Layout>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path='*' element={<UnauthorizedPage />} />
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/terms-and-conditions" element={<TermAndConditions />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/safety-guidelines" element={<SafetyGuideline />} />
                <Route path="/opportunity/:id" element={<ViewOpportunity />} />
                
                <Route path="/plans" element={<PlansPage />} />

                <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
                  <Route path="/apply/:id" element={<Apply />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['host']} />}>
                  <Route path="/create-opportunity" element={<CreateOpportunity />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['host', 'volunteer']} />}>
                  <Route path="/personal-info" element={<PersonalInfo />} />
                  <Route path="/role-profile" element={<RoleProfile />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['admin', 'host', 'volunteer']} />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected auth routes - redirect to profile if already logged in */}
                <Route element={<AuthRedirect />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                </Route>
                <Route 
                  path="/unauthorized" 
                  element={
                    <div className="min-h-screen pt-16 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-2xl font-bold text-charcoal dark:text-white mb-4">Unauthorized Access</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">You don't have permission to access this page.</p>
                        <button 
                          onClick={() => window.history.back()} 
                          className="px-6 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg"
                        >
                          Go Back
                        </button>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </motion.div>
          </Layout>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#059669',
                },
              },
              error: {
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
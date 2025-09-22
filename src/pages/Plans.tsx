import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { plans } from '../data/plans';
import { RootState } from '../store/store';
import { getSubscriptionStatus } from '../services/operations/volunteerApi';

const PlansPage: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isCheckingMembership, setIsCheckingMembership] = useState<boolean>(false);
    const { isDark } = useTheme();
    const navigate = useNavigate();
    
    // Get user data from Redux store
    const user = useSelector((state: RootState) => state.user);
    const { token, role, email } = user;

    const handleSelectPlan = async (planName: string, planPrice: number) => {
        console.log('Plan selection attempted:', { planName, userRole: role, isLoggedIn: !!token });
        
        // Prevent multiple concurrent checks
        if (isCheckingMembership) {
            toast.error('Please wait, checking membership status...', {
                duration: 2000,
                icon: '⏳',
            });
            return;
        }

        // Step 1: Check if user is logged in
        if (!token || !email) {
            toast.error('Please log in to purchase a plan', {
                duration: 4000,
                icon: '🔐',
            });
            navigate('/login', { 
                state: { 
                    from: '/plans',
                    selectedPlan: planName 
                }
            });
            return;
        }

        // Step 2: Check if user role is volunteer
        if (role !== 'volunteer') {
            if (role === 'Host' || role === 'host') {
                toast.error('Plans are currently available for volunteers only. Host subscription plans coming soon!', {
                    duration: 5000,
                    icon: '🏠',
                });
            } else if (role === 'admin') {
                toast.error('Admin accounts cannot purchase volunteer plans', {
                    duration: 4000,
                    icon: '👑',
                });
            } else {
                toast.error('Please complete your volunteer profile to purchase a plan', {
                    duration: 4000,
                    icon: '📝',
                });
                navigate('/role-profile');
            }
            return;
        }

        // Step 3: Check existing membership status
        setIsCheckingMembership(true);
        const membershipCheckToast = toast.loading('Checking membership status...', {
            icon: '🔍',
        });

        try {
            const subscriptionData = await getSubscriptionStatus();
            
            if (subscriptionData) {
                const { subscriptionStatus, subscriptionPlan, subscriptionEndDate } = subscriptionData;
                
                // Check if user has an active membership
                if (subscriptionStatus === 'active') {
                    const endDateString = subscriptionEndDate 
                        ? new Date(subscriptionEndDate).toLocaleDateString()
                        : 'an unknown date';
                    
                    toast.error(
                        `You already have an active ${subscriptionPlan} membership until ${endDateString}. You cannot purchase another plan while your current membership is active.`,
                        {
                            id: membershipCheckToast,
                            duration: 6000,
                            icon: '⚠️',
                        }
                    );
                    setIsCheckingMembership(false);
                    return;
                }
                
                // Check if user has an expired membership but might want to renew
                if (subscriptionStatus === 'expired') {
                    const endDateString = subscriptionEndDate 
                        ? new Date(subscriptionEndDate).toLocaleDateString()
                        : 'an unknown date';
                    
                    toast.success(
                        `Your previous ${subscriptionPlan} membership expired on ${endDateString}. You can now purchase a new plan!`,
                        {
                            id: membershipCheckToast,
                            duration: 4000,
                            icon: '🔄',
                        }
                    );
                }
            }

            // Step 4: All validations passed - proceed with plan selection
            setSelectedPlan(planName);
            
            toast.success(`${planName} selected! Redirecting to checkout...`, {
                id: membershipCheckToast,
                duration: 3000,
                icon: '🎉',
            });

            // Navigate to checkout page with plan data
            setTimeout(() => {
                navigate('/checkout', { 
                    state: { 
                        plan: { 
                            name: planName, 
                            price: planPrice,
                            duration: plans.find(p => p.name === planName)?.duration,
                            icon: plans.find(p => p.name === planName)?.icon,
                            features: plans.find(p => p.name === planName)?.features,
                            perDay: plans.find(p => p.name === planName)?.perDay
                        }
                    } 
                });
            }, 1500);

        } catch (error) {
            console.error('Error checking membership status:', error);
            toast.error('Failed to check membership status. Please try again.', {
                id: membershipCheckToast,
                duration: 4000,
                icon: '❌',
            });
        } finally {
            setIsCheckingMembership(false);
        }
    };

    return (
        <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50 text-gray-900'
        }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className={`text-3xl font-bold mb-4 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        💰 GhumoBee Pricing Plans
                    </h1>
                    <p className={`text-lg max-w-2xl mx-auto ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Choose the perfect plan to unlock amazing volunteer opportunities and connect with hosts worldwide
                    </p>
                    
                    {/* User Status Indicator */}
                    {token ? (
                        <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm ${
                            role === 'volunteer' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : role === 'Host' || role === 'host'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                            {role === 'volunteer' ? '✅ Volunteer Account - Ready to purchase!' : 
                             role === 'Host' || role === 'host' ? '🏠 Host Account - Plans for volunteers only' :
                             role === 'admin' ? '👑 Admin Account' : 
                             '📝 Complete your profile first'}
                        </div>
                    ) : (
                        <div className="mt-4 inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm">
                            🔐 Please log in to purchase a plan
                        </div>
                    )}
                </motion.div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -3 }}
                            className="h-full"
                        >
                            <div className={`relative h-full flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                                isDark 
                                    ? 'bg-gray-800 border border-gray-700' 
                                    : 'bg-white border border-gray-200'
                            } ${plan.highlight ? 'ring-2 ring-honey scale-105' : ''}`}>
                                
                                {/* Badge */}
                                {plan.badge && (
                                    <div className="absolute top-4 right-4 bg-honey text-white px-2 py-1 rounded-full text-xs font-bold">
                                        {plan.badge}
                                    </div>
                                )}

                                {/* Plan Content */}
                                <div className="flex flex-col h-full p-6">
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <div className="text-3xl mb-2">{plan.icon}</div>
                                        <h3 className={`text-lg font-bold mb-2 ${
                                            isDark ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {plan.name}
                                        </h3>
                                        <div className="mb-1">
                                            <span className={`text-2xl font-bold ${
                                                isDark ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                ₹{plan.price}
                                            </span>
                                        </div>
                                        <p className={`text-xs ${
                                            isDark ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            ≈ ₹{plan.perDay}/day • {plan.duration}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="flex-grow mb-6">
                                        <ul className="space-y-2">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start text-xs">
                                                    <Check className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${
                                                        isDark ? 'text-green-400' : 'text-green-500'
                                                    }`} />
                                                    <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleSelectPlan(plan.name, plan.price)}
                                        disabled={selectedPlan === plan.name || isCheckingMembership}
                                        className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            plan.highlight
                                                ? `bg-honey hover:bg-honey/90 text-white ${
                                                    (selectedPlan === plan.name || isCheckingMembership) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`
                                                : isDark
                                                ? `bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 ${
                                                    (selectedPlan === plan.name || isCheckingMembership) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`
                                                : `bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 ${
                                                    (selectedPlan === plan.name || isCheckingMembership) ? 'opacity-50 cursor-not-allowed' : ''
                                                }`
                                        }`}
                                    >
                                        {selectedPlan === plan.name ? (
                                            <span className="flex items-center justify-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                                                />
                                                Processing...
                                            </span>
                                        ) : isCheckingMembership ? (
                                            <span className="flex items-center justify-center">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Checking membership...
                                            </span>
                                        ) : (
                                            `Select ${plan.name.split(' ')[0]} Plan`
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-8"
                >
                    <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm ${
                        isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        All plans include access to our community and 24/7 support
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PlansPage;

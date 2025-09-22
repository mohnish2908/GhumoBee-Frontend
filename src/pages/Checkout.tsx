import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Check, 
    Tag, 
    CreditCard, 
    Shield, 
    Clock,
    User,
    Mail,
    Phone,
    Sparkles,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { RootState } from '../store/store';
import { applyCoupon } from '../services/operations/couponApi';
import { processPayment } from '../services/operations/paymentApi';
import type { CouponData } from '../services/operations/couponApi';

interface PlanData {
    name: string;
    price: number;
    duration: string;
    icon: string;
    features: string[];
    perDay: number;
}

const CheckoutPage: React.FC = () => {
    const { isDark } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.user);
    
    // Plan data from navigation state
    const planData: PlanData | null = location.state?.plan || null;
    
    // State management
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    
    // Pricing calculations
    const originalPrice = planData?.price || 0;
    const discountAmount = appliedCoupon ? 
        appliedCoupon.discountType === 'percentage' 
            ? Math.min(originalPrice * (appliedCoupon.discountValue / 100), appliedCoupon.maxDiscount || Infinity)
            : appliedCoupon.discountValue // For fixed discounts, use the discountValue directly
        : 0;
    const finalPrice = Math.max(originalPrice - discountAmount, 0);
    
    // Redirect if no plan data
    useEffect(() => {
        if (!planData) {
            toast.error('No plan selected. Please choose a plan first.');
            navigate('/plans');
        }
    }, [planData, navigate]);

    // Verify coupon function
    const verifyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        if (!user.token) {
            toast.error('Please log in to apply coupon');
            return;
        }

        setCouponLoading(true);
        
        try {
            const result = await applyCoupon(couponCode, originalPrice, user.token);
            console.log("result", result);  
            if (result.success && result.couponData) {
                setAppliedCoupon(result.couponData);
            } else {
                // Error toast is already shown by the API service
                console.error('Coupon application failed:', result.error);
            }
        } catch (error: any) {
            console.error('Error verifying coupon:', error);
            toast.error('Failed to verify coupon. Please try again.');
        } finally {
            setCouponLoading(false);
        }
    };

    // Remove coupon
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.success('Coupon removed');
    };

    // Proceed to payment
    const proceedToPayment = async () => {
        if (!user.token) {
            toast.error('Please log in to continue');
            navigate('/login');
            return;
        }

        if (!planData) {
            toast.error('Plan data not found. Please go back and select a plan.');
            navigate('/plans');
            return;
        }

        setIsProcessingPayment(true);
        
        try {
            // Prepare payment data
            const orderData = {
                plan: {
                    name: planData.name,
                    price: finalPrice,
                    duration: planData.duration
                },
                ...(appliedCoupon && {
                    coupon: {
                        code: appliedCoupon.code,
                        discountValue: appliedCoupon.discountValue
                    }
                })
            };

            const userDetails = {
                name: user.name || 'User',
                email: user.email || '',
                phone: '' // Add phone if available in user data
            };

            // Process payment using Razorpay
            await processPayment(orderData, user.token, userDetails);
            
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (!planData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen pt-16 transition-colors duration-300 ${
            isDark 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
                : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50'
        }`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/plans')}
                    className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
                        isDark 
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Plans
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className={`text-3xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                        Complete Your Purchase
                    </h1>
                    <p className={`text-lg ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                        Review your order and proceed to payment
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* User Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`lg:col-span-2 space-y-6`}
                    >
                        {/* User Details Card */}
                        <div className={`p-6 rounded-xl border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } shadow-lg`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                <User className="h-5 w-5" />
                                Account Information
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Mail className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                        {user.email}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                                        {(user as any).phone || 'Not provided'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className={`p-6 rounded-xl border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } shadow-lg`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                <Tag className="h-5 w-5" />
                                Apply Coupon Code
                            </h3>
                            
                            {appliedCoupon ? (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <span className="font-medium text-green-800 dark:text-green-200">
                                                Coupon Applied: {appliedCoupon.code}
                                            </span>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                                        You saved ₹{discountAmount.toFixed(2)}!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                                                isDark 
                                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-honey' 
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-honey'
                                            } focus:outline-none focus:ring-2 focus:ring-honey/20`}
                                            onKeyPress={(e) => e.key === 'Enter' && verifyCoupon()}
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={verifyCoupon}
                                            disabled={couponLoading || !couponCode.trim()}
                                            className="px-6 py-3 bg-honey hover:bg-honey/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {couponLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Check className="h-4 w-4" />
                                            )}
                                            Verify
                                        </motion.button>
                                    </div>
                                    
                                    {/* Sample Coupons */}
                                    <div className="text-xs space-y-1">
                                        <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Try these sample coupons:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {['WELCOME20', 'SAVE100', 'NEWUSER'].map((code) => (
                                                <button
                                                    key={code}
                                                    onClick={() => setCouponCode(code)}
                                                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                                                        isDark 
                                                            ? 'border-gray-600 text-gray-300 hover:border-honey hover:text-honey' 
                                                            : 'border-gray-300 text-gray-600 hover:border-honey hover:text-honey'
                                                    }`}
                                                >
                                                    {code}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Plan Summary */}
                        <div className={`p-6 rounded-xl border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } shadow-lg`}>
                            <h3 className={`text-lg font-semibold mb-4 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                Order Summary
                            </h3>
                            
                            {/* Plan Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-honey/10 border border-honey/20">
                                    <span className="text-2xl">{planData.icon}</span>
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {planData.name}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {planData.duration} • ₹{planData.perDay}/day
                                        </p>
                                    </div>
                                </div>

                                {/* Features Preview */}
                                <div className="space-y-2">
                                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        What's included:
                                    </p>
                                    <ul className="space-y-1">
                                        {planData.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-xs">
                                                <Check className={`h-3 w-3 mt-0.5 text-green-500 flex-shrink-0`} />
                                                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                        {planData.features.length > 3 && (
                                            <li className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                + {planData.features.length - 3} more features
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className={`p-6 rounded-xl border ${
                            isDark 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-200'
                        } shadow-lg`}>
                            <h3 className={`text-lg font-semibold mb-4 ${
                                isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                                Price Details
                            </h3>
                            
                            <div className="space-y-3">
                                <div className={`flex justify-between ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <span>Plan Price</span>
                                    <span>₹{originalPrice.toLocaleString()}</span>
                                </div>
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <hr className={isDark ? 'border-gray-600' : 'border-gray-200'} />
                                
                                <div className={`flex justify-between text-lg font-bold ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <span>Total Amount</span>
                                    <span>₹{finalPrice.toLocaleString()}</span>
                                </div>
                                
                                {discountAmount > 0 && (
                                    <p className="text-sm text-green-600 flex items-center gap-1">
                                        <Sparkles className="h-3 w-3" />
                                        You saved ₹{discountAmount.toFixed(2)}!
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Payment Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={proceedToPayment}
                            disabled={isProcessingPayment}
                            className="w-full py-4 px-6 bg-honey hover:bg-honey/90 text-white rounded-xl font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessingPayment ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="h-5 w-5" />
                                    Proceed to Payment
                                </>
                            )}
                        </motion.button>

                        {/* Security Badge */}
                        <div className={`flex items-center justify-center gap-2 text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            <Shield className="h-4 w-4" />
                            <span>Secure payment powered by Razorpay</span>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <div className={`inline-flex flex-wrap justify-center items-center gap-6 px-8 py-4 rounded-2xl border ${
                        isDark 
                            ? 'bg-gray-800/50 border-gray-700 text-gray-300' 
                            : 'bg-white/50 border-gray-200 text-gray-600'
                    } backdrop-blur-sm`}>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>Instant activation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4" />
                            <span>Money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CheckoutPage;

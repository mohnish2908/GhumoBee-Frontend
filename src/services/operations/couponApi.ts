import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { couponEndpoint } from '../apis';

// Types
export interface CouponData {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    isActive: boolean;
    minimumAmount?: number;
    maxDiscount?: number;
}

export interface CouponValidationResponse {
    success: boolean;
    message: string;
    data?: {
        couponId: string;
        couponCode: string;
        description: string;
        discountValue: number;
        discountAmount: number;
        finalAmount: number;
        savings: number;
    };
}

// Validate coupon during checkout
export const validateCoupon = async (
    couponCode: string, 
    orderAmount: number, 
    token: string
): Promise<CouponValidationResponse> => {
    const toastId = toast.loading('Verifying coupon...');
    
    try {
        const response = await apiConnector(
            "POST", 
            couponEndpoint.VALIDATE_COUPON_API, 
            {
                couponCode: couponCode.toUpperCase().trim(),
                orderAmount: orderAmount
            }, 
            {
                Authorization: `Bearer ${token}`
            }
        );
        
        toast.dismiss(toastId);
        
        if (response.data.success) {
            toast.success(`Coupon applied! You saved ₹${response.data.data.savings}`);
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            };
        } else {
            toast.error(response.data.message || 'Invalid or expired coupon code');
            return {
                success: false,
                message: response.data.message || 'Invalid or expired coupon code'
            };
        }
    } catch (error: any) {
        toast.dismiss(toastId);
        
        // Handle specific error cases
        if (error.response?.status === 404) {
            toast.error('Invalid or expired coupon code');
            return {
                success: false,
                message: 'Invalid or expired coupon code'
            };
        } else if (error.response?.status === 400) {
            const errorMessage = error.response?.data?.message || 'Coupon validation failed';
            toast.error(errorMessage);
            return {
                success: false,
                message: errorMessage
            };
        } else if (error.response?.status === 401) {
            toast.error('Please log in to apply coupon');
            return {
                success: false,
                message: 'Authentication required'
            };
        } else {
            // Fallback to mock coupons for demo purposes when backend is unavailable
            console.log('Backend unavailable, using mock coupons for demo');
            return validateMockCoupon(couponCode, orderAmount);
        }
    }
};

// Fallback mock coupon validation for demo purposes
const validateMockCoupon = (couponCode: string, orderAmount: number): CouponValidationResponse => {
    const mockCoupons: Record<string, CouponData & { minimumAmount: number }> = {
        'WELCOME20': { 
            code: 'WELCOME20', 
            discountType: 'percentage', 
            discountValue: 20, 
            isActive: true, 
            minimumAmount: 500 
        },
        'SAVE100': { 
            code: 'SAVE100', 
            discountType: 'fixed', 
            discountValue: 100, 
            isActive: true, 
            minimumAmount: 300 
        },
        'NEWUSER': { 
            code: 'NEWUSER', 
            discountType: 'percentage', 
            discountValue: 15, 
            isActive: true, 
            minimumAmount: 200,
            maxDiscount: 200 
        }
    };
    
    const coupon = mockCoupons[couponCode.toUpperCase().trim()];
    
    if (!coupon) {
        toast.error('Invalid or expired coupon code');
        return {
            success: false,
            message: 'Invalid or expired coupon code'
        };
    }
    
    if (orderAmount < coupon.minimumAmount) {
        const errorMessage = `Minimum order amount for this coupon is ₹${coupon.minimumAmount}`;
        toast.error(errorMessage);
        return {
            success: false,
            message: errorMessage
        };
    }
    
    // Calculate discount amount
    const discountAmount = coupon.discountType === 'percentage' 
        ? Math.min(orderAmount * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
        : Math.min(coupon.discountValue, orderAmount);
    
    const finalAmount = orderAmount - discountAmount;
    
    toast.success(`Mock coupon applied! You saved ₹${discountAmount.toFixed(2)}`);
    
    return {
        success: true,
        message: 'Coupon is valid',
        data: {
            couponId: 'mock-' + coupon.code,
            couponCode: coupon.code,
            description: `Mock ${coupon.discountType} discount`,
            discountValue: coupon.discountValue,
            discountAmount: discountAmount,
            finalAmount: finalAmount,
            savings: discountAmount
        }
    };
};

// Convert backend coupon response to frontend CouponData format
export const convertToCouponData = (backendData: CouponValidationResponse['data']): CouponData => {
    if (!backendData) {
        throw new Error('Invalid coupon data');
    }
    
    return {
        code: backendData.couponCode,
        discountType: 'fixed', // Backend coupons are typically fixed amounts
        discountValue: backendData.discountAmount, // Use calculated discount amount
        isActive: true
    };
};

// Apply coupon with full error handling
export const applyCoupon = async (
    couponCode: string,
    orderAmount: number,
    token: string
): Promise<{ success: boolean; couponData?: CouponData; error?: string }> => {
    try {
        const result = await validateCoupon(couponCode, orderAmount, token);
        
        if (result.success && result.data) {
            const couponData = convertToCouponData(result.data);
            return { success: true, couponData };
        } else {
            return { success: false, error: result.message };
        }
    } catch (error: any) {
        console.error('Error applying coupon:', error);
        return { 
            success: false, 
            error: error.message || 'Failed to apply coupon' 
        };
    }
};
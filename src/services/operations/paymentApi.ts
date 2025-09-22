import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { paymentEndpoint } from '../apis';
import logo from "../../../src/assets/a.png"
// Types
export interface PaymentOrderData {
    plan: {
        name: string;
        price: number;
        duration: string;
    };
    coupon?: {
        code: string;
        discountValue: number;
    };
}

export interface PaymentOrderResponse {
    success: boolean;
    message: string;
    paymentResponse?: {
        id: string;
        amount: number;
        currency: string;
    };
}

export interface PaymentVerificationData {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

// Capture payment (create order)
export const capturePayment = async (
    orderData: PaymentOrderData,
    token: string
): Promise<PaymentOrderResponse> => {
    const toastId = toast.loading('Creating payment order...');
    
    try {
        const response = await apiConnector(
            "POST",
            paymentEndpoint.CAPTURE_PAYMENT_API,
            orderData,
            {
                Authorization: `Bearer ${token}`
            }
        );
        
        toast.dismiss(toastId);
        
        if (response.data.success) {
            toast.success('Payment order created successfully');
            return {
                success: true,
                message: response.data.message,
                paymentResponse: response.data.paymentResponse
            };
        } else {
            toast.error(response.data.message || 'Failed to create payment order');
            return {
                success: false,
                message: response.data.message || 'Failed to create payment order'
            };
        }
    } catch (error: any) {
        toast.dismiss(toastId);
        
        const errorMessage = error.response?.data?.message || 'Failed to create payment order';
        toast.error(errorMessage);
        
        return {
            success: false,
            message: errorMessage
        };
    }
};

// Verify payment
export const verifyPayment = async (
    verificationData: PaymentVerificationData,
    token: string
): Promise<{ success: boolean; message: string; data?: any }> => {
    const toastId = toast.loading('Verifying payment...');
    
    try {
        const response = await apiConnector(
            "POST",
            paymentEndpoint.VERIFY_PAYMENT_API,
            verificationData,
            {
                Authorization: `Bearer ${token}`
            }
        );
        
        toast.dismiss(toastId);
        
        if (response.data.success) {
            toast.success('Payment verified successfully! Your subscription is now active.');
            return {
                success: true,
                message: response.data.message,
                data: response.data.data
            };
        } else {
            toast.error(response.data.message || 'Payment verification failed');
            return {
                success: false,
                message: response.data.message || 'Payment verification failed'
            };
        }
    } catch (error: any) {
        toast.dismiss(toastId);
        
        const errorMessage = error.response?.data?.message || 'Payment verification failed';
        toast.error(errorMessage);
        
        return {
            success: false,
            message: errorMessage
        };
    }
};

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Complete payment flow
export const processPayment = async (
    orderData: PaymentOrderData,
    token: string,
    userDetails: { name: string; email: string; phone?: string }
) => {
    console.log('Starting payment process with data:', { orderData, userDetails });
    
    try {
        // Step 1: Load Razorpay script
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            throw new Error('Failed to load payment gateway');
        }

        // Step 2: Create payment order
        const orderResponse = await capturePayment(orderData, token);
        if (!orderResponse.success || !orderResponse.paymentResponse) {
            throw new Error(orderResponse.message);
        }

        // Step 3: Open Razorpay checkout
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
        console.log('Razorpay Key:', razorpayKey ? 'Key found' : 'Key missing');
        
        if (!razorpayKey) {
            throw new Error('Payment gateway configuration missing. Please contact support.');
        }

        const options = {
            key: razorpayKey,
            amount: orderResponse.paymentResponse.amount,
            currency: orderResponse.paymentResponse.currency,
            order_id: orderResponse.paymentResponse.id,
            name: "GhumoBee",
            description: `${orderData.plan.name} - ${orderData.plan.duration}`,
            image: logo, // Add your logo
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone || '',
            },
            theme: {
                color: "#F59E0B", // honey color
            },
            handler: async (response: any) => {
                // Step 4: Verify payment
                const verificationResult = await verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                }, token);

                if (verificationResult.success) {
                    // Payment successful - redirect or update UI
                    window.location.href = '/profile?tab=subscription';
                } else {
                    throw new Error(verificationResult.message);
                }
            },
            modal: {
                ondismiss: () => {
                    toast.error('Payment cancelled');
                },
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();

    } catch (error: any) {
        console.error('Payment process error:', error);
        toast.error(error.message || 'Payment failed');
    }
};

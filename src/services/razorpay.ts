// Razorpay Configuration
const RAZORPAY_KEY_ID = 'rzp_test_J9KDxKMLaZnzJk';

// Razorpay types
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    address?: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

// Razorpay Service Class
class RazorpayService {
  private keyId: string;

  constructor(keyId: string = RAZORPAY_KEY_ID) {
    this.keyId = keyId;
  }

  // Initialize Razorpay
  private initializeRazorpay(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve((window as any).Razorpay);
      } else {
        // Wait for Razorpay to load
        const checkRazorpay = () => {
          if (typeof window !== 'undefined' && (window as any).Razorpay) {
            resolve((window as any).Razorpay);
          } else {
            setTimeout(checkRazorpay, 100);
          }
        };
        checkRazorpay();
      }
    });
  }

  // Open Razorpay payment modal with backend order ID
  async openPaymentModalWithOrder(
    orderId: string, 
    amount: number, 
    currency: string = 'INR',
    planName: string,
    userDetails?: { name?: string; email?: string; contact?: string }
  ): Promise<RazorpayResponse> {
    try {
      console.log('Opening Razorpay payment modal with order...');
      console.log('Order ID from backend:', orderId);
      console.log('Amount:', amount);
      console.log('Currency:', currency);

      const Razorpay = await this.initializeRazorpay();

      return new Promise((resolve, reject) => {
        const razorpayOptions: RazorpayOptions = {
          key: this.keyId,
          amount: amount * 100, // Razorpay expects amount in paise
          currency: currency,
          name: 'VendorPro',
          description: `${planName} Subscription`,
          order_id: orderId, // Use the order ID from backend
          prefill: {
            name: userDetails?.name || 'Vendor User',
            email: userDetails?.email || 'vendor@example.com',
            contact: userDetails?.contact || '+919999999999'
          },
          notes: {
            address: 'VendorPro Subscription'
          },
          theme: {
            color: '#2563eb' // Blue color matching the app theme
          },
          handler: (response: RazorpayResponse) => {
            console.log('Payment successful:', response);
            resolve(response);
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed');
              reject(new Error('Payment cancelled by user'));
            }
          }
        };

        console.log('Razorpay options:', razorpayOptions);
        const razorpayInstance = new Razorpay(razorpayOptions);
        razorpayInstance.open();
      });
    } catch (error) {
      console.error('Failed to open Razorpay payment modal:', error);
      throw error;
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    // This would typically be done on the backend
    // For now, we'll return true as a placeholder
    console.log('Verifying payment signature...');
    console.log('Order ID:', orderId);
    console.log('Payment ID:', paymentId);
    console.log('Signature:', signature);
    
    // Note: In production, this should be done on the backend
    // The frontend should not have access to the secret key
    return true;
  }

  // Format amount for display
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
}

// Create and export singleton instance
export const razorpayService = new RazorpayService(); 
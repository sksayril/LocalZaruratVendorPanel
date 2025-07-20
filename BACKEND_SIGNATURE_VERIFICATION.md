# Backend Signature Verification Fix

## Problem
The payment signature verification is failing with "Invalid payment signature" error. This is because the current signature verification logic doesn't match Razorpay's expected format.

## Current Implementation (Incorrect)
```javascript
const verifySubscriptionSignature = (subscriptionId, paymentId, signature) => {
  try {
    const text = `${subscriptionId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  } catch (error) {
    console.error('Error verifying subscription signature:', error);
    return false;
  }
};
```

## Correct Implementation

### Option 1: Use Razorpay's Standard Payment Verification
```javascript
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};
```

### Option 2: Use Razorpay SDK (Recommended)
```javascript
const Razorpay = require('razorpay');

const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const text = `${orderId}|${paymentId}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    return generated_signature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};
```

## Updated API Endpoint

```javascript
// POST /api/vendor/subscription/verify
router.post('/subscription/verify', async (req, res) => {
  try {
    const vendorId = req.user._id;
    const { subscriptionId, paymentId, signature, orderId } = req.body;

    // Validate required fields
    if (!subscriptionId || !paymentId || !signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: subscriptionId, paymentId, signature, orderId'
      });
    }

    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Verify the vendor owns this subscription
    if (subscription.vendor.toString() !== vendorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify payment signature using Razorpay's format
    const isSignatureValid = verifyPaymentSignature(orderId, paymentId, signature);
    
    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update subscription status to active
    subscription.status = 'active';
    subscription.startDate = new Date();
    
    // Calculate end date based on plan duration
    const planDuration = getPlanDuration(subscription.plan); // Helper function
    subscription.endDate = new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000);
    
    // Add payment details to subscription
    subscription.razorpay.paymentId = paymentId;
    
    await subscription.save();

    // Return updated subscription
    res.json({
      success: true,
      message: 'Payment verified and subscription activated successfully',
      data: {
        subscription: {
          _id: subscription._id,
          vendor: subscription.vendor,
          plan: subscription.plan,
          amount: subscription.amount,
          status: subscription.status,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          features: subscription.features,
          razorpay: {
            subscriptionId: subscription.razorpay.subscriptionId,
            orderId: subscription.razorpay.orderId,
            paymentId: subscription.razorpay.paymentId
          }
        }
      }
    });

  } catch (error) {
    console.error('Error verifying subscription payment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## Helper Functions

```javascript
// Get plan duration in days
const getPlanDuration = (plan) => {
  switch (plan) {
    case '3months':
      return 90;
    case '6months':
      return 180;
    case '1year':
      return 365;
    default:
      return 30;
  }
};

// Alternative: Use Razorpay's webhook verification
const verifyWebhookSignature = (payload, signature) => {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
};
```

## Environment Variables Required

```env
RAZORPAY_KEY_ID=rzp_test_BDT2TegS4Ax6Vp
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Testing

### Test Cases
1. **Valid Payment**: Use test payment data from Razorpay
2. **Invalid Signature**: Modify signature to test failure
3. **Missing Fields**: Test with missing required fields
4. **Wrong Subscription**: Test with subscription ID that doesn't belong to user

### Test Data
```javascript
// Valid test data
const testData = {
  subscriptionId: "subscription_id",
  paymentId: "pay_test_payment_id",
  signature: "valid_signature_from_razorpay",
  orderId: "order_test_order_id"
};
```

## Security Considerations

1. **Never expose secret keys** in frontend code
2. **Always verify signatures** on the backend
3. **Validate all input** before processing
4. **Use HTTPS** for all API calls
5. **Log verification attempts** for monitoring

## Monitoring

Add logging to track verification attempts:
```javascript
console.log('Payment verification attempt:', {
  subscriptionId,
  paymentId,
  orderId,
  signatureValid: isSignatureValid,
  timestamp: new Date().toISOString()
});
```

## Frontend Integration

The frontend is now sending the correct parameters:
```javascript
const verificationResponse = await apiService.verifySubscriptionPayment(
  subscriptionId,
  paymentId,
  signature,
  orderId // This is the key addition
);
```

## Next Steps

1. Update the backend signature verification logic
2. Test with Razorpay test payments
3. Monitor verification success rates
4. Implement webhook handling for additional security 
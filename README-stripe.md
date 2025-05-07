# Stripe Integration Documentation

This document provides information on how to use the Stripe integration in the e-commerce API.

## Setup

1. Make sure you have the following environment variables set in your `.env` file:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

2. To get these keys:
   - Create a Stripe account at [stripe.com](https://stripe.com)
   - Navigate to the Developers > API keys section
   - Use the test keys for development and testing
   - For the webhook secret, create a webhook endpoint in the Stripe dashboard and note the signing secret

## Payment Flow

The payment flow for card payments is as follows:

1. User creates an order by sending a POST request to `/api/orders/:userId` with payment method set to 'card'
2. The API creates the order but marks it as unpaid
3. The API response includes a `nextStep` object with an endpoint to create a payment intent
4. The client makes a request to `/api/payments/create-payment-intent/:orderId` to create a payment intent
5. The API returns a client secret that the client uses to complete the payment using Stripe.js
6. After payment is complete, the client sends a confirmation to `/api/payments/confirm/:orderId`
7. The API verifies the payment with Stripe and updates the order status

## API Endpoints

### Create Payment Intent

```
POST /api/payments/create-payment-intent/:orderId
```

**Request:**
- Headers: Authorization token
- No body required

**Response:**
```json
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_..."
}
```

### Confirm Payment

```
POST /api/payments/confirm/:orderId
```

**Request:**
- Headers: Authorization token
- Body:
  ```json
  {
    "paymentIntentId": "pi_..."
  }
  ```

**Response:**
```json
{
  "_id": "order_id",
  "user": "user_id",
  "items": [...],
  "totalPrice": 100,
  "status": "pending",
  "paymentMethod": "card",
  "isPaid": true,
  "paidAt": "2023-05-01T12:00:00.000Z",
  "paymentResult": {
    "id": "pi_...",
    "status": "succeeded",
    "update_time": "2023-05-01T12:00:00.000Z",
    "email_address": "customer@example.com"
  },
  "shippingAddress": {...}
}
```

### Webhook

```
POST /api/payments/webhook
```

This endpoint is used by Stripe to send event notifications. It should be configured in the Stripe dashboard.

## Client-Side Implementation

To implement Stripe on the client side:

1. Install the Stripe.js library:
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

2. Initialize Stripe with your publishable key:
   ```javascript
   const stripe = Stripe('your_publishable_key');
   ```

3. Create a payment method and confirm the payment:
   ```javascript
   const { error, paymentMethod } = await stripe.createPaymentMethod({
     type: 'card',
     card: cardElement,
   });

   if (!error) {
     const { clientSecret } = await fetchPaymentIntent(orderId);
     
     const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
       payment_method: paymentMethod.id,
     });
     
     if (!error) {
       await confirmPaymentWithServer(orderId, paymentIntent.id);
     }
   }
   ```

## Testing

To test the Stripe integration:

1. Use Stripe's test card numbers:
   - 4242 4242 4242 4242 (Visa, successful payment)
   - 4000 0000 0000 0002 (Visa, declined payment)

2. Use any future expiration date, any 3-digit CVC, and any postal code.

3. For testing webhooks locally, use Stripe CLI or a service like ngrok to forward webhook events to your local server.
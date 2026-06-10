import Stripe from 'stripe';

let stripeClient;

const getStripe = () => {
    if (!stripeClient) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not configured.');
        }
        stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return stripeClient;
};

export const getStripeConfig = (req, res) => {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
        return res.status(500).json({
            success: false,
            message: 'Stripe publishable key is not configured.'
        });
    }

    res.status(200).json({ success: true, publishableKey });
};

const toStripeAmount = (amountPkr) => Math.round(Number(amountPkr) * 100);

export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, email } = req.body;

        if (!amount || amount < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment amount.'
            });
        }

        const stripeAmount = toStripeAmount(amount);

        const paymentIntent = await getStripe().paymentIntents.create({
            amount: stripeAmount,
            currency: 'pkr',
            receipt_email: email || undefined,
            automatic_payment_methods: { enabled: true },
            metadata: {
                source: 'skincare-checkout'
            }
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Stripe payment intent error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create payment intent.'
        });
    }
};

export const verifyPaymentIntent = async (paymentIntentId, expectedAmount) => {
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment has not been completed.');
    }

    if (paymentIntent.amount !== toStripeAmount(expectedAmount)) {
        throw new Error('Payment amount does not match order total.');
    }

    let cardDetails;
    if (paymentIntent.payment_method) {
        const paymentMethod = await getStripe().paymentMethods.retrieve(paymentIntent.payment_method);
        if (paymentMethod.card) {
            cardDetails = {
                name: paymentMethod.billing_details?.name || '',
                number: `**** **** **** ${paymentMethod.card.last4}`,
                expiry: `${String(paymentMethod.card.exp_month).padStart(2, '0')}/${String(paymentMethod.card.exp_year).slice(-2)}`
            };
        }
    }

    return { paymentIntent, cardDetails };
};

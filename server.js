const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')('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')
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.static(path.join(__dirname, '..')));
app.use(express.json());

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency || 'thb',
      payment_method_types: ['card', 'promptpay'],
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'success.html'));
  });
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body
  let userId = req.body?.userId;
  if (!userId && req.body) {
    try {
      const parsed = JSON.parse(req.body);
      userId = parsed.userId;
    } catch (e) {}
  }

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  const merchantId = process.env.CRYPTOMUS_MERCHANT_ID;
  const apiKey = process.env.CRYPTOMUS_API_KEY;

  if (!merchantId || !apiKey) {
    console.error('CRYPTOMUS_MERCHANT_ID or CRYPTOMUS_API_KEY is missing on server');
    return res.status(500).json({ error: 'Cryptomus credentials not configured on Vercel' });
  }

  // Determine host for callback and return URLs
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['host'];
  const baseUrl = `${protocol}://${host}`;

  const paymentData = {
    amount: "15.00",
    currency: "EUR",
    order_id: userId,
    url_callback: `${baseUrl}/api/cryptomus-webhook`,
    url_return: `${baseUrl}/dashboard`,
    lifetime: 3600 // 1 hour invoice duration
  };

  try {
    const payload = Buffer.from(JSON.stringify(paymentData)).toString('base64');
    const sign = crypto.createHash('md5').update(payload + apiKey).digest('hex');

    console.log(`Creating Cryptomus payment for user: ${userId}...`);
    const response = await fetch('https://api.cryptomus.com/v1/payment', {
      method: 'POST',
      headers: {
        'merchant': merchantId,
        'sign': sign,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok || result.state !== 0) {
      console.error('Cryptomus API returned error:', result);
      return res.status(400).json({ error: 'Cryptomus API error', details: result });
    }

    const checkoutUrl = result.result?.url;
    if (!checkoutUrl) {
      return res.status(500).json({ error: 'No checkout URL returned from Cryptomus' });
    }

    return res.status(200).json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating Cryptomus payment:', error);
    return res.status(500).json({ error: 'Internal server error creating payment' });
  }
};

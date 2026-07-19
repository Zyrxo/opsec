const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sign, ...dataWithoutSign } = req.body;
  const apiKey = process.env.CRYPTOMUS_API_KEY;

  if (!sign) {
    console.error('Cryptomus webhook request does not contain signature');
    return res.status(400).json({ error: 'Missing sign' });
  }

  // 1. Verify Cryptomus Webhook Signature if API Key is configured
  if (apiKey) {
    // Cryptomus requires slashes to be escaped with backslash before base64 encoding for signature check
    const rawJsonString = JSON.stringify(dataWithoutSign).replace(/\//g, '\\/');
    const payload = Buffer.from(rawJsonString).toString('base64');
    const computedSign = crypto.createHash('md5').update(payload + apiKey).digest('hex');

    if (sign !== computedSign) {
      console.error('Cryptomus webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  const status = dataWithoutSign.status;
  const clerkUserId = dataWithoutSign.order_id; // we passed userId as order_id

  console.log(`Cryptomus webhook event received. Order: ${clerkUserId}, Status: ${status}`);

  // Cryptomus payment successful statuses are 'paid' or 'completed'
  if (status !== 'paid' && status !== 'completed') {
    console.log(`Payment status "${status}" is not completed/paid. Ignoring.`);
    return res.status(200).json({ status: 'ignored_status', current: status });
  }

  if (!clerkUserId) {
    console.error('Cryptomus payload is missing order_id (clerkUserId)');
    return res.status(400).json({ error: 'Missing order_id' });
  }

  // 2. Contact Clerk API to update publicMetadata to premium: true
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    console.error('CLERK_SECRET_KEY is not defined in environment variables');
    return res.status(500).json({ error: 'Clerk Secret Key missing' });
  }

  try {
    const clerkUrl = `https://api.clerk.com/v1/users/${clerkUserId}/metadata`;
    console.log(`Updating Clerk user ${clerkUserId} publicMetadata to premium: true...`);
    
    const response = await fetch(clerkUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_metadata: {
          premium: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Clerk API returned error ${response.status}:`, errorText);
      return res.status(response.status).json({ error: 'Clerk API error', details: errorText });
    }

    console.log(`Clerk user ${clerkUserId} successfully upgraded to premium: true via Cryptomus`);
    return res.status(200).json({ success: true, userId: clerkUserId });

  } catch (err) {
    console.error('Network or timeout exception calling Clerk API:', err);
    return res.status(500).json({ error: 'Internal server error contacting Clerk' });
  }
};

const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { event, data } = req.body;
  
  console.log('Received Sellix webhook event:', event);

  // 1. Verify Sellix Webhook Signature if secret is configured
  const signature = req.headers['x-sellix-signature'];
  const webhookSecret = process.env.SELLIX_WEBHOOK_SECRET;

  if (webhookSecret) {
    if (!signature) {
      console.error('Signature missing in webhook request headers');
      return res.status(401).json({ error: 'Missing X-Sellix-Signature header' });
    }

    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha512', webhookSecret);
    const digest = hmac.update(payload).digest('hex');

    if (signature !== digest) {
      console.error('Signature verification failed. Webhook event discarded.');
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  // 2. Validate event type
  if (event !== 'order:paid') {
    console.log(`Event "${event}" ignored. We only process "order:paid".`);
    return res.status(200).json({ status: 'ignored_event' });
  }

  // 3. Extract Clerk User ID from custom fields
  const customFields = data?.custom_fields || {};
  const clerkUserId = customFields?.clerk_user_id;

  if (!clerkUserId) {
    console.error('Missing clerk_user_id in Sellix custom_fields payload:', customFields);
    return res.status(400).json({ error: 'Missing clerk_user_id custom field' });
  }

  // 4. Update Clerk user metadata
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  if (!clerkSecretKey) {
    console.error('CLERK_SECRET_KEY is not defined in environment variables');
    return res.status(500).json({ error: 'Clerk Secret Key missing on server' });
  }

  try {
    const clerkUrl = `https://api.clerk.com/v1/users/${clerkUserId}/metadata`;
    console.log(`Contacting Clerk API for user: ${clerkUserId}...`);
    
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
      console.error(`Clerk API replied with error status ${response.status}:`, errorText);
      return res.status(response.status).json({ error: 'Clerk API error', details: errorText });
    }

    console.log(`Clerk user ${clerkUserId} metadata successfully updated to premium: true`);
    return res.status(200).json({ success: true, userId: clerkUserId });

  } catch (err) {
    console.error('Exception while contacting Clerk API:', err);
    return res.status(500).json({ error: 'Internal server error contacting Clerk' });
  }
};

// former stripe webhook
// File: /pages/api/webhooks/polar.js
// Next.js Pages Router (JavaScript)
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import getRawBody from 'raw-body';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const rawBody = await getRawBody(req);
    const event = validateEvent(rawBody, req.headers, process.env.POLAR_WEBHOOK_SECRET);

    // Process the event

    res.status(202).send('');
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return res.status(403).send('');
    }
    throw error;
  }
}
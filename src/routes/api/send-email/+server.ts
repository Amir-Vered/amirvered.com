import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { resend } from '$lib/server/resend';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { subject, text, html } = await request.json();

    const { data, error } = await resend.emails.send({
      from: "Amir Vered's Portfolio - Contact Form <contact@amirvered.com>",
      to: 'amirsvered@gmail.com',
      subject,
      text,
      html
    });

    if (error) {
      console.error('Resend error:', error);
      return json({ error }, { status: 500 });
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('Endpoint error:', err);
    return json({ error: 'Invalid request' }, { status: 400 });
  }
};

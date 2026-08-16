const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rwvkryjtdgvowythuvjx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_hCUXYQ5LUK4XA5mL5y6ePQ_IrFvxQN0';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64, contentType, extension } = req.body || {};
    if (!base64 || !contentType) {
      return res.status(400).json({ error: 'Image data and content type are required.' });
    }

    const cleanBase64 = String(base64).replace(/^data:[^;]+;base64,/, '');
    const estimatedBytes = Math.floor(cleanBase64.length * 0.75);
    if (estimatedBytes > 4 * 1024 * 1024) {
      return res.status(413).json({ error: 'Image is too large. Please use an image under 4 MB.' });
    }

    const safeExt = String(extension || contentType.split('/')[1] || 'jpg').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${safeExt}`;
    const filePath = `products/${fileName}`;
    const bytes = Buffer.from(cleanBase64, 'base64');

    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/products/${encodeURIComponent(fileName)}`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': contentType,
        'Cache-Control': '3600',
        'x-upsert': 'false',
      },
      body: bytes,
    });

    const body = await response.text();
    if (!response.ok) {
      console.error('Supabase image upload failed:', response.status, body);
      return res.status(response.status).json({ error: 'Supabase image upload failed.', details: body });
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    return res.status(200).json({ path: filePath, publicUrl });
  } catch (error: any) {
    console.error('Upload proxy error:', error);
    return res.status(502).json({ error: 'Unable to upload image.' });
  }
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rwvkryjtdgvowythuvjx.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_hCUXYQ5LUK4XA5mL5y6ePQ_IrFvxQN0';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const category = typeof req.query?.category === 'string' ? req.query.category : '';
    const params = new URLSearchParams({
      select: '*',
      is_active: 'eq.true',
      order: 'id.desc',
    });
    if (category) params.set('category', `eq.${category}`);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?${params.toString()}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const body = await response.text();
    res.setHeader('Cache-Control', 'no-store');
    res.status(response.status).send(body);
  } catch (error: any) {
    console.error('Supabase proxy error:', error);
    res.status(502).json({ error: 'Unable to reach product database' });
  }
}

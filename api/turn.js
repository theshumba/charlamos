// Vercel serverless function: returns fresh Metered TURN credentials.
// The SECRET KEY lives in the METERED_SECRET_KEY env var (server-side only),
// so it is never exposed in the browser / page source.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.METERED_API_KEY;
  const domain = process.env.METERED_DOMAIN || 'charlamos.metered.live';
  if (!key) { res.status(200).json([]); return; }
  try {
    const r = await fetch(`https://${domain}/api/v1/turn/credentials?apiKey=${key}`);
    const data = await r.json();
    // Metered returns an array of {urls, username, credential}.
    res.status(200).json(Array.isArray(data) ? data : []);
  } catch (e) {
    res.status(200).json([]);
  }
}

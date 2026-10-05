export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { images, context = {} } = req.body || {};
    if (!Array.isArray(images) || !images.length) return res.status(400).json({ error: 'At least one image is required.' });
    if (images.length > 8) return res.status(400).json({ error: 'Maximum 8 images.' });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured on the server.' });

    const content = [{ type: 'input_text', text: `Identify this mineral/crystal specimen from the supplied photographs. Treat identification as an informed visual suggestion, not a definitive laboratory identification. Look for mineral appearance, crystal habit, colour, luster, transparency, matrix, inclusions and visible diagnostic features. If uncertain, give alternatives. Return ONLY valid JSON matching this schema: {"likely_name":"","mineral":"","specimen_type":"","confidence":0,"colour":"","crystal_habit":"","visible_features":[],"locality_clues":[],"alternatives":[{"name":"","reason":""}],"notes":""}. Confidence must be an integer 0-100. Existing user context: ${JSON.stringify(context)}` }];
    for (const image of images) {
      if (typeof image !== 'string' || !image.startsWith('data:image/')) continue;
      content.push({ type: 'input_image', image_url: image, detail: 'low' });
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-6-luna',
        input: [{ role: 'user', content }],
        text: { format: { type: 'json_object' } }
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || 'OpenAI request failed.' });
    const raw = data.output_text || '';
    let result;
    try { result = JSON.parse(raw); } catch { return res.status(502).json({ error: 'AI returned invalid JSON.' }); }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Unexpected server error.' });
  }
}

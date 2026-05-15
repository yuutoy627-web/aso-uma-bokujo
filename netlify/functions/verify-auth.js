exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers };

  let body;
  try { body = JSON.parse(event.body); } catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return { statusCode: 500, headers, body: JSON.stringify({ error: 'ADMIN_PASSWORD not set' }) };

  if (!body.password || body.password !== adminPw) {
    await new Promise(r => setTimeout(r, 500));
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'パスワードが正しくありません' }) };
  }

  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};

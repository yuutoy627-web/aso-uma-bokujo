const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { password, type, data } = body;

  // ── パスワード検証 ────────────────────────────────────────────────────────
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'サーバー設定エラー: ADMIN_PASSWORD が設定されていません' }) };
  }
  if (!password || password !== adminPassword) {
    // ブルートフォース対策: 意図的に少し遅延
    await new Promise(r => setTimeout(r, 500));
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'パスワードが正しくありません' }) };
  }

  // ── データ検証 ────────────────────────────────────────────────────────────
  if (!['horses', 'plans'].includes(type)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '不正なデータ種別です' }) };
  }
  if (!Array.isArray(data)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'data は配列である必要があります' }) };
  }
  if (data.length > 50) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'データ件数が多すぎます（最大50件）' }) };
  }

  // ── 保存 ──────────────────────────────────────────────────────────────────
  try {
    const store = getStore({ name: 'aso-uma-content', consistency: 'strong' });
    await store.set(type, JSON.stringify(data));
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true, type, count: data.length }) };
  } catch (e) {
    console.error('Blob save error:', e);
    return { statusCode: 500, headers, body: JSON.stringify({ error: '保存に失敗しました。しばらくしてから再試行してください。' }) };
  }
};

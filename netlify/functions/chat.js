/**
 * 阿蘇うま牧場 AIチャット — Netlify Functions プロキシ
 * ブラウザから直接Anthropic APIを叩かず、このサーバーレス関数が中継することで
 * APIキーをクライアント側に露出させないセキュアな構成にしています。
 */
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // プリフライトリクエスト（CORS）への対応
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // APIキーが設定されているか確認
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY が環境変数に設定されていません');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'サーバーの設定が完了していません。管理者にお問い合わせください。' }),
    };
  }

  try {
    const { messages, system } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // コスト効率の高いHaikuモデルを使用
        max_tokens: 400,
        system: system || '',
        messages,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', response.status, errData);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'AIサービスとの通信に失敗しました。' }),
      };
    }

    const data = await response.json();
    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'サーバーエラーが発生しました。' }),
    };
  }
};

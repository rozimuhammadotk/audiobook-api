const { kv } = require('@vercel/kv');
const crypto = require('crypto');

module.exports = async (req, res) => {
  const { source, id } = req.query;
  if (!source || !id) return res.json({ ok: false, error: 'missing params' });

  // Короткий читаемый код: A3F9K2
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  const expire = Math.floor(Date.now() / 1000) + 86400; // 24 часа

  await kv.set(`book:${code}`, { source, id, expire }, { ex: 86400 });

  res.json({ ok: true, code, expire });
};

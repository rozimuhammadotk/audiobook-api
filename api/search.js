const axios = require('axios');
const cheerio = require('cheerio');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const TIMEOUT = 8000;

// ─── 🇷🇺 РУССКИЕ ───────────────────────────────────────
async function searchKnigavuhe(q) {
  try {
    const res = await axios.get(`https://knigavuhe.org/search/?q=${encodeURIComponent(q)}`, {
      headers: { 
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }, 
      timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];

    // Пробуем все возможные селекторы
    const items = $('.b-book__title, .book__title, [class*="book"] a, .title a').slice(0, 4);
    items.each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href') || $(el).closest('a').attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id && id.length > 2) {
        results.push({ source: 'kv', id, title, author: '—', lang: 'ru' });
      }
    });

    // Если всё равно пусто — берём все ссылки с /book/ в URL
    if (results.length === 0) {
      $('a[href*="/book/"]').slice(0, 4).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href') || '';
        const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
        if (title && id && title.length > 3) {
          results.push({ source: 'kv', id, title, author: '—', lang: 'ru' });
        }
      });
    }

    return results;
  } catch(e) { return []; }
}

async function searchAkniga(q) {
  try {
    const res = await axios.get(`https://akniga.org/search/books/?q=${encodeURIComponent(q)}`, {
      headers: { 
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }, 
      timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];

    $('.item--book').slice(0, 4).each((i, el) => {
      const title = $(el).find('.caption__title, h2, h3').first().text().trim();
      const author = $(el).find('.caption__article-author, .author').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'ak', id, title, author: author || '—', lang: 'ru' });
    });

    // Запасной вариант
    if (results.length === 0) {
      $('a[href*="/book/"]').slice(0, 4).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href') || '';
        const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
        if (title && id && title.length > 3) {
          results.push({ source: 'ak', id, title, author: '—', lang: 'ru' });
        }
      });
    }

    return results;
  } catch(e) { return []; }
}

async function searchAudioboo(q) {
  try {
    const res = await axios.get(`https://audioboo.ru/?s=${encodeURIComponent(q)}`, {
      headers: { 
        'User-Agent': UA,
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }, 
      timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];

    $('article, .post, .book-item').slice(0, 4).each((i, el) => {
      const title = $(el).find('h2 a, h3 a, .entry-title a').first().text().trim();
      const link = $(el).find('h2 a, h3 a, .entry-title a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'ab', id, title, author: '—', lang: 'ru' });
    });

    return results;
  } catch(e) { return []; }
}

async function searchSoundbook(q) {
  try {
    const res = await axios.get(`https://soundbook.ru/?s=${encodeURIComponent(q)}`, {
      headers: { 
        'User-Agent': UA,
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }, 
      timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];

    $('article, .post').slice(0, 4).each((i, el) => {
      const title = $(el).find('h2 a, h3 a, .entry-title a').first().text().trim();
      const link = $(el).find('h2 a, h3 a, .entry-title a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'sb', id, title, author: '—', lang: 'ru' });
    });

    return results;
  } catch(e) { return []; }
}

async function searchAudioknigiClub(q) {
  try {
    const res = await axios.get(`https://audioknigi.club/search/books/?q=${encodeURIComponent(q)}`, {
      headers: { 
        'User-Agent': UA,
        'Accept-Language': 'ru-RU,ru;q=0.9'
      }, 
      timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];

    $('.item--book').slice(0, 4).each((i, el) => {
      const title = $(el).find('.caption__title, h2, h3').first().text().trim();
      const author = $(el).find('.caption__article-author, .author').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'ac', id, title, author: author || '—', lang: 'ru' });
    });

    if (results.length === 0) {
      $('a[href*="/book/"]').slice(0, 4).each((i, el) => {
        const title = $(el).text().trim();
        const link = $(el).attr('href') || '';
        const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
        if (title && id && title.length > 3) {
          results.push({ source: 'ac', id, title, author: '—', lang: 'ru' });
        }
      });
    }

    return results;
  } catch(e) { return []; }
}

// ─── 🇬🇧 АНГЛИЙСКИЕ ────────────────────────────────────

async function searchLibrivox(q) {
  try {
    const res = await axios.get(
      `https://librivox.org/api/feed/audiobooks/?title=${encodeURIComponent(q)}&format=json&limit=4`,
      { timeout: TIMEOUT }
    );
    const books = res.data?.books || [];
    return books.map(b => ({
      source: 'lv',
      id: String(b.id),
      title: b.title,
      author: `${b.authors?.[0]?.first_name || ''} ${b.authors?.[0]?.last_name || ''}`.trim() || '—',
      lang: 'en'
    }));
  } catch { return []; }
}

async function searchArchive(q) {
  try {
    const res = await axios.get(
      `https://archive.org/advancedsearch.php?q=${encodeURIComponent(q)}+AND+mediatype:audio+AND+subject:audiobook&fl=identifier,title,creator&rows=4&output=json`,
      { timeout: TIMEOUT }
    );
    const docs = res.data?.response?.docs || [];
    return docs.map(d => ({
      source: 'ia',
      id: d.identifier,
      title: d.title || d.identifier,
      author: Array.isArray(d.creator) ? d.creator[0] : (d.creator || '—'),
      lang: 'en'
    }));
  } catch { return []; }
}

async function searchLoyalbooks(q) {
  try {
    const res = await axios.get(`https://www.loyalbooks.com/search?q=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': UA }, timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];
    $('li.book, .book-result, .result-item').slice(0, 4).each((i, el) => {
      const title = $(el).find('a, h2, h3').first().text().trim();
      const author = $(el).find('.author').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'lb', id, title, author: author || '—', lang: 'en' });
    });
    return results;
  } catch { return []; }
}

async function searchThoughtaudio(q) {
  try {
    const res = await axios.get(`https://thoughtaudio.com/?s=${encodeURIComponent(q)}`, {
      headers: { 'User-Agent': UA }, timeout: TIMEOUT
    });
    const $ = cheerio.load(res.data);
    const results = [];
    $('.post, article').slice(0, 4).each((i, el) => {
      const title = $(el).find('h2, h3, .entry-title').first().text().trim();
      const author = $(el).find('.author, .by-author').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'ta', id, title, author: author || '—', lang: 'en' });
    });
    return results;
  } catch { return []; }
}

async function searchOpenculture(q) {
  try {
    const res = await axios.get(
      `https://www.openculture.com/?s=${encodeURIComponent(q)}+audiobook`,
      { headers: { 'User-Agent': UA }, timeout: TIMEOUT }
    );
    const $ = cheerio.load(res.data);
    const results = [];
    $('.post, article').slice(0, 4).each((i, el) => {
      const title = $(el).find('h2, h3, .entry-title').first().text().trim();
      const link = $(el).find('a').first().attr('href') || '';
      const id = link.replace(/\/$/, '').split('/').filter(Boolean).pop();
      if (title && id) results.push({ source: 'oc', id, title, author: '—', lang: 'en' });
    });
    return results;
  } catch { return []; }
}

// ─── MAIN ───────────────────────────────────────────────

module.exports = async (req, res) => {
  const { q, lang } = req.query;
  if (!q) return res.json({ ok: false, error: 'no query' });

  // Все 10 параллельно
  const [kv, ak, ab, sb, ac, lv, ia, lb, ta, oc] = await Promise.all([
    searchKnigavuhe(q),
    searchAkniga(q),
    searchAudioboo(q),
    searchSoundbook(q),
    searchAudioknigiClub(q),
    searchLibrivox(q),
    searchArchive(q),
    searchLoyalbooks(q),
    searchThoughtaudio(q),
    searchOpenculture(q)
  ]);

  let results = [...kv, ...ak, ...ab, ...sb, ...ac, ...lv, ...ia, ...lb, ...ta, ...oc];

  // Фильтр по языку
  if (lang === 'ru') results = results.filter(r => r.lang === 'ru');
  if (lang === 'en') results = results.filter(r => r.lang === 'en');

  // Убираем дубликаты по title
  const seen = new Set();
  results = results.filter(r => {
    const key = r.title.toLowerCase().slice(0, 20);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  res.json({ ok: true, count: results.length, results: results.slice(0, 15) });
};

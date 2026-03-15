function stripTags(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchOne(regex, source) {
  const match = source.match(regex);
  return match?.[1]?.trim() || "";
}

function extractBySelectorLike(html, selector, limit) {
  if (!selector) {
    return [];
  }

  const simpleSelector = selector
    .split(",")
    .map((s) => s.trim())
    .find((s) => /^[a-zA-Z0-9\-_.#]+$/.test(s));

  if (!simpleSelector) {
    return [];
  }

  const tagOnly = simpleSelector.match(/^[a-zA-Z][a-zA-Z0-9-]*$/);
  const classOnly = simpleSelector.match(/^\.([a-zA-Z0-9_-]+)$/);
  const idOnly = simpleSelector.match(/^#([a-zA-Z0-9_-]+)$/);

  let pattern;
  if (tagOnly) {
    pattern = new RegExp(`<${tagOnly[0]}[^>]*>([\\s\\S]*?)<\\/${tagOnly[0]}>`, "gi");
  } else if (classOnly) {
    pattern = new RegExp(`<([a-zA-Z0-9-]+)[^>]*class=["'][^"']*\\b${classOnly[1]}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "gi");
  } else if (idOnly) {
    pattern = new RegExp(`<([a-zA-Z0-9-]+)[^>]*id=["']${idOnly[1]}["'][^>]*>([\\s\\S]*?)<\\/\\1>`, "gi");
  }

  if (!pattern) {
    return [];
  }

  const items = [];
  let match;
  while ((match = pattern.exec(html)) && items.length < limit) {
    const text = stripTags(match[2] || match[1] || "");
    if (text) {
      items.push(text.slice(0, 200));
    }
  }

  return items;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { url, selector, limit = 10, label = "sf6" } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "url は必須です。" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SF6Tool/1.0; +https://vercel.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: `取得に失敗しました: ${response.status}` });
    }

    const html = await response.text();
    const title = matchOne(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
    const description = matchOne(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i, html);
    const ogTitle = matchOne(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i, html);

    const extracted = extractBySelectorLike(html, selector, Math.max(1, Math.min(Number(limit) || 10, 30)));

    return res.status(200).json({
      label,
      fetchedAt: new Date().toISOString(),
      summary: {
        url,
        title,
        ogTitle,
        description,
      },
      extracted,
      previewText: stripTags(html).slice(0, 500),
    });
  } catch (error) {
    return res.status(500).json({ error: `サーバーエラー: ${error.message}` });
  }
}

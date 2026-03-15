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

async function fetchHtmlWithFallback(url) {
  const directHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
    Referer: "https://www.streetfighter.com/",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };

  try {
    const response = await fetch(url, {
      headers: directHeaders,
      redirect: "follow",
    });

    if (response.ok) {
      return {
        ok: true,
        html: await response.text(),
        source: "direct",
      };
    }

    return {
      ok: false,
      status: response.status,
      reason: `direct fetch failed with ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      reason: `direct fetch error: ${error.message}`,
    };
  }
}

async function fetchViaJinaAi(url) {
  const fallbackUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//i, "")}`;
  const response = await fetch(fallbackUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SF6Tool/1.1)",
      Accept: "text/plain,text/html;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`fallback fetch failed with ${response.status}`);
  }

  return {
    html: await response.text(),
    source: "jina-ai-fallback",
  };
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
    const firstAttempt = await fetchHtmlWithFallback(url);

    let html = "";
    let source = "direct";
    let fetchErrorDetail = "";

    if (firstAttempt.ok) {
      html = firstAttempt.html;
      source = firstAttempt.source;
    } else {
      fetchErrorDetail = firstAttempt.reason || "direct fetch failed";
      const fallback = await fetchViaJinaAi(url);
      html = fallback.html;
      source = fallback.source;
    }

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
        source,
        fallbackReason: fetchErrorDetail || undefined,
      },
      extracted,
      previewText: stripTags(html).slice(0, 500),
    });
  } catch (error) {
    return res.status(500).json({ error: `サーバーエラー: ${error.message}` });
  }
}

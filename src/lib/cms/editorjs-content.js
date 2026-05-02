const EDITORJS_VERSION = "2.31.6";

function toObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value;
}

function isBlock(value) {
  return Boolean(value && typeof value === "object" && typeof value.type === "string");
}

function normalizeBlocks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isBlock)
    .map((block) => ({
      ...block,
      data: toObject(block.data),
    }));
}

export function normalizeEditorJsData(value) {
  const source = toObject(value);

  return {
    time: Number(source.time) || Date.now(),
    version: String(source.version || EDITORJS_VERSION),
    blocks: normalizeBlocks(source.blocks),
  };
}

export function parseEditorJsContent(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if (Array.isArray(value.blocks)) {
      return normalizeEditorJsData(value);
    }
    return null;
  }

  const input = String(value).trim();
  if (!input) {
    return null;
  }

  if (!input.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(input);
    if (!parsed || !Array.isArray(parsed.blocks)) {
      return null;
    }
    return normalizeEditorJsData(parsed);
  } catch {
    return null;
  }
}

function sanitizeInlineHtml(value) {
  const source = String(value || "");

  return source
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+(href|src)\s*=\s*(['"])\s*javascript:[^'"]*\2/gi, " $1=\"#\"");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeListItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          content: item,
          meta: {},
          items: [],
        };
      }

      const row = toObject(item);
      return {
        content: String(row.content || ""),
        meta: toObject(row.meta),
        items: normalizeListItems(row.items),
      };
    })
    .filter((item) => item.content.trim() || item.items.length > 0);
}

function toCssCounterType(value) {
  const allowed = new Set(["decimal", "lower-roman", "upper-roman", "lower-alpha", "upper-alpha"]);
  if (allowed.has(value)) {
    return value;
  }

  if (value === "numeric") {
    return "decimal";
  }

  return "decimal";
}

function renderListItems(items, style) {
  if (!items.length) {
    return "";
  }

  return items
    .map((item) => {
      const label = sanitizeInlineHtml(item.content || "");
      const checked = style === "checklist" ? (item.meta?.checked ? " checked" : "") : "";
      const mark = style === "checklist" ? `<input type="checkbox"${checked} disabled />` : "";
      const children = renderListBlock(style, item.items, item.meta);

      return `<li>${mark}${label}${children}</li>`;
    })
    .join("");
}

function renderListBlock(style, items, meta = {}) {
  const normalizedItems = normalizeListItems(items);
  if (!normalizedItems.length) {
    return "";
  }

  if (style === "ordered") {
    const start = Number(meta.start) > 1 ? ` start="${Number(meta.start)}"` : "";
    const type = toCssCounterType(String(meta.counterType || "numeric"));
    const listStyle = type !== "decimal" ? ` style="list-style-type:${type}"` : "";
    return `<ol${start}${listStyle}>${renderListItems(normalizedItems, style)}</ol>`;
  }

  return `<ul>${renderListItems(normalizedItems, style)}</ul>`;
}

function toHeaderLevel(value) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return 2;
  }

  return Math.min(6, Math.max(1, parsed));
}

function renderBlock(block) {
  const data = toObject(block.data);

  switch (block.type) {
    case "paragraph": {
      const html = sanitizeInlineHtml(data.text || "");
      return html.trim() ? `<p>${html}</p>` : "";
    }
    case "header": {
      const level = toHeaderLevel(data.level);
      const html = sanitizeInlineHtml(data.text || "");
      return html.trim() ? `<h${level}>${html}</h${level}>` : "";
    }
    case "list": {
      const style = String(data.style || "unordered");
      return renderListBlock(style, data.items, toObject(data.meta));
    }
    case "quote": {
      const quoteHtml = sanitizeInlineHtml(data.text || "");
      const captionText = String(data.caption || "").trim();
      const captionHtml = captionText ? `<cite>${escapeHtml(captionText)}</cite>` : "";
      const align = data.alignment === "center" ? " style=\"text-align:center\"" : "";

      if (!quoteHtml.trim() && !captionText) {
        return "";
      }

      return `<blockquote${align}>${quoteHtml}${captionHtml}</blockquote>`;
    }
    case "code": {
      const code = String(data.code || "");
      return code.trim() ? `<pre><code>${escapeHtml(code)}</code></pre>` : "";
    }
    case "delimiter":
      return "<hr />";
    default: {
      const fallbackText = String(data.text || "").trim();
      return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : "";
    }
  }
}

export function renderEditorJsToHtml(data) {
  const normalized = normalizeEditorJsData(data);
  return normalized.blocks.map(renderBlock).filter(Boolean).join("\n");
}

export interface MetaTagOptions {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  siteName?: string;
  type?: "website" | "article";
}

export interface OgpPreview {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  type: string;
}

export function generateMetaTags(options: MetaTagOptions): string {
  const {
    title,
    description,
    url = "",
    imageUrl = "",
    siteName = "",
    type = "website",
  } = options;

  const tags: string[] = [];

  tags.push(`<meta charset="utf-8" />`);
  tags.push(`<title>${escapeHtml(title)}</title>`);
  tags.push(
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  // Open Graph
  tags.push(`<meta property="og:title" content="${escapeHtml(title)}" />`);
  tags.push(
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );
  tags.push(`<meta property="og:type" content="${escapeHtml(type)}" />`);
  if (url) {
    tags.push(`<meta property="og:url" content="${escapeHtml(url)}" />`);
  }
  if (imageUrl) {
    tags.push(`<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
  }
  if (siteName) {
    tags.push(
      `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`
    );
  }

  // Twitter Card
  tags.push(
    `<meta name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}" />`
  );
  tags.push(`<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  tags.push(
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  );
  if (imageUrl) {
    tags.push(
      `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`
    );
  }

  return tags.join("\n");
}

export function generateOgpPreview(options: MetaTagOptions): OgpPreview {
  return {
    title: options.title || "Untitled",
    description: options.description || "",
    url: options.url || "https://example.com",
    imageUrl: options.imageUrl || "",
    siteName: options.siteName || "",
    type: options.type || "website",
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

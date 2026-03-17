export interface MimeEntry {
  extension: string;
  mimeType: string;
  category: string;
}

export const MIME_TYPES: MimeEntry[] = [
  // Text
  { extension: ".html", mimeType: "text/html", category: "Text" },
  { extension: ".htm", mimeType: "text/html", category: "Text" },
  { extension: ".css", mimeType: "text/css", category: "Text" },
  { extension: ".csv", mimeType: "text/csv", category: "Text" },
  { extension: ".txt", mimeType: "text/plain", category: "Text" },
  { extension: ".xml", mimeType: "text/xml", category: "Text" },
  { extension: ".rtf", mimeType: "text/rtf", category: "Text" },
  { extension: ".md", mimeType: "text/markdown", category: "Text" },
  { extension: ".calendar", mimeType: "text/calendar", category: "Text" },
  // Application
  { extension: ".js", mimeType: "application/javascript", category: "Application" },
  { extension: ".mjs", mimeType: "application/javascript", category: "Application" },
  { extension: ".json", mimeType: "application/json", category: "Application" },
  { extension: ".jsonld", mimeType: "application/ld+json", category: "Application" },
  { extension: ".pdf", mimeType: "application/pdf", category: "Application" },
  { extension: ".zip", mimeType: "application/zip", category: "Application" },
  { extension: ".gz", mimeType: "application/gzip", category: "Application" },
  { extension: ".tar", mimeType: "application/x-tar", category: "Application" },
  { extension: ".7z", mimeType: "application/x-7z-compressed", category: "Application" },
  { extension: ".rar", mimeType: "application/vnd.rar", category: "Application" },
  { extension: ".bz", mimeType: "application/x-bzip", category: "Application" },
  { extension: ".bz2", mimeType: "application/x-bzip2", category: "Application" },
  { extension: ".doc", mimeType: "application/msword", category: "Application" },
  { extension: ".docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "Application" },
  { extension: ".xls", mimeType: "application/vnd.ms-excel", category: "Application" },
  { extension: ".xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "Application" },
  { extension: ".ppt", mimeType: "application/vnd.ms-powerpoint", category: "Application" },
  { extension: ".pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "Application" },
  { extension: ".odt", mimeType: "application/vnd.oasis.opendocument.text", category: "Application" },
  { extension: ".ods", mimeType: "application/vnd.oasis.opendocument.spreadsheet", category: "Application" },
  { extension: ".odp", mimeType: "application/vnd.oasis.opendocument.presentation", category: "Application" },
  { extension: ".wasm", mimeType: "application/wasm", category: "Application" },
  { extension: ".php", mimeType: "application/x-httpd-php", category: "Application" },
  { extension: ".sh", mimeType: "application/x-sh", category: "Application" },
  { extension: ".jar", mimeType: "application/java-archive", category: "Application" },
  { extension: ".swf", mimeType: "application/x-shockwave-flash", category: "Application" },
  { extension: ".ogx", mimeType: "application/ogg", category: "Application" },
  { extension: ".epub", mimeType: "application/epub+zip", category: "Application" },
  { extension: ".bin", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".exe", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".dll", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".iso", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".dmg", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".deb", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".rpm", mimeType: "application/octet-stream", category: "Application" },
  { extension: ".xhtml", mimeType: "application/xhtml+xml", category: "Application" },
  { extension: ".atom", mimeType: "application/atom+xml", category: "Application" },
  { extension: ".rss", mimeType: "application/rss+xml", category: "Application" },
  { extension: ".yaml", mimeType: "application/x-yaml", category: "Application" },
  { extension: ".yml", mimeType: "application/x-yaml", category: "Application" },
  { extension: ".sql", mimeType: "application/sql", category: "Application" },
  { extension: ".graphql", mimeType: "application/graphql", category: "Application" },
  { extension: ".woff", mimeType: "application/font-woff", category: "Application" },
  { extension: ".woff2", mimeType: "font/woff2", category: "Font" },
  // Image
  { extension: ".png", mimeType: "image/png", category: "Image" },
  { extension: ".jpg", mimeType: "image/jpeg", category: "Image" },
  { extension: ".jpeg", mimeType: "image/jpeg", category: "Image" },
  { extension: ".gif", mimeType: "image/gif", category: "Image" },
  { extension: ".bmp", mimeType: "image/bmp", category: "Image" },
  { extension: ".webp", mimeType: "image/webp", category: "Image" },
  { extension: ".svg", mimeType: "image/svg+xml", category: "Image" },
  { extension: ".ico", mimeType: "image/vnd.microsoft.icon", category: "Image" },
  { extension: ".tiff", mimeType: "image/tiff", category: "Image" },
  { extension: ".tif", mimeType: "image/tiff", category: "Image" },
  { extension: ".avif", mimeType: "image/avif", category: "Image" },
  { extension: ".apng", mimeType: "image/apng", category: "Image" },
  { extension: ".heic", mimeType: "image/heic", category: "Image" },
  { extension: ".heif", mimeType: "image/heif", category: "Image" },
  // Audio
  { extension: ".mp3", mimeType: "audio/mpeg", category: "Audio" },
  { extension: ".wav", mimeType: "audio/wav", category: "Audio" },
  { extension: ".ogg", mimeType: "audio/ogg", category: "Audio" },
  { extension: ".flac", mimeType: "audio/flac", category: "Audio" },
  { extension: ".aac", mimeType: "audio/aac", category: "Audio" },
  { extension: ".weba", mimeType: "audio/webm", category: "Audio" },
  { extension: ".m4a", mimeType: "audio/mp4", category: "Audio" },
  { extension: ".opus", mimeType: "audio/opus", category: "Audio" },
  { extension: ".midi", mimeType: "audio/midi", category: "Audio" },
  { extension: ".mid", mimeType: "audio/midi", category: "Audio" },
  // Video
  { extension: ".mp4", mimeType: "video/mp4", category: "Video" },
  { extension: ".avi", mimeType: "video/x-msvideo", category: "Video" },
  { extension: ".mpeg", mimeType: "video/mpeg", category: "Video" },
  { extension: ".webm", mimeType: "video/webm", category: "Video" },
  { extension: ".ogv", mimeType: "video/ogg", category: "Video" },
  { extension: ".mov", mimeType: "video/quicktime", category: "Video" },
  { extension: ".mkv", mimeType: "video/x-matroska", category: "Video" },
  { extension: ".wmv", mimeType: "video/x-ms-wmv", category: "Video" },
  { extension: ".flv", mimeType: "video/x-flv", category: "Video" },
  { extension: ".3gp", mimeType: "video/3gpp", category: "Video" },
  { extension: ".ts", mimeType: "video/mp2t", category: "Video" },
  // Font
  { extension: ".ttf", mimeType: "font/ttf", category: "Font" },
  { extension: ".otf", mimeType: "font/otf", category: "Font" },
  { extension: ".eot", mimeType: "application/vnd.ms-fontobject", category: "Font" },
  // Multipart
  { extension: ".form", mimeType: "multipart/form-data", category: "Multipart" },
  // Other
  { extension: ".ics", mimeType: "text/calendar", category: "Text" },
  { extension: ".vcf", mimeType: "text/vcard", category: "Text" },
  { extension: ".tsv", mimeType: "text/tab-separated-values", category: "Text" },
  { extension: ".wrl", mimeType: "model/vrml", category: "Model" },
  { extension: ".gltf", mimeType: "model/gltf+json", category: "Model" },
  { extension: ".glb", mimeType: "model/gltf-binary", category: "Model" },
  { extension: ".stl", mimeType: "model/stl", category: "Model" },
];

export function searchMimeTypes(query: string): MimeEntry[] {
  if (!query.trim()) return MIME_TYPES;
  const q = query.toLowerCase().trim();
  return MIME_TYPES.filter(
    (m) =>
      m.extension.toLowerCase().includes(q) ||
      m.mimeType.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  );
}

export function getCategories(): string[] {
  return [...new Set(MIME_TYPES.map((m) => m.category))];
}

export interface HtaccessOptions {
  forceHttps: boolean;
  forceWww: "none" | "www" | "non-www";
  redirects: { from: string; to: string; type: "301" | "302" }[];
  errorPages: { code: string; page: string }[];
  enableCors: boolean;
  corsOrigin: string;
  enableCaching: boolean;
  cacheDays: number;
  enableGzip: boolean;
  directoryIndex: string;
  denyDotFiles: boolean;
}

export function getDefaultOptions(): HtaccessOptions {
  return {
    forceHttps: false,
    forceWww: "none",
    redirects: [],
    errorPages: [],
    enableCors: false,
    corsOrigin: "*",
    enableCaching: false,
    cacheDays: 30,
    enableGzip: false,
    directoryIndex: "",
    denyDotFiles: false,
  };
}

export function generateHtaccess(options: HtaccessOptions): string {
  const sections: string[] = [];

  // Force HTTPS
  if (options.forceHttps) {
    sections.push(
      `# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`
    );
  }

  // WWW handling
  if (options.forceWww === "www") {
    sections.push(
      `# Force www
RewriteEngine On
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`
    );
  } else if (options.forceWww === "non-www") {
    sections.push(
      `# Force non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]`
    );
  }

  // Redirects
  if (options.redirects.length > 0) {
    const lines = options.redirects
      .filter((r) => r.from && r.to)
      .map((r) => `Redirect ${r.type} ${r.from} ${r.to}`);
    if (lines.length > 0) {
      sections.push(`# Redirects\n${lines.join("\n")}`);
    }
  }

  // Custom error pages
  if (options.errorPages.length > 0) {
    const lines = options.errorPages
      .filter((e) => e.code && e.page)
      .map((e) => `ErrorDocument ${e.code} ${e.page}`);
    if (lines.length > 0) {
      sections.push(`# Custom Error Pages\n${lines.join("\n")}`);
    }
  }

  // CORS headers
  if (options.enableCors) {
    sections.push(
      `# CORS Headers
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "${options.corsOrigin}"
    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>`
    );
  }

  // Caching
  if (options.enableCaching) {
    const seconds = options.cacheDays * 86400;
    sections.push(
      `# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus ${options.cacheDays} days"
    ExpiresByType image/png "access plus ${options.cacheDays} days"
    ExpiresByType image/gif "access plus ${options.cacheDays} days"
    ExpiresByType image/svg+xml "access plus ${options.cacheDays} days"
    ExpiresByType image/webp "access plus ${options.cacheDays} days"
    ExpiresByType text/css "access plus ${options.cacheDays} days"
    ExpiresByType application/javascript "access plus ${options.cacheDays} days"
    ExpiresByType application/font-woff2 "access plus ${options.cacheDays} days"
    ExpiresByType font/woff2 "access plus ${options.cacheDays} days"
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "\\.(ico|jpe?g|png|gif|svg|webp|css|js|woff2?)$">
        Header set Cache-Control "max-age=${seconds}, public"
    </FilesMatch>
</IfModule>`
    );
  }

  // Gzip compression
  if (options.enableGzip) {
    sections.push(
      `# Gzip Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>`
    );
  }

  // Directory index
  if (options.directoryIndex) {
    sections.push(`# Directory Index\nDirectoryIndex ${options.directoryIndex}`);
  }

  // Deny dot files
  if (options.denyDotFiles) {
    sections.push(
      `# Deny access to dot files
<FilesMatch "^\\.">
    Order allow,deny
    Deny from all
</FilesMatch>`
    );
  }

  return sections.join("\n\n") + "\n";
}

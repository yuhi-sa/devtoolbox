export interface RobotRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotRule[];
  sitemapUrl?: string;
}

export function generateRobotsTxt(config: RobotsConfig): string {
  const lines: string[] = [];

  for (const rule of config.rules) {
    lines.push(`User-agent: ${rule.userAgent}`);
    for (const path of rule.disallow) {
      lines.push(`Disallow: ${path}`);
    }
    for (const path of rule.allow) {
      lines.push(`Allow: ${path}`);
    }
    if (rule.crawlDelay !== undefined && rule.crawlDelay > 0) {
      lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    }
    lines.push("");
  }

  if (config.sitemapUrl) {
    lines.push(`Sitemap: ${config.sitemapUrl}`);
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

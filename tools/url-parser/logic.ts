export interface ParsedUrl {
  protocol: string;
  host: string;
  port: string;
  pathname: string;
  queryParams: { key: string; value: string }[];
  hash: string;
  origin: string;
}

export function parseUrl(input: string): ParsedUrl {
  // Add protocol if missing for parsing
  let normalized = input.trim();
  if (!normalized.match(/^[a-zA-Z]+:\/\//)) {
    normalized = "https://" + normalized;
  }

  const url = new URL(normalized);

  const queryParams: { key: string; value: string }[] = [];
  url.searchParams.forEach((value, key) => {
    queryParams.push({ key, value });
  });

  return {
    protocol: url.protocol.replace(":", ""),
    host: url.hostname,
    port: url.port,
    pathname: url.pathname,
    queryParams,
    hash: url.hash.replace("#", ""),
    origin: url.origin,
  };
}

export function buildUrl(parts: ParsedUrl): string {
  let url = `${parts.protocol}://${parts.host}`;
  if (parts.port) {
    url += `:${parts.port}`;
  }
  url += parts.pathname || "/";
  if (parts.queryParams.length > 0) {
    const params = parts.queryParams
      .filter((p) => p.key)
      .map(
        (p) =>
          `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`
      )
      .join("&");
    if (params) url += `?${params}`;
  }
  if (parts.hash) {
    url += `#${parts.hash}`;
  }
  return url;
}

export function extractQueryString(input: string): string {
  const idx = input.indexOf("?");
  if (idx === -1) return "";
  const hashIdx = input.indexOf("#", idx);
  return hashIdx === -1 ? input.slice(idx + 1) : input.slice(idx + 1, hashIdx);
}

export function decodeQueryString(
  qs: string
): { key: string; value: string }[] {
  if (!qs) return [];
  return qs.split("&").map((pair) => {
    const [key, ...rest] = pair.split("=");
    return {
      key: decodeURIComponent(key),
      value: decodeURIComponent(rest.join("=")),
    };
  });
}

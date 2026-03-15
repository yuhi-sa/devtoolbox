export interface NginxOptions {
  serverName: string;
  port: number;
  rootPath?: string;
  reverseProxy?: string;
  ssl?: boolean;
  sslCertificate?: string;
  sslCertificateKey?: string;
  gzip?: boolean;
  cors?: boolean;
}

export function generateNginxConfig(options: NginxOptions): string {
  const lines: string[] = [];
  const indent = "    ";

  lines.push("server {");
  lines.push(`${indent}listen ${options.port}${options.ssl ? " ssl" : ""};`);
  if (options.ssl) {
    lines.push(`${indent}listen [::]:${options.port} ssl;`);
  }
  lines.push(`${indent}server_name ${options.serverName};`);
  lines.push("");

  if (options.ssl) {
    lines.push(
      `${indent}ssl_certificate ${options.sslCertificate || "/etc/ssl/certs/server.crt"};`
    );
    lines.push(
      `${indent}ssl_certificate_key ${options.sslCertificateKey || "/etc/ssl/private/server.key"};`
    );
    lines.push(`${indent}ssl_protocols TLSv1.2 TLSv1.3;`);
    lines.push(
      `${indent}ssl_ciphers HIGH:!aNULL:!MD5;`
    );
    lines.push("");
  }

  if (options.gzip) {
    lines.push(`${indent}gzip on;`);
    lines.push(`${indent}gzip_types text/plain text/css application/json application/javascript text/xml;`);
    lines.push(`${indent}gzip_min_length 256;`);
    lines.push("");
  }

  if (options.rootPath) {
    lines.push(`${indent}root ${options.rootPath};`);
    lines.push(`${indent}index index.html index.htm;`);
    lines.push("");
  }

  lines.push(`${indent}location / {`);
  if (options.cors) {
    lines.push(`${indent}${indent}add_header Access-Control-Allow-Origin *;`);
    lines.push(
      `${indent}${indent}add_header Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE";`
    );
    lines.push(
      `${indent}${indent}add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,Content-Type,Authorization";`
    );
    lines.push("");
  }
  if (options.reverseProxy) {
    lines.push(`${indent}${indent}proxy_pass ${options.reverseProxy};`);
    lines.push(`${indent}${indent}proxy_set_header Host $host;`);
    lines.push(`${indent}${indent}proxy_set_header X-Real-IP $remote_addr;`);
    lines.push(
      `${indent}${indent}proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`
    );
    lines.push(
      `${indent}${indent}proxy_set_header X-Forwarded-Proto $scheme;`
    );
  } else {
    lines.push(`${indent}${indent}try_files $uri $uri/ =404;`);
  }
  lines.push(`${indent}}`);

  lines.push("}");
  return lines.join("\n") + "\n";
}

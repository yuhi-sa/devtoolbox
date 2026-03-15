export interface DockerRunOptions {
  image: string;
  name?: string;
  ports: string[];
  volumes: string[];
  envVars: string[];
  detach: boolean;
  restart?: string;
  network?: string;
}

export function parseDockerRun(command: string): DockerRunOptions {
  const trimmed = command.trim();
  const tokens = tokenize(trimmed);

  const options: DockerRunOptions = {
    image: "",
    ports: [],
    volumes: [],
    envVars: [],
    detach: false,
  };

  let i = 0;
  // Skip "docker" and "run"
  if (tokens[i] === "docker") i++;
  if (tokens[i] === "run") i++;

  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "-p" || token === "--publish") {
      i++;
      if (i < tokens.length) options.ports.push(tokens[i]);
    } else if (token === "-v" || token === "--volume") {
      i++;
      if (i < tokens.length) options.volumes.push(tokens[i]);
    } else if (token === "-e" || token === "--env") {
      i++;
      if (i < tokens.length) options.envVars.push(tokens[i]);
    } else if (token === "--name") {
      i++;
      if (i < tokens.length) options.name = tokens[i];
    } else if (token === "-d" || token === "--detach") {
      options.detach = true;
    } else if (token === "--restart") {
      i++;
      if (i < tokens.length) options.restart = tokens[i];
    } else if (token === "--network") {
      i++;
      if (i < tokens.length) options.network = tokens[i];
    } else if (!token.startsWith("-")) {
      options.image = token;
    }
    i++;
  }

  return options;
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuote) {
      if (ch === inQuote) {
        inQuote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
    } else if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function toComposeYaml(options: DockerRunOptions): string {
  const serviceName = options.name || "app";
  const lines: string[] = [];

  lines.push("version: '3'");
  lines.push("services:");
  lines.push(`  ${serviceName}:`);
  lines.push(`    image: ${options.image}`);

  if (options.restart) {
    lines.push(`    restart: ${options.restart}`);
  }

  if (options.network) {
    lines.push(`    networks:`);
    lines.push(`      - ${options.network}`);
  }

  if (options.ports.length > 0) {
    lines.push("    ports:");
    for (const p of options.ports) {
      lines.push(`      - "${p}"`);
    }
  }

  if (options.volumes.length > 0) {
    lines.push("    volumes:");
    for (const v of options.volumes) {
      lines.push(`      - ${v}`);
    }
  }

  if (options.envVars.length > 0) {
    lines.push("    environment:");
    for (const e of options.envVars) {
      lines.push(`      - ${e}`);
    }
  }

  if (options.network) {
    lines.push("");
    lines.push("networks:");
    lines.push(`  ${options.network}:`);
    lines.push("    external: true");
  }

  return lines.join("\n") + "\n";
}

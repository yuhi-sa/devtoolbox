export interface SubnetInfo {
  ip: string;
  cidr: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  numberOfHosts: number;
}

export function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    throw new Error("Invalid IP address format.");
  }
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function numberToIp(num: number): string {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
}

export function calculateSubnet(cidrNotation: string): SubnetInfo {
  const match = cidrNotation.trim().match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
  if (!match) {
    throw new Error("Invalid CIDR notation. Use format: 192.168.1.0/24");
  }

  const ip = match[1];
  const cidr = parseInt(match[2], 10);

  if (cidr < 0 || cidr > 32) {
    throw new Error("CIDR prefix must be between 0 and 32.");
  }

  const ipNum = ipToNumber(ip);
  const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const numberOfHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : (broadcast - network - 1);
  const firstHost = cidr >= 31 ? network : (network + 1) >>> 0;
  const lastHost = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    ip,
    cidr,
    subnetMask: numberToIp(mask),
    networkAddress: numberToIp(network),
    broadcastAddress: numberToIp(broadcast),
    firstHost: numberToIp(firstHost),
    lastHost: numberToIp(lastHost),
    numberOfHosts,
  };
}

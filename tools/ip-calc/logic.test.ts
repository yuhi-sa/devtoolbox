import { describe, it, expect } from "vitest";
import { calculateSubnet, ipToNumber, numberToIp } from "./logic";

describe("ip-calc", () => {
  it("calculates /24 subnet correctly", () => {
    const result = calculateSubnet("192.168.1.0/24");
    expect(result.networkAddress).toBe("192.168.1.0");
    expect(result.broadcastAddress).toBe("192.168.1.255");
    expect(result.subnetMask).toBe("255.255.255.0");
    expect(result.firstHost).toBe("192.168.1.1");
    expect(result.lastHost).toBe("192.168.1.254");
    expect(result.numberOfHosts).toBe(254);
  });

  it("calculates /16 subnet correctly", () => {
    const result = calculateSubnet("10.0.0.0/16");
    expect(result.networkAddress).toBe("10.0.0.0");
    expect(result.broadcastAddress).toBe("10.0.255.255");
    expect(result.subnetMask).toBe("255.255.0.0");
    expect(result.numberOfHosts).toBe(65534);
  });

  it("converts IP to number and back", () => {
    expect(numberToIp(ipToNumber("192.168.1.1"))).toBe("192.168.1.1");
    expect(numberToIp(ipToNumber("0.0.0.0"))).toBe("0.0.0.0");
    expect(numberToIp(ipToNumber("255.255.255.255"))).toBe("255.255.255.255");
  });

  it("throws on invalid CIDR notation", () => {
    expect(() => calculateSubnet("invalid")).toThrow();
    expect(() => calculateSubnet("192.168.1.0/33")).toThrow();
  });

  it("handles /32 single host", () => {
    const result = calculateSubnet("10.0.0.1/32");
    expect(result.numberOfHosts).toBe(1);
    expect(result.subnetMask).toBe("255.255.255.255");
  });
});

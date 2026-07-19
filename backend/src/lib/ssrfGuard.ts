import dns from 'dns/promises';
import { URL } from 'url';

export class SsrfError extends Error {
  code: string;
  constructor(message: string, code = 'SSRF_BLOCKED') {
    super(message);
    this.name = 'SsrfError';
    this.code = code;
  }
}

/**
 * Validates if an IPv4 address is in a private, loopback, or reserved range.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  // IPv6 mapped IPv4 or plain IPv6 check
  if (ip.includes(':')) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1' || normalized === '::' || normalized.startsWith('fe80:') || normalized.startsWith('fc00:') || normalized.startsWith('fd00:')) {
      return true;
    }
    // Check IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
    if (normalized.startsWith('::ffff:')) {
      return isPrivateOrReservedIp(normalized.slice(7));
    }
    return false;
  }

  const parts = ip.split('.').map((p) => parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IP, block
  }

  const [a, b, c, d] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (Private RFC1918)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private RFC1918) -> 172.16.0.0 - 172.31.255.255
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private RFC1918)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-Local, including cloud metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 100.64.0.0/10 (Carrier-grade NAT) -> 100.64.0.0 - 100.127.255.255
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (TEST-NET)
  if (a === 192 && b === 0 && c === 2) return true;
  if (a === 198 && b === 51 && c === 100) return true;
  if (a === 203 && b === 0 && c === 113) return true;

  // 224.0.0.0/4 (Multicast) and 240.0.0.0/4 (Future/Reserved)
  if (a >= 224) return true;

  // Broadcast
  if (a === 255 && b === 255 && c === 255 && d === 255) return true;

  return false;
}

/**
 * Validates a target URL against SSRF vulnerabilities:
 * 1. Requires http: or https: protocol
 * 2. Blocks localhost hostnames and dot-decimal representations
 * 3. Resolves DNS and blocks if resolved address is private or reserved
 */
export async function validateUrlAgainstSsrf(targetUrl: string): Promise<{ valid: boolean; resolvedIp?: string; error?: string }> {
  try {
    const parsed = new URL(targetUrl);

    // Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new SsrfError(`Forbidden protocol: ${parsed.protocol}. Only http and https are allowed.`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check common localhost aliases
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      throw new SsrfError('Access to localhost is blocked for security.');
    }

    // Direct IP check if hostname is already an IP
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      if (isPrivateOrReservedIp(hostname)) {
        throw new SsrfError(`IP address ${hostname} belongs to a private or reserved network.`);
      }
      return { valid: true, resolvedIp: hostname };
    }

    // DNS Resolution check (prevent DNS rebinding)
    const lookup = await dns.lookup(hostname, { all: true });
    if (!lookup || lookup.length === 0) {
      throw new SsrfError(`Unable to resolve DNS for hostname: ${hostname}`, 'DNS_RESOLUTION_FAILED');
    }

    for (const entry of lookup) {
      if (isPrivateOrReservedIp(entry.address)) {
        throw new SsrfError(`Host ${hostname} resolves to blocked internal IP: ${entry.address}`);
      }
    }

    return { valid: true, resolvedIp: lookup[0].address };
  } catch (err: any) {
    if (err instanceof SsrfError) {
      throw err;
    }
    throw new SsrfError(err.message || 'Invalid URL or SSRF validation failure');
  }
}

// Updated: blocks 100.64.0.0/10 (Carrier-Grade NAT) as well

// Added: explicit IPv6 loopback (::1) guard

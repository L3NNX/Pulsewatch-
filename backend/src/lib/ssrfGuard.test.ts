import { describe, it, expect } from 'vitest';
import { isPrivateOrReservedIp, validateUrlAgainstSsrf } from './ssrfGuard.js';

describe('SSRF Guard: isPrivateOrReservedIp', () => {
  it('identifies localhost / loopback', () => {
    expect(isPrivateOrReservedIp('127.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('127.1.2.3')).toBe(true);
    expect(isPrivateOrReservedIp('::1')).toBe(true);
  });

  it('identifies RFC1918 private subnets', () => {
    expect(isPrivateOrReservedIp('10.0.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('10.254.1.1')).toBe(true);
    expect(isPrivateOrReservedIp('172.16.0.1')).toBe(true);
    expect(isPrivateOrReservedIp('172.31.255.254')).toBe(true);
    expect(isPrivateOrReservedIp('192.168.1.1')).toBe(true);
  });

  it('identifies cloud metadata IP (169.254.169.254)', () => {
    expect(isPrivateOrReservedIp('169.254.169.254')).toBe(true);
  });

  it('allows public IPv4 addresses', () => {
    expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
    expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
    expect(isPrivateOrReservedIp('142.250.190.46')).toBe(false);
  });
});

describe('SSRF Guard: validateUrlAgainstSsrf', () => {
  it('blocks non-http/https protocols', async () => {
    await expect(validateUrlAgainstSsrf('ftp://example.com')).rejects.toThrow(/Forbidden protocol/);
    await expect(validateUrlAgainstSsrf('file:///etc/passwd')).rejects.toThrow(/Forbidden protocol/);
  });

  it('blocks localhost directly', async () => {
    await expect(validateUrlAgainstSsrf('http://localhost:3000')).rejects.toThrow(/Access to localhost is blocked/);
    await expect(validateUrlAgainstSsrf('http://127.0.0.1:8080')).rejects.toThrow();
  });

  it('blocks cloud metadata endpoint', async () => {
    await expect(validateUrlAgainstSsrf('http://169.254.169.254/latest/meta-data')).rejects.toThrow();
  });

  it('accepts valid public domain', async () => {
    const res = await validateUrlAgainstSsrf('https://example.com');
    expect(res.valid).toBe(true);
  });
});

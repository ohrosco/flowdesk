import { describe, it, expect, beforeAll, jest } from '@jest/globals';

function mockRequest(body, searchParams = {}) {
  const url = new URL('https://flowdesk-test.vercel.app/api/voice/menu');
  Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  return {
    text: () => Promise.resolve(body),
    url: url.href,
    nextUrl: url,
    json: () => Promise.resolve(body ? JSON.parse(body) : {}),
    headers: { get: () => null },
  };
}

describe('POST /api/voice/menu', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('returns XML Content-Type', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=1&Caller=%2B12255551234'));
    expect(res.headers.get('Content-Type')).toBe('text/xml');
  });

  it('press 1: dials emergency phone', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=1&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Dial>');
    expect(xml).toContain('+12255551234');
    // Should fire emergency-sms fetch
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/voice/emergency-sms'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('press 1 without emergency phone set: says hold and hangs up', async () => {
    process.env.EMERGENCY_PHONE = '';
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=1&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Hangup/>');
    expect(xml).not.toContain('<Dial>');
    // Reset
    process.env.EMERGENCY_PHONE = '+12255551234';
  });

  it('press 2: prompts for 5-digit zip code', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=2&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Gather');
    expect(xml).toContain('numDigits="5"');
    expect(xml).toContain('zip code');
  });

  it('press 3: says hours, address, sends info SMS, hangs up', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=3&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('Monday to Friday');
    expect(xml).toContain('123 Main St');
    expect(xml).toContain('<Hangup/>');
    // Should fire send-info-sms fetch
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/voice/send-info-sms'),
      expect.anything()
    );
  });

  it('invalid digit: says sorry and redirects', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Digits=9&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain("did not understand");
    expect(xml).toContain('<Redirect>');
    expect(xml).toContain('/api/voice/incoming');
  });

  it('handles missing Digits gracefully', async () => {
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const res = await POST(mockRequest('Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain("did not understand");
    expect(xml).toContain('<Redirect>');
  });

  it('returns safe TwiML on exception', async () => {
    // Force an error by passing invalid body
    const { POST } = await import('../../app/api/voice/menu/route.js');
    const badReq = {
      text: () => Promise.reject(new Error('parse error')),
      nextUrl: new URL('https://flowdesk-test.vercel.app/api/voice/menu'),
      headers: { get: () => null },
    };
    const res = await POST(badReq);
    const xml = await res.text();
    expect(xml).toContain('something went wrong');
  });
});

import { describe, it, expect, beforeAll, jest } from '@jest/globals';

function mockRequest(body, searchParams = {}) {
  const url = new URL('https://flowdesk-test.vercel.app/api/voice/lead-capture');
  Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  return {
    text: () => Promise.resolve(body),
    url: url.href,
    nextUrl: url,
    json: () => Promise.resolve(body ? JSON.parse(body) : {}),
    headers: { get: () => null },
  };
}

describe('POST /api/voice/lead-capture', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    global.fetch.mockClear();
  });

  it('returns XML Content-Type', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const res = await POST(mockRequest('Digits=70706&Caller=%2B12255551234'));
    expect(res.headers.get('Content-Type')).toBe('text/xml');
  });

  it('valid 5-digit zip: says thanks, sends SMS, hangs up', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const res = await POST(mockRequest('Digits=70706&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Hangup/>');
    expect(xml).toContain('Thanks');
    expect(xml).toContain('text shortly');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/voice/send-sms'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('invalid zip (4 digits): prompts retry', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const res = await POST(mockRequest('Digits=1234&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Gather');
    expect(xml).toContain('numDigits="5"');
    expect(xml).toContain('try again');
  });

  it('invalid zip (letters): prompts retry', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const res = await POST(mockRequest('Digits=abcde&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Gather');
    expect(xml).toContain('try again');
  });

  it('empty Digits: prompts retry', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const res = await POST(mockRequest('Digits=&Caller=%2B12255551234'));
    const xml = await res.text();
    expect(xml).toContain('<Gather');
    expect(xml).toContain('try again');
  });

  it('returns safe TwiML on exception', async () => {
    const { POST } = await import('../../app/api/voice/lead-capture/route.js');
    const badReq = {
      text: () => Promise.reject(new Error('crash')),
      nextUrl: new URL('https://flowdesk-test.vercel.app/api/voice/lead-capture'),
      headers: { get: () => null },
    };
    const res = await POST(badReq);
    const xml = await res.text();
    expect(xml).toContain('something went wrong');
  });
});
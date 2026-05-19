import { describe, it, expect, beforeAll, jest } from '@jest/globals';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

function mockRequest(body = '', searchParams = {}) {
  const url = new URL('https://flowdesk-test.vercel.app/api/voice/incoming');
  Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));
  const req = {
    text: () => Promise.resolve(body),
    url: url.href,
    nextUrl: url,
    json: () => Promise.resolve(body ? JSON.parse(body) : {}),
    headers: { get: () => null },
  };
  return req;
}

function setTime(hour, minute = 0, weekday = 'Wed') {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayIndex = days.indexOf(weekday);
  const baseDate = new Date(2026, 0, 5 + dayIndex, hour, minute);
  jest.useFakeTimers({ now: baseDate });
}

describe('POST /api/voice/incoming', () => {
  beforeAll(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns XML Content-Type header', async () => {
    setTime(10, 0, 'Wed');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    expect(res.headers.get('Content-Type')).toBe('text/xml');
  });

  it('returns valid TwiML with <Response> root', async () => {
    setTime(10, 0, 'Wed');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    const xml = await res.text();
    expect(xml).toContain('<Response>');
    expect(xml).toContain('</Response>');
  });

  it('includes <Say> and <Gather> during business hours', async () => {
    setTime(10, 0, 'Wed');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    const xml = await res.text();
    expect(xml).toContain('<Say');
    expect(xml).toContain('<Gather');
    expect(xml).toContain('Thanks for calling');
  });

  it('uses after-hours message on Saturday', async () => {
    setTime(10, 0, 'Sat');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    const xml = await res.text();
    expect(xml).toContain('currently closed');
  });

  it('uses after-hours before open hour', async () => {
    setTime(5, 0, 'Wed');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    const xml = await res.text();
    expect(xml).toContain('currently closed');
  });

  it('uses after-hours after close hour', async () => {
    setTime(20, 0, 'Wed');
    const { POST } = await import('../../app/api/voice/incoming/route.js');
    const res = await POST(mockRequest());
    const xml = await res.text();
    expect(xml).toContain('currently closed');
  });
});
import { jest } from '@jest/globals';

// Mock global fetch (fire-and-forget calls in voice routes)
global.fetch = jest.fn(() =>
  Promise.resolve(new Response(null, { status: 200 }))
);

// Set default env vars for tests
process.env.NEXT_PUBLIC_APP_URL = 'https://flowdesk-test.vercel.app';
process.env.NEXT_PUBLIC_BUSINESS_NAME = 'TestBiz';
process.env.BUSINESS_OPEN_HOUR = '8';
process.env.BUSINESS_CLOSE_HOUR = '18';
process.env.BUSINESS_TIMEZONE = 'America/Chicago';
process.env.EMERGENCY_PHONE = '+12255551234';
process.env.BUSINESS_HOURS_TEXT = 'Monday to Friday, 8am to 6pm';
process.env.BUSINESS_ADDRESS = '123 Main St';
process.env.BOOKING_URL = 'https://testbiz.com/book';
process.env.TWILIO_ACCOUNT_SID = 'test_sid';
process.env.TWILIO_AUTH_TOKEN = 'test_token';
process.env.TWILIO_PHONE_NUMBER = '+12255550000';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test_anon_key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test_service_role_key';
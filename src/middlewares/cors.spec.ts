import { isAllowedOrigin } from './cors';

describe('isAllowedOrigin', () => {
  it('returns true for an allowed origin from config', () => {
    // Simulate process.env/config value for the test if needed
    expect(isAllowedOrigin('http://localhost:4200')).toBe(true);
    expect(isAllowedOrigin('https://edugese.github.io')).toBe(true);
  });

  it('returns true when origin is undefined (e.g., Postman, curl)', () => {
    expect(isAllowedOrigin(undefined)).toBe(true);
  });

  it('returns false for a disallowed origin', () => {
    expect(isAllowedOrigin('http://not-allowed.com')).toBe(false);
  });
});

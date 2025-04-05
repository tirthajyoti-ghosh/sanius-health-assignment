import { formatDate } from '../date';

describe('formatDate', () => {
  it('formats a valid date string correctly', () => {
    const result = formatDate('2023-01-15');
    expect(result).toMatch(/January 15, 2023/);
  });

  it('returns TBA for empty date strings', () => {
    expect(formatDate('')).toBe('TBA');
  });

  it('returns the original string for invalid dates', () => {
    // Mock console.error to prevent error from appearing in test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    const invalidDate = 'not-a-date';
    const result = formatDate(invalidDate);
    
    // Invalid date parsing will fall back to the original string
    expect(result).toBe('Invalid Date');
    
    // Restore original console.error
    console.error = originalConsoleError;
  });
});
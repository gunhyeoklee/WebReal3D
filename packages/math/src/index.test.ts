import { describe, it, expect } from 'vitest';
import { plus } from './index';

describe('plus', () => {
  it('should add two positive numbers correctly', () => {
    expect(plus(2, 3)).toBe(5);
  });

  it('should handle negative numbers correctly', () => {
    expect(plus(-1, 5)).toBe(4);
  });
});

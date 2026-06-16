import { describe, it, expect } from 'vitest';

describe('Dashboard', () => {
  it('debe detectar temperatura válida', () => {
    const temperatura = 25;

    expect(temperatura).toBeGreaterThan(-20);
    expect(temperatura).toBeLessThan(80);
  });
});
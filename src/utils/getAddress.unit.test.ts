import { expect, test } from 'vitest';
import { getAddress } from '@/utils/getAddress.ts';

test('get Address from string', () => {
  expect(getAddress('a')).toBe('a');
  expect(getAddress('')).toBe(undefined);
  expect(getAddress('a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u0v0w0x0y0z0')).toBe(undefined);
});

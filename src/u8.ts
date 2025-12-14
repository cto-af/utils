import * as impl from './u8Impl.ts';

/**
 * Convert hex string to bytes.
 *
 * @param str String.
 * @returns Buffer.
 */
const hexToU8: (s: string) => Uint8Array =
  // @ts-expect-error fromHex not in types yet
  Uint8Array.fromHex as typeof impl.hexToU8 ??
  impl.hexToU8;

/**
 * Convert bytes to hex string.
 * @param u8 Bytes.
 * @returns Hex.
 */
const u8toHex: (u8: Uint8Array) => string =
  // @ts-expect-error toHex not in types yet
  Uint8Array.prototype.toHex ? impl.u8toHexModern : impl.u8toHex;

export {
  hexToU8,
  u8toHex,
};

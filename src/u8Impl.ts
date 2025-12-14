/**
 * Convert hex string to bytes.
 *
 * @param str String.
 * @returns Buffer.
 */
export function hexToU8(str: string): Uint8Array {
  str = str.replace(/\s/g, '');
  let len = Math.ceil(str.length / 2);
  const res = new Uint8Array(len);
  len--;
  for (let end = str.length, start = end - 2;
    end >= 0;
    end = start, start -= 2, len--
  ) {
    res[len] = parseInt(str.substring(start, end), 16);
  }

  return res;
}

/**
 * Convert bytes to hex string.
 * @param u8 Bytes.
 * @returns Hex.
 */
export function u8toHex(u8: Uint8Array): string {
  return u8.reduce((t, v) => t + v.toString(16).padStart(2, '0'), '');
}

/**
 * Convert bytes to hex string.
 * @param u8 Bytes.
 * @returns Hex.
 */
export function u8toHexModern(u8: Uint8Array): string {
  // @ts-expect-error toHex not in types yet
  return u8.toHex();
}

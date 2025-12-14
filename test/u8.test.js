import {u8toHex, hexToU8} from '../lib/u8.mjs'
import assert from 'node:assert';
import test from 'node:test';

test('u8', () => {
  test('u8toHex', () => {
    const res = u8toHex(new Uint8Array([0, 1, 2, 0xff]));
    assert.equal(res, '000102ff');
  });

  test('hexToU8', () => {
    const res = hexToU8('000102ff');
    assert.deepEqual(res, new Uint8Array([0, 1, 2, 0xff]));
  });
});

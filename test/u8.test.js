import * as impl from '../lib/u8Impl.mjs';
import {hexToU8, u8toHex} from '../lib/u8.mjs';
import assert from 'node:assert';
import test from 'node:test';

test('u8', async () => {
  await test('u8toHex', () => {
    const res = u8toHex(new Uint8Array([0, 1, 2, 0xff]));
    assert.equal(res, '000102ff');
  });

  await test('u8toHex impl', () => {
    const res = impl.u8toHex(new Uint8Array([0, 1, 2, 0xff]));
    assert.equal(res, '000102ff');
  });

  await test('hexToU8', () => {
    const res = hexToU8('000102ff');
    assert.deepEqual(res, new Uint8Array([0, 1, 2, 0xff]));
  });

  await test('hexToU8 impl', () => {
    const res = impl.hexToU8('000102ff');
    assert.deepEqual(res, new Uint8Array([0, 1, 2, 0xff]));
  });
});

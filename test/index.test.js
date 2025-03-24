import {errCode, isErrno} from '../lib/index.js';
import assert from 'node:assert';
import test from 'node:test';

test('index', () => {
  const e = new Error('test');
  e.errno = -2;
  e.code = 'ENOENT';
  assert(isErrno(e));

  assert.equal(errCode(null), false);
  assert(errCode(e, -2));
  assert(errCode(e, 'ENOENT'));
  assert.throws(() => errCode(e, null));
});

import {errCode, isCI, isErrno} from '../lib/index.js';
import assert from 'node:assert';
import test from 'node:test';

test('isErrno', () => {
  const e = new Error('test');
  e.errno = -2;
  e.code = 'ENOENT';
  assert(isErrno(e));

  assert.equal(errCode(null), false);
  assert(errCode(e, -2));
  assert(errCode(e, 'ENOENT'));
  assert.throws(() => errCode(e, null));
});

test('isCI', () => {
  const CI = isCI();
  assert.equal(typeof CI, 'boolean');

  assert.equal(isCI({CI: true}), true);
  assert.equal(isCI({CI: false}), false);
  assert.equal(isCI({}), CI);

  const {env} = process;
  process.env = {};
  assert.equal(isCI(), false);
  process.env = env;
});

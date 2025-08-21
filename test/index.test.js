import {
  assertDisjoint,
  errCode,
  isCI,
  isErrno,
  nameSet,
  promiseWithResolvers,
  select,
} from '../lib/index.js';
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

test('promiseWithResolvers', async () => {
  const p = promiseWithResolvers();
  p.resolve(-1);
  const ret = await p.promise;
  assert.equal(ret, -1);

  const r = promiseWithResolvers();
  r.reject(new Error('foo'));
  await assert.rejects(() => r.promise, /foo/);
});

test('nameSet', () => {
  const s = nameSet({a: 1, b: 2});
  assert.deepEqual(s, new Set(['a', 'b']));
});

test('assertDisjoint', () => {
  assert.throws(
    () => assertDisjoint(new Set(['a', 'c']), new Set(['a', 'b'])),
    assert.AssertionError
  );
  assert.doesNotThrow(
    () => assertDisjoint(new Set(['a', 'c']), new Set('b', 'd'))
  );
});

test('select', () => {
  const opts = {
    one: 1,
    two: 2,
    three: 3,
  };
  const res = select(opts, ['one'], ['two']);
  assert.deepEqual(res, [
    {one: 1},
    {two: 2},
    {three: 3},
  ]);

  assert.deepEqual(select(null), [{}]);
  assert.deepEqual(select({}), [{}]);
  assert.deepEqual(select({a: 1}), [{a: 1}]);
  assert.deepEqual(select({a: 1}, new Set(['a'])), [{a: 1}, {}]);
});

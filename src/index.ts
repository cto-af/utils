import assert from 'node:assert/strict';

/**
 * Is the object an ErrnoException?
 *
 * @param e Object to check.
 * @returns Type assertion.
 */
export function isErrno(e: unknown): e is NodeJS.ErrnoException {
  return (e instanceof Error) &&
    Object.prototype.hasOwnProperty.call(e, 'code');
}

/**
 * Does the error contain a specific code?
 *
 * @param e Exception to check.
 * @param code Code such as 'ENOENT' or -2.
 * @returns True if code matches.
 * @throws {TypeError} On invalid code type.
 */
export function errCode(e: unknown, code: string | number): boolean {
  if (!isErrno(e)) {
    return false;
  }
  switch (typeof code) {
    case 'string':
      return e.code === code;
    case 'number':
      return e.errno === code;
  }
  throw new TypeError(`Invalid code: ${JSON.stringify(code)}`);
}

export interface CiOptions {
  CI?: boolean;
}

/**
 * Is the current environment CI-like.
 *
 * @param opts Override the environment determination, for testing.
 * @returns True if in CI.
 */
export function isCI(opts?: CiOptions): boolean {
  // Override for testing, so we don't have to much with process.env
  if (opts && ('CI' in opts)) {
    return Boolean(opts.CI);
  }

  const {env} = process;
  return Boolean(
    // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari,
    // GitHub Actions
    env.CI ||
    env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
    env.BUILD_NUMBER || // Jenkins, TeamCity
    env.RUN_ID || // TaskCluster, dsari
    false
  );
}

export interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve(value: T | PromiseLike<T>): void;
  reject(reason?: any): void;
}

const noOp = (): void => undefined;

/**
 * Polyfill for Promise.withResolvers.  Once node 22 is the minimum version,
 * this should be removed.
 *
 * @template T Return type for resolve.
 * @returns An object containing a new Promise object and two functions to
 *   resolve or reject it, corresponding to the two parameters passed to the
 *   executor of the Promise() constructor.
 */
export function promiseWithResolvers<T>(): PromiseWithResolvers<T> {
  let resolve: (value: T | PromiseLike<T>) => void = noOp;
  let reject: (reason?: any) => void = noOp;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

/**
 * Get the names of the keys of an options type, from the defaults.
 *
 * @template T
 * @param defaults Default values for the options.
 * @returns List of keys of the given object.
 */
export function nameSet<T extends object>(defaults: T): Set<keyof T> {
  return new Set<keyof T>(Object.keys(defaults) as (keyof T)[]);
}

/**
 * Assert that none of the given sets of strings share a value.
 * Useful for validating inputs to select.
 *
 * @param sets Sets to check.
 * @throws If sets are the wrong type.
 */
export function assertDisjoint(
  ...sets: (Set<string> | string[] | object)[]
): void {
  const seen = new Set<string>();
  for (const s of sets) {
    let it: Iterable<string> | null = null;
    if (Array.isArray(s)) {
      it = s;
    } else if (s instanceof Set) {
      it = s;
    } else if ((typeof s === 'object') && s) {
      it = Object.keys(s);
    } else {
      throw new Error('Invalid set');
    }
    for (const i of it) {
      assert(!seen.has(i));
      seen.add(i);
    }
  }
}

export type Selector<T> = Partial<T> | (keyof T)[] | Set<keyof T>;

/**
 * Select some properties from an object into multiple other objects.
 * All unselected fields will be contained in a final object for the
 * "leftovers", meaning there will always be at least one element in the
 * result array.  If the first selector is a set of defaults, the type from
 * that object will be copied to the first element of the result array.
 *
 * @template T Composed options object.
 * @template U May be a Required<Partial<T>> type.
 * @param obj The source object.
 * @param defaults Defaults object or field names.
 * @param args Arrays of strings to select into the result
 *   objects.
 * @returns {Partial<Record<keyof T, any>>[]} One object for each of args,
 *   plus an extra one for everything that was left over.
 */
export function select<T extends object, U extends Selector<T>>(
  obj: T, defaults?: U, ...args: Selector<T>[]
): [U extends Partial<T> ? U : Partial<T>, ...Partial<T>[]] {
  if (defaults !== undefined) {
    args.unshift(defaults);
  }
  const sets: Set<keyof T>[] = [];
  const res: Partial<T>[] = args.map(a => {
    const ret = Object.create(null);
    if (a instanceof Set) {
      sets.push(a);
      return ret;
    }
    if (Array.isArray(a)) {
      sets.push(new Set(a));
      return ret;
    }
    if (!a || (typeof a !== 'object')) {
      throw new Error(`Invalid set: ${a}`);
    }
    sets.push(nameSet(a));
    return Object.assign(ret, a);
  });
  const leftovers: Partial<T> = Object.create(null);
  res.push(leftovers);

  if (!obj) {
    return res as [U extends Partial<T> ? U : Partial<T>, ...Partial<T>[]];
  }

  for (const [k, v] of Object.entries(obj)) {
    let found = false;
    sets.forEach((s: Set<keyof T>, i: number) => {
      if (!found && s.has(k as keyof T)) {
        found = true;
        res[i][k as keyof T] = v;
      }
    });
    if (!found) {
      leftovers[k as keyof T] = v;
    }
  }
  return res as [U extends Partial<T> ? U : Partial<T>, ...Partial<T>[]];
}

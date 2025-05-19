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

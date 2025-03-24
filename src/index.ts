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

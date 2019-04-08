export function isDigit(c: string): boolean {
  return parseInt(c) === parseInt(c);
}

export function isHexDigit(c: string): boolean {
  return isDigit(c) || (Boolean(c) && 'abcdef'.indexOf(c.toLowerCase()) !== -1);
}

// a..z_
export function isLetter(c: string): boolean {
  const code = c.toLowerCase().charCodeAt(0);
  return (code >= 97 && code <= 122) || code === 95;
}

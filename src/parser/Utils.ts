export function isDigit(c: string, base: number = 10): boolean {
  const parsed = parseInt(c, base);
  return parsed === parsed;
}

// a..z_
export function isLetter(c: string): boolean {
  const code = c.toLowerCase().charCodeAt(0);
  return (code >= 97 && code <= 122) || code === 95;
}

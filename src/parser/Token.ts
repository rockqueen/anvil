export default class Token {
  constructor(
    readonly type: string,
    readonly value: number | string | boolean | null,
    readonly start: number,
    readonly end: number
  ) {}
}

export enum Tokens {
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  STRING = 'STRING',
  ID = 'ID',
  EOF = 'EOF',

  PLUS = '+',
  MINUS = '-',
  STAR = '*',
  SLASH = '/',
  EQ = '=',
  POW = '**',
  PERCENT = '%',
  SLASHSLASH = '//',

  LT = '>',
  LTEQ = '>=',
  GT = '<',
  GTEQ = '<=',
  EQEQ = '==',

  LPAREN = '(',
  RPAREN = ')',
  LBRACE = '{',
  RBRACE = '}',

  LET = 'let',
  IF = 'if',
}

// prettier-ignore
export const OPERATORS: Array<string> = [
  Tokens.PLUS, Tokens.MINUS, Tokens.STAR, Tokens.SLASH, 
  Tokens.EQ, Tokens.POW, Tokens.PERCENT, Tokens.SLASHSLASH,
  Tokens.LT, Tokens.LTEQ, Tokens.GT, Tokens.GTEQ, Tokens.EQEQ,
  Tokens.LPAREN, Tokens.RPAREN, Tokens.LBRACE, Tokens.RBRACE
]

export function getPrecedence(token: string): number {
  switch (token) {
    case Tokens.LT:
    case Tokens.LTEQ:
    case Tokens.GT:
    case Tokens.GTEQ:
    case Tokens.EQEQ:
      return 1;
    case Tokens.PLUS:
    case Tokens.MINUS:
      return 2;
    case Tokens.STAR:
    case Tokens.SLASH:
    case Tokens.SLASHSLASH:
    case Tokens.PERCENT:
      return 3;
    case Tokens.POW:
      return 4;
    default:
      return 0;
  }
}

export const KEYWORDS: {
  [c: string]: Tokens | [Tokens, number | string | boolean];
} = {
  let: Tokens.LET,
  if: Tokens.IF,
  true: [Tokens.BOOLEAN, true],
  false: [Tokens.BOOLEAN, false],
};

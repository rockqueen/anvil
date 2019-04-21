export function createToken<T extends TokenType>(
  type: T,
  value: TokenValue<T>,
  start: number,
  end: number
): Token<T> {
  return {type, value, start, end};
}

export type Token<T extends TokenType = TokenType> = {
  readonly type: T;
  readonly value: TokenValue<T>;
  readonly start: number;
  readonly end: number;
};

export const enum TokenType {
  // Types
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  STRING = 'string',
  ID = 'id',
  // Arithmetical perators
  PLUS = 'plus',
  MINUS = 'minus',
  STAR = 'star',
  SLASH = 'slash',
  EQ = 'eq',
  POW = 'pow',
  PERCENT = 'percent',
  SLASHSLASH = 'slashslash',
  // Conditional operatos
  LT = 'lt',
  LTEQ = 'lteq',
  GT = 'gt',
  GTEQ = 'gteq',
  EQEQ = 'eqeq',
  // Parentheses
  LPAREN = 'lparent',
  RPAREN = 'rparen',
  LBRACE = 'lbrace',
  RBRACE = 'rbrace',
  // Keywords
  LET = 'let',
  IF = 'if',
  // EOF
  EOF = 'eof',
}

// prettier-ignore
export type TokenValue<T> = 
  T extends TokenType.NUMBER ? number :
  T extends TokenType.BOOLEAN ? boolean :
  T extends (TokenType.STRING | TokenType.ID) ? string :
  null;

export const OPERATORS: {[c: string]: TokenType} = {
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '*': TokenType.STAR,
  '/': TokenType.SLASH,
  '=': TokenType.EQ,
  '**': TokenType.POW,
  '%': TokenType.PERCENT,
  '//': TokenType.SLASHSLASH,
  '<': TokenType.LT,
  '<=': TokenType.LTEQ,
  '>': TokenType.GT,
  '>=': TokenType.GTEQ,
  '==': TokenType.EQEQ,
  '(': TokenType.LPAREN,
  ')': TokenType.RPAREN,
  '{': TokenType.LBRACE,
  '}': TokenType.RBRACE,
};

export const OPERATOR_TOKENS: {[t: string]: string} = {};
for (const char in OPERATORS) {
  OPERATOR_TOKENS[OPERATORS[char]] = char;
}

export const KEYWORDS: {
  [c: string]: TokenType | [TokenType, number | string | boolean];
} = {
  let: TokenType.LET,
  if: TokenType.IF,
  true: [TokenType.BOOLEAN, true],
  false: [TokenType.BOOLEAN, false],
};

// prettier-ignore
export const enum TokenType {
  NUMBER, BOOLEAN, STRING, ID,
  PLUS, MINUS, STAR, SLASH, EQ, POW, PERCENT, SLASHSLASH,
  LT, LTEQ, GT, GTEQ, EQEQ,
  LPAREN, RPAREN, LBRACE, RBRACE,
  LET, IF,
  EOF,
}

// prettier-ignore
export type TokenValue<T> = 
  T extends TokenType.NUMBER ? number :
  T extends TokenType.BOOLEAN ? boolean :
  T extends (TokenType.STRING | TokenType.ID) ? string :
  null;

export type Token<T extends TokenType = TokenType> = {
  readonly type: T;
  readonly value: TokenValue<T>;
  readonly start: number;
  readonly end: number;
};

export function createToken<T extends TokenType>(
  type: T,
  value: TokenValue<T>,
  start: number,
  end: number
): Token<T> {
  return {type, value, start, end};
}

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

export const KEYWORDS: {
  [c: string]: TokenType | [TokenType, number | string | boolean];
} = {
  let: TokenType.LET,
  if: TokenType.IF,
  true: [TokenType.BOOLEAN, true],
  false: [TokenType.BOOLEAN, false],
};

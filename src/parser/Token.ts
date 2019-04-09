// prettier-ignore
export const enum TokenType {
  NUMBER, BOOLEAN, STRING, ID,
  PLUS, MINUS, STAR, SLASH, EQ,
  INC,
  LPAREN, RPAREN,
  LET,
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
};

export function createToken<T extends TokenType>(
  type: T,
  value: TokenValue<T>
): Token<T> {
  return {type, value};
}

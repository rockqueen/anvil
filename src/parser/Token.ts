// prettier-ignore
export const enum TokenType {
  NUMBER, STRING, ID,
  PLUS, MINUS, STAR, SLASH, EQ,
  LPAREN, RPAREN,
  LET,
  EOF
}

// prettier-ignore
export type TokenValue<T> = 
  T extends TokenType.NUMBER ? number :
  T extends (TokenType.STRING | TokenType.ID) ? string :
  null

class Token<T extends TokenType = TokenType> {
  constructor(private type: T, private value: TokenValue<T>) {}

  public getType(): T {
    return this.type;
  }

  public getValue(): TokenValue<T> {
    return this.value;
  }
}

export default Token;

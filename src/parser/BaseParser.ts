import {Token, TokenType} from './Token';

class BaseParser {
  private readonly tokens: ReadonlyArray<Token>;
  private readonly size: number;

  private pos: number = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.size = this.tokens.length;
  }

  protected get(relative: number = 0): Token {
    const finalPosition = this.pos + relative;
    return this.tokens[finalPosition] || this.tokens[this.size - 1];
  }

  protected next(): Token {
    this.pos += 1;
    return this.get();
  }

  protected match(type: TokenType): boolean {
    const current = this.get();
    if (current.type === type) {
      this.next();
      return true;
    }
    return false;
  }

  protected consume<T extends TokenType>(type: T): Token<T> {
    const current = this.get();
    if (current.type === type) {
      this.pos++;
      return current as Token<T>;
    }
    throw new Error('No expected token');
  }
}

export default BaseParser;

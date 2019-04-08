import Token, {TokenType, TokenValue} from './Token';
import {isDigit, isHexDigit, isLetter} from './Utils';

const OPERATORS: {[c: string]: TokenType} = {
  '+': TokenType.PLUS,
  '-': TokenType.MINUS,
  '*': TokenType.STAR,
  '/': TokenType.SLASH,
  '=': TokenType.EQ,
  '(': TokenType.LPAREN,
  ')': TokenType.RPAREN,
};

const KEYWORDS: {[c: string]: TokenType} = {
  let: TokenType.LET,
};

class Lexer {
  private input: string;
  private length: number;
  private pos: number = 0;
  private tokens: Array<Token> = [];

  constructor(input: string) {
    this.input = input;
    this.length = this.input.length;
  }

  private peek(relative: number = 0): string {
    const finalPosition = this.pos + relative;
    return this.input[finalPosition] || '';
  }

  private next(count: number = 1): string {
    this.pos += count;
    return this.peek();
  }

  private addToken<T extends TokenType>(type: T, value: TokenValue<T>) {
    this.tokens.push(new Token(type, value));
  }

  public tokenize(): Array<Token> {
    while (this.pos < this.length) {
      const current = this.peek();
      if (isDigit(current)) {
        this.tokenizeNumber();
      } else if (current in OPERATORS) {
        this.tokenizeOperator();
      } else if (current === '"') {
        this.tokenizeString();
      } else if (isLetter(current)) {
        this.tokenizeWord();
      } else {
        this.next();
      }
    }
    this.addToken(TokenType.EOF, null);
    return this.tokens;
  }

  private tokenizeNumber() {
    let value;
    if (this.peek() === '0' && this.peek(1) === 'x') {
      let buffer = '';
      let current = this.next(2);
      while (isHexDigit(current)) {
        buffer += current;
        current = this.next();
      }
      value = parseInt(buffer, 16);
    } else {
      let buffer = '';
      let current = this.peek();
      while (isDigit(current) || current === '.') {
        buffer += current;
        current = this.next();
      }
      value = parseFloat(buffer);
    }
    this.addToken(TokenType.NUMBER, value);
  }

  private tokenizeOperator() {
    const operator = this.peek();
    this.addToken(OPERATORS[operator], null);
    this.next();
  }

  private tokenizeString() {
    let value = '';
    let current = this.next();
    while (current !== '"' && current) {
      value += current;
      current = this.next();
    }
    this.addToken(TokenType.STRING, value);
    this.next();
  }

  private tokenizeWord() {
    let word = '';
    let current = this.peek();
    while (isLetter(current)) {
      word += current;
      current = this.next();
    }
    if (word in KEYWORDS) {
      this.addToken(KEYWORDS[word], null);
    } else {
      this.addToken(TokenType.ID, word);
    }
  }
}

export default Lexer;

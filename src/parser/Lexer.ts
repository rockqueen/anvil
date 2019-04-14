import {isDigit, isLetter} from './Utils';
import {
  Token,
  TokenType,
  TokenValue,
  createToken,
  OPERATORS,
  KEYWORDS,
} from './Token';

const OPERATORS_CHARS = new Set(Object.keys(OPERATORS).join(''));

class Lexer {
  private readonly input: string;
  private readonly length: number;

  private start: number = 0;
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

  private next(): string {
    this.pos += 1;
    return this.peek();
  }

  private addToken<T extends TokenType>(type: T, value: TokenValue<T>) {
    this.tokens.push(createToken(type, value, this.start, this.pos));
  }

  public tokenize(): Array<Token> {
    while (this.pos < this.length) {
      this.start = this.pos;
      const current = this.peek();
      if (isDigit(current)) {
        this.tokenizeNumber();
      } else if (OPERATORS_CHARS.has(current)) {
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
    if (this.peek() === '0' && 'box'.indexOf(this.peek(1)) > -1) {
      const base = 2 ** ('b_ox'.indexOf(this.next()) + 1);
      let buffer = '';
      let current = this.next();
      while (isDigit(current, base)) {
        buffer += current;
        current = this.next();
      }
      value = parseInt(buffer, base);
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
    let operator = '';
    let current = this.peek();
    while (OPERATORS[operator + current] && current) {
      operator += current;
      current = this.next();
    }
    this.addToken(OPERATORS[operator], null);
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
      const keyword = KEYWORDS[word];
      const type = Array.isArray(keyword) ? keyword[0] : keyword;
      const value = Array.isArray(keyword) ? keyword[1] : null;
      this.addToken(type, value);
    } else {
      this.addToken(TokenType.ID, word);
    }
  }
}

export default Lexer;

import Token, {Tokens, OPERATORS, KEYWORDS} from './Token';

const OPERATORS_CHARS = new Set(OPERATORS);

function isDigit(c: string, base: number = 10): boolean {
  const parsed = parseInt(c, base);
  return parsed === parsed;
}

function isWordSymbol(c: string): boolean {
  const code = c.toLowerCase().charCodeAt(0);
  return (code >= 97 && code <= 122) || code === 95;
}

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

  private addToken(type: string, value: any) {
    this.tokens.push(new Token(type, value, this.start, this.pos));
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
      } else if (isWordSymbol(current)) {
        this.tokenizeWord();
      } else {
        this.next();
      }
    }
    this.addToken(Tokens.EOF, null);
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
    this.addToken(Tokens.NUMBER, value);
  }

  private tokenizeOperator() {
    let operator = '';
    let current = this.peek();
    while (OPERATORS.indexOf(operator + current) > -1 && current) {
      operator += current;
      current = this.next();
    }
    this.addToken(operator, null);
  }

  private tokenizeString() {
    let value = '';
    let current = this.next();
    while (current !== '"' && current) {
      value += current;
      current = this.next();
    }
    this.addToken(Tokens.STRING, value);
    this.next();
  }

  private tokenizeWord() {
    let word = '';
    let current = this.peek();
    while (isWordSymbol(current)) {
      word += current;
      current = this.next();
    }
    if (KEYWORDS.indexOf(word) > -1) {
      this.addToken(word, null);
    } else {
      this.addToken(Tokens.ID, word);
    }
  }
}

export default Lexer;

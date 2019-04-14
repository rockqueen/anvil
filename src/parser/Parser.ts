import {Token, TokenType, OPERATORS} from './Token';
import {
  AssignStatement,
  Node,
  Statement,
  Expression,
  ExpressionStatement,
} from '../AST';

function createNode<T extends Node>(data: T): T {
  return data;
}

class Parser {
  private readonly tokens: ReadonlyArray<Token>;
  private readonly size: number;
  private pos = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
    this.size = this.tokens.length;
  }

  private get(relative: number = 0): Token {
    const finalPosition = this.pos + relative;
    return this.tokens[finalPosition] || this.tokens[this.size - 1];
  }

  private next(count: number = 1): Token {
    this.pos += count;
    return this.get();
  }

  private match(type: TokenType): boolean {
    const current = this.get();
    if (current.type === type) {
      this.next();
      return true;
    }
    return false;
  }

  private consume<T extends TokenType>(type: T): Token<T> {
    const current = this.get();
    if (current.type === type) {
      this.pos++;
      return current as Token<T>;
    }
    throw new Error('No expected token');
  }

  public parse() {
    const children: Array<Statement> = [];
    while (!this.match(TokenType.EOF)) {
      children.push(this.statement());
    }
    return createNode({type: 'BlockStatement', children});
  }

  private statement(): Statement {
    if (this.match(TokenType.LET)) {
      return this.assignStatement();
    }
    throw new Error();
  }

  private assignStatement(): AssignStatement {
    const id = createNode({
      type: 'IdentifierExpression',
      name: this.consume(TokenType.ID).value,
    });
    const value = this.match(TokenType.EQ) ? this.expression() : null;
    return createNode({type: 'AssignStatement', id, value});
  }

  private expression(): Expression {
    let result = this.multiplicative();
    while (true) {
      const token = this.get();
      if (token.type !== TokenType.PLUS && token.type !== TokenType.MINUS) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: token.type === TokenType.PLUS ? '+' : '-',
        left: result,
        right: this.multiplicative(),
      });
    }
    return result;
  }

  private multiplicative(): Expression {
    let result = this.unary();
    while (true) {
      const token = this.get();
      if (token.type !== TokenType.STAR && token.type !== TokenType.SLASH) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: token.type === TokenType.STAR ? '*' : '/',
        left: result,
        right: this.unary(),
      });
    }
    return result;
  }

  private unary() {
    const current = this.get();
    if (current.type === TokenType.MINUS) {
      this.next();
      return createNode({
        type: 'UnaryExpression',
        operator: '-',
        value: this.atom(),
      });
    }
    return this.atom();
  }

  private atom(): Expression {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TokenType.NUMBER:
        return createNode({
          type: 'NumberExpression',
          value: (current as Token<TokenType.NUMBER>).value,
        });
      case TokenType.ID:
        return createNode({
          type: 'IdentifierExpression',
          name: (current as Token<TokenType.ID>).value,
        });
      case TokenType.LPAREN:
        const expression = this.expression();
        this.consume(TokenType.RPAREN);
        return expression;
      default:
        throw new Error('Incorrect expression');
    }
  }
}

export default Parser;

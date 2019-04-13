import {Token, TokenType, OPERATORS} from './Token';
import {AssignStatement, Node, Statement, Value, Expression} from '../AST';

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
      children.push(this.parseStatement());
    }
    return createNode({type: 'BlockStatement', children});
  }

  private parseStatement(): Statement {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TokenType.LET:
        return this.parseAssignStatement();
      default:
        throw new Error(`Unknown token for statement`);
    }
  }

  private parseAssignStatement(): AssignStatement {
    const id = createNode({
      type: 'Identifier',
      name: this.consume(TokenType.ID).value,
    });
    this.consume(TokenType.EQ);
    const value = this.parseExpression();
    return createNode({type: 'AssignStatement', id, value});
  }

  private parseExpression(): Value | Expression {
    let result = this.parseMonomial();
    while (true) {
      if (this.match(TokenType.PLUS)) {
        result = createNode({
          type: 'BinaryExpression',
          operator: '+',
          left: result,
          right: this.parseMonomial(),
        });
        continue;
      }
      if (this.match(TokenType.MINUS)) {
        result = createNode({
          type: 'BinaryExpression',
          operator: '-',
          left: result,
          right: this.parseMonomial(),
        });
        continue;
      }
      break;
    }
    return result;
  }

  private parseMonomial(): Value | Expression {
    let result: Value | Expression = this.parseAtom();
    while (true) {
      if (this.match(TokenType.STAR)) {
        result = createNode({
          type: 'BinaryExpression',
          operator: '*',
          left: result,
          right: this.parseMonomial(),
        });
        continue;
      }
      if (this.match(TokenType.SLASH)) {
        result = createNode({
          type: 'BinaryExpression',
          operator: '/',
          left: result,
          right: this.parseMonomial(),
        });
        continue;
      }
      break;
    }
    return result;
  }

  private parseAtom(): Value | Expression {
    const current = this.get();
    if (this.match(TokenType.NUMBER)) {
      const token = current as Token<TokenType.NUMBER>;
      return createNode({type: 'NumberValue', value: token.value});
    } else if (this.match(TokenType.MINUS)) {
      const exp = this.parseAtom();
      return createNode({type: 'UnaryExpression', operator: '-', value: exp});
    } else if (this.match(TokenType.LPAREN)) {
      const exp = this.parseExpression();
      this.consume(TokenType.RPAREN);
      return exp;
    }
    throw new Error();
  }
}

export default Parser;

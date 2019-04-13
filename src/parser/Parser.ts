import {Token, TokenType, OPERATORS} from './Token';
import {
  AssignStatement,
  Node,
  Statement,
  Value,
  Expression,
  Identifier,
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

  private parseExpression(): Value | Expression | Identifier {
    let result = this.parseMonomial();
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
        right: this.parseMonomial(),
      });
    }
    return result;
  }

  private parseMonomial(): Value | Expression | Identifier {
    let result: Value | Expression | Identifier = this.parseAtom();
    while (true) {
      const token = this.get();
      if (token.type !== TokenType.STAR && token.type !== TokenType.SLASH) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: token.type === TokenType.STAR ? '+' : '-',
        left: result,
        right: this.parseAtom(),
      });
    }
    return result;
  }

  private parseAtom(): Value | Expression | Identifier {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TokenType.NUMBER:
        return createNode({
          type: 'NumberValue',
          value: (current as Token<TokenType.NUMBER>).value,
        });
      case TokenType.ID:
        return createNode({
          type: 'Identifier',
          name: (current as Token<TokenType.ID>).value,
        });
      // Maybe to `unary` function??
      case TokenType.MINUS:
        return createNode({
          type: 'UnaryExpression',
          operator: '-',
          value: this.parseAtom(),
        });
      case TokenType.LPAREN:
        const expression = this.parseExpression();
        this.consume(TokenType.RPAREN);
        return expression;
      default:
        throw new Error('Incorrect expression');
    }
  }
}

export default Parser;

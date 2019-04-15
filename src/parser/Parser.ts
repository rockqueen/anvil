import {Token, TokenType} from './Token';
import Node, * as NodeType from '../AST';

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

  private next(): Token {
    this.pos += 1;
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
    const children: Array<NodeType.Statement> = [];
    while (!this.match(TokenType.EOF)) {
      children.push(this.statement());
    }
    return createNode({type: 'BlockStatement', children});
  }

  /**
   * Statement parser
   */
  private statement(): NodeType.Statement {
    if (this.match(TokenType.LET)) {
      return this.assignStatement();
    }
    throw new Error(`Unknown statement`);
  }

  private assignStatement(): NodeType.AssignStatement {
    const id = createNode({
      type: 'IdentifierExpression',
      value: this.consume(TokenType.ID).value,
    });
    const value = this.match(TokenType.EQ)
      ? this.expression()
      : createNode({type: 'NullExpression', value: null});
    return createNode({type: 'AssignStatement', id, value});
  }

  /**
   * Expression parser
   */
  private expression(): NodeType.Expression {
    return this.conditional();
  }

  private readonly conditionalOperators: {
    [c: number]: NodeType.ConditionalOperator;
  } = {
    [TokenType.LT]: '<',
    [TokenType.LTEQ]: '<=',
    [TokenType.GT]: '>',
    [TokenType.GTEQ]: '>=',
    [TokenType.EQEQ]: '==',
  };

  private conditional(): NodeType.Expression {
    let result = this.addictive();
    while (true) {
      const token = this.get();
      if (!(token.type in this.conditionalOperators)) {
        break;
      }
      this.next();
      result = createNode({
        type: 'ConditionalExpression',
        operator: this.conditionalOperators[token.type],
        left: result,
        right: this.addictive(),
      });
    }
    return result;
  }

  private addictive(): NodeType.Expression {
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

  private readonly multiplicativeOperators: {
    [c: number]: NodeType.BinaryOperator;
  } = {
    [TokenType.STAR]: '*',
    [TokenType.SLASH]: '/',
    [TokenType.PERCENT]: '%',
    [TokenType.SLASHSLASH]: '//',
  };

  private multiplicative(): NodeType.Expression {
    let result = this.unary();
    while (true) {
      const token = this.get();
      if (!(token.type in this.multiplicativeOperators)) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: this.multiplicativeOperators[token.type],
        left: result,
        right: this.unary(),
      });
    }
    return result;
  }

  private unary(): NodeType.Expression {
    const current = this.get();
    if (current.type === TokenType.MINUS) {
      this.next();
      return createNode({
        type: 'UnaryExpression',
        operator: '-',
        value: this.poweable(),
      });
    }
    if (this.match(TokenType.PLUS)) {
      return this.poweable();
    }
    return this.poweable();
  }

  private poweable(): NodeType.Expression {
    let result = this.atom();
    while (true) {
      const token = this.get();
      if (token.type !== TokenType.POW) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: '**',
        left: result,
        right: this.atom(),
      });
    }
    return result;
  }

  private atom(): NodeType.Expression {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TokenType.NUMBER:
        return createNode({
          type: 'NumberExpression',
          value: (current as Token<TokenType.NUMBER>).value,
        });
      case TokenType.STRING:
        return createNode({
          type: 'StringExpression',
          value: (current as Token<TokenType.STRING>).value,
        });
      case TokenType.BOOLEAN:
        return createNode({
          type: 'BooleanExpression',
          value: (current as Token<TokenType.BOOLEAN>).value,
        });
      case TokenType.ID:
        return createNode({
          type: 'IdentifierExpression',
          value: (current as Token<TokenType.ID>).value,
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

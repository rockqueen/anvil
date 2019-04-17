import BaseParser from './BaseParser';
import {Token, TokenType} from './Token';
import Node, * as NodeType from '../AST';

function createNode<T extends Node>(data: T): T {
  return data;
}

class ExpressionParser extends BaseParser {
  protected expression(): NodeType.Expression {
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
        type: 'ConditionExpression',
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

export default ExpressionParser;

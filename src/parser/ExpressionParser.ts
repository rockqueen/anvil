import BaseParser from './BaseParser';
import {Token, TokenType as TT, OPERATOR_TOKENS} from './Token';
import Node, * as NT from '../AST';

function createNode<T extends Node>(data: T): T {
  return data;
}

const CONDITIONAL_TOKENS: Set<TT> = new Set([
  TT.LT,
  TT.LTEQ,
  TT.GT,
  TT.GTEQ,
  TT.EQEQ,
]);

const MULTIPLICATIVE_TOKENS: Set<TT> = new Set([
  TT.STAR,
  TT.SLASH,
  TT.PERCENT,
  TT.SLASHSLASH,
]);

class ExpressionParser extends BaseParser {
  protected expression(): NT.Expression {
    return this.conditional();
  }

  private conditional(): NT.Expression {
    let result = this.addictive();
    while (true) {
      const token = this.get();
      if (!CONDITIONAL_TOKENS.has(token.type)) {
        break;
      }
      this.next();
      result = createNode({
        type: 'ConditionExpression',
        operator: <NT.ConditionalOperator>OPERATOR_TOKENS[token.type],
        left: result,
        right: this.addictive(),
      });
    }
    return result;
  }

  private addictive(): NT.Expression {
    let result = this.multiplicative();
    while (true) {
      const token = this.get();
      if (token.type !== TT.PLUS && token.type !== TT.MINUS) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: token.type === TT.PLUS ? '+' : '-',
        left: result,
        right: this.multiplicative(),
      });
    }
    return result;
  }

  private multiplicative(): NT.Expression {
    let result = this.unary();
    while (true) {
      const token = this.get();
      if (!MULTIPLICATIVE_TOKENS.has(token.type)) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: <NT.BinaryOperator>OPERATOR_TOKENS[token.type],
        left: result,
        right: this.unary(),
      });
    }
    return result;
  }

  private unary(): NT.Expression {
    const current = this.get();
    if (current.type === TT.MINUS) {
      this.next();
      return createNode({
        type: 'UnaryExpression',
        operator: '-',
        value: this.pow(),
      });
    }
    if (this.match(TT.PLUS)) {
      return this.pow();
    }
    return this.pow();
  }

  private pow(): NT.Expression {
    let result = this.atom();
    while (true) {
      const token = this.get();
      if (token.type !== TT.POW) {
        break;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: <NT.BinaryOperator>OPERATOR_TOKENS[TT.POW],
        left: result,
        right: this.atom(),
      });
    }
    return result;
  }

  private atom(): NT.Expression {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TT.NUMBER:
        return createNode({
          type: 'NumberExpression',
          value: (current as Token<TT.NUMBER>).value,
        });
      case TT.STRING:
        return createNode({
          type: 'StringExpression',
          value: (current as Token<TT.STRING>).value,
        });
      case TT.BOOLEAN:
        return createNode({
          type: 'BooleanExpression',
          value: (current as Token<TT.BOOLEAN>).value,
        });
      case TT.ID:
        return createNode({
          type: 'IdentifierExpression',
          value: (current as Token<TT.ID>).value,
        });
      case TT.LPAREN:
        const expression = this.expression();
        this.consume(TT.RPAREN);
        return expression;
      default:
        throw new Error('Incorrect expression');
    }
  }
}

export default ExpressionParser;

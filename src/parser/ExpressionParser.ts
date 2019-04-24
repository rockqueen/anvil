import BaseParser from './BaseParser';
import {Token, TokenType as TT, OPERATOR_TOKENS} from './Token';
import Node, * as NT from '../AST';

function createNode<T extends Node>(data: T): T {
  return data;
}

function getPrecedence(token: TT): number {
  switch (token) {
    case TT.LT:
    case TT.LTEQ:
    case TT.GT:
    case TT.GTEQ:
    case TT.EQEQ:
      return 1;
    case TT.PLUS:
    case TT.MINUS:
      return 2;
    case TT.STAR:
    case TT.SLASH:
    case TT.SLASHSLASH:
    case TT.PERCENT:
      return 3;
    case TT.POW:
      return 4;
    default:
      return 0;
  }
}

class ExpressionParser extends BaseParser {
  protected expression(): NT.Expression {
    return this.binaryExpression();
  }

  private binaryExpression(prec: number = 1) {
    let result = this.unaryExpression();
    while (true) {
      const token = this.get();
      const tprec = getPrecedence(token.type);
      if (tprec < prec) {
        return result;
      }
      this.next();
      result = createNode({
        type: 'BinaryExpression',
        operator: <NT.BinaryOperator>OPERATOR_TOKENS[token.type],
        left: result,
        right: this.binaryExpression(tprec + 1),
      });
    }
  }

  private unaryExpression(): NT.Expression {
    const current = this.get();
    if (current.type === TT.MINUS) {
      this.next();
      return createNode({
        type: 'UnaryExpression',
        operator: '-',
        value: this.primary(),
      });
    }
    return this.primary();
  }

  private primary(): NT.Expression {
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
        throw new Error('Incorrect expression ' + current.type);
    }
  }
}

export default ExpressionParser;

import BaseParser from './BaseParser';
import {Token, TokenType, OPERATOR_TOKENS} from './Token';
import {
  Expression,
  BinaryExpression,
  UnaryExpression,
  NumberExpression,
  StringExpression,
  BooleanExpression,
  IdentifierExpression,
} from '../ast/Expression';

function getPrecedence(token: TokenType): number {
  switch (token) {
    case TokenType.LT:
    case TokenType.LTEQ:
    case TokenType.GT:
    case TokenType.GTEQ:
    case TokenType.EQEQ:
      return 1;
    case TokenType.PLUS:
    case TokenType.MINUS:
      return 2;
    case TokenType.STAR:
    case TokenType.SLASH:
    case TokenType.SLASHSLASH:
    case TokenType.PERCENT:
      return 3;
    case TokenType.POW:
      return 4;
    default:
      return 0;
  }
}

class ExpressionParser extends BaseParser {
  protected identifier(): IdentifierExpression {
    const current = this.get();
    if (current.type === TokenType.ID) {
      return <IdentifierExpression>this.primary();
    }
    throw new Error('No identifier');
  }

  protected expression(): Expression {
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
      result = new BinaryExpression(
        OPERATOR_TOKENS[token.type],
        result,
        this.binaryExpression(tprec + 1)
      );
    }
  }

  private unaryExpression() {
    const current = this.get();
    if (current.type === TokenType.MINUS) {
      this.next();
      return new UnaryExpression('-', this.primary());
    }
    return this.primary();
  }

  private primary() {
    const current = this.get();
    this.next();
    switch (current.type) {
      case TokenType.NUMBER:
        return new NumberExpression((current as Token<TokenType.NUMBER>).value);
      case TokenType.STRING:
        return new StringExpression((current as Token<TokenType.STRING>).value);
      case TokenType.BOOLEAN:
        return new BooleanExpression(
          (current as Token<TokenType.BOOLEAN>).value
        );
      case TokenType.ID:
        return new IdentifierExpression((current as Token<TokenType.ID>).value);
      case TokenType.LPAREN:
        const expression = this.expression();
        this.consume(TokenType.RPAREN);
        return expression;
      default:
        throw new Error('Incorrect expression ' + current.type);
    }
  }
}

export default ExpressionParser;

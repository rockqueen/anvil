import BaseParser from './BaseParser';
import {Tokens, getPrecedence} from './Token';
import {
  Expression,
  NumberExpression,
  StringExpression,
  BooleanExpression,
  IdentifierExpression,
  UnaryExpression,
  BinaryExpression,
} from '../ast/Expression';

class ExpressionParser extends BaseParser {
  protected identifier(): IdentifierExpression {
    const token = this.consume(Tokens.ID);
    return new IdentifierExpression(token.value as string);
  }

  protected expression(): Expression {
    return this.binaryExpression();
  }

  private binaryExpression(prec: number = 1) {
    let x = this.unaryExpression();
    while (true) {
      const token = this.get();
      const tokenPrec = getPrecedence(token.type);
      if (tokenPrec < prec) {
        return x;
      }
      this.next();
      const y = this.binaryExpression(tokenPrec + 1);
      x = new BinaryExpression(token.type, x, y);
    }
  }

  private unaryExpression() {
    const current = this.get();
    switch (current.type) {
      case Tokens.MINUS:
        this.next();
        return new UnaryExpression('-', this.primary());
    }
    return this.primary();
  }

  private primary() {
    const current = this.get();
    this.next();
    switch (current.type) {
      case Tokens.NUMBER:
        return new NumberExpression(current.value as number);
      case Tokens.STRING:
        return new StringExpression(current.value as string);
      case Tokens.TRUE:
      case Tokens.FALSE:
        return new BooleanExpression(current.type === Tokens.TRUE);
      case Tokens.ID:
        return new IdentifierExpression(current.value as string);
      case Tokens.LPAREN:
        const expression = this.expression();
        this.consume(Tokens.RPAREN);
        return expression;
      default:
        throw new Error('Incorrect expression ' + current.type);
    }
  }
}

export default ExpressionParser;

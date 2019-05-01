import ExpressionParser from './ExpressionParser';
import {Tokens} from './Token';
import {
  Statement,
  BlockStatement,
  AssignStatement,
  IfStatement,
} from '../ast/Statement';

class StatementParser extends ExpressionParser {
  public parse() {
    return this.blockStatement(Tokens.EOF);
  }

  private blockStatement(endToken: Tokens) {
    const children: Array<Statement> = [];
    while (!this.match(endToken)) {
      children.push(this.statement());
    }
    return new BlockStatement(children);
  }

  private statement() {
    if (this.match(Tokens.LET)) {
      return this.assignStatement();
    }
    if (this.match(Tokens.IF)) {
      return this.ifStatement();
    }
    throw new Error(`'${this.get().type}' is incorrect for statement`);
  }

  private assignStatement(): AssignStatement {
    const id = this.identifier();
    this.consume(Tokens.EQ);
    const value = this.expression();
    return new AssignStatement(id, value);
  }

  private ifStatement() {
    const condition = this.expression();
    this.consume(Tokens.LBRACE);
    const body = this.blockStatement(Tokens.RBRACE);
    return new IfStatement(condition, body);
  }
}

export default StatementParser;

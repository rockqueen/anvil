import ExpressionParser from './ExpressionParser';
import {TokenType} from './Token';
import {Statement, BlockStatement, AssignStatement} from '../ast/Statement';
import {IdentifierExpression} from '../ast/Expression';

class StatementParser extends ExpressionParser {
  public parse() {
    const children: Array<Statement> = [];
    while (!this.match(TokenType.EOF)) {
      children.push(this.statement());
    }
    return new BlockStatement(children);
  }

  private statement() {
    if (this.match(TokenType.LET)) {
      return this.assignStatement();
    }
    throw new Error(`Unknown statement`);
  }

  private assignStatement(): AssignStatement {
    const id = this.identifier();
    this.consume(TokenType.EQ);
    const value = this.expression();
    return new AssignStatement(id, value);
  }

  // private ifStatement(): NodeType.IfStatement {
  //   const condition = this.expression() as NodeType.ConditionExpression;
  //   this.consume(TokenType.LBRACE);
  //   const children: Array<NodeType.Statement> = [];
  //   while (!this.match(TokenType.RBRACE)) {
  //     children.push(this.statement());
  //   }
  //   const body = createNode({type: 'BlockStatement', children});
  //   return createNode({type: 'IfStatement', condition, body});
  // }
}

export default StatementParser;

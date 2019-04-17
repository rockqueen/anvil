import ExpressionParser from './ExpressionParser';
import {TokenType} from './Token';
import Node, * as NodeType from '../AST';

function createNode<T extends Node>(data: T): T {
  return data;
}

class StatementParser extends ExpressionParser {
  public parse() {
    const children: Array<NodeType.Statement> = [];
    while (!this.match(TokenType.EOF)) {
      children.push(this.statement());
    }
    return createNode({type: 'BlockStatement', children});
  }

  private statement(): NodeType.Statement {
    if (this.match(TokenType.LET)) {
      return this.assignStatement();
    }
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
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

  private ifStatement(): NodeType.IfStatement {
    const condition = this.expression() as NodeType.ConditionExpression;
    this.consume(TokenType.LBRACE);
    const children: Array<NodeType.Statement> = [];
    while (!this.match(TokenType.RBRACE)) {
      children.push(this.statement());
    }
    const body = createNode({type: 'BlockStatement', children});
    return createNode({type: 'IfStatement', condition, body});
  }
}

export default StatementParser;

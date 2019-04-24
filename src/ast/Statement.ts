import {Expression, IdentifierExpression} from './Expression';

export abstract class Statement {
  constructor(readonly type: string) {}
}

export class BlockStatement extends Statement {
  constructor(readonly children: Array<Statement>) {
    super('BlockStatement');
  }
}

export class AssignStatement extends Statement {
  constructor(readonly id: IdentifierExpression, readonly value: Expression) {
    super('AssignExpression');
  }
}

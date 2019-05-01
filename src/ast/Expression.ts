export abstract class Expression {
  constructor(readonly type: string) {}
}

export class NumberExpression extends Expression {
  constructor(readonly value: number) {
    super('NumberExpression');
  }
}

export class StringExpression extends Expression {
  constructor(readonly value: string) {
    super('StringExpression');
  }
}

export class BooleanExpression extends Expression {
  constructor(readonly value: boolean) {
    super('BooleanExpression');
  }
}

export class IdentifierExpression extends Expression {
  constructor(readonly value: string) {
    super('IdentifierExpression');
  }
}

export class UnaryExpression extends Expression {
  constructor(readonly operator: string, readonly value: Expression) {
    super('UnaryExpression');
  }
}

export class BinaryExpression extends Expression {
  constructor(
    readonly operator: string,
    readonly left: Expression,
    readonly right: Expression
  ) {
    super('BinaryExpression');
  }
}

export type Node = Identifier | Value | Operator | Expression | Statement;

export type Identifier = {type: 'Identifier'; name: string};

export type Value = NumberValue | StringValue | BooleanValue;
export type NumberValue = {type: 'NumberValue'; value: number};
export type StringValue = {type: 'StringValue'; value: string};
export type BooleanValue = {type: 'BooleanValue'; value: boolean};

export type Operator = UnaryOperator | BinaryOperator;
export type UnaryOperator = '++' | '--';
export type BinaryOperator = '+' | '-' | '*' | '/' | '=';

export type Expression = UnaryExpression | BinaryExpression;
export type UnaryExpression = {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  value: Value | Expression;
};
export type BinaryExpression = {
  type: 'BinaryExpression';
  operator: BinaryOperator;
  left: Value | Expression;
  right: Value | Expression;
};

export type Statement = AssignStatement | BlockStatement;
export type AssignStatement = {
  type: 'AssignStatement';
  id: Identifier;
  value: Value | Expression;
};
export type BlockStatement = {
  type: 'BlockStatement';
  children: Array<Statement>;
};

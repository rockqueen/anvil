export type Node = Expression | Statement;

/**
 * OPERATORS
 */
export type Operator = UnaryOperator | BinaryOperator;
export type UnaryOperator = '-';
export type BinaryOperator = '+' | '-' | '*' | '/' | '=';

/**
 * EXPRESSIONS
 */
export type Expression =
  | NumberExpression
  | StringExpression
  | BooleanExpression
  | IdentifierExpression
  | UnaryExpression
  | BinaryExpression
  | AssignExpression;
export type NumberExpression = {type: 'NumberExpression'; value: number};
export type StringExpression = {type: 'NumberExpression'; value: string};
export type BooleanExpression = {type: 'BooleanExpression'; value: boolean};
export type IdentifierExpression = {type: 'IdentifierExpression'; name: string};
export type UnaryExpression = {
  type: 'UnaryExpression';
  operator: UnaryOperator;
  value: Expression;
};
export type BinaryExpression = {
  type: 'BinaryExpression';
  operator: BinaryOperator;
  left: Expression;
  right: Expression;
};
export type AssignExpression = {
  type: 'AssignExpression';
  id: IdentifierExpression;
  value: Expression;
};

/**
 * STATEMENTS
 */
export type Statement = AssignStatement | BlockStatement | ExpressionStatement;
export type AssignStatement = {
  type: 'AssignStatement';
  id: IdentifierExpression;
  value: Expression | null;
};
export type BlockStatement = {
  type: 'BlockStatement';
  children: Array<Statement>;
};
export type ExpressionStatement = {
  type: 'ExpressionStatement';
  expression: Expression;
};

type Node = Expression | Statement;
export default Node;

/**
 * OPERATORS
 */
export type UnaryOperator = '+' | '-';
export type BinaryOperator = '+' | '-' | '*' | '/' | '=' | '**' | '%' | '//';
export type ConditionalOperator = '<' | '<=' | '>' | '>=' | '==';

/**
 * EXPRESSIONS
 */
export type Expression =
  | NumberExpression
  | StringExpression
  | BooleanExpression
  | NullExpression
  | IdentifierExpression
  | UnaryExpression
  | BinaryExpression
  | ConditionalExpression
  | AssignExpression;
export type NumberExpression = {type: 'NumberExpression'; value: number};
export type StringExpression = {type: 'StringExpression'; value: string};
export type BooleanExpression = {type: 'BooleanExpression'; value: boolean};
export type NullExpression = {type: 'NullExpression'; value: null};
export type IdentifierExpression = {
  type: 'IdentifierExpression';
  value: string;
};
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
export type ConditionalExpression = {
  type: 'ConditionalExpression';
  operator: ConditionalOperator;
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
  value: Expression;
};
export type BlockStatement = {
  type: 'BlockStatement';
  children: Array<Statement>;
};
export type ExpressionStatement = {
  type: 'ExpressionStatement';
  expression: Expression;
};

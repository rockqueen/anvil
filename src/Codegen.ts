import {Tokens} from './parser/Token';
import {
  Expression,
  NumberExpression,
  BooleanExpression,
  StringExpression,
  IdentifierExpression,
  UnaryExpression,
  BinaryExpression,
} from './ast/Expression';
import {Statement, BlockStatement, AssignStatement} from './ast/Statement';
import Commands from './Commands';

export class Codegen {
  private readonly code: Array<number | string | boolean> = [];

  constructor(private readonly ast: Expression | Statement) {}

  public generate() {
    this.compile(this.ast);
    return this.code;
  }

  private command(command: Commands, arg?: number | string | boolean) {
    this.code.push(command);
    if (arg) this.code.push(arg);
  }

  private compile(node: Expression | Statement) {
    if (node instanceof BlockStatement) {
      node.children.forEach(c => this.compile(c));
    } else if (node instanceof AssignStatement) {
      this.compile(node.value);
      this.command(Commands.STORE, node.id.value);
      this.command(Commands.POP);
    } else if (node instanceof IdentifierExpression) {
      this.command(Commands.FETCH, node.value);
    } else if (
      node instanceof NumberExpression ||
      node instanceof StringExpression ||
      node instanceof BooleanExpression
    ) {
      this.command(Commands.PUSH, node.value);
    } else if (node instanceof UnaryExpression) {
      this.compileUnaryExpression(node);
    } else if (node instanceof BinaryExpression) {
      this.compileBinaryExpression(node);
    }
  }

  private compileBinaryExpression(node: BinaryExpression) {
    if (node.operator === Tokens.GT || node.operator === Tokens.GTEQ) {
      this.compile(node.right);
      this.compile(node.left);
    } else {
      this.compile(node.left);
      this.compile(node.right);
    }

    // prettier-ignore
    switch (node.operator) {
      case Tokens.PLUS: this.command(Commands.ADD); break;
      case Tokens.MINUS: this.command(Commands.SUB); break;
      case Tokens.STAR: this.command(Commands.MULT); break;
      case Tokens.SLASH: this.command(Commands.DIV); break;
      case Tokens.PERCENT: this.command(Commands.MOD); break;
      case Tokens.SLASHSLASH: this.command(Commands.IDIV); break;
      case Tokens.POW: this.command(Commands.POW); break;
      case Tokens.LT:
      case Tokens.GT:
        this.command(Commands.LT);
        break;
      case Tokens.LTEQ:
      case Tokens.GTEQ:
      case Tokens.EQEQ:
        this.command(Commands.LTE)
        break
    }
  }

  private compileUnaryExpression(node: UnaryExpression) {
    this.compile(node.value);
    switch (node.operator) {
      case Tokens.MINUS:
        this.command(Commands.SIGN);
        break;
    }
  }
}

export default Codegen;

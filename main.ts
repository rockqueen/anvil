import Lexer from './src/parser/Lexer';
import Parser from './src/parser/Parser';

const tokens = new Lexer(`
  let x = 1 * 2 / (9 - 0)
  let y = 1 * x
  let z = z - -x
`).tokenize();

const ast = new Parser(tokens).parse();

console.log(JSON.stringify(ast, null, 2));

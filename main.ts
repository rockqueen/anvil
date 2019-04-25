import Lexer from './src/parser/Lexer';
import StatementParser from './src/parser/StatementParser';

const tokens = new Lexer(`
  
  if x > 2 {
    let x = 2
  }

`).tokenize();

console.log(tokens);

const ast = new StatementParser(tokens).parse();
console.log(JSON.stringify(ast, null, 2));

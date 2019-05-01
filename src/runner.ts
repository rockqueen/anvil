import program from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import Lexer from './parser/Lexer';
import StatementParser from './parser/StatementParser';

program
  .arguments('<file>')
  .option('-a, --ast', 'show ast')
  .option('-t, --tokens', 'show tokens')
  .description('compile input file')
  .action((file, options) => compileFile(file, cleanArgs(options)))
  .parse(process.argv);

function compileFile(input: string, options: {[c: string]: boolean}) {
  const code = fs.readFileSync(input).toString();
  try {
    const tokens = new Lexer(code).tokenize();
    const ast = new StatementParser(tokens).parse();
    if (options.tokens) {
      console.log(tokens);
    }
    if (options.ast) {
      console.log(JSON.stringify(ast, null, 2));
    }
  } catch (error) {
    console.error(chalk.red('\n' + error + '\n'));
  }
}

function cleanArgs(cmd: any) {
  const args: {[c: string]: boolean} = {};
  cmd.options.forEach((opt: any) => {
    const key = camelize(opt.long.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}

function camelize(str: string) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

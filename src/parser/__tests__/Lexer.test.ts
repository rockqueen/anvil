import {createToken, TokenType} from '../Token';
import Lexer from '../Lexer';

it('always creates EOF token', () => {
  const tokens = new Lexer('').tokenize();
  expect(tokens[0]).toEqual(createToken(TokenType.EOF, null));
});

it('tokenizes string', () => {
  const tokens = new Lexer('"hello"').tokenize();
  expect(tokens[0]).toEqual(createToken(TokenType.STRING, 'hello'));
});

it('tokenizes numbers', () => {
  const decimal = new Lexer('00100.1').tokenize();
  const bin = new Lexer('0b110').tokenize();
  const octal = new Lexer('0o17').tokenize();
  const hex = new Lexer('0xaa').tokenize();

  expect(decimal[0]).toEqual(createToken(TokenType.NUMBER, 100.1));
  expect(bin[0]).toEqual(createToken(TokenType.NUMBER, 6));
  expect(octal[0]).toEqual(createToken(TokenType.NUMBER, 15));
  expect(hex[0]).toEqual(createToken(TokenType.NUMBER, 170));
});

it('tokenizes boolean', () => {
  const tokens = new Lexer('true false').tokenize();
  expect(tokens[0]).toEqual(createToken(TokenType.BOOLEAN, true));
  expect(tokens[1]).toEqual(createToken(TokenType.BOOLEAN, false));
});

it('tokenizes operators', () => {
  const tokens = new Lexer('+= ++').tokenize();
  expect(tokens.length).toEqual(4);
  expect(tokens[0]).toEqual(createToken(TokenType.PLUS, null));
  expect(tokens[1]).toEqual(createToken(TokenType.EQ, null));
  expect(tokens[2]).toEqual(createToken(TokenType.INC, null));
});

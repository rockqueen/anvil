import Token, {TokenType} from '../Token';
import Lexer from '../Lexer';

it('always creates EOF token', () => {
  const tokens = new Lexer('x = 1').tokenize();
  expect(tokens[tokens.length - 1]).toEqual(new Token(TokenType.EOF, null));
});

it('tokenizes string', () => {
  const tokens = new Lexer('"hello"').tokenize();
  expect(tokens[0]).toEqual(new Token(TokenType.STRING, 'hello'));
});

it('tokenizes numbers', () => {
  const decimal = new Lexer('0100').tokenize();
  expect(decimal[0]).toEqual(new Token(TokenType.NUMBER, 100));
  const hex = new Lexer('0xaa').tokenize();
  expect(hex[0]).toEqual(new Token(TokenType.NUMBER, 170));
});

it('tokenizes operators', () => {
  const tokens = new Lexer('+=').tokenize();
  expect(tokens.length).toEqual(3);
  expect(tokens[0]).toEqual(new Token(TokenType.PLUS, null));
  expect(tokens[1]).toEqual(new Token(TokenType.EQ, null));
});

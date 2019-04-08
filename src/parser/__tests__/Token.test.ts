import Token, {TokenType} from '../Token';

it('creates instance and has public interface', () => {
  const token = new Token(TokenType.NUMBER, 1);
  expect(token.getType()).toEqual(TokenType.NUMBER);
  expect(token.getValue()).toEqual(1);
});

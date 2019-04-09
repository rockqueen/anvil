import {createToken, TokenType} from '../Token';

it('creates instance and has public interface', () => {
  const token = createToken(TokenType.NUMBER, 1);
  expect(token.type).toEqual(TokenType.NUMBER);
  expect(token.value).toEqual(1);
});

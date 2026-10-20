import { describe, expect, it } from '@jest/globals';
import { validateEmail, validatePassword } from './validation';

describe('validatePassword', () => {
  it('принимает корректный пароль', () => {
    expect(validatePassword('Secure@!')).toBeNull();
  });
  it('требует минимум 6 символов', () => {
    expect(validatePassword('A@!')).toMatch(/не менее 6/);
  });
  it('требует минимум 2 спецсимвола', () => {
    expect(validatePassword('Secure@1')).toMatch(/2 спецсимволов/);
  });
  it('требует заглавную букву', () => {
    expect(validatePassword('secure@!')).toMatch(/заглавную/);
  });
});

describe('validateEmail', () => {
  it('проверяет формат', () => {
    expect(validateEmail('user@example.com')).toBeNull();
    expect(validateEmail('user@')).toMatch(/корректный/);
  });
});

// sum.test.js
import { expect, test } from 'vitest';
import stringCleaner from '../libs/stringCleaner';



test('Check Links Validity', () => {
    expect(stringCleaner.isValidURL("http://ciao.com/jajaj")).toBe(true);
    expect(stringCleaner.isValidURL("https://en.wikipedia.org/wiki/The_Legend_of_Zelda:_The_Minish_Cap")).toBe(true);
});
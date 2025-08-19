import { StringFormattingPipe } from './string-formatting.pipe';

describe('StringFormattingPipe', () => {
  it('create an instance', () => {
    const pipe = new StringFormattingPipe();
    expect(pipe).toBeTruthy();
  });
});

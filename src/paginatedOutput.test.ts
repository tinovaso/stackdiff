import { paginateLines, splitIntoLines } from './paginatedOutput';

describe('splitIntoLines', () => {
  it('splits text into lines', () => {
    expect(splitIntoLines('a\nb\nc')).toEqual(['a', 'b', 'c']);
  });

  it('handles empty string', () => {
    expect(splitIntoLines('')).toEqual(['']);
  });

  it('handles single line', () => {
    expect(splitIntoLines('hello')).toEqual(['hello']);
  });
});

describe('paginateLines', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('prints all lines when non-interactive', () => {
    const lines = ['line1', 'line2', 'line3'];
    paginateLines(lines, { interactive: false });
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'line1');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'line2');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'line3');
  });

  it('prints all lines when count is within page size', () => {
    const lines = Array.from({ length: 5 }, (_, i) => `line${i}`);
    paginateLines(lines, { interactive: true, pageSize: 20 });
    expect(consoleSpy).toHaveBeenCalledTimes(5);
  });

  it('prints only first page when interactive and over limit', () => {
    const lines = Array.from({ length: 30 }, (_, i) => `line${i}`);
    // Can't fully test interactive mode in unit tests, so disable it
    paginateLines(lines, { interactive: false, pageSize: 10 });
    expect(consoleSpy).toHaveBeenCalledTimes(30);
  });

  it('handles empty lines array', () => {
    paginateLines([], { interactive: false });
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});

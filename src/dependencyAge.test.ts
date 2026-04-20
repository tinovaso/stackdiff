import { ageInDays, resolveDependencyAge, fetchPublishDate } from './dependencyAge';
import { DiffEntry } from './diffEngine';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

beforeEach(() => {
  mockFetch.mockReset();
});

describe('ageInDays', () => {
  it('returns null for null input', () => {
    expect(ageInDays(null)).toBeNull();
  });

  it('returns a non-negative number for a past date', () => {
    const past = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const result = ageInDays(past);
    expect(result).toBeGreaterThanOrEqual(9);
  });
});

describe('fetchPublishDate', () => {
  it('returns null when fetch fails', async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const result = await fetchPublishDate('lodash', '4.0.0');
    expect(result).toBeNull();
  });

  it('returns a Date when time field is present', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ time: { '4.0.0': '2021-01-15T00:00:00.000Z' } }),
    });
    const result = await fetchPublishDate('lodash', '4.0.0');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2021);
  });

  it('returns null when version not in time map', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ time: {} }),
    });
    const result = await fetchPublishDate('lodash', '4.0.0');
    expect(result).toBeNull();
  });
});

describe('resolveDependencyAge', () => {
  it('resolves age info for an updated entry', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ time: { '3.0.0': '2019-06-01T00:00:00.000Z' } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ time: { '4.0.0': '2021-01-15T00:00:00.000Z' } }),
      });

    const entry: DiffEntry = { name: 'lodash', from: '3.0.0', to: '4.0.0', type: 'changed' };
    const result = await resolveDependencyAge(entry);

    expect(result.name).toBe('lodash');
    expect(result.fromAge?.version).toBe('3.0.0');
    expect(result.toAge?.version).toBe('4.0.0');
    expect(result.ageDeltaDays).not.toBeNull();
    expect(result.ageDeltaDays).toBeGreaterThan(0);
  });

  it('handles added entry with no from version', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ time: { '1.0.0': '2022-03-10T00:00:00.000Z' } }),
    });
    const entry: DiffEntry = { name: 'newpkg', from: null, to: '1.0.0', type: 'added' };
    const result = await resolveDependencyAge(entry);
    expect(result.fromAge).toBeNull();
    expect(result.toAge?.version).toBe('1.0.0');
    expect(result.ageDeltaDays).toBeNull();
  });
});

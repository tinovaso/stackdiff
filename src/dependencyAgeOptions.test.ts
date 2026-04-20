import {
  parseDependencyAgeOptions,
  filterByAge,
  DEFAULT_REGISTRY,
} from './dependencyAgeOptions';

describe('parseDependencyAgeOptions', () => {
  it('returns defaults when no age flags are provided', () => {
    const opts = parseDependencyAgeOptions([]);
    expect(opts.enabled).toBe(false);
    expect(opts.registryUrl).toBe(DEFAULT_REGISTRY);
    expect(opts.minAgeDays).toBeNull();
    expect(opts.maxAgeDays).toBeNull();
  });

  it('enables age when --age flag is present', () => {
    const opts = parseDependencyAgeOptions(['--age']);
    expect(opts.enabled).toBe(true);
  });

  it('parses custom registry URL', () => {
    const opts = parseDependencyAgeOptions(['--registry', 'https://my-registry.example.com']);
    expect(opts.registryUrl).toBe('https://my-registry.example.com');
  });

  it('parses --min-age', () => {
    const opts = parseDependencyAgeOptions(['--min-age', '30']);
    expect(opts.minAgeDays).toBe(30);
  });

  it('parses --max-age', () => {
    const opts = parseDependencyAgeOptions(['--max-age', '365']);
    expect(opts.maxAgeDays).toBe(365);
  });
});

describe('filterByAge', () => {
  const makeResult = (age: number | null) => ({
    ageDeltaDays: null,
    toAge: age !== null ? { ageInDays: age } : null,
  });

  it('passes all results when no min/max set', () => {
    const opts = parseDependencyAgeOptions([]);
    const results = [makeResult(10), makeResult(200), makeResult(null)];
    expect(filterByAge(results, opts)).toHaveLength(3);
  });

  it('filters by minAgeDays', () => {
    const opts = parseDependencyAgeOptions(['--min-age', '50']);
    const results = [makeResult(10), makeResult(100), makeResult(200)];
    const filtered = filterByAge(results, opts);
    expect(filtered).toHaveLength(2);
  });

  it('filters by maxAgeDays', () => {
    const opts = parseDependencyAgeOptions(['--max-age', '100']);
    const results = [makeResult(50), makeResult(100), makeResult(200)];
    const filtered = filterByAge(results, opts);
    expect(filtered).toHaveLength(2);
  });

  it('excludes entries with null age when min-age is set', () => {
    const opts = parseDependencyAgeOptions(['--min-age', '1']);
    const results = [makeResult(null), makeResult(10)];
    expect(filterByAge(results, opts)).toHaveLength(1);
  });
});

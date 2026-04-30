import {
  parsePublishDate,
  daysBetween,
  detectPublishDates,
  PublishDateReport,
} from './packagePublishDateDetector';
import { formatPublishDateReport } from './packagePublishDateFormatter';

const makePkg = (deps: Record<string, string> = {}) => ({
  name: 'test',
  version: '1.0.0',
  dependencies: deps,
});

describe('parsePublishDate', () => {
  it('extracts date from time map', () => {
    const meta = { version: '1.2.3', time: { '1.2.3': '2023-06-01T00:00:00Z' } };
    expect(parsePublishDate(meta)).toBe('2023-06-01T00:00:00Z');
  });

  it('extracts from publishedAt field', () => {
    const meta = { publishedAt: '2022-01-15T00:00:00Z' };
    expect(parsePublishDate(meta)).toBe('2022-01-15T00:00:00Z');
  });

  it('returns null when no date found', () => {
    expect(parsePublishDate({})).toBeNull();
  });
});

describe('daysBetween', () => {
  it('returns positive when B is newer', () => {
    expect(daysBetween('2023-01-01', '2023-01-11')).toBe(10);
  });

  it('returns negative when B is older', () => {
    expect(daysBetween('2023-01-11', '2023-01-01')).toBe(-10);
  });

  it('returns zero for same date', () => {
    expect(daysBetween('2023-05-01', '2023-05-01')).toBe(0);
  });
});

describe('detectPublishDates', () => {
  it('builds report with delta', () => {
    const pkgA = makePkg({ react: '^17.0.0' });
    const pkgB = makePkg({ react: '^18.0.0' });
    const metaMap = {
      react: {
        a: { version: '17.0.0', time: { '17.0.0': '2021-06-08T00:00:00Z' } },
        b: { version: '18.0.0', time: { '18.0.0': '2022-03-29T00:00:00Z' } },
      },
    };
    const report = detectPublishDates(pkgA, pkgB, metaMap);
    expect(report.totalCompared).toBe(1);
    expect(report.entries[0].name).toBe('react');
    expect(report.entries[0].daysDelta).toBeGreaterThan(0);
  });

  it('handles missing meta gracefully', () => {
    const pkgA = makePkg({ lodash: '^4.0.0' });
    const pkgB = makePkg({ lodash: '^4.17.0' });
    const report = detectPublishDates(pkgA, pkgB, {});
    expect(report.entries[0].daysDelta).toBeNull();
  });
});

describe('formatPublishDateReport', () => {
  const report: PublishDateReport = {
    totalCompared: 1,
    entries: [{
      name: 'express',
      sideA: '^4.0.0',
      sideB: '^5.0.0',
      publishedAtA: '2020-01-01T00:00:00Z',
      publishedAtB: '2021-01-01T00:00:00Z',
      daysDelta: 366,
    }],
  };

  it('formats as text', () => {
    const out = formatPublishDateReport(report, 'text');
    expect(out).toContain('express');
    expect(out).toContain('+366d newer');
  });

  it('formats as markdown', () => {
    const out = formatPublishDateReport(report, 'markdown');
    expect(out).toContain('| express |');
    expect(out).toContain('+366d newer');
  });

  it('handles empty report', () => {
    const empty: PublishDateReport = { entries: [], totalCompared: 0 };
    expect(formatPublishDateReport(empty)).toContain('No publish date');
  });
});

import {
  buildChangelogEntries,
  exportChangelog,
  formatChangelogAsMarkdown,
} from './changelogExport';
import { DiffResult } from './diffEngine';

const mockDiff: DiffResult[] = [
  {
    name: 'react',
    type: 'changed',
    versionA: '17.0.0',
    versionB: '18.0.0',
    versionChange: 'upgrade',
    semverGroup: 'major',
  },
  {
    name: 'lodash',
    type: 'removed',
    versionA: '4.17.21',
    versionB: undefined,
    versionChange: undefined,
    semverGroup: 'none',
  },
  {
    name: 'axios',
    type: 'added',
    versionA: undefined,
    versionB: '1.4.0',
    versionChange: undefined,
    semverGroup: 'none',
  },
  {
    name: 'express',
    type: 'changed',
    versionA: '5.0.0',
    versionB: '4.18.0',
    versionChange: 'downgrade',
    semverGroup: 'major',
  },
];

describe('buildChangelogEntries', () => {
  it('maps upgraded packages correctly', () => {
    const entries = buildChangelogEntries([mockDiff[0]]);
    expect(entries[0].changeType).toBe('upgraded');
    expect(entries[0].from).toBe('17.0.0');
    expect(entries[0].to).toBe('18.0.0');
  });

  it('maps removed packages correctly', () => {
    const entries = buildChangelogEntries([mockDiff[1]]);
    expect(entries[0].changeType).toBe('removed');
    expect(entries[0].to).toBeNull();
  });

  it('maps added packages correctly', () => {
    const entries = buildChangelogEntries([mockDiff[2]]);
    expect(entries[0].changeType).toBe('added');
    expect(entries[0].from).toBeNull();
  });

  it('maps downgraded packages correctly', () => {
    const entries = buildChangelogEntries([mockDiff[3]]);
    expect(entries[0].changeType).toBe('downgraded');
  });
});

describe('exportChangelog', () => {
  it('returns valid JSON when format is json', () => {
    const output = exportChangelog(mockDiff, 'json');
    const parsed = JSON.parse(output);
    expect(parsed.totalChanges).toBe(4);
    expect(Array.isArray(parsed.entries)).toBe(true);
  });

  it('returns markdown table when format is markdown', () => {
    const output = exportChangelog(mockDiff, 'markdown');
    expect(output).toContain('# Dependency Changelog');
    expect(output).toContain('| react |');
    expect(output).toContain('| lodash |');
  });

  it('defaults to markdown format', () => {
    const output = exportChangelog(mockDiff);
    expect(output).toContain('# Dependency Changelog');
  });
});

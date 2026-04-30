import {
  formatEntryAsText,
  formatEntryAsMarkdown,
  formatProvenanceReportAsText,
  formatProvenanceReportAsMarkdown,
  formatProvenanceReport,
} from './packageProvenanceFormatter';
import { ProvenanceEntry, ProvenanceReport } from './packageProvenance';

const entry: ProvenanceEntry = {
  name: 'mylib',
  version: 'github:org/mylib',
  source: 'github',
  raw: 'github:org/mylib',
  side: 'b',
};

const emptyReport: ProvenanceReport = {
  entries: [],
  summary: { npm: 0, github: 0, local: 0, git: 0, unknown: 0 },
};

const report: ProvenanceReport = {
  entries: [entry],
  summary: { npm: 0, github: 1, local: 0, git: 0, unknown: 0 },
};

describe('formatEntryAsText', () => {
  it('includes package name and source label', () => {
    const line = formatEntryAsText(entry);
    expect(line).toContain('mylib');
    expect(line).toContain('GitHub');
    expect(line).toContain('[B only]');
  });
});

describe('formatEntryAsMarkdown', () => {
  it('formats as markdown table row', () => {
    const row = formatEntryAsMarkdown(entry);
    expect(row).toContain('| `mylib`');
    expect(row).toContain('GitHub');
    expect(row).toContain('[B only]');
  });
});

describe('formatProvenanceReportAsText', () => {
  it('returns no-sources message for empty report', () => {
    const out = formatProvenanceReportAsText(emptyReport);
    expect(out).toContain('No non-npm provenance');
  });

  it('includes header and summary for non-empty report', () => {
    const out = formatProvenanceReportAsText(report);
    expect(out).toContain('Non-npm Dependency Sources');
    expect(out).toContain('GitHub: 1');
  });
});

describe('formatProvenanceReportAsMarkdown', () => {
  it('returns italic message for empty report', () => {
    const out = formatProvenanceReportAsMarkdown(emptyReport);
    expect(out).toContain('_No non-npm');
  });

  it('renders markdown table with header row', () => {
    const out = formatProvenanceReportAsMarkdown(report);
    expect(out).toContain('## Non-npm Dependency Sources');
    expect(out).toContain('| Package |');
    expect(out).toContain('`mylib`');
  });
});

describe('formatProvenanceReport', () => {
  it('defaults to text format', () => {
    expect(formatProvenanceReport(report)).toContain('Non-npm Dependency Sources');
  });

  it('uses markdown format when specified', () => {
    expect(formatProvenanceReport(report, 'markdown')).toContain('##');
  });
});

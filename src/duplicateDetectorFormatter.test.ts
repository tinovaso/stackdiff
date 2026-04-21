import {
  formatDuplicateReportAsText,
  formatDuplicateReportAsMarkdown,
} from './duplicateDetectorFormatter';
import { DuplicateReport } from './duplicateDetector';

const reportWithConflicts: DuplicateReport = {
  totalPackages: 4,
  duplicateCount: 2,
  duplicates: [
    { name: 'axios', versions: ['0.21.1', '1.4.0'], sources: ['package-a', 'package-b'] },
    { name: 'react', versions: ['17.0.2', '18.2.0'], sources: ['package-a', 'package-b'] },
  ],
};

const emptyReport: DuplicateReport = {
  totalPackages: 3,
  duplicateCount: 0,
  duplicates: [],
};

describe('formatDuplicateReportAsText', () => {
  it('includes header and counts', () => {
    const output = formatDuplicateReportAsText(reportWithConflicts);
    expect(output).toContain('Duplicate Detection Report');
    expect(output).toContain('Total packages: 4');
    expect(output).toContain('Packages with version conflicts: 2');
  });

  it('lists each conflict', () => {
    const output = formatDuplicateReportAsText(reportWithConflicts);
    expect(output).toContain('axios');
    expect(output).toContain('react');
  });

  it('shows no conflicts message when empty', () => {
    const output = formatDuplicateReportAsText(emptyReport);
    expect(output).toContain('No version conflicts found.');
  });
});

describe('formatDuplicateReportAsMarkdown', () => {
  it('includes markdown heading', () => {
    const output = formatDuplicateReportAsMarkdown(reportWithConflicts);
    expect(output).toContain('## Duplicate Detection Report');
  });

  it('renders a markdown table with conflicts', () => {
    const output = formatDuplicateReportAsMarkdown(reportWithConflicts);
    expect(output).toContain('| Package |');
    expect(output).toContain('| axios |');
    expect(output).toContain('| react |');
  });

  it('omits table when no conflicts', () => {
    const output = formatDuplicateReportAsMarkdown(emptyReport);
    expect(output).not.toContain('| Package |');
  });

  it('includes version conflict count', () => {
    const output = formatDuplicateReportAsMarkdown(reportWithConflicts);
    expect(output).toContain('**Version conflicts:** 2');
  });
});

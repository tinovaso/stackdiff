import { checkPeerDependencies, PeerDependencyReport } from './peerDependencyChecker';

describe('checkPeerDependencies', () => {
  const resolved = {
    react: '18.2.0',
    'react-dom': '18.2.0',
    typescript: '4.9.5',
  };

  it('marks satisfied peer deps correctly', () => {
    const report = checkPeerDependencies({ react: '^18.0.0' }, resolved);
    expect(report.totalSatisfied).toBe(1);
    expect(report.totalMissing).toBe(0);
    expect(report.totalIncompatible).toBe(0);
    expect(report.issues[0].status).toBe('satisfied');
  });

  it('marks missing peer deps', () => {
    const report = checkPeerDependencies({ lodash: '^4.0.0' }, resolved);
    expect(report.totalMissing).toBe(1);
    expect(report.issues[0].status).toBe('missing');
    expect(report.issues[0].resolvedVersion).toBeNull();
  });

  it('marks incompatible peer deps', () => {
    const report = checkPeerDependencies({ typescript: '^5.0.0' }, resolved);
    expect(report.totalIncompatible).toBe(1);
    expect(report.issues[0].status).toBe('incompatible');
  });

  it('handles exact version match', () => {
    const report = checkPeerDependencies({ react: '18.2.0' }, resolved);
    expect(report.issues[0].status).toBe('satisfied');
  });

  it('handles tilde range', () => {
    const report = checkPeerDependencies({ typescript: '~4.9.0' }, resolved);
    expect(report.issues[0].status).toBe('satisfied');
  });

  it('handles >= range', () => {
    const report = checkPeerDependencies({ react: '>=17.0.0' }, resolved);
    expect(report.issues[0].status).toBe('satisfied');
  });

  it('returns empty report for no peer deps', () => {
    const report = checkPeerDependencies({}, resolved);
    expect(report.issues).toHaveLength(0);
    expect(report.totalSatisfied).toBe(0);
  });

  it('handles multiple peer deps with mixed statuses', () => {
    const report = checkPeerDependencies(
      { react: '^18.0.0', lodash: '^4.0.0', typescript: '^5.0.0' },
      resolved
    );
    expect(report.totalSatisfied).toBe(1);
    expect(report.totalMissing).toBe(1);
    expect(report.totalIncompatible).toBe(1);
  });
});

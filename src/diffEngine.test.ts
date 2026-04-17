import { diffDependencies, DiffResult } from './diffEngine';
import { FlatDependencies } from './packageParser';

describe('diffDependencies', () => {
  const depsA: FlatDependencies = {
    react: '17.0.2',
    lodash: '4.17.21',
    axios: '0.21.1',
  };

  const depsB: FlatDependencies = {
    react: '18.2.0',
    lodash: '4.17.21',
    express: '4.18.2',
  };

  let result: DiffResult;

  beforeEach(() => {
    result = diffDependencies(depsA, depsB);
  });

  it('detects added packages', () => {
    expect(result.added).toHaveLength(1);
    expect(result.added[0]).toMatchObject({ name: 'express', status: 'added', versionB: '4.18.2' });
  });

  it('detects removed packages', () => {
    expect(result.removed).toHaveLength(1);
    expect(result.removed[0]).toMatchObject({ name: 'axios', status: 'removed', versionA: '0.21.1' });
  });

  it('detects upgraded packages', () => {
    expect(result.upgraded).toHaveLength(1);
    expect(result.upgraded[0]).toMatchObject({ name: 'react', status: 'upgraded', versionA: '17.0.2', versionB: '18.2.0' });
  });

  it('detects unchanged packages', () => {
    expect(result.unchanged).toHaveLength(1);
    expect(result.unchanged[0]).toMatchObject({ name: 'lodash', status: 'unchanged' });
  });

  it('detects downgraded packages', () => {
    const r = diffDependencies({ pkg: '2.0.0' }, { pkg: '1.0.0' });
    expect(r.downgraded).toHaveLength(1);
    expect(r.downgraded[0].status).toBe('downgraded');
  });

  it('handles empty dependency trees', () => {
    const r = diffDependencies({}, {});
    expect(r.added).toHaveLength(0);
    expect(r.removed).toHaveLength(0);
    expect(r.unchanged).toHaveLength(0);
  });
});

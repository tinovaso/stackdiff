import { DiffResult, DependencyDiff } from './diffEngine';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function colorize(color: keyof typeof COLORS, text: string): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function formatLine(dep: DependencyDiff): string {
  const { name, status, versionA, versionB } = dep;
  switch (status) {
    case 'added':
      return colorize('green', `  + ${name} ${versionB}`);
    case 'removed':
      return colorize('red', `  - ${name} ${versionA}`);
    case 'upgraded':
      return colorize('cyan', `  ↑ ${name} ${versionA} → ${versionB}`);
    case 'downgraded':
      return colorize('yellow', `  ↓ ${name} ${versionA} → ${versionB}`);
    case 'unchanged':
      return colorize('dim', `  = ${name} ${versionA}`);
  }
}

export function printReport(result: DiffResult, showUnchanged = false): void {
  const sections: Array<{ label: string; items: DependencyDiff[] }> = [
    { label: 'Added', items: result.added },
    { label: 'Removed', items: result.removed },
    { label: 'Upgraded', items: result.upgraded },
    { label: 'Downgraded', items: result.downgraded },
  ];

  if (showUnchanged) {
    sections.push({ label: 'Unchanged', items: result.unchanged });
  }

  let hasOutput = false;
  for (const { label, items } of sections) {
    if (items.length === 0) continue;
    console.log(`\n${label} (${items.length}):`);
    items.forEach((dep) => console.log(formatLine(dep)));
    hasOutput = true;
  }

  if (!hasOutput) {
    console.log('No differences found.');
  }

  const total = result.added.length + result.removed.length +
    result.upgraded.length + result.downgraded.length;
  console.log(`\nSummary: ${total} change(s) detected.`);
}

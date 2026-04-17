#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { parsePackageJson, flattenDependencies } from './packageParser';
import { diffDependencies } from './diffEngine';
import { printReport } from './reporter';

function usage(): void {
  console.error('Usage: stackdiff <package-a.json> <package-b.json> [options]');
  console.error('');
  console.error('Options:');
  console.error('  --no-dev       Exclude devDependencies');
  console.error('  --json         Output raw JSON diff');
  console.error('  --help         Show this help message');
  process.exit(1);
}

function readPackageFile(filePath: string): object {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Error: File not found: ${resolved}`);
    process.exit(1);
  }
  try {
    const raw = fs.readFileSync(resolved, 'utf-8');
    return JSON.parse(raw);
  } catch {
    console.error(`Error: Failed to parse JSON in ${resolved}`);
    process.exit(1);
  }
}

export function run(argv: string[]): void {
  const args = argv.slice(2);

  if (args.includes('--help') || args.length === 0) {
    usage();
  }

  const flags = args.filter(a => a.startsWith('--'));
  const files = args.filter(a => !a.startsWith('--'));

  if (files.length < 2) {
    console.error('Error: Two package.json files are required.');
    usage();
  }

  const includeDev = !flags.includes('--no-dev');
  const jsonOutput = flags.includes('--json');

  const rawA = readPackageFile(files[0]);
  const rawB = readPackageFile(files[1]);

  const pkgA = parsePackageJson(rawA, includeDev);
  const pkgB = parsePackageJson(rawB, includeDev);

  const flatA = flattenDependencies(pkgA);
  const flatB = flattenDependencies(pkgB);

  const diff = diffDependencies(flatA, flatB);

  if (jsonOutput) {
    console.log(JSON.stringify(diff, null, 2));
  } else {
    printReport(diff, files[0], files[1]);
  }
}

run(process.argv);

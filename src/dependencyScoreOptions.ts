export interface DependencyScoreOptions {
  showAll: boolean;
  minScore: number;
  gradeOnly: boolean;
}

const DEFAULT_OPTIONS: DependencyScoreOptions = {
  showAll: false,
  minScore: 0,
  gradeOnly: false,
};

export function parseDependencyScoreOptions(
  args: Record<string, string | boolean | undefined>
): DependencyScoreOptions {
  const options: DependencyScoreOptions = { ...DEFAULT_OPTIONS };

  if (args['--score-show-all'] === true) {
    options.showAll = true;
  }

  if (typeof args['--score-min'] === 'string') {
    const val = parseInt(args['--score-min'], 10);
    if (!isNaN(val) && val >= 0) {
      options.minScore = val;
    } else {
      throw new Error(`Invalid --score-min value: ${args['--score-min']}`);
    }
  }

  if (args['--score-grade-only'] === true) {
    options.gradeOnly = true;
  }

  return options;
}

export const dependencyScoreHelp = `
Dependency Score Options:
  --score-show-all       Include unchanged dependencies in score report
  --score-min <n>        Only show packages with score >= n
  --score-grade-only     Print only the overall grade letter
`.trim();

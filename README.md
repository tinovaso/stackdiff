# stackdiff

CLI tool to compare and visualize differences between two npm package dependency trees.

## Installation

```bash
npm install -g stackdiff
```

## Usage

```bash
stackdiff <package-a> <package-b>
```

**Example:**

```bash
stackdiff react@17 react@18
```

This will output a visual diff of the dependency trees, highlighting added, removed, and changed packages between the two versions.

### Options

| Flag | Description |
|------|-------------|
| `--depth <n>` | Limit tree depth (default: unlimited) |
| `--json` | Output results as JSON |
| `--no-color` | Disable colored output |
| `--ignore <pkg>` | Ignore a package by name (repeatable) |

**Example output:**

```
+ added:   scheduler@0.23.0
~ changed: loose-envify 1.4.0 → 1.5.0
- removed: object-assign@4.1.1
```

**JSON output example (`--json`):**

```json
{
  "added": ["scheduler@0.23.0"],
  "changed": [{ "name": "loose-envify", "from": "1.4.0", "to": "1.5.0" }],
  "removed": ["object-assign@4.1.1"]
}
```

## Requirements

- Node.js >= 14
- npm >= 6

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

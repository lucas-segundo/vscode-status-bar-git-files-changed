# Git PR size (status bar)

VS Code / Cursor extension that shows how many files differ between your current branch and a **base branch** using `git diff <base>...HEAD` (three-dot diff). The status bar uses a green (≤ yellow threshold) / yellow (between thresholds) / red (above red threshold) indicator. Clicking the item opens **Source Control**.

## Settings

| Id | Default | Description |
| --- | --- | --- |
| `prSizeStatusBar.yellowThreshold` | `20` | Above this count (and ≤ red), yellow. |
| `prSizeStatusBar.redThreshold` | `30` | Above this count, red. |
| `prSizeStatusBar.baseBranch` | `main` | Base branch for the diff. |

## Requirements

- Workspace with at least one folder open
- Git repository; base branch must exist locally for a numeric count (otherwise the bar shows *`<branch> not found`*)
- Built-in **Git** extension (`vscode.git`) for timely refresh when repository state changes

## Development

1. `npm install`
2. **Run → Start Debugging** (or **Run Extension**): compiles with the default build task and opens an Extension Development Host.
3. `npm run compile` — one-off TypeScript build.
4. Package: install [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce) and run `vsce package` (or `npm run package` if `vsce` is on your `PATH`).

## Publishing

Create a [publisher](https://marketplace.visualstudio.com/manage), set `"publisher"` in `package.json` to match, then `vsce login` and `vsce publish`. Adjust `repository.url` if your remote differs.

## What gets measured

In the first workspace root:

```bash
git diff --name-only <baseBranch>...HEAD
```

Line count = number of changed paths (three-dot diff vs the base branch), not every unsaved edit.

## License

MIT License.

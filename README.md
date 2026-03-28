# Branch Size Monitor

VS Code extension that shows how many files differ between your current branch and a **base branch** in your status bar. Config the thresholds to use a green (≤ yellow threshold) / yellow (between thresholds) / red (above red threshold) indicator based on the number of files changed. Clicking the item opens **Source Control**.

## Requirements

- Git repository; base branch must exist locally for a numeric count (otherwise the bar shows *`<branch> not found`*)
- Built-in **Git** extension (`vscode.git`) for timely refresh when repository state changes

## Development

1. `pnpm install`
2. **Run → Start Debugging** (or **Run Extension**): compiles with the default build task and opens an Extension Development Host.
3. `pnpm run compile` — one-off TypeScript build.
4. Package: install [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce) and run `vsce package` (or `pnpm run package` if `vsce` is on your `PATH`).

## License

MIT License.

# Branch Size Monitor

See at a glance how many files differ between your **current branch** and a **base branch** (for example `main`)—right in the status bar. Handy for keeping pull requests and branch scope easy to spot while you work and make it smaller.

## Features

- **Live count** of files changed versus the base branch using Git’s three-dot diff (`base...HEAD`), so it reflects what would be unique to your branch.
- **Color-style indicator** in the bar: green when the count is within your “comfort” range, yellow is the warning zone, red is the danger zone. Thresholds are configurable, but choose wisely.
- **Click the status item** to open **Source Control**.
- **Updates when Git state changes**, using the built-in Git extension’s repository events.
- **Workspace-aware**: uses the first workspace folder as the Git working directory.

## Screenshots

### Green indicator
<img width="753" height="471" alt="Green indicator" src="https://github.com/user-attachments/assets/47785146-4fc5-465e-83b2-581cede16c23" />

### Yellow indicator
<img width="753" height="471" alt="Yellow indicator" src="https://github.com/user-attachments/assets/c9174423-300d-45a7-82d4-8581f6da4785" />

### Red indicator
<img width="753" height="471" alt="Red indicator" src="https://github.com/user-attachments/assets/3b03877a-13ae-4ecb-a295-179fdd3870c3" />

## Getting started

1. Open a **folder** that contains a Git repository (not only loose files).
2. Ensure your **base branch** exists locally (for example `main` or `develop`), or fetch it—otherwise the status text shows that the base was not found.
3. Optional: open **Settings** and search for **Branch Size Monitor** to change the base branch and thresholds.

## Requirements

- A **Git** repository in the opened workspace.
- The built-in **Git** extension (`vscode.git`) enabled, for timely refresh when the repository changes.

## Development

Go to the (repository)[https://github.com/lucassegundo/vscode-status-bar-git-files-changed] and clone it to your local machine.

1. Install dependencies: `pnpm install`
2. **Run → Start Debugging** (or **Run Extension**): Go to Run and Start Debugging, and run the extension in watch mode. The extension will be built and launched in a new VS Code window to be used for testing.

## License

MIT License.

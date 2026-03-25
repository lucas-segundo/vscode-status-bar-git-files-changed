# PR size status bar (VS Code / Cursor)

Shows how many files differ between your current branch and **`main`** using `git diff main...HEAD`, with a green (≤ 20 files changed) / yellow (21–30 files changed) / red indicator (> 30 files changes) in the status bar. Customize the default values for showing the indicator in `pr-size-statusbar.js`.

Requires the **[statusbar-commands](https://marketplace.visualstudio.com/items?itemName=anweber.statusbar-commands)** extension (`anweber.statusbar-commands`).

## Screenshots

### Green indicator
<img width="1505" height="941" alt="Screenshot 2026-03-25 at 09 43 52" src="https://github.com/user-attachments/assets/47785146-4fc5-465e-83b2-581cede16c23" />

### Yellow indicator
<img width="1508" height="947" alt="Screenshot 2026-03-25 at 09 52 48" src="https://github.com/user-attachments/assets/c9174423-300d-45a7-82d4-8581f6da4785" />

### Red indicator
<img width="1507" height="947" alt="Screenshot 2026-03-25 at 09 46 13" src="https://github.com/user-attachments/assets/3b03877a-13ae-4ecb-a295-179fdd3870c3" />

## Requirements

- VS Code or Cursor
- Extension: **statusbar-commands** (`anweber.statusbar-commands`)
- Built-in Git extension (`vscode.git`) for optional Git-driven refresh events
- Local branch **`main`** (or change the git command in `pr-size-statusbar.js`)
- Workspace with at least one folder open (scripts use `workspaceFolders[0]`)
- Trusted workspace if your editor requires it for extension script execution

## Files in this bundle

| File                              | Purpose                                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `pr-size-statusbar.js`            | Runs `git diff --name-only main...HEAD \| wc -l` and sets `statusBarItem.text`.                         |
| `pr-size-statusbar-git-events.js` | Supplies Git-related `scriptEvents` subscribers for statusbar-commands (see below).                     |
| `settings.json` (fragment)        | Registers the status bar item, `scriptEvents`, and the inline `script` that `require`s the files above. |

For a **standalone repository**, copy these files into `.vscode/` at the project root and merge the `statusbar_command.commands` entry into your workspace `settings.json` (or keep a dedicated `settings.json` if this repo is only the snippet).

## Install in another project

1. Install **statusbar-commands**.
2. Copy `pr-size-statusbar.js` and `pr-size-statusbar-git-events.js` into **`.vscode/`**.
3. Add the `statusbar_command.commands` block from `settings.json` into your workspace settings. Adjust or remove unrelated keys (formatters, etc.) if you only want the status bar.
4. Reload the window if needed.

## What gets measured

The script runs (in the first workspace folder):

```bash
git diff --name-only main...HEAD 2>/dev/null | wc -l
```

That is the **three-dot** diff vs `main` (commits on your branch relative to `main`), not “every unsaved buffer change.”

## When the label refreshes

From `settings.json` `scriptEvents`:

- **`vscode.window.onDidChangeWindowState`** — e.g. after git in the terminal, when you focus the editor again.
- **`vscode.workspace.onDidChangeWorkspaceFolders`** — workspace roots change.
- **`onDidOpenRepository`** / **`onDidChangeRepositoryState`** — loaded from `pr-size-statusbar-git-events.js` (see next section).

Clicking the item runs **`workbench.view.scm`** (Source Control). Change `command` in settings to use another command.

## Git events module (`pr-size-statusbar-git-events.js`)

`main()` resolves the Git extension API and `repositories[0]`.

- If **both** the Git API and **`repositories[0]`** exist, the exported subscribers are the real **`onDidOpenRepository`** and **`repo.state.onDidChange`**.
- Otherwise **both** exports are **no-op** subscribers so statusbar-commands can still register without throwing.

The module is evaluated once on first `require`; if Git was not ready yet, reload the window.

## Thresholds and errors

- On failure (e.g. no `main`), the bar shows **`main not found`**.

## Troubleshooting

- **View → Output** → channel **“statusbarcommands”** for extension messages.
- **Help → Toggle Developer Tools → Console** for `console.log` from required scripts (extension host).

## License

MIT License.

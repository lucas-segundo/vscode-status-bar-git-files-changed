import * as cp from 'child_process'
import * as vscode from 'vscode'

const SECTION = 'prSizeStatusBar'

let statusBarItem: vscode.StatusBarItem | undefined
let gitDisposables: vscode.Disposable[] = []

export function activate(context: vscode.ExtensionContext): void {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
  statusBarItem.tooltip = 'Files changed vs base branch (three-dot diff). Click: Source Control.'
  statusBarItem.command = 'workbench.view.scm'
  context.subscriptions.push(statusBarItem)

  const update = (): void => {
    if (statusBarItem) {
      updateStatusBar(statusBarItem)
    }
  }

  update()
  void wireGitListeners(update)

  context.subscriptions.push(
    vscode.window.onDidChangeWindowState(() => update()),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearGitDisposables()
      void wireGitListeners(update)
      update()
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SECTION)) {
        update()
      }
    }),
    new vscode.Disposable(() => clearGitDisposables())
  )
}

export function deactivate(): void {
  clearGitDisposables()
  statusBarItem = undefined
}

function getConfig(): { yellowThreshold: number; redThreshold: number; baseBranch: string } {
  const c = vscode.workspace.getConfiguration(SECTION)
  return {
    yellowThreshold: c.get<number>('yellowThreshold', 20),
    redThreshold: c.get<number>('redThreshold', 30),
    baseBranch: c.get<string>('baseBranch', 'main'),
  }
}

function updateStatusBar(item: vscode.StatusBarItem): void {
  const folders = vscode.workspace.workspaceFolders
  if (!folders?.length) {
    item.hide()
    return
  }

  item.show()

  const { yellowThreshold, redThreshold, baseBranch } = getConfig()
  const cwd = folders[0].uri.fsPath
  const cmd = `git diff --name-only ${baseBranch}...HEAD`

  try {
    const stdout = cp.execSync(cmd, {
      cwd,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    const count = stdout.trim() ? stdout.trim().split('\n').filter((line) => line.length > 0).length : 0

    let icon = '🟢'
    if (count > redThreshold) {
      icon = '🔴'
    } else if (count > yellowThreshold) {
      icon = '🟡'
    }

    item.text = `${icon} PR: ${count} files changed`
  } catch {
    item.text = `⚪ PR: ${baseBranch} not found`
  }
}

function clearGitDisposables(): void {
  for (const d of gitDisposables) {
    d.dispose()
  }
  gitDisposables = []
}

interface GitRepository {
  readonly state: {
    onDidChange: (listener: () => void) => vscode.Disposable
  }
}

interface GitApi {
  readonly repositories: GitRepository[]
  readonly onDidOpenRepository: vscode.Event<GitRepository>
}

async function wireGitListeners(update: () => void): Promise<void> {
  clearGitDisposables()

  const ext = vscode.extensions.getExtension<{
    getAPI(version: number): GitApi | undefined
  }>('vscode.git')
  if (!ext) {
    return
  }

  try {
    await ext.activate()
  } catch {
    return
  }

  const api = ext.exports?.getAPI?.(1)
  if (!api) {
    return
  }

  const push = (d: vscode.Disposable): void => {
    gitDisposables.push(d)
  }

  const wireRepo = (repo: GitRepository): void => {
    push(repo.state.onDidChange(() => update()))
  }

  for (const repo of api.repositories ?? []) {
    wireRepo(repo)
  }

  push(
    api.onDidOpenRepository((repo) => {
      wireRepo(repo)
      update()
    })
  )
}

import * as vscode from 'vscode'
import { BranchSizeMonitor } from './BranchSizeMonitor'
import { SETTINGS_SECTION } from './constants'

const branchSizeMonitor = new BranchSizeMonitor()
let gitDisposables: vscode.Disposable[] = []

function update(): void {
  branchSizeMonitor.update()
}

export function activate(context: vscode.ExtensionContext): void {
  update()
  void wireGitListeners(update)

  context.subscriptions.push(
    branchSizeMonitor,
    vscode.window.onDidChangeWindowState(() => update()),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearGitDisposables()
      void wireGitListeners(update)
      update()
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SETTINGS_SECTION)) {
        update()
      }
    }),
    new vscode.Disposable(() => clearGitDisposables()),
  )
}

export function deactivate(): void {
  clearGitDisposables()
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
    }),
  )
}

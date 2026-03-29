import * as vscode from 'vscode'
import { BranchSizeMonitor } from './BranchSizeMonitor'
import { GitOnChangePublisher } from './GitOnChangePublisher'
import { SETTINGS_SECTION } from './constants'
import { GitDiffCounter } from './GitDiffCounter'

const branchSizeMonitor = new BranchSizeMonitor()
const gitDiffCounter = new GitDiffCounter()

function update(): void {
  branchSizeMonitor.updateStatusBar(gitDiffCounter.count())
}

const gitOnChangePublisher = new GitOnChangePublisher()

export function activate(context: vscode.ExtensionContext): void {
  gitOnChangePublisher.addSubscriber(update)

  context.subscriptions.push(
    branchSizeMonitor,
    gitOnChangePublisher,
    vscode.window.onDidChangeWindowState(() => update()),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      gitOnChangePublisher.addSubscriber(update)
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SETTINGS_SECTION)) {
        update()
      }
    }),
  )
}

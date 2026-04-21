import * as vscode from 'vscode'
import { GitOnChangePublisher } from './publishers/GitOnChangePublisher'
import { SETTINGS_SECTION } from './constants'
import { makeFilesChangedStatusBarSubscriber } from './subscribers/FilesChangedStatusBar/factory'

const filesChangedStatusBarSubscriber = makeFilesChangedStatusBarSubscriber()
const gitOnChangePublisher = new GitOnChangePublisher()

export function activate(context: vscode.ExtensionContext): void {
  gitOnChangePublisher.addSubscribers(filesChangedStatusBarSubscriber)

  context.subscriptions.push(
    gitOnChangePublisher,
    vscode.window.onDidChangeWindowState(() =>
      filesChangedStatusBarSubscriber.notify(),
    ),
    vscode.window.onDidChangeActiveTextEditor(() =>
      filesChangedStatusBarSubscriber.notify(),
    ),
    vscode.window.onDidChangeActiveNotebookEditor(() =>
      filesChangedStatusBarSubscriber.notify(),
    ),
    vscode.window.tabGroups.onDidChangeTabs(() =>
      filesChangedStatusBarSubscriber.notify(),
    ),
    vscode.window.tabGroups.onDidChangeTabGroups(() =>
      filesChangedStatusBarSubscriber.notify(),
    ),
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      gitOnChangePublisher.wire()
      filesChangedStatusBarSubscriber.notify()
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SETTINGS_SECTION)) {
        filesChangedStatusBarSubscriber.notify()
      }
    }),
  )
}

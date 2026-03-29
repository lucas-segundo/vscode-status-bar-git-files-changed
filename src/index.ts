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
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      gitOnChangePublisher.wire()
    }),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(SETTINGS_SECTION)) {
        filesChangedStatusBarSubscriber.notify()
      }
    }),
  )
}

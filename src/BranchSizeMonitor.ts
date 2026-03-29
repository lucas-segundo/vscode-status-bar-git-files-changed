import * as cp from 'child_process'
import {
  Disposable,
  StatusBarAlignment,
  StatusBarItem,
  window,
  workspace,
  WorkspaceFolder,
} from 'vscode'
import { getSettings } from './getSettings'

export class BranchSizeMonitor implements Disposable {
  private statusBarItem: StatusBarItem

  constructor() {
    this.statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Left,
      100,
    )
    this.statusBarItem.tooltip =
      'Files changed vs base branch. Click: Source Control.'
    this.statusBarItem.command = 'workbench.view.scm'
  }

  update(): void {
    const folders = workspace.workspaceFolders
    const hasNoFolders = !folders?.length

    if (hasNoFolders) {
      this.statusBarItem.text = `⚪ No workspace folders found`
    } else {
      this.updateWithFolders(folders)
    }
  }

  private updateWithFolders(folders: readonly WorkspaceFolder[]) {
    const { yellowThreshold, redThreshold, baseBranch } = getSettings()

    try {
      const count = this.getGitDiffCount(folders, baseBranch)
      const icon = this.getIcon(count, redThreshold, yellowThreshold)

      this.statusBarItem.text = `${icon} ${count} files changed`
    } catch {
      this.statusBarItem.text = `⚪ Base branch ${baseBranch} not found`
    } finally {
      this.statusBarItem.show()
    }
  }

  private getGitDiffCount(
    folders: readonly WorkspaceFolder[],
    baseBranch: string,
  ): number {
    const cwd = folders[0].uri.fsPath
    const cmd = `git diff --name-only ${baseBranch}...HEAD`
    const stdout = cp.execSync(cmd, {
      cwd,
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    if (stdout.trim()) {
      return stdout
        .trim()
        .split('\n')
        .filter((line) => line.length > 0).length
    }

    return 0
  }

  private getIcon(
    count: number,
    redThreshold: number,
    yellowThreshold: number,
  ): string {
    if (count > redThreshold) {
      return '🔴'
    } else if (count > yellowThreshold) {
      return '🟡'
    }

    return '🟢'
  }

  dispose(): void {
    this.statusBarItem.dispose()
  }
}

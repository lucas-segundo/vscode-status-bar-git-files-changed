import {
  StatusBarAlignment,
  StatusBarItem,
  WorkspaceFolder,
  window,
} from 'vscode'
import { getSettings } from '../utils/getSettings'

export class FilesChangedStatusBar {
  private statusBarItem: StatusBarItem

  constructor() {
    this.statusBarItem = window.createStatusBarItem(
      StatusBarAlignment.Left,
      100,
    )
    this.setDefaultTooltip()
    this.statusBarItem.command = 'workbench.view.scm'
  }

  updateStatusBar(
    filesChangedCount: number,
    focusedWorkspaceFolder?: WorkspaceFolder,
  ) {
    const { yellowThreshold, redThreshold, baseBranch } = getSettings()

    try {
      const icon = this.getIcon(
        filesChangedCount,
        redThreshold,
        yellowThreshold,
      )

      this.statusBarItem.text = `${icon} ${filesChangedCount} ${filesChangedCount === 1 ? 'file' : 'files'} changed`
      this.setDefaultTooltip(focusedWorkspaceFolder)
    } catch {
      this.statusBarItem.text = `⚪ Base branch ${baseBranch} not found`
      this.statusBarItem.tooltip = `Check if the base branch ${baseBranch} exists locally. If not, go to settings and set the base branch.`
    } finally {
      this.statusBarItem.show()
    }
  }

  private setDefaultTooltip(focusedWorkspaceFolder?: WorkspaceFolder): void {
    const base =
      'Files changed vs base branch. Click: Source Control.'
    if (focusedWorkspaceFolder) {
      this.statusBarItem.tooltip = `${base}\n\nWorkspace: ${focusedWorkspaceFolder.name}`
      return
    }
    this.statusBarItem.tooltip = base
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
}

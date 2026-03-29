import { StatusBarAlignment, StatusBarItem, window } from 'vscode'
import { getSettings } from './utils/getSettings'

export class BranchSizeMonitor {
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

  updateStatusBar(filesChangedCount: number) {
    const { yellowThreshold, redThreshold, baseBranch } = getSettings()

    try {
      const icon = this.getIcon(
        filesChangedCount,
        redThreshold,
        yellowThreshold,
      )

      this.statusBarItem.text = `${icon} ${filesChangedCount} ${filesChangedCount === 1 ? 'file' : 'files'} changed`
    } catch {
      this.statusBarItem.text = `⚪ Base branch ${baseBranch} not found`
      this.statusBarItem.tooltip = `Check if the base branch ${baseBranch} exists locally. If not, go to settings and set the base branch.`
    } finally {
      this.statusBarItem.show()
    }
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

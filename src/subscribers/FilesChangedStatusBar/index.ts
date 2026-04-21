import { workspace } from 'vscode'
import { Subscriber } from '..'
import { FilesChangedStatusBar } from '../../components/FilesChangedStatusBar'
import { getFocusedWorkspaceFolder, GitDiffCounter } from '../../services/GitDiffCounter'

export class FilesChangedStatusBarSubscriber implements Subscriber {
  constructor(
    private readonly filesChangedStatusBar: FilesChangedStatusBar,
    private readonly gitDiffCounter: GitDiffCounter,
  ) {}

  notify(): void {
    const count = this.gitDiffCounter.count()
    const multiRoot = (workspace.workspaceFolders?.length ?? 0) > 1
    this.filesChangedStatusBar.updateStatusBar(
      count,
      multiRoot ? getFocusedWorkspaceFolder() : undefined,
    )
  }
}

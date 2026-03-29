import { Subscriber } from '..'
import { BranchSizeMonitor } from '../../BranchSizeMonitor'
import { GitDiffCounter } from '../../GitDiffCounter'

export class FilesChangedStatusBarSubscriber implements Subscriber {
  constructor(
    private readonly branchSizeMonitor: BranchSizeMonitor,
    private readonly gitDiffCounter: GitDiffCounter,
  ) {}

  notify(): void {
    this.branchSizeMonitor.updateStatusBar(this.gitDiffCounter.count())
  }
}

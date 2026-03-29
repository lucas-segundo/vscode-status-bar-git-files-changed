import { Subscriber } from '..'
import { FilesChangedStatusBar } from '../../FilesChangedStatusBar'
import { GitDiffCounter } from '../../GitDiffCounter'

export class FilesChangedStatusBarSubscriber implements Subscriber {
  constructor(
    private readonly filesChangedStatusBar: FilesChangedStatusBar,
    private readonly gitDiffCounter: GitDiffCounter,
  ) {}

  notify(): void {
    this.filesChangedStatusBar.updateStatusBar(this.gitDiffCounter.count())
  }
}

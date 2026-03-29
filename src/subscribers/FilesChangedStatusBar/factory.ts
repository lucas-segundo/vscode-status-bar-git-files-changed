import { FilesChangedStatusBarSubscriber } from '.'
import { BranchSizeMonitor } from '../../BranchSizeMonitor'
import { GitDiffCounter } from '../../GitDiffCounter'

export const makeFilesChangedStatusBarSubscriber = () => {
  return new FilesChangedStatusBarSubscriber(
    new BranchSizeMonitor(),
    new GitDiffCounter(),
  )
}

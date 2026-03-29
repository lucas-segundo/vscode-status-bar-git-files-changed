import { FilesChangedStatusBarSubscriber } from '.'
import { FilesChangedStatusBar } from '../../FilesChangedStatusBar'
import { GitDiffCounter } from '../../GitDiffCounter'

export const makeFilesChangedStatusBarSubscriber = () => {
  return new FilesChangedStatusBarSubscriber(
    new FilesChangedStatusBar(),
    new GitDiffCounter(),
  )
}

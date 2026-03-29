import { FilesChangedStatusBarSubscriber } from '.'
import { FilesChangedStatusBar } from '../../components/FilesChangedStatusBar'
import { GitDiffCounter } from '../../services/GitDiffCounter'

export const makeFilesChangedStatusBarSubscriber = () => {
  return new FilesChangedStatusBarSubscriber(
    new FilesChangedStatusBar(),
    new GitDiffCounter(),
  )
}

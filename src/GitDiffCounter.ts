import * as cp from 'child_process'
import { workspace, WorkspaceFolder } from 'vscode'
import { getSettings } from './getSettings'

export class GitDiffCounter {
  private workspaceFolders: readonly WorkspaceFolder[]

  constructor() {
    this.workspaceFolders = workspace.workspaceFolders ?? []
  }

  count(): number {
    const folders = workspace.workspaceFolders
    const hasNoFolders = !folders?.length

    if (hasNoFolders) {
      return 0
    }

    return this.countForFolders()
  }

  private countForFolders(): number {
    const { baseBranch } = getSettings()

    const cwd = this.workspaceFolders[0].uri.fsPath
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
}

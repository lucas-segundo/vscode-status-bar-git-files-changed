import * as cp from 'child_process'
import * as path from 'node:path'
import {
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputText,
  TabInputTextDiff,
  Uri,
  window,
  workspace,
  WorkspaceFolder,
} from 'vscode'
import { getSettings } from '../utils/getSettings'

/**
 * Maps a URI to a workspace folder. `getWorkspaceFolder` fails for git:/, vscode-scm:,
 * and other non-file URIs even when the resource lives under a root — use fsPath + longest root prefix.
 */
export function getWorkspaceFolderForUri(uri: Uri): WorkspaceFolder | undefined {
  const direct = workspace.getWorkspaceFolder(uri)
  if (direct) {
    return direct
  }

  const folders = workspace.workspaceFolders
  if (!folders?.length) {
    return undefined
  }

  const fsPath = uri.fsPath
  if (!fsPath) {
    return undefined
  }

  const normalized = path.normalize(fsPath)
  let best: WorkspaceFolder | undefined
  let bestRootLen = -1
  for (const folder of folders) {
    const root = path.normalize(folder.uri.fsPath)
    if (
      normalized === root ||
      normalized.startsWith(root + path.sep)
    ) {
      if (root.length > bestRootLen) {
        bestRootLen = root.length
        best = folder
      }
    }
  }
  return best
}

function getUriFromActiveTab(): Uri | undefined {
  const tab = window.tabGroups.activeTabGroup.activeTab
  const input = tab?.input
  if (!input) {
    return undefined
  }
  if (input instanceof TabInputText) {
    return input.uri
  }
  if (input instanceof TabInputTextDiff) {
    return input.modified
  }
  if (input instanceof TabInputNotebook) {
    return input.uri
  }
  if (input instanceof TabInputNotebookDiff) {
    return input.modified
  }
  if (input instanceof TabInputCustom) {
    return input.uri
  }
  return undefined
}

/** Workspace folder for the resource the user is most likely "in" (active tab / editor / notebook), else first root. */
export function getFocusedWorkspaceFolder():
  | WorkspaceFolder
  | undefined {
  const folders = workspace.workspaceFolders
  if (!folders?.length) {
    return undefined
  }

  const tabUri = getUriFromActiveTab()
  if (tabUri) {
    const folder = getWorkspaceFolderForUri(tabUri)
    if (folder) {
      return folder
    }
  }

  const editorUri = window.activeTextEditor?.document.uri
  if (editorUri) {
    const folder = getWorkspaceFolderForUri(editorUri)
    if (folder) {
      return folder
    }
  }

  const notebook = window.activeNotebookEditor
  if (notebook) {
    const folder = getWorkspaceFolderForUri(notebook.notebook.uri)
    if (folder) {
      return folder
    }
  }

  return folders[0]
}

export class GitDiffCounter {
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

    const focused = getFocusedWorkspaceFolder()
    if (!focused) {
      return 0
    }

    const cwd = focused.uri.fsPath
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

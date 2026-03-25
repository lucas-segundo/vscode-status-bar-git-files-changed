module.exports = function runPrSizeStatusbar(vscode, statusBarItem) {
  // Config here the thresholds for green, yellow and red icons
  const YELLOW_THRESHOLD = 20
  const RED_THRESHOLD = 30

  const cp = require('child_process')

  try {
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath

    const cmd = 'git diff --name-only main...HEAD 2>/dev/null | wc -l'

    const res = cp.execSync(cmd, { cwd: wsPath, encoding: 'utf8' }).trim()
    const count = parseInt(res) || 0

    let icon = '🟢'

    if (count > RED_THRESHOLD) {
      icon = '🔴'
    } else if (count > YELLOW_THRESHOLD) {
      icon = '🟡'
    }

    statusBarItem.text = `${icon} PR: ${count} files changed`
  } catch (e) {
    statusBarItem.text = '⚪ PR: main not found'
  }
}

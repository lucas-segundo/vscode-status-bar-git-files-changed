// Git event subscribers for statusbar_command scriptEvents (see .vscode/settings.json).
const vscode = require('vscode')

function main() {
  const api = getGitApi()
  const repo = api && api.repositories && api.repositories[0]

  if (api && repo) {
    return {
      onDidOpenRepository: api.onDidOpenRepository,
      onDidChangeRepositoryState: repo.state.onDidChange,
    }
  } else {
    return {
      onDidOpenRepository: noopSubscribe(),
      onDidChangeRepositoryState: noopSubscribe(),
    }
  }
}

function getGitApi() {
  try {
    const ext = vscode.extensions.getExtension('vscode.git')
    return ext && ext.exports && ext.exports.getAPI(1)
  } catch {
    return null
  }
}

function noopSubscribe() {
  return function () {
    return new vscode.Disposable(function () {})
  }
}

module.exports = main()

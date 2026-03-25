// Loaded by statusbar_command (see .vscode/settings.json).
// Refreshes on: window focus, workspace folders, git events (see pr-size-statusbar-git-events.js).
module.exports = function runPrSizeStatusbar(vscode, statusBarItem) {
  const cp = require('child_process')

  try {
    // 1. Pega o caminho raiz do projeto aberto no VS Code/Cursor
    const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath

    // 2. Comando git para contar os arquivos modificados em relação à main
    const cmd = 'git diff --name-only main...HEAD 2>/dev/null | wc -l'

    // 3. Executa o comando e pega o número
    const res = cp.execSync(cmd, { cwd: wsPath, encoding: 'utf8' }).trim()
    const count = parseInt(res) || 0

    // 4. Lógica de Cores e Ícones
    let icon = '🟢' // Reseta a cor de fundo para o padrão

    if (count > 30) {
      icon = '🔴'
    } else if (count > 20) {
      icon = '🟡'
    }

    // 5. Atualiza o texto na interface
    statusBarItem.text = `${icon} PR: ${count} files changed`
  } catch (e) {
    // Se der erro (ex: branch main não existe), mostra um ícone neutro
    statusBarItem.text = '⚪ PR: main not found'
  }
}

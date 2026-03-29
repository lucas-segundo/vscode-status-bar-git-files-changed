import { workspace } from 'vscode'
import { SETTINGS_SECTION } from './constants'

export function getSettings(): {
  yellowThreshold: number
  redThreshold: number
  baseBranch: string
} {
  const settings = workspace.getConfiguration(SETTINGS_SECTION)
  return {
    yellowThreshold: settings.get('yellowThreshold', 20),
    redThreshold: settings.get('redThreshold', 30),
    baseBranch: settings.get('baseBranch', 'main'),
  }
}

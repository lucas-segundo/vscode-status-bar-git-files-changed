import * as vscode from 'vscode'
import { Subscriber } from '../subscribers'

interface GitRepository {
  readonly state: {
    onDidChange: (listener: () => void) => vscode.Disposable
  }
}

interface GitApi {
  readonly repositories: GitRepository[]
  readonly onDidOpenRepository: vscode.Event<GitRepository>
}

export class GitOnChangePublisher implements vscode.Disposable {
  private gitDisposables: vscode.Disposable[] = []
  private subscribers: Subscriber[] = []

  async addSubscribers(
    ...subscribers: Subscriber[]
  ): Promise<vscode.Disposable> {
    this.subscribers.push(...subscribers)
    await this.wire()

    return new vscode.Disposable(() => {
      this.subscribers = []
      this.clearGitDisposables()
    })
  }

  async wire(): Promise<void> {
    this.clearGitDisposables()

    const ext = vscode.extensions.getExtension<{
      getAPI(version: number): GitApi | undefined
    }>('vscode.git')
    if (!ext) {
      return
    }

    try {
      await ext.activate()
    } catch {
      return
    }

    const api = ext.exports?.getAPI?.(1)
    if (!api) {
      return
    }

    for (const repo of api.repositories) {
      this.gitDisposables.push(
        repo.state.onDidChange(() => this.notifyAllSubscribers()),
      )
    }

    const onDidOpenRepository = api.onDidOpenRepository((repo) =>
      this.gitDisposables.push(
        repo.state.onDidChange(() => this.notifyAllSubscribers()),
      ),
    )

    this.gitDisposables.push(onDidOpenRepository)
  }

  private notifyAllSubscribers(): void {
    for (const subscriber of this.subscribers) {
      subscriber.notify()
    }
  }

  dispose(): void {
    this.clearGitDisposables()
    this.subscribers = []
  }

  private clearGitDisposables(): void {
    for (const disposable of this.gitDisposables) {
      disposable.dispose()
    }
    this.gitDisposables = []
  }
}

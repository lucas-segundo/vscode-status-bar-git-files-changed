import * as vscode from 'vscode'

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
  private readonly subscribers = new Set<() => void>()

  async addSubscribers(
    ...listeners: (() => void)[]
  ): Promise<vscode.Disposable> {
    for (const listener of listeners) {
      this.subscribers.add(listener)
    }
    await this.wire()

    return new vscode.Disposable(() =>
      listeners.forEach((listener) => this.subscribers.delete(listener)),
    )
  }

  async wire(): Promise<void> {
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

    for (const repo of api.repositories ?? []) {
      this.wireRepo(repo)
    }

    this.pushDisposable(
      api.onDidOpenRepository((repo) => {
        this.wireRepo(repo)
        this.notify()
      }),
    )
  }

  dispose(): void {
    this.clearGitDisposables()
    this.subscribers.clear()
  }

  private clearGitDisposables(): void {
    for (const d of this.gitDisposables) {
      d.dispose()
    }
    this.gitDisposables = []
  }

  private pushDisposable(d: vscode.Disposable): void {
    this.gitDisposables.push(d)
  }

  private wireRepo(repo: GitRepository): void {
    this.pushDisposable(repo.state.onDidChange(() => this.notify()))
  }

  private notify(): void {
    for (const listener of this.subscribers) {
      listener()
    }
  }
}

declare global {
  namespace NodeJS {
    /**
     * process.env.* から環境変数を参照するためのIF定義です。
     * <pre>
     *  process.env 記述時にコード補完有効化と型の定義が可能です。
     * </pre>
     */
    interface ProcessEnv {
      NEXT_RUNTIME: string
      // DB接続定義
      DATABASE_URL: string
      // バックエンドAPI接続URL
      NEXT_PUBLIC_API_BASE_URL: string
      // fakeAPI接続URL(※後に削除すること)
      NEXT_PUBLIC_FAKE_API_BASE_URL: string
    }
  }
}

export {}

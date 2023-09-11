/**
 * サービス起動時の初期処理です。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('nodejs初期処理')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    console.log('edge初期処理')
    // await import('./instrumentation-edge')
  }
}

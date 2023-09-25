/**
 * テストライブラリ Jestの設定ファイルです。
 * <pre>
 *  https://nextjs-ja-translation-docs.vercel.app/docs/testing
 * </pre>
 */

// ************************************************************************** //

const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // テスト環境の next.config.js と .env ファイルを読み込むために、Next.js アプリケーションへのパス
  dir: './',
})

// Jest に渡すカスタム設定を追加する
const customJestConfig = {
  // 各テストの実行前に渡すオプションを追加
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // TypeScript の設定で baseUrl をルートディレクトリに設定している場合、alias を動作させるためには以下のようにする必要があります
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  // テスト環境のセットアップ時に実行 (環境変数設定など) *.spec.ts ファイル単位で実行
  setupFiles: ['<rootDir>/src/tests/jest/config/setup.ts'],
  // テスト環境のセットアップ後に実行 (Jestのテスト実装に関係する設定を対応)  *.spec.ts ファイル単位で実行
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest/config/setupAfterEnv.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/tests/playwright'],
  // testEnvironment: 'jest-environment-jsdom',
  testEnvironment: 'node', //node  @quramy/jest-prisma/environment
}

// createJestConfig は、非同期で next/jest が Next.js の設定を読み込めるようにするため、下記のようにエクスポート
module.exports = createJestConfig(customJestConfig)

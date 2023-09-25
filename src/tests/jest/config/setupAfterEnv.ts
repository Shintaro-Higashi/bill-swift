import { beforeEach } from '@jest/globals'
import { Prisma, PrismaClient } from '@prisma/client'
import { initialize } from '@/tests/__generated__/fabbrica'
import { createInitUser } from '@/tests/jest/data/init/createInitUser'
import { createInitCompany } from '@/tests/jest/data/init/createInitCompany'
import { snakeCase } from 'lodash'

const prisma = new PrismaClient()

// *.spec.ts 単位に都度実地 beforeAll
// test 単位に都度実地 beforeEach
beforeEach(async () => {
  initialize({ prisma })
  // データベースの初期化、セットアップ
  await clearDatabase()
  // execSync('npx prisma migrate reset --force', {
  //   env: {
  //     ...process.env,
  //   },
  // })
  await createInitData()
  prisma.$disconnect()
})

/**
 * 全テーブルレコードを削除します。
 */
async function clearDatabase(): Promise<void> {
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name) as Prisma.ModelName[]

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SET FOREIGN_KEY_CHECKS=0`
    for (const modelName of modelNames) {
      const tableName = snakeCase(modelName)
      await tx.$queryRawUnsafe(`TRUNCATE TABLE ${tableName}`)
    }
    await tx.$queryRaw`SET FOREIGN_KEY_CHECKS=1`
  })
}

/**
 * テスト用初期データを作成します
 */
async function createInitData() {
  await createInitUser()
  await createInitCompany()
}

import { prisma } from '@/servers/repositories/prisma/configs/prisma'
import bcrypt from 'bcryptjs'

const upsertUser = async () => {
  const saltRounds = 10
  const password = 'green@8-bill-system'
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  const testUser = await prisma.user.upsert({
    where: { id: '0000000000000000000U0001' },
    update: {
      userType: 'ADMIN',
      name: '請求マスター',
      userId: 'bill-admin',
      password: hashedPassword,
    },
    create: {
      id: '0000000000000000000U0001',
      userType: 'ADMIN',
      name: '請求マスター',
      userId: 'bill-admin',
      password: hashedPassword,
    },
  })
  console.log({ testUser })
}

async function seed() {
  // console.log('seed : start')
  await upsertUser()
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

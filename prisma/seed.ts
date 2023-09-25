import { prisma } from '@/servers/repositories/prisma/configs/prisma'

async function seed() {
  // console.log('seed : start')
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

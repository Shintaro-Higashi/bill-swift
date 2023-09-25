import { defineUserFactory } from '@/tests/__generated__/fabbrica'
import { addDays } from 'date-fns'

export async function createInitUser() {
  const mockDate = new Date('2023/09/01')
  const UserFactory = defineUserFactory({
    defaultData: async ({ seq }) => ({
      id: `user${seq.toString().padStart(3, '0')}`,
      createdBy: '1',
      updatedBy: '1',
      createdAt: addDays(mockDate, seq),
      updatedAt: addDays(mockDate, seq + 1),
    }),
  })
  await UserFactory.create({ id: '1' })
  await UserFactory.createList(4)
}

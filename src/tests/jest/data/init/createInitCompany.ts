import { defineCompanyFactory } from '@/tests/__generated__/fabbrica'
import { addDays } from 'date-fns'

export async function createInitCompany() {
  const mockDate = new Date('2023/09/01')
  const CompanyFactory = defineCompanyFactory({
    defaultData: async ({ seq }) => ({
      id: `company${seq.toString().padStart(3, '0')}`,
      name: `会社${seq.toString().padStart(3, '0')}`,
      postalCode: '111222' + seq.toString(),
      createdBy: '1',
      updatedBy: '1',
      createdAt: addDays(mockDate, seq),
      updatedAt: addDays(mockDate, seq + 1),
    }),
  })
  await CompanyFactory.createList(5)
}

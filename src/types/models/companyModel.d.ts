import { Company, User } from '@prisma/client'

// 会社EntityModel
export type CompanyModel = Company & {
  userCompanyCreatedByTouser: User | null
  userCompanyUpdatedByTouser: User | null
}

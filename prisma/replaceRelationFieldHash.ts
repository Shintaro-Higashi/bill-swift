/**
 * replaceRelationFieldで利用する置換ルールです
 */
const replacements: { search: string; replace: string }[] = [
  // 会社
  { search: 'userCompanyCreatedByTouser', replace: 'createdUser' },
  { search: 'userCompanyUpdatedByTouser', replace: 'updatedUser' },
  // ユーザ
  { search: 'companyCompanyCreatedByTouser', replace: 'companyCreatedUser' },
  { search: 'companyCompanyUpdatedByTouser', replace: 'companyUpdatedUser' },
]

export default replacements

import type { AccountManage } from "@prisma/client";
import type { Company } from "@prisma/client";
import type { HealthFacility } from "@prisma/client";
import type { HealthFacilityCodeGroup } from "@prisma/client";
import type { HealthFacilityCodeManage } from "@prisma/client";
import type { HealthFacilityRelatePharmacy } from "@prisma/client";
import type { Inquiry } from "@prisma/client";
import type { InquiryCorrespond } from "@prisma/client";
import type { InquiryFile } from "@prisma/client";
import type { Patient } from "@prisma/client";
import type { PatientChangeContent } from "@prisma/client";
import type { PatientChangeHistory } from "@prisma/client";
import type { PatientCodeHistory } from "@prisma/client";
import type { PatientFile } from "@prisma/client";
import type { PatientRelateHealthFacility } from "@prisma/client";
import type { Pharmacy } from "@prisma/client";
import type { PharmacyBaseCompoundingSetting } from "@prisma/client";
import type { PharmacyGroup } from "@prisma/client";
import type { User } from "@prisma/client";
import type { AccountManageAccountType } from "@prisma/client";
import type { HealthFacilityBillingType } from "@prisma/client";
import type { HealthFacilityPaymentType } from "@prisma/client";
import type { HealthFacilityTransferGuide } from "@prisma/client";
import type { HealthFacilityPatientSortType } from "@prisma/client";
import type { HealthFacilityCodeGroupFormatType } from "@prisma/client";
import type { InquiryStatus } from "@prisma/client";
import type { PatientGender } from "@prisma/client";
import type { PatientMedicalInsuranceStatus } from "@prisma/client";
import type { PatientMedicalShare } from "@prisma/client";
import type { PatientNursingInsuranceStatus } from "@prisma/client";
import type { PatientNursingShare } from "@prisma/client";
import type { PatientConsentStatus } from "@prisma/client";
import type { PatientPaymentType } from "@prisma/client";
import type { PatientAccountConfirmStatus } from "@prisma/client";
import type { PatientRelateHealthFacilityReason } from "@prisma/client";
import type { UserUserType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { getClient, ModelWithFields, createScreener, getScalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
};

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "AccountManage",
        fields: [{
                name: "createdUser",
                type: "User",
                relationName: "account_manage_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "account_manage_updated_byTouser"
            }, {
                name: "pharmacyTransfer",
                type: "Pharmacy",
                relationName: "pharmacy_transfer_account_manage_idToaccount_manage"
            }, {
                name: "pharmacyWithdrawal",
                type: "Pharmacy",
                relationName: "pharmacy_withdrawal_account_manage_idToaccount_manage"
            }]
    }, {
        name: "Company",
        fields: [{
                name: "healthFacilityCodeGroup",
                type: "HealthFacilityCodeGroup",
                relationName: "CompanyToHealthFacilityCodeGroup"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "company_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "company_updated_byTouser"
            }, {
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "CompanyToPharmacy"
            }]
    }, {
        name: "HealthFacility",
        fields: [{
                name: "createdUser",
                type: "User",
                relationName: "health_facility_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "health_facility_updated_byTouser"
            }, {
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "HealthFacilityToPharmacy"
            }, {
                name: "healthFacilityCodeManage",
                type: "HealthFacilityCodeManage",
                relationName: "HealthFacilityToHealthFacilityCodeManage"
            }, {
                name: "healthFacilityRelatePharmacy",
                type: "HealthFacilityRelatePharmacy",
                relationName: "HealthFacilityToHealthFacilityRelatePharmacy"
            }, {
                name: "patientRelateHealthFacility",
                type: "PatientRelateHealthFacility",
                relationName: "HealthFacilityToPatientRelateHealthFacility"
            }]
    }, {
        name: "HealthFacilityCodeGroup",
        fields: [{
                name: "company",
                type: "Company",
                relationName: "CompanyToHealthFacilityCodeGroup"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "health_facility_code_group_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "health_facility_code_group_updated_byTouser"
            }, {
                name: "healthFacilityCodeManage",
                type: "HealthFacilityCodeManage",
                relationName: "HealthFacilityCodeGroupToHealthFacilityCodeManage"
            }]
    }, {
        name: "HealthFacilityCodeManage",
        fields: [{
                name: "healthFacility",
                type: "HealthFacility",
                relationName: "HealthFacilityToHealthFacilityCodeManage"
            }, {
                name: "healthFacilityCodeGroup",
                type: "HealthFacilityCodeGroup",
                relationName: "HealthFacilityCodeGroupToHealthFacilityCodeManage"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "health_facility_code_manage_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "health_facility_code_manage_updated_byTouser"
            }]
    }, {
        name: "HealthFacilityRelatePharmacy",
        fields: [{
                name: "healthFacility",
                type: "HealthFacility",
                relationName: "HealthFacilityToHealthFacilityRelatePharmacy"
            }, {
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "HealthFacilityRelatePharmacyToPharmacy"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "health_facility_relate_pharmacy_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "health_facility_relate_pharmacy_updated_byTouser"
            }]
    }, {
        name: "Inquiry",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "InquiryToPatient"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "inquiry_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "inquiry_updated_byTouser"
            }, {
                name: "inquiryCorrespond",
                type: "InquiryCorrespond",
                relationName: "InquiryToInquiryCorrespond"
            }]
    }, {
        name: "InquiryCorrespond",
        fields: [{
                name: "inquiry",
                type: "Inquiry",
                relationName: "InquiryToInquiryCorrespond"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "inquiry_correspond_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "inquiry_correspond_updated_byTouser"
            }, {
                name: "inquiryFile",
                type: "InquiryFile",
                relationName: "InquiryCorrespondToInquiryFile"
            }]
    }, {
        name: "InquiryFile",
        fields: [{
                name: "inquiryCorrespond",
                type: "InquiryCorrespond",
                relationName: "InquiryCorrespondToInquiryFile"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "inquiry_file_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "inquiry_file_updated_byTouser"
            }]
    }, {
        name: "Patient",
        fields: [{
                name: "inquiry",
                type: "Inquiry",
                relationName: "InquiryToPatient"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_updated_byTouser"
            }, {
                name: "patientChangeHistory",
                type: "PatientChangeHistory",
                relationName: "PatientToPatientChangeHistory"
            }, {
                name: "patientCodeHistory",
                type: "PatientCodeHistory",
                relationName: "PatientToPatientCodeHistory"
            }, {
                name: "patientFile",
                type: "PatientFile",
                relationName: "PatientToPatientFile"
            }, {
                name: "patientRelateHealthFacility",
                type: "PatientRelateHealthFacility",
                relationName: "PatientToPatientRelateHealthFacility"
            }]
    }, {
        name: "PatientChangeContent",
        fields: [{
                name: "patientChangeHistory",
                type: "PatientChangeHistory",
                relationName: "PatientChangeContentToPatientChangeHistory"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_change_content_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_change_content_updated_byTouser"
            }]
    }, {
        name: "PatientChangeHistory",
        fields: [{
                name: "patientChangeContent",
                type: "PatientChangeContent",
                relationName: "PatientChangeContentToPatientChangeHistory"
            }, {
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientChangeHistory"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_change_history_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_change_history_updated_byTouser"
            }]
    }, {
        name: "PatientCodeHistory",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientCodeHistory"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_code_history_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_code_history_updated_byTouser"
            }]
    }, {
        name: "PatientFile",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientFile"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_file_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_file_updated_byTouser"
            }]
    }, {
        name: "PatientRelateHealthFacility",
        fields: [{
                name: "healthFacility",
                type: "HealthFacility",
                relationName: "HealthFacilityToPatientRelateHealthFacility"
            }, {
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientRelateHealthFacility"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "patient_relate_health_facility_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "patient_relate_health_facility_updated_byTouser"
            }]
    }, {
        name: "Pharmacy",
        fields: [{
                name: "healthFacility",
                type: "HealthFacility",
                relationName: "HealthFacilityToPharmacy"
            }, {
                name: "healthFacilityRelatePharmacy",
                type: "HealthFacilityRelatePharmacy",
                relationName: "HealthFacilityRelatePharmacyToPharmacy"
            }, {
                name: "pharmacyGroup",
                type: "PharmacyGroup",
                relationName: "PharmacyToPharmacyGroup"
            }, {
                name: "company",
                type: "Company",
                relationName: "CompanyToPharmacy"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "pharmacy_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "pharmacy_updated_byTouser"
            }, {
                name: "transferAccountManage",
                type: "AccountManage",
                relationName: "pharmacy_transfer_account_manage_idToaccount_manage"
            }, {
                name: "withdrawalAccountManage",
                type: "AccountManage",
                relationName: "pharmacy_withdrawal_account_manage_idToaccount_manage"
            }, {
                name: "pharmacyBaseCompoundingSetting",
                type: "PharmacyBaseCompoundingSetting",
                relationName: "PharmacyToPharmacyBaseCompoundingSetting"
            }]
    }, {
        name: "PharmacyBaseCompoundingSetting",
        fields: [{
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "PharmacyToPharmacyBaseCompoundingSetting"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "pharmacy_base_compounding_setting_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "pharmacy_base_compounding_setting_updated_byTouser"
            }]
    }, {
        name: "PharmacyGroup",
        fields: [{
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "PharmacyToPharmacyGroup"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "pharmacy_group_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "pharmacy_group_updated_byTouser"
            }]
    }, {
        name: "User",
        fields: [{
                name: "accountManageAccountManageCreatedByTouser",
                type: "AccountManage",
                relationName: "account_manage_created_byTouser"
            }, {
                name: "accountManageAccountManageUpdatedByTouser",
                type: "AccountManage",
                relationName: "account_manage_updated_byTouser"
            }, {
                name: "companyCreatedUser",
                type: "Company",
                relationName: "company_created_byTouser"
            }, {
                name: "companyUpdatedUser",
                type: "Company",
                relationName: "company_updated_byTouser"
            }, {
                name: "healthFacilityCreatedUser",
                type: "HealthFacility",
                relationName: "health_facility_created_byTouser"
            }, {
                name: "healthFacilityUpdatedUser",
                type: "HealthFacility",
                relationName: "health_facility_updated_byTouser"
            }, {
                name: "healthFacilityCodeGroupCreatedUser",
                type: "HealthFacilityCodeGroup",
                relationName: "health_facility_code_group_created_byTouser"
            }, {
                name: "healthFacilityCodeGroupUpdatedUser",
                type: "HealthFacilityCodeGroup",
                relationName: "health_facility_code_group_updated_byTouser"
            }, {
                name: "healthFacilityCodeManageCreatedUser",
                type: "HealthFacilityCodeManage",
                relationName: "health_facility_code_manage_created_byTouser"
            }, {
                name: "healthFacilityCodeManageUpdatedUser",
                type: "HealthFacilityCodeManage",
                relationName: "health_facility_code_manage_updated_byTouser"
            }, {
                name: "healthFacilityRelatePharmacyCreatedUser",
                type: "HealthFacilityRelatePharmacy",
                relationName: "health_facility_relate_pharmacy_created_byTouser"
            }, {
                name: "healthFacilityRelatePharmacyUpdatedUser",
                type: "HealthFacilityRelatePharmacy",
                relationName: "health_facility_relate_pharmacy_updated_byTouser"
            }, {
                name: "inquiryCreatedUser",
                type: "Inquiry",
                relationName: "inquiry_created_byTouser"
            }, {
                name: "inquiryUpdatedUser",
                type: "Inquiry",
                relationName: "inquiry_updated_byTouser"
            }, {
                name: "inquiryCorrespondCreatedUser",
                type: "InquiryCorrespond",
                relationName: "inquiry_correspond_created_byTouser"
            }, {
                name: "inquiryCorrespondUpdatedUser",
                type: "InquiryCorrespond",
                relationName: "inquiry_correspond_updated_byTouser"
            }, {
                name: "inquiryFileCreatedUser",
                type: "InquiryFile",
                relationName: "inquiry_file_created_byTouser"
            }, {
                name: "inquiryFileUpdatedUser",
                type: "InquiryFile",
                relationName: "inquiry_file_updated_byTouser"
            }, {
                name: "patientCreatedUser",
                type: "Patient",
                relationName: "patient_created_byTouser"
            }, {
                name: "patientUpdatedUser",
                type: "Patient",
                relationName: "patient_updated_byTouser"
            }, {
                name: "patientChangeContentCreatedUser",
                type: "PatientChangeContent",
                relationName: "patient_change_content_created_byTouser"
            }, {
                name: "patientChangeContentUpdatedUser",
                type: "PatientChangeContent",
                relationName: "patient_change_content_updated_byTouser"
            }, {
                name: "patientChangeHistoryCreatedUser",
                type: "PatientChangeHistory",
                relationName: "patient_change_history_created_byTouser"
            }, {
                name: "patientChangeHistoryUpdatedUser",
                type: "PatientChangeHistory",
                relationName: "patient_change_history_updated_byTouser"
            }, {
                name: "patientCodeHistoryCreatedUser",
                type: "PatientCodeHistory",
                relationName: "patient_code_history_created_byTouser"
            }, {
                name: "patientCodeHistoryUpdatedUser",
                type: "PatientCodeHistory",
                relationName: "patient_code_history_updated_byTouser"
            }, {
                name: "patientFileCreatedUser",
                type: "PatientFile",
                relationName: "patient_file_created_byTouser"
            }, {
                name: "patientFileUpdatedUser",
                type: "PatientFile",
                relationName: "patient_file_updated_byTouser"
            }, {
                name: "patientRelateHealthFacilityCreatedUser",
                type: "PatientRelateHealthFacility",
                relationName: "patient_relate_health_facility_created_byTouser"
            }, {
                name: "patientRelateHealthFacilityUpdatedUser",
                type: "PatientRelateHealthFacility",
                relationName: "patient_relate_health_facility_updated_byTouser"
            }, {
                name: "pharmacyCreatedUser",
                type: "Pharmacy",
                relationName: "pharmacy_created_byTouser"
            }, {
                name: "pharmacyUpdatedUser",
                type: "Pharmacy",
                relationName: "pharmacy_updated_byTouser"
            }, {
                name: "pharmacyBaseCompoundingSettingCreatedUser",
                type: "PharmacyBaseCompoundingSetting",
                relationName: "pharmacy_base_compounding_setting_created_byTouser"
            }, {
                name: "pharmacyBaseCompoundingSettingUpdatedUser",
                type: "PharmacyBaseCompoundingSetting",
                relationName: "pharmacy_base_compounding_setting_updated_byTouser"
            }, {
                name: "pharmacyGroupCreatedUser",
                type: "PharmacyGroup",
                relationName: "pharmacy_group_created_byTouser"
            }, {
                name: "pharmacyGroupUpdatedUser",
                type: "PharmacyGroup",
                relationName: "pharmacy_group_updated_byTouser"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "user_created_byTouser"
            }, {
                name: "otherUserUserCreatedByTouser",
                type: "User",
                relationName: "user_created_byTouser"
            }, {
                name: "updatedUser",
                type: "User",
                relationName: "user_updated_byTouser"
            }, {
                name: "otherUserUserUpdatedByTouser",
                type: "User",
                relationName: "user_updated_byTouser"
            }]
    }];

type AccountManageScalarOrEnumFields = {
    id: string;
    name: string;
};

type AccountManagecreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutAccountManageAccountManageCreatedByTouserInput["create"]>;
};

type AccountManageupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutAccountManageAccountManageUpdatedByTouserInput["create"]>;
};

type AccountManageFactoryDefineInput = {
    id?: string;
    name?: string;
    transferDate?: number | null;
    financialCode?: string | null;
    financialName?: string | null;
    branchCode?: string | null;
    branchName?: string | null;
    accountType?: AccountManageAccountType | null;
    accountNo?: string | null;
    accountName?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    createdUser?: AccountManagecreatedUserFactory | Prisma.UserCreateNestedOneWithoutAccountManageAccountManageCreatedByTouserInput;
    updatedUser?: AccountManageupdatedUserFactory | Prisma.UserCreateNestedOneWithoutAccountManageAccountManageUpdatedByTouserInput;
    pharmacyTransfer?: Prisma.PharmacyCreateNestedManyWithoutTransferAccountManageInput;
    pharmacyWithdrawal?: Prisma.PharmacyCreateNestedManyWithoutWithdrawalAccountManageInput;
};

type AccountManageFactoryDefineOptions = {
    defaultData?: Resolver<AccountManageFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<AccountManageFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isAccountManagecreatedUserFactory(x: AccountManagecreatedUserFactory | Prisma.UserCreateNestedOneWithoutAccountManageAccountManageCreatedByTouserInput | undefined): x is AccountManagecreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isAccountManageupdatedUserFactory(x: AccountManageupdatedUserFactory | Prisma.UserCreateNestedOneWithoutAccountManageAccountManageUpdatedByTouserInput | undefined): x is AccountManageupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type AccountManageTraitKeys<TOptions extends AccountManageFactoryDefineOptions> = keyof TOptions["traits"];

export interface AccountManageFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "AccountManage";
    build(inputData?: Partial<Prisma.AccountManageCreateInput>): PromiseLike<Prisma.AccountManageCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.AccountManageCreateInput>): PromiseLike<Prisma.AccountManageCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.AccountManageCreateInput>[]): PromiseLike<Prisma.AccountManageCreateInput[]>;
    pickForConnect(inputData: AccountManage): Pick<AccountManage, "id">;
    create(inputData?: Partial<Prisma.AccountManageCreateInput>): PromiseLike<AccountManage>;
    createList(inputData: number | readonly Partial<Prisma.AccountManageCreateInput>[]): PromiseLike<AccountManage[]>;
    createForConnect(inputData?: Partial<Prisma.AccountManageCreateInput>): PromiseLike<Pick<AccountManage, "id">>;
}

export interface AccountManageFactoryInterface<TOptions extends AccountManageFactoryDefineOptions = AccountManageFactoryDefineOptions> extends AccountManageFactoryInterfaceWithoutTraits {
    use(name: AccountManageTraitKeys<TOptions>, ...names: readonly AccountManageTraitKeys<TOptions>[]): AccountManageFactoryInterfaceWithoutTraits;
}

function autoGenerateAccountManageScalarsOrEnums({ seq }: {
    readonly seq: number;
}): AccountManageScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "AccountManage", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "AccountManage", fieldName: "name", isId: false, isUnique: false, seq })
    };
}

function defineAccountManageFactoryInternal<TOptions extends AccountManageFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): AccountManageFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly AccountManageTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("AccountManage", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.AccountManageCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateAccountManageScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<AccountManageFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<AccountManageFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isAccountManagecreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isAccountManageupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.AccountManageCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.AccountManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: AccountManage) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.AccountManageCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().accountManage.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.AccountManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.AccountManageCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "AccountManage" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: AccountManageTraitKeys<TOptions>, ...names: readonly AccountManageTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link AccountManage} model.
 *
 * @param options
 * @returns factory {@link AccountManageFactoryInterface}
 */
export function defineAccountManageFactory<TOptions extends AccountManageFactoryDefineOptions>(options?: TOptions): AccountManageFactoryInterface<TOptions> {
    return defineAccountManageFactoryInternal(options ?? {});
}

type CompanyScalarOrEnumFields = {
    id: string;
    name: string;
    nameKana: string;
    postalCode: string;
    address1: string;
};

type CompanyhealthFacilityCodeGroupFactory = {
    _factoryFor: "HealthFacilityCodeGroup";
    build: () => PromiseLike<Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutCompanyInput["create"]>;
};

type CompanycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput["create"]>;
};

type CompanyupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput["create"]>;
};

type CompanyFactoryDefineInput = {
    id?: string;
    name?: string;
    nameKana?: string;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    tel?: string | null;
    fax?: string | null;
    invoiceNo?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacilityCodeGroup: CompanyhealthFacilityCodeGroupFactory | Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutCompanyInput;
    createdUser?: CompanycreatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput;
    updatedUser?: CompanyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput;
    pharmacy?: Prisma.PharmacyCreateNestedManyWithoutCompanyInput;
};

type CompanyFactoryDefineOptions = {
    defaultData: Resolver<CompanyFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<CompanyFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isCompanyhealthFacilityCodeGroupFactory(x: CompanyhealthFacilityCodeGroupFactory | Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutCompanyInput | undefined): x is CompanyhealthFacilityCodeGroupFactory {
    return (x as any)?._factoryFor === "HealthFacilityCodeGroup";
}

function isCompanycreatedUserFactory(x: CompanycreatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput | undefined): x is CompanycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isCompanyupdatedUserFactory(x: CompanyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput | undefined): x is CompanyupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type CompanyTraitKeys<TOptions extends CompanyFactoryDefineOptions> = keyof TOptions["traits"];

export interface CompanyFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Company";
    build(inputData?: Partial<Prisma.CompanyCreateInput>): PromiseLike<Prisma.CompanyCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.CompanyCreateInput>): PromiseLike<Prisma.CompanyCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.CompanyCreateInput>[]): PromiseLike<Prisma.CompanyCreateInput[]>;
    pickForConnect(inputData: Company): Pick<Company, "id">;
    create(inputData?: Partial<Prisma.CompanyCreateInput>): PromiseLike<Company>;
    createList(inputData: number | readonly Partial<Prisma.CompanyCreateInput>[]): PromiseLike<Company[]>;
    createForConnect(inputData?: Partial<Prisma.CompanyCreateInput>): PromiseLike<Pick<Company, "id">>;
}

export interface CompanyFactoryInterface<TOptions extends CompanyFactoryDefineOptions = CompanyFactoryDefineOptions> extends CompanyFactoryInterfaceWithoutTraits {
    use(name: CompanyTraitKeys<TOptions>, ...names: readonly CompanyTraitKeys<TOptions>[]): CompanyFactoryInterfaceWithoutTraits;
}

function autoGenerateCompanyScalarsOrEnums({ seq }: {
    readonly seq: number;
}): CompanyScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        postalCode: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "postalCode", isId: false, isUnique: false, seq }),
        address1: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "address1", isId: false, isUnique: false, seq })
    };
}

function defineCompanyFactoryInternal<TOptions extends CompanyFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): CompanyFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly CompanyTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Company", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.CompanyCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateCompanyScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<CompanyFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<CompanyFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                healthFacilityCodeGroup: isCompanyhealthFacilityCodeGroupFactory(defaultData.healthFacilityCodeGroup) ? {
                    create: await defaultData.healthFacilityCodeGroup.build()
                } : defaultData.healthFacilityCodeGroup,
                createdUser: isCompanycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isCompanyupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.CompanyCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.CompanyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Company) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.CompanyCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().company.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.CompanyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.CompanyCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Company" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: CompanyTraitKeys<TOptions>, ...names: readonly CompanyTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link Company} model.
 *
 * @param options
 * @returns factory {@link CompanyFactoryInterface}
 */
export function defineCompanyFactory<TOptions extends CompanyFactoryDefineOptions>(options: TOptions): CompanyFactoryInterface<TOptions> {
    return defineCompanyFactoryInternal(options);
}

type HealthFacilityScalarOrEnumFields = {
    id: string;
    code: string;
    name: string;
    nameKana: string;
    searchName: string;
    postalCode: string;
    address1: string;
};

type HealthFacilitycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityCreatedUserInput["create"]>;
};

type HealthFacilityupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityUpdatedUserInput["create"]>;
};

type HealthFacilitypharmacyFactory = {
    _factoryFor: "Pharmacy";
    build: () => PromiseLike<Prisma.PharmacyCreateNestedOneWithoutHealthFacilityInput["create"]>;
};

type HealthFacilityFactoryDefineInput = {
    id?: string;
    code?: string;
    name?: string;
    nameKana?: string;
    searchName?: string;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    tel?: string | null;
    fax?: string | null;
    mail?: string | null;
    url?: string | null;
    billingType?: HealthFacilityBillingType | null;
    paymentType?: HealthFacilityPaymentType | null;
    transferGuide?: HealthFacilityTransferGuide | null;
    patientSortType?: HealthFacilityPatientSortType;
    note?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    createdUser?: HealthFacilitycreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCreatedUserInput;
    updatedUser?: HealthFacilityupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityUpdatedUserInput;
    pharmacy: HealthFacilitypharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutHealthFacilityInput;
    healthFacilityCodeManage?: Prisma.HealthFacilityCodeManageCreateNestedManyWithoutHealthFacilityInput;
    healthFacilityRelatePharmacy?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutHealthFacilityInput;
    patientRelateHealthFacility?: Prisma.PatientRelateHealthFacilityCreateNestedManyWithoutHealthFacilityInput;
};

type HealthFacilityFactoryDefineOptions = {
    defaultData: Resolver<HealthFacilityFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<HealthFacilityFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isHealthFacilitycreatedUserFactory(x: HealthFacilitycreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCreatedUserInput | undefined): x is HealthFacilitycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilityupdatedUserFactory(x: HealthFacilityupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityUpdatedUserInput | undefined): x is HealthFacilityupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilitypharmacyFactory(x: HealthFacilitypharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutHealthFacilityInput | undefined): x is HealthFacilitypharmacyFactory {
    return (x as any)?._factoryFor === "Pharmacy";
}

type HealthFacilityTraitKeys<TOptions extends HealthFacilityFactoryDefineOptions> = keyof TOptions["traits"];

export interface HealthFacilityFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "HealthFacility";
    build(inputData?: Partial<Prisma.HealthFacilityCreateInput>): PromiseLike<Prisma.HealthFacilityCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.HealthFacilityCreateInput>): PromiseLike<Prisma.HealthFacilityCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.HealthFacilityCreateInput>[]): PromiseLike<Prisma.HealthFacilityCreateInput[]>;
    pickForConnect(inputData: HealthFacility): Pick<HealthFacility, "id">;
    create(inputData?: Partial<Prisma.HealthFacilityCreateInput>): PromiseLike<HealthFacility>;
    createList(inputData: number | readonly Partial<Prisma.HealthFacilityCreateInput>[]): PromiseLike<HealthFacility[]>;
    createForConnect(inputData?: Partial<Prisma.HealthFacilityCreateInput>): PromiseLike<Pick<HealthFacility, "id">>;
}

export interface HealthFacilityFactoryInterface<TOptions extends HealthFacilityFactoryDefineOptions = HealthFacilityFactoryDefineOptions> extends HealthFacilityFactoryInterfaceWithoutTraits {
    use(name: HealthFacilityTraitKeys<TOptions>, ...names: readonly HealthFacilityTraitKeys<TOptions>[]): HealthFacilityFactoryInterfaceWithoutTraits;
}

function autoGenerateHealthFacilityScalarsOrEnums({ seq }: {
    readonly seq: number;
}): HealthFacilityScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "id", isId: true, isUnique: false, seq }),
        code: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "code", isId: false, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        searchName: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "searchName", isId: false, isUnique: false, seq }),
        postalCode: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "postalCode", isId: false, isUnique: false, seq }),
        address1: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "address1", isId: false, isUnique: false, seq })
    };
}

function defineHealthFacilityFactoryInternal<TOptions extends HealthFacilityFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): HealthFacilityFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly HealthFacilityTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("HealthFacility", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.HealthFacilityCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateHealthFacilityScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<HealthFacilityFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<HealthFacilityFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isHealthFacilitycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isHealthFacilityupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser,
                pharmacy: isHealthFacilitypharmacyFactory(defaultData.pharmacy) ? {
                    create: await defaultData.pharmacy.build()
                } : defaultData.pharmacy
            };
            const data: Prisma.HealthFacilityCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.HealthFacilityCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: HealthFacility) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.HealthFacilityCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().healthFacility.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.HealthFacilityCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.HealthFacilityCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "HealthFacility" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: HealthFacilityTraitKeys<TOptions>, ...names: readonly HealthFacilityTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link HealthFacility} model.
 *
 * @param options
 * @returns factory {@link HealthFacilityFactoryInterface}
 */
export function defineHealthFacilityFactory<TOptions extends HealthFacilityFactoryDefineOptions>(options: TOptions): HealthFacilityFactoryInterface<TOptions> {
    return defineHealthFacilityFactoryInternal(options);
}

type HealthFacilityCodeGroupScalarOrEnumFields = {
    id: string;
    name: string;
    formatType: HealthFacilityCodeGroupFormatType;
};

type HealthFacilityCodeGroupcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupCreatedUserInput["create"]>;
};

type HealthFacilityCodeGroupupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupUpdatedUserInput["create"]>;
};

type HealthFacilityCodeGroupFactoryDefineInput = {
    id?: string;
    name?: string;
    formatType?: HealthFacilityCodeGroupFormatType;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    company?: Prisma.CompanyCreateNestedManyWithoutHealthFacilityCodeGroupInput;
    createdUser?: HealthFacilityCodeGroupcreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupCreatedUserInput;
    updatedUser?: HealthFacilityCodeGroupupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupUpdatedUserInput;
    healthFacilityCodeManage?: Prisma.HealthFacilityCodeManageCreateNestedManyWithoutHealthFacilityCodeGroupInput;
};

type HealthFacilityCodeGroupFactoryDefineOptions = {
    defaultData?: Resolver<HealthFacilityCodeGroupFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<HealthFacilityCodeGroupFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isHealthFacilityCodeGroupcreatedUserFactory(x: HealthFacilityCodeGroupcreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupCreatedUserInput | undefined): x is HealthFacilityCodeGroupcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilityCodeGroupupdatedUserFactory(x: HealthFacilityCodeGroupupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeGroupUpdatedUserInput | undefined): x is HealthFacilityCodeGroupupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type HealthFacilityCodeGroupTraitKeys<TOptions extends HealthFacilityCodeGroupFactoryDefineOptions> = keyof TOptions["traits"];

export interface HealthFacilityCodeGroupFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "HealthFacilityCodeGroup";
    build(inputData?: Partial<Prisma.HealthFacilityCodeGroupCreateInput>): PromiseLike<Prisma.HealthFacilityCodeGroupCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.HealthFacilityCodeGroupCreateInput>): PromiseLike<Prisma.HealthFacilityCodeGroupCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.HealthFacilityCodeGroupCreateInput>[]): PromiseLike<Prisma.HealthFacilityCodeGroupCreateInput[]>;
    pickForConnect(inputData: HealthFacilityCodeGroup): Pick<HealthFacilityCodeGroup, "id">;
    create(inputData?: Partial<Prisma.HealthFacilityCodeGroupCreateInput>): PromiseLike<HealthFacilityCodeGroup>;
    createList(inputData: number | readonly Partial<Prisma.HealthFacilityCodeGroupCreateInput>[]): PromiseLike<HealthFacilityCodeGroup[]>;
    createForConnect(inputData?: Partial<Prisma.HealthFacilityCodeGroupCreateInput>): PromiseLike<Pick<HealthFacilityCodeGroup, "id">>;
}

export interface HealthFacilityCodeGroupFactoryInterface<TOptions extends HealthFacilityCodeGroupFactoryDefineOptions = HealthFacilityCodeGroupFactoryDefineOptions> extends HealthFacilityCodeGroupFactoryInterfaceWithoutTraits {
    use(name: HealthFacilityCodeGroupTraitKeys<TOptions>, ...names: readonly HealthFacilityCodeGroupTraitKeys<TOptions>[]): HealthFacilityCodeGroupFactoryInterfaceWithoutTraits;
}

function autoGenerateHealthFacilityCodeGroupScalarsOrEnums({ seq }: {
    readonly seq: number;
}): HealthFacilityCodeGroupScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "HealthFacilityCodeGroup", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "HealthFacilityCodeGroup", fieldName: "name", isId: false, isUnique: false, seq }),
        formatType: "SIMPLE"
    };
}

function defineHealthFacilityCodeGroupFactoryInternal<TOptions extends HealthFacilityCodeGroupFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): HealthFacilityCodeGroupFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly HealthFacilityCodeGroupTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("HealthFacilityCodeGroup", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.HealthFacilityCodeGroupCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateHealthFacilityCodeGroupScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<HealthFacilityCodeGroupFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<HealthFacilityCodeGroupFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isHealthFacilityCodeGroupcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isHealthFacilityCodeGroupupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.HealthFacilityCodeGroupCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.HealthFacilityCodeGroupCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: HealthFacilityCodeGroup) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.HealthFacilityCodeGroupCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().healthFacilityCodeGroup.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.HealthFacilityCodeGroupCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.HealthFacilityCodeGroupCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "HealthFacilityCodeGroup" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: HealthFacilityCodeGroupTraitKeys<TOptions>, ...names: readonly HealthFacilityCodeGroupTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link HealthFacilityCodeGroup} model.
 *
 * @param options
 * @returns factory {@link HealthFacilityCodeGroupFactoryInterface}
 */
export function defineHealthFacilityCodeGroupFactory<TOptions extends HealthFacilityCodeGroupFactoryDefineOptions>(options?: TOptions): HealthFacilityCodeGroupFactoryInterface<TOptions> {
    return defineHealthFacilityCodeGroupFactoryInternal(options ?? {});
}

type HealthFacilityCodeManageScalarOrEnumFields = {
    id: string;
    code: string;
};

type HealthFacilityCodeManagehealthFacilityFactory = {
    _factoryFor: "HealthFacility";
    build: () => PromiseLike<Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityCodeManageInput["create"]>;
};

type HealthFacilityCodeManagehealthFacilityCodeGroupFactory = {
    _factoryFor: "HealthFacilityCodeGroup";
    build: () => PromiseLike<Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutHealthFacilityCodeManageInput["create"]>;
};

type HealthFacilityCodeManagecreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageCreatedUserInput["create"]>;
};

type HealthFacilityCodeManageupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageUpdatedUserInput["create"]>;
};

type HealthFacilityCodeManageFactoryDefineInput = {
    id?: string;
    code?: string;
    sequenceNo?: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility: HealthFacilityCodeManagehealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityCodeManageInput;
    healthFacilityCodeGroup: HealthFacilityCodeManagehealthFacilityCodeGroupFactory | Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutHealthFacilityCodeManageInput;
    createdUser?: HealthFacilityCodeManagecreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageCreatedUserInput;
    updatedUser?: HealthFacilityCodeManageupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageUpdatedUserInput;
};

type HealthFacilityCodeManageFactoryDefineOptions = {
    defaultData: Resolver<HealthFacilityCodeManageFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<HealthFacilityCodeManageFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isHealthFacilityCodeManagehealthFacilityFactory(x: HealthFacilityCodeManagehealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityCodeManageInput | undefined): x is HealthFacilityCodeManagehealthFacilityFactory {
    return (x as any)?._factoryFor === "HealthFacility";
}

function isHealthFacilityCodeManagehealthFacilityCodeGroupFactory(x: HealthFacilityCodeManagehealthFacilityCodeGroupFactory | Prisma.HealthFacilityCodeGroupCreateNestedOneWithoutHealthFacilityCodeManageInput | undefined): x is HealthFacilityCodeManagehealthFacilityCodeGroupFactory {
    return (x as any)?._factoryFor === "HealthFacilityCodeGroup";
}

function isHealthFacilityCodeManagecreatedUserFactory(x: HealthFacilityCodeManagecreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageCreatedUserInput | undefined): x is HealthFacilityCodeManagecreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilityCodeManageupdatedUserFactory(x: HealthFacilityCodeManageupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityCodeManageUpdatedUserInput | undefined): x is HealthFacilityCodeManageupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type HealthFacilityCodeManageTraitKeys<TOptions extends HealthFacilityCodeManageFactoryDefineOptions> = keyof TOptions["traits"];

export interface HealthFacilityCodeManageFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "HealthFacilityCodeManage";
    build(inputData?: Partial<Prisma.HealthFacilityCodeManageCreateInput>): PromiseLike<Prisma.HealthFacilityCodeManageCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.HealthFacilityCodeManageCreateInput>): PromiseLike<Prisma.HealthFacilityCodeManageCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.HealthFacilityCodeManageCreateInput>[]): PromiseLike<Prisma.HealthFacilityCodeManageCreateInput[]>;
    pickForConnect(inputData: HealthFacilityCodeManage): Pick<HealthFacilityCodeManage, "id">;
    create(inputData?: Partial<Prisma.HealthFacilityCodeManageCreateInput>): PromiseLike<HealthFacilityCodeManage>;
    createList(inputData: number | readonly Partial<Prisma.HealthFacilityCodeManageCreateInput>[]): PromiseLike<HealthFacilityCodeManage[]>;
    createForConnect(inputData?: Partial<Prisma.HealthFacilityCodeManageCreateInput>): PromiseLike<Pick<HealthFacilityCodeManage, "id">>;
}

export interface HealthFacilityCodeManageFactoryInterface<TOptions extends HealthFacilityCodeManageFactoryDefineOptions = HealthFacilityCodeManageFactoryDefineOptions> extends HealthFacilityCodeManageFactoryInterfaceWithoutTraits {
    use(name: HealthFacilityCodeManageTraitKeys<TOptions>, ...names: readonly HealthFacilityCodeManageTraitKeys<TOptions>[]): HealthFacilityCodeManageFactoryInterfaceWithoutTraits;
}

function autoGenerateHealthFacilityCodeManageScalarsOrEnums({ seq }: {
    readonly seq: number;
}): HealthFacilityCodeManageScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "HealthFacilityCodeManage", fieldName: "id", isId: true, isUnique: false, seq }),
        code: getScalarFieldValueGenerator().String({ modelName: "HealthFacilityCodeManage", fieldName: "code", isId: false, isUnique: false, seq })
    };
}

function defineHealthFacilityCodeManageFactoryInternal<TOptions extends HealthFacilityCodeManageFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): HealthFacilityCodeManageFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly HealthFacilityCodeManageTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("HealthFacilityCodeManage", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.HealthFacilityCodeManageCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateHealthFacilityCodeManageScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<HealthFacilityCodeManageFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<HealthFacilityCodeManageFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                healthFacility: isHealthFacilityCodeManagehealthFacilityFactory(defaultData.healthFacility) ? {
                    create: await defaultData.healthFacility.build()
                } : defaultData.healthFacility,
                healthFacilityCodeGroup: isHealthFacilityCodeManagehealthFacilityCodeGroupFactory(defaultData.healthFacilityCodeGroup) ? {
                    create: await defaultData.healthFacilityCodeGroup.build()
                } : defaultData.healthFacilityCodeGroup,
                createdUser: isHealthFacilityCodeManagecreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isHealthFacilityCodeManageupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.HealthFacilityCodeManageCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.HealthFacilityCodeManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: HealthFacilityCodeManage) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.HealthFacilityCodeManageCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().healthFacilityCodeManage.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.HealthFacilityCodeManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.HealthFacilityCodeManageCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "HealthFacilityCodeManage" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: HealthFacilityCodeManageTraitKeys<TOptions>, ...names: readonly HealthFacilityCodeManageTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link HealthFacilityCodeManage} model.
 *
 * @param options
 * @returns factory {@link HealthFacilityCodeManageFactoryInterface}
 */
export function defineHealthFacilityCodeManageFactory<TOptions extends HealthFacilityCodeManageFactoryDefineOptions>(options: TOptions): HealthFacilityCodeManageFactoryInterface<TOptions> {
    return defineHealthFacilityCodeManageFactoryInternal(options);
}

type HealthFacilityRelatePharmacyScalarOrEnumFields = {
    id: string;
    startDate: Date;
};

type HealthFacilityRelatePharmacyhealthFacilityFactory = {
    _factoryFor: "HealthFacility";
    build: () => PromiseLike<Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityRelatePharmacyInput["create"]>;
};

type HealthFacilityRelatePharmacypharmacyFactory = {
    _factoryFor: "Pharmacy";
    build: () => PromiseLike<Prisma.PharmacyCreateNestedOneWithoutHealthFacilityRelatePharmacyInput["create"]>;
};

type HealthFacilityRelatePharmacycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyCreatedUserInput["create"]>;
};

type HealthFacilityRelatePharmacyupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyUpdatedUserInput["create"]>;
};

type HealthFacilityRelatePharmacyFactoryDefineInput = {
    id?: string;
    startDate?: Date;
    endDate?: Date;
    note?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility: HealthFacilityRelatePharmacyhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityRelatePharmacyInput;
    pharmacy: HealthFacilityRelatePharmacypharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutHealthFacilityRelatePharmacyInput;
    createdUser?: HealthFacilityRelatePharmacycreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyCreatedUserInput;
    updatedUser?: HealthFacilityRelatePharmacyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyUpdatedUserInput;
};

type HealthFacilityRelatePharmacyFactoryDefineOptions = {
    defaultData: Resolver<HealthFacilityRelatePharmacyFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<HealthFacilityRelatePharmacyFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isHealthFacilityRelatePharmacyhealthFacilityFactory(x: HealthFacilityRelatePharmacyhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityRelatePharmacyInput | undefined): x is HealthFacilityRelatePharmacyhealthFacilityFactory {
    return (x as any)?._factoryFor === "HealthFacility";
}

function isHealthFacilityRelatePharmacypharmacyFactory(x: HealthFacilityRelatePharmacypharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutHealthFacilityRelatePharmacyInput | undefined): x is HealthFacilityRelatePharmacypharmacyFactory {
    return (x as any)?._factoryFor === "Pharmacy";
}

function isHealthFacilityRelatePharmacycreatedUserFactory(x: HealthFacilityRelatePharmacycreatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyCreatedUserInput | undefined): x is HealthFacilityRelatePharmacycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilityRelatePharmacyupdatedUserFactory(x: HealthFacilityRelatePharmacyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityRelatePharmacyUpdatedUserInput | undefined): x is HealthFacilityRelatePharmacyupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type HealthFacilityRelatePharmacyTraitKeys<TOptions extends HealthFacilityRelatePharmacyFactoryDefineOptions> = keyof TOptions["traits"];

export interface HealthFacilityRelatePharmacyFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "HealthFacilityRelatePharmacy";
    build(inputData?: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>): PromiseLike<Prisma.HealthFacilityRelatePharmacyCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>): PromiseLike<Prisma.HealthFacilityRelatePharmacyCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>[]): PromiseLike<Prisma.HealthFacilityRelatePharmacyCreateInput[]>;
    pickForConnect(inputData: HealthFacilityRelatePharmacy): Pick<HealthFacilityRelatePharmacy, "id">;
    create(inputData?: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>): PromiseLike<HealthFacilityRelatePharmacy>;
    createList(inputData: number | readonly Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>[]): PromiseLike<HealthFacilityRelatePharmacy[]>;
    createForConnect(inputData?: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>): PromiseLike<Pick<HealthFacilityRelatePharmacy, "id">>;
}

export interface HealthFacilityRelatePharmacyFactoryInterface<TOptions extends HealthFacilityRelatePharmacyFactoryDefineOptions = HealthFacilityRelatePharmacyFactoryDefineOptions> extends HealthFacilityRelatePharmacyFactoryInterfaceWithoutTraits {
    use(name: HealthFacilityRelatePharmacyTraitKeys<TOptions>, ...names: readonly HealthFacilityRelatePharmacyTraitKeys<TOptions>[]): HealthFacilityRelatePharmacyFactoryInterfaceWithoutTraits;
}

function autoGenerateHealthFacilityRelatePharmacyScalarsOrEnums({ seq }: {
    readonly seq: number;
}): HealthFacilityRelatePharmacyScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "HealthFacilityRelatePharmacy", fieldName: "id", isId: true, isUnique: false, seq }),
        startDate: getScalarFieldValueGenerator().DateTime({ modelName: "HealthFacilityRelatePharmacy", fieldName: "startDate", isId: false, isUnique: false, seq })
    };
}

function defineHealthFacilityRelatePharmacyFactoryInternal<TOptions extends HealthFacilityRelatePharmacyFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): HealthFacilityRelatePharmacyFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly HealthFacilityRelatePharmacyTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("HealthFacilityRelatePharmacy", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateHealthFacilityRelatePharmacyScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<HealthFacilityRelatePharmacyFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<HealthFacilityRelatePharmacyFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                healthFacility: isHealthFacilityRelatePharmacyhealthFacilityFactory(defaultData.healthFacility) ? {
                    create: await defaultData.healthFacility.build()
                } : defaultData.healthFacility,
                pharmacy: isHealthFacilityRelatePharmacypharmacyFactory(defaultData.pharmacy) ? {
                    create: await defaultData.pharmacy.build()
                } : defaultData.pharmacy,
                createdUser: isHealthFacilityRelatePharmacycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isHealthFacilityRelatePharmacyupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.HealthFacilityRelatePharmacyCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: HealthFacilityRelatePharmacy) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().healthFacilityRelatePharmacy.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.HealthFacilityRelatePharmacyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.HealthFacilityRelatePharmacyCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "HealthFacilityRelatePharmacy" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: HealthFacilityRelatePharmacyTraitKeys<TOptions>, ...names: readonly HealthFacilityRelatePharmacyTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link HealthFacilityRelatePharmacy} model.
 *
 * @param options
 * @returns factory {@link HealthFacilityRelatePharmacyFactoryInterface}
 */
export function defineHealthFacilityRelatePharmacyFactory<TOptions extends HealthFacilityRelatePharmacyFactoryDefineOptions>(options: TOptions): HealthFacilityRelatePharmacyFactoryInterface<TOptions> {
    return defineHealthFacilityRelatePharmacyFactoryInternal(options);
}

type InquiryScalarOrEnumFields = {
    id: string;
    title: string;
    content: string;
};

type InquirypatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutInquiryInput["create"]>;
};

type InquirycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryCreatedUserInput["create"]>;
};

type InquiryupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryUpdatedUserInput["create"]>;
};

type InquiryFactoryDefineInput = {
    id?: string;
    title?: string;
    content?: string;
    status?: InquiryStatus;
    pharrmacyId?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: InquirypatientFactory | Prisma.PatientCreateNestedOneWithoutInquiryInput;
    createdUser?: InquirycreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCreatedUserInput;
    updatedUser?: InquiryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryUpdatedUserInput;
    inquiryCorrespond?: Prisma.InquiryCorrespondCreateNestedManyWithoutInquiryInput;
};

type InquiryFactoryDefineOptions = {
    defaultData: Resolver<InquiryFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<InquiryFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isInquirypatientFactory(x: InquirypatientFactory | Prisma.PatientCreateNestedOneWithoutInquiryInput | undefined): x is InquirypatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

function isInquirycreatedUserFactory(x: InquirycreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCreatedUserInput | undefined): x is InquirycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isInquiryupdatedUserFactory(x: InquiryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryUpdatedUserInput | undefined): x is InquiryupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type InquiryTraitKeys<TOptions extends InquiryFactoryDefineOptions> = keyof TOptions["traits"];

export interface InquiryFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Inquiry";
    build(inputData?: Partial<Prisma.InquiryCreateInput>): PromiseLike<Prisma.InquiryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.InquiryCreateInput>): PromiseLike<Prisma.InquiryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.InquiryCreateInput>[]): PromiseLike<Prisma.InquiryCreateInput[]>;
    pickForConnect(inputData: Inquiry): Pick<Inquiry, "id">;
    create(inputData?: Partial<Prisma.InquiryCreateInput>): PromiseLike<Inquiry>;
    createList(inputData: number | readonly Partial<Prisma.InquiryCreateInput>[]): PromiseLike<Inquiry[]>;
    createForConnect(inputData?: Partial<Prisma.InquiryCreateInput>): PromiseLike<Pick<Inquiry, "id">>;
}

export interface InquiryFactoryInterface<TOptions extends InquiryFactoryDefineOptions = InquiryFactoryDefineOptions> extends InquiryFactoryInterfaceWithoutTraits {
    use(name: InquiryTraitKeys<TOptions>, ...names: readonly InquiryTraitKeys<TOptions>[]): InquiryFactoryInterfaceWithoutTraits;
}

function autoGenerateInquiryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): InquiryScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Inquiry", fieldName: "id", isId: true, isUnique: false, seq }),
        title: getScalarFieldValueGenerator().String({ modelName: "Inquiry", fieldName: "title", isId: false, isUnique: false, seq }),
        content: getScalarFieldValueGenerator().String({ modelName: "Inquiry", fieldName: "content", isId: false, isUnique: false, seq })
    };
}

function defineInquiryFactoryInternal<TOptions extends InquiryFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): InquiryFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly InquiryTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Inquiry", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.InquiryCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateInquiryScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<InquiryFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<InquiryFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isInquirypatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient,
                createdUser: isInquirycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isInquiryupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.InquiryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.InquiryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Inquiry) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.InquiryCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().inquiry.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.InquiryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.InquiryCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Inquiry" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: InquiryTraitKeys<TOptions>, ...names: readonly InquiryTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link Inquiry} model.
 *
 * @param options
 * @returns factory {@link InquiryFactoryInterface}
 */
export function defineInquiryFactory<TOptions extends InquiryFactoryDefineOptions>(options: TOptions): InquiryFactoryInterface<TOptions> {
    return defineInquiryFactoryInternal(options);
}

type InquiryCorrespondScalarOrEnumFields = {
    id: string;
    content: string;
};

type InquiryCorrespondinquiryFactory = {
    _factoryFor: "Inquiry";
    build: () => PromiseLike<Prisma.InquiryCreateNestedOneWithoutInquiryCorrespondInput["create"]>;
};

type InquiryCorrespondcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryCorrespondCreatedUserInput["create"]>;
};

type InquiryCorrespondupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryCorrespondUpdatedUserInput["create"]>;
};

type InquiryCorrespondFactoryDefineInput = {
    id?: string;
    content?: string;
    userName?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    inquiry: InquiryCorrespondinquiryFactory | Prisma.InquiryCreateNestedOneWithoutInquiryCorrespondInput;
    createdUser?: InquiryCorrespondcreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCorrespondCreatedUserInput;
    updatedUser?: InquiryCorrespondupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCorrespondUpdatedUserInput;
    inquiryFile?: Prisma.InquiryFileCreateNestedManyWithoutInquiryCorrespondInput;
};

type InquiryCorrespondFactoryDefineOptions = {
    defaultData: Resolver<InquiryCorrespondFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<InquiryCorrespondFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isInquiryCorrespondinquiryFactory(x: InquiryCorrespondinquiryFactory | Prisma.InquiryCreateNestedOneWithoutInquiryCorrespondInput | undefined): x is InquiryCorrespondinquiryFactory {
    return (x as any)?._factoryFor === "Inquiry";
}

function isInquiryCorrespondcreatedUserFactory(x: InquiryCorrespondcreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCorrespondCreatedUserInput | undefined): x is InquiryCorrespondcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isInquiryCorrespondupdatedUserFactory(x: InquiryCorrespondupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryCorrespondUpdatedUserInput | undefined): x is InquiryCorrespondupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type InquiryCorrespondTraitKeys<TOptions extends InquiryCorrespondFactoryDefineOptions> = keyof TOptions["traits"];

export interface InquiryCorrespondFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "InquiryCorrespond";
    build(inputData?: Partial<Prisma.InquiryCorrespondCreateInput>): PromiseLike<Prisma.InquiryCorrespondCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.InquiryCorrespondCreateInput>): PromiseLike<Prisma.InquiryCorrespondCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.InquiryCorrespondCreateInput>[]): PromiseLike<Prisma.InquiryCorrespondCreateInput[]>;
    pickForConnect(inputData: InquiryCorrespond): Pick<InquiryCorrespond, "id">;
    create(inputData?: Partial<Prisma.InquiryCorrespondCreateInput>): PromiseLike<InquiryCorrespond>;
    createList(inputData: number | readonly Partial<Prisma.InquiryCorrespondCreateInput>[]): PromiseLike<InquiryCorrespond[]>;
    createForConnect(inputData?: Partial<Prisma.InquiryCorrespondCreateInput>): PromiseLike<Pick<InquiryCorrespond, "id">>;
}

export interface InquiryCorrespondFactoryInterface<TOptions extends InquiryCorrespondFactoryDefineOptions = InquiryCorrespondFactoryDefineOptions> extends InquiryCorrespondFactoryInterfaceWithoutTraits {
    use(name: InquiryCorrespondTraitKeys<TOptions>, ...names: readonly InquiryCorrespondTraitKeys<TOptions>[]): InquiryCorrespondFactoryInterfaceWithoutTraits;
}

function autoGenerateInquiryCorrespondScalarsOrEnums({ seq }: {
    readonly seq: number;
}): InquiryCorrespondScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "InquiryCorrespond", fieldName: "id", isId: true, isUnique: false, seq }),
        content: getScalarFieldValueGenerator().String({ modelName: "InquiryCorrespond", fieldName: "content", isId: false, isUnique: false, seq })
    };
}

function defineInquiryCorrespondFactoryInternal<TOptions extends InquiryCorrespondFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): InquiryCorrespondFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly InquiryCorrespondTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("InquiryCorrespond", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.InquiryCorrespondCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateInquiryCorrespondScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<InquiryCorrespondFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<InquiryCorrespondFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                inquiry: isInquiryCorrespondinquiryFactory(defaultData.inquiry) ? {
                    create: await defaultData.inquiry.build()
                } : defaultData.inquiry,
                createdUser: isInquiryCorrespondcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isInquiryCorrespondupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.InquiryCorrespondCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.InquiryCorrespondCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: InquiryCorrespond) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.InquiryCorrespondCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().inquiryCorrespond.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.InquiryCorrespondCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.InquiryCorrespondCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "InquiryCorrespond" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: InquiryCorrespondTraitKeys<TOptions>, ...names: readonly InquiryCorrespondTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link InquiryCorrespond} model.
 *
 * @param options
 * @returns factory {@link InquiryCorrespondFactoryInterface}
 */
export function defineInquiryCorrespondFactory<TOptions extends InquiryCorrespondFactoryDefineOptions>(options: TOptions): InquiryCorrespondFactoryInterface<TOptions> {
    return defineInquiryCorrespondFactoryInternal(options);
}

type InquiryFileScalarOrEnumFields = {
    id: string;
    filePath: string;
};

type InquiryFileinquiryCorrespondFactory = {
    _factoryFor: "InquiryCorrespond";
    build: () => PromiseLike<Prisma.InquiryCorrespondCreateNestedOneWithoutInquiryFileInput["create"]>;
};

type InquiryFilecreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryFileCreatedUserInput["create"]>;
};

type InquiryFileupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutInquiryFileUpdatedUserInput["create"]>;
};

type InquiryFileFactoryDefineInput = {
    id?: string;
    filePath?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    inquiryCorrespond: InquiryFileinquiryCorrespondFactory | Prisma.InquiryCorrespondCreateNestedOneWithoutInquiryFileInput;
    createdUser?: InquiryFilecreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryFileCreatedUserInput;
    updatedUser?: InquiryFileupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryFileUpdatedUserInput;
};

type InquiryFileFactoryDefineOptions = {
    defaultData: Resolver<InquiryFileFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<InquiryFileFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isInquiryFileinquiryCorrespondFactory(x: InquiryFileinquiryCorrespondFactory | Prisma.InquiryCorrespondCreateNestedOneWithoutInquiryFileInput | undefined): x is InquiryFileinquiryCorrespondFactory {
    return (x as any)?._factoryFor === "InquiryCorrespond";
}

function isInquiryFilecreatedUserFactory(x: InquiryFilecreatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryFileCreatedUserInput | undefined): x is InquiryFilecreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isInquiryFileupdatedUserFactory(x: InquiryFileupdatedUserFactory | Prisma.UserCreateNestedOneWithoutInquiryFileUpdatedUserInput | undefined): x is InquiryFileupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type InquiryFileTraitKeys<TOptions extends InquiryFileFactoryDefineOptions> = keyof TOptions["traits"];

export interface InquiryFileFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "InquiryFile";
    build(inputData?: Partial<Prisma.InquiryFileCreateInput>): PromiseLike<Prisma.InquiryFileCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.InquiryFileCreateInput>): PromiseLike<Prisma.InquiryFileCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.InquiryFileCreateInput>[]): PromiseLike<Prisma.InquiryFileCreateInput[]>;
    pickForConnect(inputData: InquiryFile): Pick<InquiryFile, "id">;
    create(inputData?: Partial<Prisma.InquiryFileCreateInput>): PromiseLike<InquiryFile>;
    createList(inputData: number | readonly Partial<Prisma.InquiryFileCreateInput>[]): PromiseLike<InquiryFile[]>;
    createForConnect(inputData?: Partial<Prisma.InquiryFileCreateInput>): PromiseLike<Pick<InquiryFile, "id">>;
}

export interface InquiryFileFactoryInterface<TOptions extends InquiryFileFactoryDefineOptions = InquiryFileFactoryDefineOptions> extends InquiryFileFactoryInterfaceWithoutTraits {
    use(name: InquiryFileTraitKeys<TOptions>, ...names: readonly InquiryFileTraitKeys<TOptions>[]): InquiryFileFactoryInterfaceWithoutTraits;
}

function autoGenerateInquiryFileScalarsOrEnums({ seq }: {
    readonly seq: number;
}): InquiryFileScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "InquiryFile", fieldName: "id", isId: true, isUnique: false, seq }),
        filePath: getScalarFieldValueGenerator().String({ modelName: "InquiryFile", fieldName: "filePath", isId: false, isUnique: false, seq })
    };
}

function defineInquiryFileFactoryInternal<TOptions extends InquiryFileFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): InquiryFileFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly InquiryFileTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("InquiryFile", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.InquiryFileCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateInquiryFileScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<InquiryFileFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<InquiryFileFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                inquiryCorrespond: isInquiryFileinquiryCorrespondFactory(defaultData.inquiryCorrespond) ? {
                    create: await defaultData.inquiryCorrespond.build()
                } : defaultData.inquiryCorrespond,
                createdUser: isInquiryFilecreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isInquiryFileupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.InquiryFileCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.InquiryFileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: InquiryFile) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.InquiryFileCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().inquiryFile.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.InquiryFileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.InquiryFileCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "InquiryFile" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: InquiryFileTraitKeys<TOptions>, ...names: readonly InquiryFileTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link InquiryFile} model.
 *
 * @param options
 * @returns factory {@link InquiryFileFactoryInterface}
 */
export function defineInquiryFileFactory<TOptions extends InquiryFileFactoryDefineOptions>(options: TOptions): InquiryFileFactoryInterface<TOptions> {
    return defineInquiryFileFactoryInternal(options);
}

type PatientScalarOrEnumFields = {
    id: string;
    code: string;
    name: string;
    nameKana: string;
    searchName: string;
};

type PatientcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientCreatedUserInput["create"]>;
};

type PatientupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientUpdatedUserInput["create"]>;
};

type PatientFactoryDefineInput = {
    id?: string;
    code?: string;
    name?: string;
    nameKana?: string;
    searchName?: string;
    gender?: PatientGender;
    birthday?: Date | null;
    medicalInsuranceStatus?: PatientMedicalInsuranceStatus;
    medicalInsuranceStartDate?: Date | null;
    medicalInsuranceEndDate?: Date | null;
    medicalShareConfirmDate?: Date | null;
    medicalShare?: PatientMedicalShare | null;
    nursingInsuranceStatus?: PatientNursingInsuranceStatus;
    nursingInsuranceStartDate?: Date | null;
    nursingInsuranceEndDate?: Date | null;
    nursingShareConfirmDate?: Date | null;
    nursingShare?: PatientNursingShare | null;
    consentStatus?: PatientConsentStatus;
    consentConfirmDate?: Date | null;
    paymentType?: PatientPaymentType;
    accountConfirmStatus?: PatientAccountConfirmStatus | null;
    accountManageId?: string | null;
    publicExpense?: boolean;
    receptSyncFlag?: boolean;
    deliveryName?: string | null;
    deliveryPostalCode?: string | null;
    deliveryAddress1?: string | null;
    deliveryAddress2?: string | null;
    deliveryTel?: string | null;
    healthFacilityInfo?: string | null;
    note?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    inquiry?: Prisma.InquiryCreateNestedManyWithoutPatientInput;
    createdUser?: PatientcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCreatedUserInput;
    updatedUser?: PatientupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientUpdatedUserInput;
    patientChangeHistory?: Prisma.PatientChangeHistoryCreateNestedManyWithoutPatientInput;
    patientCodeHistory?: Prisma.PatientCodeHistoryCreateNestedManyWithoutPatientInput;
    patientFile?: Prisma.PatientFileCreateNestedManyWithoutPatientInput;
    patientRelateHealthFacility?: Prisma.PatientRelateHealthFacilityCreateNestedManyWithoutPatientInput;
};

type PatientFactoryDefineOptions = {
    defaultData?: Resolver<PatientFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientcreatedUserFactory(x: PatientcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCreatedUserInput | undefined): x is PatientcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientupdatedUserFactory(x: PatientupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientUpdatedUserInput | undefined): x is PatientupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientTraitKeys<TOptions extends PatientFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Patient";
    build(inputData?: Partial<Prisma.PatientCreateInput>): PromiseLike<Prisma.PatientCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientCreateInput>): PromiseLike<Prisma.PatientCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientCreateInput>[]): PromiseLike<Prisma.PatientCreateInput[]>;
    pickForConnect(inputData: Patient): Pick<Patient, "id">;
    create(inputData?: Partial<Prisma.PatientCreateInput>): PromiseLike<Patient>;
    createList(inputData: number | readonly Partial<Prisma.PatientCreateInput>[]): PromiseLike<Patient[]>;
    createForConnect(inputData?: Partial<Prisma.PatientCreateInput>): PromiseLike<Pick<Patient, "id">>;
}

export interface PatientFactoryInterface<TOptions extends PatientFactoryDefineOptions = PatientFactoryDefineOptions> extends PatientFactoryInterfaceWithoutTraits {
    use(name: PatientTraitKeys<TOptions>, ...names: readonly PatientTraitKeys<TOptions>[]): PatientFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "id", isId: true, isUnique: false, seq }),
        code: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "code", isId: false, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        searchName: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "searchName", isId: false, isUnique: false, seq })
    };
}

function definePatientFactoryInternal<TOptions extends PatientFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Patient", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isPatientcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Patient) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patient.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Patient" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientTraitKeys<TOptions>, ...names: readonly PatientTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link Patient} model.
 *
 * @param options
 * @returns factory {@link PatientFactoryInterface}
 */
export function definePatientFactory<TOptions extends PatientFactoryDefineOptions>(options?: TOptions): PatientFactoryInterface<TOptions> {
    return definePatientFactoryInternal(options ?? {});
}

type PatientChangeContentScalarOrEnumFields = {
    id: string;
    itemName: string;
};

type PatientChangeContentpatientChangeHistoryFactory = {
    _factoryFor: "PatientChangeHistory";
    build: () => PromiseLike<Prisma.PatientChangeHistoryCreateNestedOneWithoutPatientChangeContentInput["create"]>;
};

type PatientChangeContentcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientChangeContentCreatedUserInput["create"]>;
};

type PatientChangeContentupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientChangeContentUpdatedUserInput["create"]>;
};

type PatientChangeContentFactoryDefineInput = {
    id?: string;
    itemName?: string;
    beforeValue?: string | null;
    afterValue?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patientChangeHistory: PatientChangeContentpatientChangeHistoryFactory | Prisma.PatientChangeHistoryCreateNestedOneWithoutPatientChangeContentInput;
    createdUser?: PatientChangeContentcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeContentCreatedUserInput;
    updatedUser?: PatientChangeContentupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeContentUpdatedUserInput;
};

type PatientChangeContentFactoryDefineOptions = {
    defaultData: Resolver<PatientChangeContentFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientChangeContentFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientChangeContentpatientChangeHistoryFactory(x: PatientChangeContentpatientChangeHistoryFactory | Prisma.PatientChangeHistoryCreateNestedOneWithoutPatientChangeContentInput | undefined): x is PatientChangeContentpatientChangeHistoryFactory {
    return (x as any)?._factoryFor === "PatientChangeHistory";
}

function isPatientChangeContentcreatedUserFactory(x: PatientChangeContentcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeContentCreatedUserInput | undefined): x is PatientChangeContentcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientChangeContentupdatedUserFactory(x: PatientChangeContentupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeContentUpdatedUserInput | undefined): x is PatientChangeContentupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientChangeContentTraitKeys<TOptions extends PatientChangeContentFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientChangeContentFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientChangeContent";
    build(inputData?: Partial<Prisma.PatientChangeContentCreateInput>): PromiseLike<Prisma.PatientChangeContentCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientChangeContentCreateInput>): PromiseLike<Prisma.PatientChangeContentCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientChangeContentCreateInput>[]): PromiseLike<Prisma.PatientChangeContentCreateInput[]>;
    pickForConnect(inputData: PatientChangeContent): Pick<PatientChangeContent, "id">;
    create(inputData?: Partial<Prisma.PatientChangeContentCreateInput>): PromiseLike<PatientChangeContent>;
    createList(inputData: number | readonly Partial<Prisma.PatientChangeContentCreateInput>[]): PromiseLike<PatientChangeContent[]>;
    createForConnect(inputData?: Partial<Prisma.PatientChangeContentCreateInput>): PromiseLike<Pick<PatientChangeContent, "id">>;
}

export interface PatientChangeContentFactoryInterface<TOptions extends PatientChangeContentFactoryDefineOptions = PatientChangeContentFactoryDefineOptions> extends PatientChangeContentFactoryInterfaceWithoutTraits {
    use(name: PatientChangeContentTraitKeys<TOptions>, ...names: readonly PatientChangeContentTraitKeys<TOptions>[]): PatientChangeContentFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientChangeContentScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientChangeContentScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientChangeContent", fieldName: "id", isId: true, isUnique: false, seq }),
        itemName: getScalarFieldValueGenerator().String({ modelName: "PatientChangeContent", fieldName: "itemName", isId: false, isUnique: false, seq })
    };
}

function definePatientChangeContentFactoryInternal<TOptions extends PatientChangeContentFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientChangeContentFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientChangeContentTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientChangeContent", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientChangeContentCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientChangeContentScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientChangeContentFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientChangeContentFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patientChangeHistory: isPatientChangeContentpatientChangeHistoryFactory(defaultData.patientChangeHistory) ? {
                    create: await defaultData.patientChangeHistory.build()
                } : defaultData.patientChangeHistory,
                createdUser: isPatientChangeContentcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientChangeContentupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientChangeContentCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientChangeContentCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientChangeContent) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientChangeContentCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientChangeContent.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientChangeContentCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientChangeContentCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientChangeContent" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientChangeContentTraitKeys<TOptions>, ...names: readonly PatientChangeContentTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientChangeContent} model.
 *
 * @param options
 * @returns factory {@link PatientChangeContentFactoryInterface}
 */
export function definePatientChangeContentFactory<TOptions extends PatientChangeContentFactoryDefineOptions>(options: TOptions): PatientChangeContentFactoryInterface<TOptions> {
    return definePatientChangeContentFactoryInternal(options);
}

type PatientChangeHistoryScalarOrEnumFields = {
    id: string;
};

type PatientChangeHistorypatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientChangeHistoryInput["create"]>;
};

type PatientChangeHistorycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientChangeHistoryCreatedUserInput["create"]>;
};

type PatientChangeHistoryupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientChangeHistoryUpdatedUserInput["create"]>;
};

type PatientChangeHistoryFactoryDefineInput = {
    id?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patientChangeContent?: Prisma.PatientChangeContentCreateNestedManyWithoutPatientChangeHistoryInput;
    patient: PatientChangeHistorypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientChangeHistoryInput;
    createdUser?: PatientChangeHistorycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeHistoryCreatedUserInput;
    updatedUser?: PatientChangeHistoryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeHistoryUpdatedUserInput;
};

type PatientChangeHistoryFactoryDefineOptions = {
    defaultData: Resolver<PatientChangeHistoryFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientChangeHistoryFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientChangeHistorypatientFactory(x: PatientChangeHistorypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientChangeHistoryInput | undefined): x is PatientChangeHistorypatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

function isPatientChangeHistorycreatedUserFactory(x: PatientChangeHistorycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeHistoryCreatedUserInput | undefined): x is PatientChangeHistorycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientChangeHistoryupdatedUserFactory(x: PatientChangeHistoryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientChangeHistoryUpdatedUserInput | undefined): x is PatientChangeHistoryupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientChangeHistoryTraitKeys<TOptions extends PatientChangeHistoryFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientChangeHistoryFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientChangeHistory";
    build(inputData?: Partial<Prisma.PatientChangeHistoryCreateInput>): PromiseLike<Prisma.PatientChangeHistoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientChangeHistoryCreateInput>): PromiseLike<Prisma.PatientChangeHistoryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientChangeHistoryCreateInput>[]): PromiseLike<Prisma.PatientChangeHistoryCreateInput[]>;
    pickForConnect(inputData: PatientChangeHistory): Pick<PatientChangeHistory, "id">;
    create(inputData?: Partial<Prisma.PatientChangeHistoryCreateInput>): PromiseLike<PatientChangeHistory>;
    createList(inputData: number | readonly Partial<Prisma.PatientChangeHistoryCreateInput>[]): PromiseLike<PatientChangeHistory[]>;
    createForConnect(inputData?: Partial<Prisma.PatientChangeHistoryCreateInput>): PromiseLike<Pick<PatientChangeHistory, "id">>;
}

export interface PatientChangeHistoryFactoryInterface<TOptions extends PatientChangeHistoryFactoryDefineOptions = PatientChangeHistoryFactoryDefineOptions> extends PatientChangeHistoryFactoryInterfaceWithoutTraits {
    use(name: PatientChangeHistoryTraitKeys<TOptions>, ...names: readonly PatientChangeHistoryTraitKeys<TOptions>[]): PatientChangeHistoryFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientChangeHistoryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientChangeHistoryScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientChangeHistory", fieldName: "id", isId: true, isUnique: false, seq })
    };
}

function definePatientChangeHistoryFactoryInternal<TOptions extends PatientChangeHistoryFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientChangeHistoryFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientChangeHistoryTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientChangeHistory", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientChangeHistoryCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientChangeHistoryScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientChangeHistoryFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientChangeHistoryFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isPatientChangeHistorypatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient,
                createdUser: isPatientChangeHistorycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientChangeHistoryupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientChangeHistoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientChangeHistoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientChangeHistory) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientChangeHistoryCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientChangeHistory.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientChangeHistoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientChangeHistoryCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientChangeHistory" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientChangeHistoryTraitKeys<TOptions>, ...names: readonly PatientChangeHistoryTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientChangeHistory} model.
 *
 * @param options
 * @returns factory {@link PatientChangeHistoryFactoryInterface}
 */
export function definePatientChangeHistoryFactory<TOptions extends PatientChangeHistoryFactoryDefineOptions>(options: TOptions): PatientChangeHistoryFactoryInterface<TOptions> {
    return definePatientChangeHistoryFactoryInternal(options);
}

type PatientCodeHistoryScalarOrEnumFields = {
    id: string;
    patientCode: string;
};

type PatientCodeHistorypatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientCodeHistoryInput["create"]>;
};

type PatientCodeHistorycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientCodeHistoryCreatedUserInput["create"]>;
};

type PatientCodeHistoryupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientCodeHistoryUpdatedUserInput["create"]>;
};

type PatientCodeHistoryFactoryDefineInput = {
    id?: string;
    patientCode?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: PatientCodeHistorypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCodeHistoryInput;
    createdUser?: PatientCodeHistorycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCodeHistoryCreatedUserInput;
    updatedUser?: PatientCodeHistoryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCodeHistoryUpdatedUserInput;
};

type PatientCodeHistoryFactoryDefineOptions = {
    defaultData: Resolver<PatientCodeHistoryFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientCodeHistoryFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientCodeHistorypatientFactory(x: PatientCodeHistorypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCodeHistoryInput | undefined): x is PatientCodeHistorypatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

function isPatientCodeHistorycreatedUserFactory(x: PatientCodeHistorycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCodeHistoryCreatedUserInput | undefined): x is PatientCodeHistorycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientCodeHistoryupdatedUserFactory(x: PatientCodeHistoryupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientCodeHistoryUpdatedUserInput | undefined): x is PatientCodeHistoryupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientCodeHistoryTraitKeys<TOptions extends PatientCodeHistoryFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientCodeHistoryFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientCodeHistory";
    build(inputData?: Partial<Prisma.PatientCodeHistoryCreateInput>): PromiseLike<Prisma.PatientCodeHistoryCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientCodeHistoryCreateInput>): PromiseLike<Prisma.PatientCodeHistoryCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientCodeHistoryCreateInput>[]): PromiseLike<Prisma.PatientCodeHistoryCreateInput[]>;
    pickForConnect(inputData: PatientCodeHistory): Pick<PatientCodeHistory, "id">;
    create(inputData?: Partial<Prisma.PatientCodeHistoryCreateInput>): PromiseLike<PatientCodeHistory>;
    createList(inputData: number | readonly Partial<Prisma.PatientCodeHistoryCreateInput>[]): PromiseLike<PatientCodeHistory[]>;
    createForConnect(inputData?: Partial<Prisma.PatientCodeHistoryCreateInput>): PromiseLike<Pick<PatientCodeHistory, "id">>;
}

export interface PatientCodeHistoryFactoryInterface<TOptions extends PatientCodeHistoryFactoryDefineOptions = PatientCodeHistoryFactoryDefineOptions> extends PatientCodeHistoryFactoryInterfaceWithoutTraits {
    use(name: PatientCodeHistoryTraitKeys<TOptions>, ...names: readonly PatientCodeHistoryTraitKeys<TOptions>[]): PatientCodeHistoryFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientCodeHistoryScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientCodeHistoryScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientCodeHistory", fieldName: "id", isId: true, isUnique: false, seq }),
        patientCode: getScalarFieldValueGenerator().String({ modelName: "PatientCodeHistory", fieldName: "patientCode", isId: false, isUnique: false, seq })
    };
}

function definePatientCodeHistoryFactoryInternal<TOptions extends PatientCodeHistoryFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientCodeHistoryFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientCodeHistoryTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientCodeHistory", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientCodeHistoryCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientCodeHistoryScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientCodeHistoryFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientCodeHistoryFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isPatientCodeHistorypatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient,
                createdUser: isPatientCodeHistorycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientCodeHistoryupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientCodeHistoryCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientCodeHistoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientCodeHistory) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientCodeHistoryCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientCodeHistory.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientCodeHistoryCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientCodeHistoryCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientCodeHistory" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientCodeHistoryTraitKeys<TOptions>, ...names: readonly PatientCodeHistoryTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientCodeHistory} model.
 *
 * @param options
 * @returns factory {@link PatientCodeHistoryFactoryInterface}
 */
export function definePatientCodeHistoryFactory<TOptions extends PatientCodeHistoryFactoryDefineOptions>(options: TOptions): PatientCodeHistoryFactoryInterface<TOptions> {
    return definePatientCodeHistoryFactoryInternal(options);
}

type PatientFileScalarOrEnumFields = {
    id: string;
    title: string;
    filePath: string;
};

type PatientFilepatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientFileInput["create"]>;
};

type PatientFilecreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientFileCreatedUserInput["create"]>;
};

type PatientFileupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientFileUpdatedUserInput["create"]>;
};

type PatientFileFactoryDefineInput = {
    id?: string;
    title?: string;
    filePath?: string;
    note?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: PatientFilepatientFactory | Prisma.PatientCreateNestedOneWithoutPatientFileInput;
    createdUser?: PatientFilecreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientFileCreatedUserInput;
    updatedUser?: PatientFileupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientFileUpdatedUserInput;
};

type PatientFileFactoryDefineOptions = {
    defaultData: Resolver<PatientFileFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientFileFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientFilepatientFactory(x: PatientFilepatientFactory | Prisma.PatientCreateNestedOneWithoutPatientFileInput | undefined): x is PatientFilepatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

function isPatientFilecreatedUserFactory(x: PatientFilecreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientFileCreatedUserInput | undefined): x is PatientFilecreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientFileupdatedUserFactory(x: PatientFileupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientFileUpdatedUserInput | undefined): x is PatientFileupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientFileTraitKeys<TOptions extends PatientFileFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientFileFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientFile";
    build(inputData?: Partial<Prisma.PatientFileCreateInput>): PromiseLike<Prisma.PatientFileCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientFileCreateInput>): PromiseLike<Prisma.PatientFileCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientFileCreateInput>[]): PromiseLike<Prisma.PatientFileCreateInput[]>;
    pickForConnect(inputData: PatientFile): Pick<PatientFile, "id">;
    create(inputData?: Partial<Prisma.PatientFileCreateInput>): PromiseLike<PatientFile>;
    createList(inputData: number | readonly Partial<Prisma.PatientFileCreateInput>[]): PromiseLike<PatientFile[]>;
    createForConnect(inputData?: Partial<Prisma.PatientFileCreateInput>): PromiseLike<Pick<PatientFile, "id">>;
}

export interface PatientFileFactoryInterface<TOptions extends PatientFileFactoryDefineOptions = PatientFileFactoryDefineOptions> extends PatientFileFactoryInterfaceWithoutTraits {
    use(name: PatientFileTraitKeys<TOptions>, ...names: readonly PatientFileTraitKeys<TOptions>[]): PatientFileFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientFileScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientFileScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientFile", fieldName: "id", isId: true, isUnique: false, seq }),
        title: getScalarFieldValueGenerator().String({ modelName: "PatientFile", fieldName: "title", isId: false, isUnique: false, seq }),
        filePath: getScalarFieldValueGenerator().String({ modelName: "PatientFile", fieldName: "filePath", isId: false, isUnique: false, seq })
    };
}

function definePatientFileFactoryInternal<TOptions extends PatientFileFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientFileFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientFileTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientFile", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientFileCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientFileScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientFileFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientFileFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isPatientFilepatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient,
                createdUser: isPatientFilecreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientFileupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientFileCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientFileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientFile) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientFileCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientFile.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientFileCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientFileCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientFile" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientFileTraitKeys<TOptions>, ...names: readonly PatientFileTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientFile} model.
 *
 * @param options
 * @returns factory {@link PatientFileFactoryInterface}
 */
export function definePatientFileFactory<TOptions extends PatientFileFactoryDefineOptions>(options: TOptions): PatientFileFactoryInterface<TOptions> {
    return definePatientFileFactoryInternal(options);
}

type PatientRelateHealthFacilityScalarOrEnumFields = {
    id: string;
    startDate: Date;
};

type PatientRelateHealthFacilityhealthFacilityFactory = {
    _factoryFor: "HealthFacility";
    build: () => PromiseLike<Prisma.HealthFacilityCreateNestedOneWithoutPatientRelateHealthFacilityInput["create"]>;
};

type PatientRelateHealthFacilitypatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientRelateHealthFacilityInput["create"]>;
};

type PatientRelateHealthFacilitycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityCreatedUserInput["create"]>;
};

type PatientRelateHealthFacilityupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityUpdatedUserInput["create"]>;
};

type PatientRelateHealthFacilityFactoryDefineInput = {
    id?: string;
    startDate?: Date;
    endDate?: Date;
    reason?: PatientRelateHealthFacilityReason | null;
    billSort?: number | null;
    note?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility: PatientRelateHealthFacilityhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutPatientRelateHealthFacilityInput;
    patient: PatientRelateHealthFacilitypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientRelateHealthFacilityInput;
    createdUser?: PatientRelateHealthFacilitycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityCreatedUserInput;
    updatedUser?: PatientRelateHealthFacilityupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityUpdatedUserInput;
};

type PatientRelateHealthFacilityFactoryDefineOptions = {
    defaultData: Resolver<PatientRelateHealthFacilityFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientRelateHealthFacilityFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientRelateHealthFacilityhealthFacilityFactory(x: PatientRelateHealthFacilityhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutPatientRelateHealthFacilityInput | undefined): x is PatientRelateHealthFacilityhealthFacilityFactory {
    return (x as any)?._factoryFor === "HealthFacility";
}

function isPatientRelateHealthFacilitypatientFactory(x: PatientRelateHealthFacilitypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientRelateHealthFacilityInput | undefined): x is PatientRelateHealthFacilitypatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

function isPatientRelateHealthFacilitycreatedUserFactory(x: PatientRelateHealthFacilitycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityCreatedUserInput | undefined): x is PatientRelateHealthFacilitycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPatientRelateHealthFacilityupdatedUserFactory(x: PatientRelateHealthFacilityupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPatientRelateHealthFacilityUpdatedUserInput | undefined): x is PatientRelateHealthFacilityupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PatientRelateHealthFacilityTraitKeys<TOptions extends PatientRelateHealthFacilityFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientRelateHealthFacilityFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientRelateHealthFacility";
    build(inputData?: Partial<Prisma.PatientRelateHealthFacilityCreateInput>): PromiseLike<Prisma.PatientRelateHealthFacilityCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientRelateHealthFacilityCreateInput>): PromiseLike<Prisma.PatientRelateHealthFacilityCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientRelateHealthFacilityCreateInput>[]): PromiseLike<Prisma.PatientRelateHealthFacilityCreateInput[]>;
    pickForConnect(inputData: PatientRelateHealthFacility): Pick<PatientRelateHealthFacility, "id">;
    create(inputData?: Partial<Prisma.PatientRelateHealthFacilityCreateInput>): PromiseLike<PatientRelateHealthFacility>;
    createList(inputData: number | readonly Partial<Prisma.PatientRelateHealthFacilityCreateInput>[]): PromiseLike<PatientRelateHealthFacility[]>;
    createForConnect(inputData?: Partial<Prisma.PatientRelateHealthFacilityCreateInput>): PromiseLike<Pick<PatientRelateHealthFacility, "id">>;
}

export interface PatientRelateHealthFacilityFactoryInterface<TOptions extends PatientRelateHealthFacilityFactoryDefineOptions = PatientRelateHealthFacilityFactoryDefineOptions> extends PatientRelateHealthFacilityFactoryInterfaceWithoutTraits {
    use(name: PatientRelateHealthFacilityTraitKeys<TOptions>, ...names: readonly PatientRelateHealthFacilityTraitKeys<TOptions>[]): PatientRelateHealthFacilityFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientRelateHealthFacilityScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientRelateHealthFacilityScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientRelateHealthFacility", fieldName: "id", isId: true, isUnique: false, seq }),
        startDate: getScalarFieldValueGenerator().DateTime({ modelName: "PatientRelateHealthFacility", fieldName: "startDate", isId: false, isUnique: false, seq })
    };
}

function definePatientRelateHealthFacilityFactoryInternal<TOptions extends PatientRelateHealthFacilityFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientRelateHealthFacilityFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientRelateHealthFacilityTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientRelateHealthFacility", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientRelateHealthFacilityCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientRelateHealthFacilityScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientRelateHealthFacilityFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientRelateHealthFacilityFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                healthFacility: isPatientRelateHealthFacilityhealthFacilityFactory(defaultData.healthFacility) ? {
                    create: await defaultData.healthFacility.build()
                } : defaultData.healthFacility,
                patient: isPatientRelateHealthFacilitypatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient,
                createdUser: isPatientRelateHealthFacilitycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPatientRelateHealthFacilityupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PatientRelateHealthFacilityCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientRelateHealthFacilityCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientRelateHealthFacility) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientRelateHealthFacilityCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientRelateHealthFacility.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientRelateHealthFacilityCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientRelateHealthFacilityCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientRelateHealthFacility" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PatientRelateHealthFacilityTraitKeys<TOptions>, ...names: readonly PatientRelateHealthFacilityTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientRelateHealthFacility} model.
 *
 * @param options
 * @returns factory {@link PatientRelateHealthFacilityFactoryInterface}
 */
export function definePatientRelateHealthFacilityFactory<TOptions extends PatientRelateHealthFacilityFactoryDefineOptions>(options: TOptions): PatientRelateHealthFacilityFactoryInterface<TOptions> {
    return definePatientRelateHealthFacilityFactoryInternal(options);
}

type PharmacyScalarOrEnumFields = {
    id: string;
    name: string;
    nameKana: string;
    postalCode: string;
    address1: string;
    tel: string;
};

type PharmacypharmacyGroupFactory = {
    _factoryFor: "PharmacyGroup";
    build: () => PromiseLike<Prisma.PharmacyGroupCreateNestedOneWithoutPharmacyInput["create"]>;
};

type PharmacycompanyFactory = {
    _factoryFor: "Company";
    build: () => PromiseLike<Prisma.CompanyCreateNestedOneWithoutPharmacyInput["create"]>;
};

type PharmacycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyCreatedUserInput["create"]>;
};

type PharmacyupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyUpdatedUserInput["create"]>;
};

type PharmacytransferAccountManageFactory = {
    _factoryFor: "AccountManage";
    build: () => PromiseLike<Prisma.AccountManageCreateNestedOneWithoutPharmacyTransferInput["create"]>;
};

type PharmacywithdrawalAccountManageFactory = {
    _factoryFor: "AccountManage";
    build: () => PromiseLike<Prisma.AccountManageCreateNestedOneWithoutPharmacyWithdrawalInput["create"]>;
};

type PharmacyFactoryDefineInput = {
    id?: string;
    name?: string;
    nameKana?: string;
    medicalInstitutionCode?: string | null;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    tel?: string;
    fax?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility?: Prisma.HealthFacilityCreateNestedManyWithoutPharmacyInput;
    healthFacilityRelatePharmacy?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutPharmacyInput;
    pharmacyGroup: PharmacypharmacyGroupFactory | Prisma.PharmacyGroupCreateNestedOneWithoutPharmacyInput;
    company: PharmacycompanyFactory | Prisma.CompanyCreateNestedOneWithoutPharmacyInput;
    createdUser?: PharmacycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyCreatedUserInput;
    updatedUser?: PharmacyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyUpdatedUserInput;
    transferAccountManage: PharmacytransferAccountManageFactory | Prisma.AccountManageCreateNestedOneWithoutPharmacyTransferInput;
    withdrawalAccountManage: PharmacywithdrawalAccountManageFactory | Prisma.AccountManageCreateNestedOneWithoutPharmacyWithdrawalInput;
    pharmacyBaseCompoundingSetting?: Prisma.PharmacyBaseCompoundingSettingCreateNestedManyWithoutPharmacyInput;
};

type PharmacyFactoryDefineOptions = {
    defaultData: Resolver<PharmacyFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PharmacyFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPharmacypharmacyGroupFactory(x: PharmacypharmacyGroupFactory | Prisma.PharmacyGroupCreateNestedOneWithoutPharmacyInput | undefined): x is PharmacypharmacyGroupFactory {
    return (x as any)?._factoryFor === "PharmacyGroup";
}

function isPharmacycompanyFactory(x: PharmacycompanyFactory | Prisma.CompanyCreateNestedOneWithoutPharmacyInput | undefined): x is PharmacycompanyFactory {
    return (x as any)?._factoryFor === "Company";
}

function isPharmacycreatedUserFactory(x: PharmacycreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyCreatedUserInput | undefined): x is PharmacycreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPharmacyupdatedUserFactory(x: PharmacyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyUpdatedUserInput | undefined): x is PharmacyupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPharmacytransferAccountManageFactory(x: PharmacytransferAccountManageFactory | Prisma.AccountManageCreateNestedOneWithoutPharmacyTransferInput | undefined): x is PharmacytransferAccountManageFactory {
    return (x as any)?._factoryFor === "AccountManage";
}

function isPharmacywithdrawalAccountManageFactory(x: PharmacywithdrawalAccountManageFactory | Prisma.AccountManageCreateNestedOneWithoutPharmacyWithdrawalInput | undefined): x is PharmacywithdrawalAccountManageFactory {
    return (x as any)?._factoryFor === "AccountManage";
}

type PharmacyTraitKeys<TOptions extends PharmacyFactoryDefineOptions> = keyof TOptions["traits"];

export interface PharmacyFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "Pharmacy";
    build(inputData?: Partial<Prisma.PharmacyCreateInput>): PromiseLike<Prisma.PharmacyCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PharmacyCreateInput>): PromiseLike<Prisma.PharmacyCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PharmacyCreateInput>[]): PromiseLike<Prisma.PharmacyCreateInput[]>;
    pickForConnect(inputData: Pharmacy): Pick<Pharmacy, "id">;
    create(inputData?: Partial<Prisma.PharmacyCreateInput>): PromiseLike<Pharmacy>;
    createList(inputData: number | readonly Partial<Prisma.PharmacyCreateInput>[]): PromiseLike<Pharmacy[]>;
    createForConnect(inputData?: Partial<Prisma.PharmacyCreateInput>): PromiseLike<Pick<Pharmacy, "id">>;
}

export interface PharmacyFactoryInterface<TOptions extends PharmacyFactoryDefineOptions = PharmacyFactoryDefineOptions> extends PharmacyFactoryInterfaceWithoutTraits {
    use(name: PharmacyTraitKeys<TOptions>, ...names: readonly PharmacyTraitKeys<TOptions>[]): PharmacyFactoryInterfaceWithoutTraits;
}

function autoGeneratePharmacyScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PharmacyScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        postalCode: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "postalCode", isId: false, isUnique: false, seq }),
        address1: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "address1", isId: false, isUnique: false, seq }),
        tel: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "tel", isId: false, isUnique: false, seq })
    };
}

function definePharmacyFactoryInternal<TOptions extends PharmacyFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PharmacyFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PharmacyTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("Pharmacy", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PharmacyCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePharmacyScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PharmacyFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PharmacyFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                pharmacyGroup: isPharmacypharmacyGroupFactory(defaultData.pharmacyGroup) ? {
                    create: await defaultData.pharmacyGroup.build()
                } : defaultData.pharmacyGroup,
                company: isPharmacycompanyFactory(defaultData.company) ? {
                    create: await defaultData.company.build()
                } : defaultData.company,
                createdUser: isPharmacycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPharmacyupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser,
                transferAccountManage: isPharmacytransferAccountManageFactory(defaultData.transferAccountManage) ? {
                    create: await defaultData.transferAccountManage.build()
                } : defaultData.transferAccountManage,
                withdrawalAccountManage: isPharmacywithdrawalAccountManageFactory(defaultData.withdrawalAccountManage) ? {
                    create: await defaultData.withdrawalAccountManage.build()
                } : defaultData.withdrawalAccountManage
            };
            const data: Prisma.PharmacyCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PharmacyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: Pharmacy) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PharmacyCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().pharmacy.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PharmacyCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PharmacyCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "Pharmacy" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PharmacyTraitKeys<TOptions>, ...names: readonly PharmacyTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link Pharmacy} model.
 *
 * @param options
 * @returns factory {@link PharmacyFactoryInterface}
 */
export function definePharmacyFactory<TOptions extends PharmacyFactoryDefineOptions>(options: TOptions): PharmacyFactoryInterface<TOptions> {
    return definePharmacyFactoryInternal(options);
}

type PharmacyBaseCompoundingSettingScalarOrEnumFields = {
    id: string;
    name: string;
    score: number;
    startDate: Date;
    endDate: Date;
};

type PharmacyBaseCompoundingSettingpharmacyFactory = {
    _factoryFor: "Pharmacy";
    build: () => PromiseLike<Prisma.PharmacyCreateNestedOneWithoutPharmacyBaseCompoundingSettingInput["create"]>;
};

type PharmacyBaseCompoundingSettingcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingCreatedUserInput["create"]>;
};

type PharmacyBaseCompoundingSettingupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingUpdatedUserInput["create"]>;
};

type PharmacyBaseCompoundingSettingFactoryDefineInput = {
    id?: string;
    name?: string;
    score?: number;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    pharmacy: PharmacyBaseCompoundingSettingpharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutPharmacyBaseCompoundingSettingInput;
    createdUser?: PharmacyBaseCompoundingSettingcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingCreatedUserInput;
    updatedUser?: PharmacyBaseCompoundingSettingupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingUpdatedUserInput;
};

type PharmacyBaseCompoundingSettingFactoryDefineOptions = {
    defaultData: Resolver<PharmacyBaseCompoundingSettingFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PharmacyBaseCompoundingSettingFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPharmacyBaseCompoundingSettingpharmacyFactory(x: PharmacyBaseCompoundingSettingpharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutPharmacyBaseCompoundingSettingInput | undefined): x is PharmacyBaseCompoundingSettingpharmacyFactory {
    return (x as any)?._factoryFor === "Pharmacy";
}

function isPharmacyBaseCompoundingSettingcreatedUserFactory(x: PharmacyBaseCompoundingSettingcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingCreatedUserInput | undefined): x is PharmacyBaseCompoundingSettingcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPharmacyBaseCompoundingSettingupdatedUserFactory(x: PharmacyBaseCompoundingSettingupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyBaseCompoundingSettingUpdatedUserInput | undefined): x is PharmacyBaseCompoundingSettingupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PharmacyBaseCompoundingSettingTraitKeys<TOptions extends PharmacyBaseCompoundingSettingFactoryDefineOptions> = keyof TOptions["traits"];

export interface PharmacyBaseCompoundingSettingFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PharmacyBaseCompoundingSetting";
    build(inputData?: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>): PromiseLike<Prisma.PharmacyBaseCompoundingSettingCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>): PromiseLike<Prisma.PharmacyBaseCompoundingSettingCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>[]): PromiseLike<Prisma.PharmacyBaseCompoundingSettingCreateInput[]>;
    pickForConnect(inputData: PharmacyBaseCompoundingSetting): Pick<PharmacyBaseCompoundingSetting, "id">;
    create(inputData?: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>): PromiseLike<PharmacyBaseCompoundingSetting>;
    createList(inputData: number | readonly Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>[]): PromiseLike<PharmacyBaseCompoundingSetting[]>;
    createForConnect(inputData?: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>): PromiseLike<Pick<PharmacyBaseCompoundingSetting, "id">>;
}

export interface PharmacyBaseCompoundingSettingFactoryInterface<TOptions extends PharmacyBaseCompoundingSettingFactoryDefineOptions = PharmacyBaseCompoundingSettingFactoryDefineOptions> extends PharmacyBaseCompoundingSettingFactoryInterfaceWithoutTraits {
    use(name: PharmacyBaseCompoundingSettingTraitKeys<TOptions>, ...names: readonly PharmacyBaseCompoundingSettingTraitKeys<TOptions>[]): PharmacyBaseCompoundingSettingFactoryInterfaceWithoutTraits;
}

function autoGeneratePharmacyBaseCompoundingSettingScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PharmacyBaseCompoundingSettingScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "name", isId: false, isUnique: false, seq }),
        score: getScalarFieldValueGenerator().Int({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "score", isId: false, isUnique: false, seq }),
        startDate: getScalarFieldValueGenerator().DateTime({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "startDate", isId: false, isUnique: false, seq }),
        endDate: getScalarFieldValueGenerator().DateTime({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "endDate", isId: false, isUnique: false, seq })
    };
}

function definePharmacyBaseCompoundingSettingFactoryInternal<TOptions extends PharmacyBaseCompoundingSettingFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PharmacyBaseCompoundingSettingFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PharmacyBaseCompoundingSettingTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PharmacyBaseCompoundingSetting", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePharmacyBaseCompoundingSettingScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PharmacyBaseCompoundingSettingFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PharmacyBaseCompoundingSettingFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                pharmacy: isPharmacyBaseCompoundingSettingpharmacyFactory(defaultData.pharmacy) ? {
                    create: await defaultData.pharmacy.build()
                } : defaultData.pharmacy,
                createdUser: isPharmacyBaseCompoundingSettingcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPharmacyBaseCompoundingSettingupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PharmacyBaseCompoundingSettingCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PharmacyBaseCompoundingSetting) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().pharmacyBaseCompoundingSetting.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PharmacyBaseCompoundingSettingCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PharmacyBaseCompoundingSetting" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PharmacyBaseCompoundingSettingTraitKeys<TOptions>, ...names: readonly PharmacyBaseCompoundingSettingTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PharmacyBaseCompoundingSetting} model.
 *
 * @param options
 * @returns factory {@link PharmacyBaseCompoundingSettingFactoryInterface}
 */
export function definePharmacyBaseCompoundingSettingFactory<TOptions extends PharmacyBaseCompoundingSettingFactoryDefineOptions>(options: TOptions): PharmacyBaseCompoundingSettingFactoryInterface<TOptions> {
    return definePharmacyBaseCompoundingSettingFactoryInternal(options);
}

type PharmacyGroupScalarOrEnumFields = {
    id: string;
    name: string;
    nameKana: string;
};

type PharmacyGroupcreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyGroupCreatedUserInput["create"]>;
};

type PharmacyGroupupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutPharmacyGroupUpdatedUserInput["create"]>;
};

type PharmacyGroupFactoryDefineInput = {
    id?: string;
    name?: string;
    nameKana?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    pharmacy?: Prisma.PharmacyCreateNestedManyWithoutPharmacyGroupInput;
    createdUser?: PharmacyGroupcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyGroupCreatedUserInput;
    updatedUser?: PharmacyGroupupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyGroupUpdatedUserInput;
};

type PharmacyGroupFactoryDefineOptions = {
    defaultData?: Resolver<PharmacyGroupFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PharmacyGroupFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPharmacyGroupcreatedUserFactory(x: PharmacyGroupcreatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyGroupCreatedUserInput | undefined): x is PharmacyGroupcreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isPharmacyGroupupdatedUserFactory(x: PharmacyGroupupdatedUserFactory | Prisma.UserCreateNestedOneWithoutPharmacyGroupUpdatedUserInput | undefined): x is PharmacyGroupupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type PharmacyGroupTraitKeys<TOptions extends PharmacyGroupFactoryDefineOptions> = keyof TOptions["traits"];

export interface PharmacyGroupFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PharmacyGroup";
    build(inputData?: Partial<Prisma.PharmacyGroupCreateInput>): PromiseLike<Prisma.PharmacyGroupCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PharmacyGroupCreateInput>): PromiseLike<Prisma.PharmacyGroupCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PharmacyGroupCreateInput>[]): PromiseLike<Prisma.PharmacyGroupCreateInput[]>;
    pickForConnect(inputData: PharmacyGroup): Pick<PharmacyGroup, "id">;
    create(inputData?: Partial<Prisma.PharmacyGroupCreateInput>): PromiseLike<PharmacyGroup>;
    createList(inputData: number | readonly Partial<Prisma.PharmacyGroupCreateInput>[]): PromiseLike<PharmacyGroup[]>;
    createForConnect(inputData?: Partial<Prisma.PharmacyGroupCreateInput>): PromiseLike<Pick<PharmacyGroup, "id">>;
}

export interface PharmacyGroupFactoryInterface<TOptions extends PharmacyGroupFactoryDefineOptions = PharmacyGroupFactoryDefineOptions> extends PharmacyGroupFactoryInterfaceWithoutTraits {
    use(name: PharmacyGroupTraitKeys<TOptions>, ...names: readonly PharmacyGroupTraitKeys<TOptions>[]): PharmacyGroupFactoryInterfaceWithoutTraits;
}

function autoGeneratePharmacyGroupScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PharmacyGroupScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PharmacyGroup", fieldName: "id", isId: true, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "PharmacyGroup", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "PharmacyGroup", fieldName: "nameKana", isId: false, isUnique: false, seq })
    };
}

function definePharmacyGroupFactoryInternal<TOptions extends PharmacyGroupFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PharmacyGroupFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PharmacyGroupTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PharmacyGroup", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PharmacyGroupCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePharmacyGroupScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PharmacyGroupFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PharmacyGroupFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isPharmacyGroupcreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isPharmacyGroupupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.PharmacyGroupCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PharmacyGroupCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PharmacyGroup) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PharmacyGroupCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().pharmacyGroup.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PharmacyGroupCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PharmacyGroupCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PharmacyGroup" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: PharmacyGroupTraitKeys<TOptions>, ...names: readonly PharmacyGroupTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PharmacyGroup} model.
 *
 * @param options
 * @returns factory {@link PharmacyGroupFactoryInterface}
 */
export function definePharmacyGroupFactory<TOptions extends PharmacyGroupFactoryDefineOptions>(options?: TOptions): PharmacyGroupFactoryInterface<TOptions> {
    return definePharmacyGroupFactoryInternal(options ?? {});
}

type UserScalarOrEnumFields = {
    id: string;
    userType: UserUserType;
    name: string;
    userId: string;
};

type UsercreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutOtherUserUserCreatedByTouserInput["create"]>;
};

type UserupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutOtherUserUserUpdatedByTouserInput["create"]>;
};

type UserFactoryDefineInput = {
    id?: string;
    userType?: UserUserType;
    name?: string;
    userId?: string;
    password?: string | null;
    pharmacyId?: string | null;
    patientId?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    accountManageAccountManageCreatedByTouser?: Prisma.AccountManageCreateNestedManyWithoutCreatedUserInput;
    accountManageAccountManageUpdatedByTouser?: Prisma.AccountManageCreateNestedManyWithoutUpdatedUserInput;
    companyCreatedUser?: Prisma.CompanyCreateNestedManyWithoutCreatedUserInput;
    companyUpdatedUser?: Prisma.CompanyCreateNestedManyWithoutUpdatedUserInput;
    healthFacilityCreatedUser?: Prisma.HealthFacilityCreateNestedManyWithoutCreatedUserInput;
    healthFacilityUpdatedUser?: Prisma.HealthFacilityCreateNestedManyWithoutUpdatedUserInput;
    healthFacilityCodeGroupCreatedUser?: Prisma.HealthFacilityCodeGroupCreateNestedManyWithoutCreatedUserInput;
    healthFacilityCodeGroupUpdatedUser?: Prisma.HealthFacilityCodeGroupCreateNestedManyWithoutUpdatedUserInput;
    healthFacilityCodeManageCreatedUser?: Prisma.HealthFacilityCodeManageCreateNestedManyWithoutCreatedUserInput;
    healthFacilityCodeManageUpdatedUser?: Prisma.HealthFacilityCodeManageCreateNestedManyWithoutUpdatedUserInput;
    healthFacilityRelatePharmacyCreatedUser?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutCreatedUserInput;
    healthFacilityRelatePharmacyUpdatedUser?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutUpdatedUserInput;
    inquiryCreatedUser?: Prisma.InquiryCreateNestedManyWithoutCreatedUserInput;
    inquiryUpdatedUser?: Prisma.InquiryCreateNestedManyWithoutUpdatedUserInput;
    inquiryCorrespondCreatedUser?: Prisma.InquiryCorrespondCreateNestedManyWithoutCreatedUserInput;
    inquiryCorrespondUpdatedUser?: Prisma.InquiryCorrespondCreateNestedManyWithoutUpdatedUserInput;
    inquiryFileCreatedUser?: Prisma.InquiryFileCreateNestedManyWithoutCreatedUserInput;
    inquiryFileUpdatedUser?: Prisma.InquiryFileCreateNestedManyWithoutUpdatedUserInput;
    patientCreatedUser?: Prisma.PatientCreateNestedManyWithoutCreatedUserInput;
    patientUpdatedUser?: Prisma.PatientCreateNestedManyWithoutUpdatedUserInput;
    patientChangeContentCreatedUser?: Prisma.PatientChangeContentCreateNestedManyWithoutCreatedUserInput;
    patientChangeContentUpdatedUser?: Prisma.PatientChangeContentCreateNestedManyWithoutUpdatedUserInput;
    patientChangeHistoryCreatedUser?: Prisma.PatientChangeHistoryCreateNestedManyWithoutCreatedUserInput;
    patientChangeHistoryUpdatedUser?: Prisma.PatientChangeHistoryCreateNestedManyWithoutUpdatedUserInput;
    patientCodeHistoryCreatedUser?: Prisma.PatientCodeHistoryCreateNestedManyWithoutCreatedUserInput;
    patientCodeHistoryUpdatedUser?: Prisma.PatientCodeHistoryCreateNestedManyWithoutUpdatedUserInput;
    patientFileCreatedUser?: Prisma.PatientFileCreateNestedManyWithoutCreatedUserInput;
    patientFileUpdatedUser?: Prisma.PatientFileCreateNestedManyWithoutUpdatedUserInput;
    patientRelateHealthFacilityCreatedUser?: Prisma.PatientRelateHealthFacilityCreateNestedManyWithoutCreatedUserInput;
    patientRelateHealthFacilityUpdatedUser?: Prisma.PatientRelateHealthFacilityCreateNestedManyWithoutUpdatedUserInput;
    pharmacyCreatedUser?: Prisma.PharmacyCreateNestedManyWithoutCreatedUserInput;
    pharmacyUpdatedUser?: Prisma.PharmacyCreateNestedManyWithoutUpdatedUserInput;
    pharmacyBaseCompoundingSettingCreatedUser?: Prisma.PharmacyBaseCompoundingSettingCreateNestedManyWithoutCreatedUserInput;
    pharmacyBaseCompoundingSettingUpdatedUser?: Prisma.PharmacyBaseCompoundingSettingCreateNestedManyWithoutUpdatedUserInput;
    pharmacyGroupCreatedUser?: Prisma.PharmacyGroupCreateNestedManyWithoutCreatedUserInput;
    pharmacyGroupUpdatedUser?: Prisma.PharmacyGroupCreateNestedManyWithoutUpdatedUserInput;
    createdUser?: UsercreatedUserFactory | Prisma.UserCreateNestedOneWithoutOtherUserUserCreatedByTouserInput;
    otherUserUserCreatedByTouser?: Prisma.UserCreateNestedManyWithoutCreatedUserInput;
    updatedUser?: UserupdatedUserFactory | Prisma.UserCreateNestedOneWithoutOtherUserUserUpdatedByTouserInput;
    otherUserUserUpdatedByTouser?: Prisma.UserCreateNestedManyWithoutUpdatedUserInput;
};

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isUsercreatedUserFactory(x: UsercreatedUserFactory | Prisma.UserCreateNestedOneWithoutOtherUserUserCreatedByTouserInput | undefined): x is UsercreatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isUserupdatedUserFactory(x: UserupdatedUserFactory | Prisma.UserCreateNestedOneWithoutOtherUserUserUpdatedByTouserInput | undefined): x is UserupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

type UserTraitKeys<TOptions extends UserFactoryDefineOptions> = keyof TOptions["traits"];

export interface UserFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Prisma.UserCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<User>;
    createList(inputData: number | readonly Partial<Prisma.UserCreateInput>[]): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput>): PromiseLike<Pick<User, "id">>;
}

export interface UserFactoryInterface<TOptions extends UserFactoryDefineOptions = UserFactoryDefineOptions> extends UserFactoryInterfaceWithoutTraits {
    use(name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]): UserFactoryInterfaceWithoutTraits;
}

function autoGenerateUserScalarsOrEnums({ seq }: {
    readonly seq: number;
}): UserScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        userType: "ADMIN",
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq }),
        userId: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "userId", isId: false, isUnique: true, seq })
    };
}

function defineUserFactoryInternal<TOptions extends UserFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): UserFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly UserTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("User", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<UserFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<UserFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                createdUser: isUsercreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser,
                updatedUser: isUserupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser
            };
            const data: Prisma.UserCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: User) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.UserCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().user.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.UserCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.UserCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "User" as const,
            build,
            buildList,
            buildCreateInput: build,
            pickForConnect,
            create,
            createList,
            createForConnect,
        };
    };
    const factory = getFactoryWithTraits();
    const useTraits = (name: UserTraitKeys<TOptions>, ...names: readonly UserTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export function defineUserFactory<TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<TOptions> {
    return defineUserFactoryInternal(options ?? {});
}

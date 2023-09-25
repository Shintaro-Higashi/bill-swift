import type { Company } from "@prisma/client";
import type { HealthFacility } from "@prisma/client";
import type { HealthFacilityRelatePharmacy } from "@prisma/client";
import type { Patient } from "@prisma/client";
import type { PatientChangeContent } from "@prisma/client";
import type { PatientChangeHistory } from "@prisma/client";
import type { PatientCodeManage } from "@prisma/client";
import type { PatientComment } from "@prisma/client";
import type { PatientFile } from "@prisma/client";
import type { PatientRelateHealthFacility } from "@prisma/client";
import type { Pharmacy } from "@prisma/client";
import type { PharmacyBaseCompoundingSetting } from "@prisma/client";
import type { PharmacyGroup } from "@prisma/client";
import type { User } from "@prisma/client";
import type { HealthFacilityPatientSortType } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { getClient, ModelWithFields, createScreener, getScalarFieldValueGenerator, Resolver, normalizeResolver, normalizeList, getSequenceCounter, } from "@quramy/prisma-fabbrica/lib/internal";
export { initialize, resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";

type BuildDataOptions = {
    readonly seq: number;
};

const modelFieldDefinitions: ModelWithFields[] = [{
        name: "Company",
        fields: [{
                name: "updatedUser",
                type: "User",
                relationName: "company_updated_byTouser"
            }, {
                name: "createdUser",
                type: "User",
                relationName: "company_created_byTouser"
            }, {
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "CompanyToPharmacy"
            }]
    }, {
        name: "HealthFacility",
        fields: [{
                name: "userHealthFacilityUpdatedByTouser",
                type: "User",
                relationName: "health_facility_updated_byTouser"
            }, {
                name: "userHealthFacilityCreatedByTouser",
                type: "User",
                relationName: "health_facility_created_byTouser"
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
        name: "HealthFacilityRelatePharmacy",
        fields: [{
                name: "healthFacility",
                type: "HealthFacility",
                relationName: "HealthFacilityToHealthFacilityRelatePharmacy"
            }, {
                name: "pharmacy",
                type: "Pharmacy",
                relationName: "HealthFacilityRelatePharmacyToPharmacy"
            }]
    }, {
        name: "Patient",
        fields: [{
                name: "patientChangeHistory",
                type: "PatientChangeHistory",
                relationName: "PatientToPatientChangeHistory"
            }, {
                name: "patientCodeManage",
                type: "PatientCodeManage",
                relationName: "PatientToPatientCodeManage"
            }, {
                name: "patientComment",
                type: "PatientComment",
                relationName: "PatientToPatientComment"
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
            }]
    }, {
        name: "PatientCodeManage",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientCodeManage"
            }]
    }, {
        name: "PatientComment",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientComment"
            }]
    }, {
        name: "PatientFile",
        fields: [{
                name: "patient",
                type: "Patient",
                relationName: "PatientToPatientFile"
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
            }]
    }, {
        name: "Pharmacy",
        fields: [{
                name: "healthFacilityRelatePharmacy",
                type: "HealthFacilityRelatePharmacy",
                relationName: "HealthFacilityRelatePharmacyToPharmacy"
            }, {
                name: "company",
                type: "Company",
                relationName: "CompanyToPharmacy"
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
            }]
    }, {
        name: "PharmacyGroup",
        fields: []
    }, {
        name: "User",
        fields: [{
                name: "companyUpdatedUser",
                type: "Company",
                relationName: "company_updated_byTouser"
            }, {
                name: "companyCreatedUser",
                type: "Company",
                relationName: "company_created_byTouser"
            }, {
                name: "healthFacilityHealthFacilityUpdatedByTouser",
                type: "HealthFacility",
                relationName: "health_facility_updated_byTouser"
            }, {
                name: "healthFacilityHealthFacilityCreatedByTouser",
                type: "HealthFacility",
                relationName: "health_facility_created_byTouser"
            }]
    }];

type CompanyScalarOrEnumFields = {
    id: string;
    name: string;
    postalCode: string;
    address1: string;
    telephone: string;
};

type CompanyupdatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput["create"]>;
};

type CompanycreatedUserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput["create"]>;
};

type CompanyFactoryDefineInput = {
    id?: string;
    name?: string;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    telephone?: string;
    fax?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    updatedUser?: CompanyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput;
    createdUser?: CompanycreatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput;
    pharmacy?: Prisma.PharmacyCreateNestedManyWithoutCompanyInput;
};

type CompanyFactoryDefineOptions = {
    defaultData?: Resolver<CompanyFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<CompanyFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isCompanyupdatedUserFactory(x: CompanyupdatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyUpdatedUserInput | undefined): x is CompanyupdatedUserFactory {
    return (x as any)?._factoryFor === "User";
}

function isCompanycreatedUserFactory(x: CompanycreatedUserFactory | Prisma.UserCreateNestedOneWithoutCompanyCreatedUserInput | undefined): x is CompanycreatedUserFactory {
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
        postalCode: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "postalCode", isId: false, isUnique: false, seq }),
        address1: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "address1", isId: false, isUnique: false, seq }),
        telephone: getScalarFieldValueGenerator().String({ modelName: "Company", fieldName: "telephone", isId: false, isUnique: false, seq })
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
                updatedUser: isCompanyupdatedUserFactory(defaultData.updatedUser) ? {
                    create: await defaultData.updatedUser.build()
                } : defaultData.updatedUser,
                createdUser: isCompanycreatedUserFactory(defaultData.createdUser) ? {
                    create: await defaultData.createdUser.build()
                } : defaultData.createdUser
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
export function defineCompanyFactory<TOptions extends CompanyFactoryDefineOptions>(options?: TOptions): CompanyFactoryInterface<TOptions> {
    return defineCompanyFactoryInternal(options ?? {});
}

type HealthFacilityScalarOrEnumFields = {
    id: string;
    name: string;
    nameKana: string;
    code: string;
    postalCode: string;
    address1: string;
    telephone: string;
};

type HealthFacilityuserHealthFacilityUpdatedByTouserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityUpdatedByTouserInput["create"]>;
};

type HealthFacilityuserHealthFacilityCreatedByTouserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityCreatedByTouserInput["create"]>;
};

type HealthFacilityFactoryDefineInput = {
    id?: string;
    name?: string;
    nameKana?: string;
    code?: string;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    telephone?: string;
    fax?: string | null;
    mail?: string | null;
    url?: string | null;
    patientSortType?: HealthFacilityPatientSortType;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    userHealthFacilityUpdatedByTouser?: HealthFacilityuserHealthFacilityUpdatedByTouserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityUpdatedByTouserInput;
    userHealthFacilityCreatedByTouser?: HealthFacilityuserHealthFacilityCreatedByTouserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityCreatedByTouserInput;
    healthFacilityRelatePharmacy?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutHealthFacilityInput;
    patientRelateHealthFacility?: Prisma.PatientRelateHealthFacilityCreateNestedManyWithoutHealthFacilityInput;
};

type HealthFacilityFactoryDefineOptions = {
    defaultData?: Resolver<HealthFacilityFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<HealthFacilityFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isHealthFacilityuserHealthFacilityUpdatedByTouserFactory(x: HealthFacilityuserHealthFacilityUpdatedByTouserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityUpdatedByTouserInput | undefined): x is HealthFacilityuserHealthFacilityUpdatedByTouserFactory {
    return (x as any)?._factoryFor === "User";
}

function isHealthFacilityuserHealthFacilityCreatedByTouserFactory(x: HealthFacilityuserHealthFacilityCreatedByTouserFactory | Prisma.UserCreateNestedOneWithoutHealthFacilityHealthFacilityCreatedByTouserInput | undefined): x is HealthFacilityuserHealthFacilityCreatedByTouserFactory {
    return (x as any)?._factoryFor === "User";
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
        name: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        code: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "code", isId: false, isUnique: false, seq }),
        postalCode: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "postalCode", isId: false, isUnique: false, seq }),
        address1: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "address1", isId: false, isUnique: false, seq }),
        telephone: getScalarFieldValueGenerator().String({ modelName: "HealthFacility", fieldName: "telephone", isId: false, isUnique: false, seq })
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
                userHealthFacilityUpdatedByTouser: isHealthFacilityuserHealthFacilityUpdatedByTouserFactory(defaultData.userHealthFacilityUpdatedByTouser) ? {
                    create: await defaultData.userHealthFacilityUpdatedByTouser.build()
                } : defaultData.userHealthFacilityUpdatedByTouser,
                userHealthFacilityCreatedByTouser: isHealthFacilityuserHealthFacilityCreatedByTouserFactory(defaultData.userHealthFacilityCreatedByTouser) ? {
                    create: await defaultData.userHealthFacilityCreatedByTouser.build()
                } : defaultData.userHealthFacilityCreatedByTouser
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
export function defineHealthFacilityFactory<TOptions extends HealthFacilityFactoryDefineOptions>(options?: TOptions): HealthFacilityFactoryInterface<TOptions> {
    return defineHealthFacilityFactoryInternal(options ?? {});
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

type HealthFacilityRelatePharmacyFactoryDefineInput = {
    id?: string;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility: HealthFacilityRelatePharmacyhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutHealthFacilityRelatePharmacyInput;
    pharmacy: HealthFacilityRelatePharmacypharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutHealthFacilityRelatePharmacyInput;
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
                } : defaultData.pharmacy
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

type PatientScalarOrEnumFields = {
    id: string;
    code: string;
    name: string;
    nameKana: string;
    gender: string;
    birthday: string;
};

type PatientFactoryDefineInput = {
    id?: string;
    code?: string;
    name?: string;
    nameKana?: string;
    gender?: string;
    birthday?: string;
    receptSyncFlag?: boolean;
    postalCode?: string | null;
    address1?: string | null;
    address2?: string | null;
    tel?: string | null;
    emergencyTel?: string | null;
    paymentType?: string;
    batchOrderFlag?: boolean;
    billingName?: string | null;
    billingTel?: string | null;
    billingPostalCode?: string | null;
    billingAddress1?: string | null;
    billingAddress2?: string | null;
    financialCode?: string | null;
    financialName?: string | null;
    branchCode?: string | null;
    branchName?: string | null;
    accountType?: string | null;
    accountNo?: string | null;
    accountName?: string | null;
    payerName?: string | null;
    note?: string | null;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patientChangeHistory?: Prisma.PatientChangeHistoryCreateNestedManyWithoutPatientInput;
    patientCodeManage?: Prisma.PatientCodeManageCreateNestedManyWithoutPatientInput;
    patientComment?: Prisma.PatientCommentCreateNestedManyWithoutPatientInput;
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
        gender: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "gender", isId: false, isUnique: false, seq }),
        birthday: getScalarFieldValueGenerator().String({ modelName: "Patient", fieldName: "birthday", isId: false, isUnique: false, seq })
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
            const defaultAssociations = {};
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
    beforeValue: string;
    afterValue: string;
};

type PatientChangeContentpatientChangeHistoryFactory = {
    _factoryFor: "PatientChangeHistory";
    build: () => PromiseLike<Prisma.PatientChangeHistoryCreateNestedOneWithoutPatientChangeContentInput["create"]>;
};

type PatientChangeContentFactoryDefineInput = {
    id?: string;
    itemName?: string;
    beforeValue?: string;
    afterValue?: string;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patientChangeHistory: PatientChangeContentpatientChangeHistoryFactory | Prisma.PatientChangeHistoryCreateNestedOneWithoutPatientChangeContentInput;
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
        itemName: getScalarFieldValueGenerator().String({ modelName: "PatientChangeContent", fieldName: "itemName", isId: false, isUnique: false, seq }),
        beforeValue: getScalarFieldValueGenerator().String({ modelName: "PatientChangeContent", fieldName: "beforeValue", isId: false, isUnique: false, seq }),
        afterValue: getScalarFieldValueGenerator().String({ modelName: "PatientChangeContent", fieldName: "afterValue", isId: false, isUnique: false, seq })
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
                } : defaultData.patientChangeHistory
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

type PatientChangeHistoryFactoryDefineInput = {
    id?: string;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patientChangeContent?: Prisma.PatientChangeContentCreateNestedManyWithoutPatientChangeHistoryInput;
    patient: PatientChangeHistorypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientChangeHistoryInput;
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
                } : defaultData.patient
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

type PatientCodeManageScalarOrEnumFields = {
    id: string;
    oldPatientCode: string;
};

type PatientCodeManagepatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientCodeManageInput["create"]>;
};

type PatientCodeManageFactoryDefineInput = {
    id?: string;
    oldPatientCode?: string;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: PatientCodeManagepatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCodeManageInput;
};

type PatientCodeManageFactoryDefineOptions = {
    defaultData: Resolver<PatientCodeManageFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientCodeManageFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientCodeManagepatientFactory(x: PatientCodeManagepatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCodeManageInput | undefined): x is PatientCodeManagepatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

type PatientCodeManageTraitKeys<TOptions extends PatientCodeManageFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientCodeManageFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientCodeManage";
    build(inputData?: Partial<Prisma.PatientCodeManageCreateInput>): PromiseLike<Prisma.PatientCodeManageCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientCodeManageCreateInput>): PromiseLike<Prisma.PatientCodeManageCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientCodeManageCreateInput>[]): PromiseLike<Prisma.PatientCodeManageCreateInput[]>;
    pickForConnect(inputData: PatientCodeManage): Pick<PatientCodeManage, "id">;
    create(inputData?: Partial<Prisma.PatientCodeManageCreateInput>): PromiseLike<PatientCodeManage>;
    createList(inputData: number | readonly Partial<Prisma.PatientCodeManageCreateInput>[]): PromiseLike<PatientCodeManage[]>;
    createForConnect(inputData?: Partial<Prisma.PatientCodeManageCreateInput>): PromiseLike<Pick<PatientCodeManage, "id">>;
}

export interface PatientCodeManageFactoryInterface<TOptions extends PatientCodeManageFactoryDefineOptions = PatientCodeManageFactoryDefineOptions> extends PatientCodeManageFactoryInterfaceWithoutTraits {
    use(name: PatientCodeManageTraitKeys<TOptions>, ...names: readonly PatientCodeManageTraitKeys<TOptions>[]): PatientCodeManageFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientCodeManageScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientCodeManageScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientCodeManage", fieldName: "id", isId: true, isUnique: false, seq }),
        oldPatientCode: getScalarFieldValueGenerator().String({ modelName: "PatientCodeManage", fieldName: "oldPatientCode", isId: false, isUnique: false, seq })
    };
}

function definePatientCodeManageFactoryInternal<TOptions extends PatientCodeManageFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientCodeManageFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientCodeManageTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientCodeManage", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientCodeManageCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientCodeManageScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientCodeManageFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientCodeManageFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isPatientCodeManagepatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient
            };
            const data: Prisma.PatientCodeManageCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientCodeManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientCodeManage) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientCodeManageCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientCodeManage.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientCodeManageCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientCodeManageCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientCodeManage" as const,
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
    const useTraits = (name: PatientCodeManageTraitKeys<TOptions>, ...names: readonly PatientCodeManageTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientCodeManage} model.
 *
 * @param options
 * @returns factory {@link PatientCodeManageFactoryInterface}
 */
export function definePatientCodeManageFactory<TOptions extends PatientCodeManageFactoryDefineOptions>(options: TOptions): PatientCodeManageFactoryInterface<TOptions> {
    return definePatientCodeManageFactoryInternal(options);
}

type PatientCommentScalarOrEnumFields = {
    id: string;
    comment: string;
};

type PatientCommentpatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientCommentInput["create"]>;
};

type PatientCommentFactoryDefineInput = {
    id?: string;
    comment?: string;
    relatePatientCommentId?: string | null;
    attachFilePath?: string | null;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: PatientCommentpatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCommentInput;
};

type PatientCommentFactoryDefineOptions = {
    defaultData: Resolver<PatientCommentFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PatientCommentFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

function isPatientCommentpatientFactory(x: PatientCommentpatientFactory | Prisma.PatientCreateNestedOneWithoutPatientCommentInput | undefined): x is PatientCommentpatientFactory {
    return (x as any)?._factoryFor === "Patient";
}

type PatientCommentTraitKeys<TOptions extends PatientCommentFactoryDefineOptions> = keyof TOptions["traits"];

export interface PatientCommentFactoryInterfaceWithoutTraits {
    readonly _factoryFor: "PatientComment";
    build(inputData?: Partial<Prisma.PatientCommentCreateInput>): PromiseLike<Prisma.PatientCommentCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.PatientCommentCreateInput>): PromiseLike<Prisma.PatientCommentCreateInput>;
    buildList(inputData: number | readonly Partial<Prisma.PatientCommentCreateInput>[]): PromiseLike<Prisma.PatientCommentCreateInput[]>;
    pickForConnect(inputData: PatientComment): Pick<PatientComment, "id">;
    create(inputData?: Partial<Prisma.PatientCommentCreateInput>): PromiseLike<PatientComment>;
    createList(inputData: number | readonly Partial<Prisma.PatientCommentCreateInput>[]): PromiseLike<PatientComment[]>;
    createForConnect(inputData?: Partial<Prisma.PatientCommentCreateInput>): PromiseLike<Pick<PatientComment, "id">>;
}

export interface PatientCommentFactoryInterface<TOptions extends PatientCommentFactoryDefineOptions = PatientCommentFactoryDefineOptions> extends PatientCommentFactoryInterfaceWithoutTraits {
    use(name: PatientCommentTraitKeys<TOptions>, ...names: readonly PatientCommentTraitKeys<TOptions>[]): PatientCommentFactoryInterfaceWithoutTraits;
}

function autoGeneratePatientCommentScalarsOrEnums({ seq }: {
    readonly seq: number;
}): PatientCommentScalarOrEnumFields {
    return {
        id: getScalarFieldValueGenerator().String({ modelName: "PatientComment", fieldName: "id", isId: true, isUnique: false, seq }),
        comment: getScalarFieldValueGenerator().String({ modelName: "PatientComment", fieldName: "comment", isId: false, isUnique: false, seq })
    };
}

function definePatientCommentFactoryInternal<TOptions extends PatientCommentFactoryDefineOptions>({ defaultData: defaultDataResolver, traits: traitsDefs = {} }: TOptions): PatientCommentFactoryInterface<TOptions> {
    const getFactoryWithTraits = (traitKeys: readonly PatientCommentTraitKeys<TOptions>[] = []) => {
        const seqKey = {};
        const getSeq = () => getSequenceCounter(seqKey);
        const screen = createScreener("PatientComment", modelFieldDefinitions);
        const build = async (inputData: Partial<Prisma.PatientCommentCreateInput> = {}) => {
            const seq = getSeq();
            const requiredScalarData = autoGeneratePatientCommentScalarsOrEnums({ seq });
            const resolveValue = normalizeResolver<PatientCommentFactoryDefineInput, BuildDataOptions>(defaultDataResolver ?? {});
            const defaultData = await traitKeys.reduce(async (queue, traitKey) => {
                const acc = await queue;
                const resolveTraitValue = normalizeResolver<Partial<PatientCommentFactoryDefineInput>, BuildDataOptions>(traitsDefs[traitKey]?.data ?? {});
                const traitData = await resolveTraitValue({ seq });
                return {
                    ...acc,
                    ...traitData,
                };
            }, resolveValue({ seq }));
            const defaultAssociations = {
                patient: isPatientCommentpatientFactory(defaultData.patient) ? {
                    create: await defaultData.patient.build()
                } : defaultData.patient
            };
            const data: Prisma.PatientCommentCreateInput = { ...requiredScalarData, ...defaultData, ...defaultAssociations, ...inputData };
            return data;
        };
        const buildList = (inputData: number | readonly Partial<Prisma.PatientCommentCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => build(data)));
        const pickForConnect = (inputData: PatientComment) => ({
            id: inputData.id
        });
        const create = async (inputData: Partial<Prisma.PatientCommentCreateInput> = {}) => {
            const data = await build(inputData).then(screen);
            return await getClient<PrismaClient>().patientComment.create({ data });
        };
        const createList = (inputData: number | readonly Partial<Prisma.PatientCommentCreateInput>[]) => Promise.all(normalizeList(inputData).map(data => create(data)));
        const createForConnect = (inputData: Partial<Prisma.PatientCommentCreateInput> = {}) => create(inputData).then(pickForConnect);
        return {
            _factoryFor: "PatientComment" as const,
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
    const useTraits = (name: PatientCommentTraitKeys<TOptions>, ...names: readonly PatientCommentTraitKeys<TOptions>[]) => {
        return getFactoryWithTraits([name, ...names]);
    };
    return {
        ...factory,
        use: useTraits,
    };
}

/**
 * Define factory for {@link PatientComment} model.
 *
 * @param options
 * @returns factory {@link PatientCommentFactoryInterface}
 */
export function definePatientCommentFactory<TOptions extends PatientCommentFactoryDefineOptions>(options: TOptions): PatientCommentFactoryInterface<TOptions> {
    return definePatientCommentFactoryInternal(options);
}

type PatientFileScalarOrEnumFields = {
    id: string;
    title: string;
    attachFilePath: string;
};

type PatientFilepatientFactory = {
    _factoryFor: "Patient";
    build: () => PromiseLike<Prisma.PatientCreateNestedOneWithoutPatientFileInput["create"]>;
};

type PatientFileFactoryDefineInput = {
    id?: string;
    title?: string;
    attachFilePath?: string;
    comment?: string | null;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    patient: PatientFilepatientFactory | Prisma.PatientCreateNestedOneWithoutPatientFileInput;
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
        attachFilePath: getScalarFieldValueGenerator().String({ modelName: "PatientFile", fieldName: "attachFilePath", isId: false, isUnique: false, seq })
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
                } : defaultData.patient
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

type PatientRelateHealthFacilityFactoryDefineInput = {
    id?: string;
    startDate?: Date;
    endDate?: Date;
    reason?: string | null;
    billSort?: number | null;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacility: PatientRelateHealthFacilityhealthFacilityFactory | Prisma.HealthFacilityCreateNestedOneWithoutPatientRelateHealthFacilityInput;
    patient: PatientRelateHealthFacilitypatientFactory | Prisma.PatientCreateNestedOneWithoutPatientRelateHealthFacilityInput;
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
                } : defaultData.patient
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
    code: string;
    postalCode: string;
    address1: string;
    tel: string;
};

type PharmacycompanyFactory = {
    _factoryFor: "Company";
    build: () => PromiseLike<Prisma.CompanyCreateNestedOneWithoutPharmacyInput["create"]>;
};

type PharmacyFactoryDefineInput = {
    id?: string;
    name?: string;
    code?: string;
    nsipsCode?: string | null;
    postalCode?: string;
    address1?: string;
    address2?: string | null;
    tel?: string;
    fax?: string | null;
    invoiceNo?: string | null;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    healthFacilityRelatePharmacy?: Prisma.HealthFacilityRelatePharmacyCreateNestedManyWithoutPharmacyInput;
    company: PharmacycompanyFactory | Prisma.CompanyCreateNestedOneWithoutPharmacyInput;
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

function isPharmacycompanyFactory(x: PharmacycompanyFactory | Prisma.CompanyCreateNestedOneWithoutPharmacyInput | undefined): x is PharmacycompanyFactory {
    return (x as any)?._factoryFor === "Company";
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
        code: getScalarFieldValueGenerator().String({ modelName: "Pharmacy", fieldName: "code", isId: false, isUnique: false, seq }),
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
                company: isPharmacycompanyFactory(defaultData.company) ? {
                    create: await defaultData.company.build()
                } : defaultData.company
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
};

type PharmacyBaseCompoundingSettingpharmacyFactory = {
    _factoryFor: "Pharmacy";
    build: () => PromiseLike<Prisma.PharmacyCreateNestedOneWithoutPharmacyBaseCompoundingSettingInput["create"]>;
};

type PharmacyBaseCompoundingSettingFactoryDefineInput = {
    id?: string;
    name?: string;
    score?: number;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    pharmacy: PharmacyBaseCompoundingSettingpharmacyFactory | Prisma.PharmacyCreateNestedOneWithoutPharmacyBaseCompoundingSettingInput;
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
        startDate: getScalarFieldValueGenerator().DateTime({ modelName: "PharmacyBaseCompoundingSetting", fieldName: "startDate", isId: false, isUnique: false, seq })
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
                } : defaultData.pharmacy
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

type PharmacyGroupFactoryDefineInput = {
    id?: string;
    name?: string;
    nameKana?: string;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
};

type PharmacyGroupFactoryDefineOptions = {
    defaultData?: Resolver<PharmacyGroupFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<PharmacyGroupFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

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
            const defaultAssociations = {};
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
    mail: string;
    name: string;
    nameKana: string;
    staffFlag: boolean;
};

type UserFactoryDefineInput = {
    id?: string;
    mail?: string;
    name?: string;
    nameKana?: string;
    password?: string | null;
    staffFlag?: boolean;
    createdAt?: Date | null;
    createdBy?: string | null;
    updatedAt?: Date | null;
    updatedBy?: string | null;
    deletedAt?: Date | null;
    existence?: boolean | null;
    companyUpdatedUser?: Prisma.CompanyCreateNestedManyWithoutUpdatedUserInput;
    companyCreatedUser?: Prisma.CompanyCreateNestedManyWithoutCreatedUserInput;
    healthFacilityHealthFacilityUpdatedByTouser?: Prisma.HealthFacilityCreateNestedManyWithoutUserHealthFacilityUpdatedByTouserInput;
    healthFacilityHealthFacilityCreatedByTouser?: Prisma.HealthFacilityCreateNestedManyWithoutUserHealthFacilityCreatedByTouserInput;
};

type UserFactoryDefineOptions = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions>;
    traits?: {
        [traitName: string | symbol]: {
            data: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions>;
        };
    };
};

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
        mail: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "mail", isId: false, isUnique: false, seq }),
        name: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "name", isId: false, isUnique: false, seq }),
        nameKana: getScalarFieldValueGenerator().String({ modelName: "User", fieldName: "nameKana", isId: false, isUnique: false, seq }),
        staffFlag: getScalarFieldValueGenerator().Boolean({ modelName: "User", fieldName: "staffFlag", isId: false, isUnique: false, seq })
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
            const defaultAssociations = {};
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

'use client'

import { BaseTableConfig } from "@/components/base-table/base-table-config";

import { BaseTable } from "@/components/base-table/base-table";
import { PersonEntity, statusSelectOption } from "@/domain/entities/person-entity";


export default function ENodeLog() {
    const tableConfig = new BaseTableConfig<PersonEntity>();
    tableConfig.init();
    tableConfig.setData([]);
    return (
        <BaseTable<PersonEntity> data={tableConfig.getData} tableConfig={tableConfig} />
    )
}
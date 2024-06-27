'use client'

import { toast } from "sonner";
import { Delete } from "lucide-react";
import { BaseTableConfig } from "@/components/base-table/base-table-config";
import { FormatColumnType, RowSelectType } from "@/components/base-table/enums";

import { BaseTable } from "@/components/base-table/base-table";
import { createColumnHelper } from "@tanstack/react-table";
import { PersonEntity, statusSelectOption } from "@/domain/entities/person-entity";

// const defaultData: Person[] = [];
const defaultData: PersonEntity[] = [
    new PersonEntity(
        '1',
        'tanner',
        'linsley',
        24,
        100,
        'InRelationship',
        50, undefined,
        true,
    ),
    new PersonEntity(
        '2',
        'tandy',
        'miller',
        40,
        1234567,
        'Single',
        80,
        new Date(),
        false,
    ),
    new PersonEntity(
        '3',
        'joe',
        'dirte',
        1234567.89,
        20,
        'Complicated',
        10,
        new Date(2024, 5, 26),
    ),
]


export default function ENode() {
    const tableConfig = new BaseTableConfig<PersonEntity>(PersonEntity);


    tableConfig.cols.push(
        {
            id: 'firstName',
            accessorKey: 'firstName',
        },
        {
            id: 'lastName',
            accessorKey: 'lastName',
        },
        {
            id: 'age',
            accessorKey: 'age',
            meta: {
                formatColumnType: FormatColumnType.Decimal,
                editable: false
            }
        },
        {
            id: 'visits',
            accessorKey: 'visits',
            meta: {
                formatColumnType: FormatColumnType.Decimal
            }
        },
        {
            id: 'status',
            accessorKey: 'status',
            maxSize: 400,
            minSize: 400,
            size: 400,
            meta: {
                formatColumnType: FormatColumnType.StaticCombobox,
                staticSelectOption: statusSelectOption
            }
        },
        {
            id: 'date',
            accessorKey: 'date',
            meta: {
                formatColumnType: FormatColumnType.DateTime
            }
        },
        {
            id: 'active',
            accessorKey: 'active',
            meta: {
                formatColumnType: FormatColumnType.Boolean
            }
        }
    )

    let columnHelper = createColumnHelper<PersonEntity>();

    columnHelper.accessor(row => row.lastName, {
        id: '',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: info => info.column.id,
    });

    let aa = new PersonEntity()
    aa.id = '1',
        aa.firstName = 'tanner',
        aa.lastName = 'linsley',
        aa.age = 24,
        aa.visits = 100,
        aa.status = 'In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship',
        aa.progress = 50,
        aa.active = true,


        tableConfig.colsFixLeft.push('age');
    tableConfig.init();

    // gridConfig.isActionColumListType = false;
    tableConfig.isShowSelectionColumn = true;
    tableConfig.isShowChild = true;

    // tableConfig.editButton.action = (data) => {
    //     toast(`Edit ${JSON.stringify(data)}`)
    // }
    tableConfig.detailButton.action = (data) => {
        toast(`Detail ${JSON.stringify(data)}`)
    }
    tableConfig.deleteButton.action = (data) => {
        // console.log(gridConfig.table);
        toast(`Delete ${JSON.stringify(data)}`)
    }

    tableConfig.deleteButton.disableFn = (data) => {
        return tableConfig.table?.getSelectedRowModel().rows.some(w => w.original == data) ?? false;
    }

    // gridConfig.deleteButton.visibleFn = (data) => {
    //     return data.status == 'Single';
    // }

    // eslint-disable-next-line react/jsx-no-undef
    tableConfig.otherButton.push({
        id: '_row_action_hehe', name: 'Hehe', iconChild: <Delete className="h-4 w-4" fontSize='inherit' />, action: (data) => {
        }
    });


    // gridConfig.isSelectAllPages = true;
    tableConfig.allowSelectRow = (data) => {
        return (data.lastName != 'dirte')
    }

    tableConfig.onSelect = (checked, rowSelectType, data, id) => {

        switch (rowSelectType) {
            case RowSelectType.Row:
                if (data) {
                    data.active = !data.active;
                    data.lastName = 'hehe';
                }
            case RowSelectType.AllPages:
            case RowSelectType.OnePage:
                break;
        }

        //lúc này getSelectedRowModel() vẫn chưa chứa row vừa được toggle
        // console.log('intime', gridConfig.table?.getSelectedRowModel())

        // setTimeout(() => {
        //     console.log('setTimeout', gridConfig.table?.getSelectedRowModel())
        // }, 100);
        // console.log(event, checked, rowSelectType, data, id);
    }

    tableConfig.handleRowsSelectionChange = (checked, rows, arrData) => {
        // console.log(checked)
        // console.log(rows);
        // console.log(arrData);
    }

    tableConfig.setData([...defaultData,]);

    return (
        <>
            <BaseTable<PersonEntity> data={tableConfig.getData} tableConfig={tableConfig} />
        </>

    )
}
'use client'

import { toast } from "sonner";
import { Delete } from "lucide-react";
import { BaseTableConfig } from "@/components/base-table/base-table-config";
import { FormatColumnType, RowSelectType } from "@/components/base-table/enums";
import { Person } from "./types";
import { BaseTable } from "@/components/base-table/base-table";

const defaultData: Person[] = [
    {
        id: '1',
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship',
        progress: 50,
        active: true,
    },
    {
        id: '2',
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 1234567,
        status: 'Single',
        progress: 80,
        date: new Date(),
        active: false,
    },
    {
        id: '3',
        firstName: 'joe',
        lastName: 'dirte',
        age: 1234567.89,
        visits: 20,
        status: 'Complicated',
        date: new Date(2024, 5, 26),
        progress: 10,
    },
]


export default function ENode() {
    const tableConfig = new BaseTableConfig<Person>(Person);
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
                formatColumnType: FormatColumnType.Decimal
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
            maxSize:400,
            minSize:400,
            size:400
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

    let aa = new Person()
    aa.id= '1',
    aa.firstName= 'tanner',
    aa.lastName= 'linsley',
    aa.age=24,
    aa.visits= 100,
    aa.status= 'In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship In Relationship',
    aa.progress= 50,
    aa.active= true,

    
    tableConfig.colsFixLeft.push('age');
    tableConfig.init();

    // gridConfig.isActionColumListType = false;
    tableConfig.isShowSelectionColumn = true;
    tableConfig.isShowChild = true;

    tableConfig.editButton.action = (data) => {
        toast(`Edit ${JSON.stringify(data)}`)
    }
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
    tableConfig.otherButton.push({ id: '_row_action_hehe', name: 'Hehe', iconChild: <Delete fontSize='inherit' /> });
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

    return (
        <>
            <BaseTable<Person> data={[...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData]} tableConfig={tableConfig} />
        </>

    )
}
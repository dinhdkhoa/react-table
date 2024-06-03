'use client'

import { toast } from "sonner";
import { ENodeGrid } from "./enode-grid";
import { BaseGridConfig, FormatColumnType, Person, RowSelectType } from "./types";
import { Delete } from "lucide-react";

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
    const gridConfig = new BaseGridConfig<Person>(Person);
    gridConfig.cols.push(
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

    
    gridConfig.colsFixLeft.push('age');
    gridConfig.init();

    // gridConfig.isActionColumListType = false;
    gridConfig.isShowSelectionColumn = true;
    gridConfig.isShowChild = true;

    gridConfig.editButton.action = (data) => {
        toast(`Edit ${JSON.stringify(data)}`)
    }
    gridConfig.detailButton.action = (data) => {
        toast(`Detail ${JSON.stringify(data)}`)
    }
    gridConfig.deleteButton.action = (data) => {
        // console.log(gridConfig.table);
        toast(`Delete ${JSON.stringify(data)}`)
    }

    gridConfig.deleteButton.disableFn = (data) => {
        return gridConfig.table?.getSelectedRowModel().rows.some(w => w.original == data) ?? false;
    }

    // gridConfig.deleteButton.visibleFn = (data) => {
    //     return data.status == 'Single';
    // }

    // eslint-disable-next-line react/jsx-no-undef
    gridConfig.otherButton.push({ id: '_row_action_hehe', name: 'Hehe', iconChild: <Delete fontSize='inherit' /> });
    // gridConfig.isSelectAllPages = true;
    gridConfig.allowSelectRow = (data) => {
        return (data.lastName != 'dirte')
    }

    gridConfig.onSelect = (checked, rowSelectType, data, id) => {

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

    gridConfig.handleRowsSelectionChange = (checked, rows, arrData) => {
        // console.log(checked)
        // console.log(rows);
        // console.log(arrData);
    }

    return (
        <>
            <ENodeGrid<Person> data={[...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData, ...defaultData]} gridConfig={gridConfig} />
        </>

    )
}
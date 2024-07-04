'use client'

import { toast } from 'sonner'
import { Delete } from 'lucide-react'
import { BaseTableConfig } from '@/components/base-table/base-table-config'
import { FormatColumnType, RowSelectType } from '@/components/base-table/enums'

import { BaseTable } from '@/components/base-table/base-table'
import { createColumnHelper } from '@tanstack/react-table'
import {
  PersonEntity,
  PersonEntityFields,
  PersonEntityOnChange,
  statusSelectOption
} from '@/domain/entities/person-entity'

const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Chris', 'Ella', 'Tom', 'Sophia', 'Mike', 'Olivia']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor']
const statuses = ['InRelationship', 'Single', 'Complicated', '']

const getRandomElement = (arr: string[]): string | undefined => arr[Math.floor(Math.random() * arr.length)]
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
const getRandomBoolean = (): boolean => Math.random() < 0.5

const generateRandomPerson = (id: number): PersonEntity => ({
  __id__: id.toString(),
  __formfields__: PersonEntityFields,
  __onChange__: PersonEntityOnChange,
  firstName: getRandomElement(firstNames),
  lastName: getRandomElement(lastNames),
  age: getRandomNumber(18, 80),
  visits: getRandomNumber(0, 100),
  status: getRandomElement(statuses),
  progress: getRandomNumber(0, 100),
  date: new Date(getRandomNumber(2020, 2023), getRandomNumber(0, 11), getRandomNumber(1, 28)),
  active: getRandomBoolean()
})

const generateRandomPersons = (count: number): PersonEntity[] => {
  const persons: PersonEntity[] = []
  for (let i = 0; i < count; i++) {
    persons.push(generateRandomPerson(i))
  }
  return persons
}

const randomPersons = generateRandomPersons(10000)
console.log(randomPersons)

const defaultData: PersonEntity[] = [
  {
    __id__: '1',
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'InRelationship',
    progress: 50,
    date: undefined,
    active: true,
    __onChange__: PersonEntityOnChange,
    __formfields__: PersonEntityFields
  },
  {
    __id__: '2',
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 1234567,
    status: 'Single',
    progress: 80,
    date: new Date(),
    active: false,
    __onChange__: PersonEntityOnChange,
    __formfields__: PersonEntityFields
  },
  {
    __id__: '3',
    firstName: 'joe',
    lastName: 'dirte',
    age: 1234567.89,
    visits: 20,
    status: 'Complicated',
    progress: 10,
    date: new Date(2024, 5, 26),
    __onChange__: PersonEntityOnChange,
    __formfields__: PersonEntityFields
  }
]

export default function ENode() {
  const tableConfig = new BaseTableConfig<PersonEntity>(['__id__'])

  tableConfig.cols.push(
    {
      // id: 'firstName',
      accessorKey: 'firstName',
      meta: {
        editable: true
      }
    },
    {
      // id: 'lastName',
      accessorKey: 'lastName',
      meta: {
        editable: true
      }
    },
    {
      // id: 'age',
      accessorKey: 'age',
      meta: {
        formatColumnType: FormatColumnType.Decimal,
        editable: true
      }
    },
    {
      // id: 'visits',
      accessorKey: 'visits',
      meta: {
        formatColumnType: FormatColumnType.Decimal,
        editable: true
      }
    },
    {
      // id: 'status',
      accessorKey: 'status',
      maxSize: 400,
      minSize: 400,
      size: 400,
      meta: {
        formatColumnType: FormatColumnType.StaticCombobox,
        staticSelectOption: statusSelectOption,
        editable: true
      }
    },
    {
      // id: 'date',
      accessorKey: 'date',
      meta: {
        formatColumnType: FormatColumnType.DateTime,
        editable: true
      }
    },
    {
      // id: 'active',
      accessorKey: 'active',
      meta: {
        formatColumnType: FormatColumnType.Boolean,
        editable: true
      }
    }
  )

  let columnHelper = createColumnHelper<PersonEntity>()

  columnHelper.accessor((row) => row.lastName, {
    id: '',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id
  })

  tableConfig.colsFixLeft.push('age')
  tableConfig.init()

  // gridConfig.isActionColumListType = false;
  tableConfig.isShowSelectionColumn = true
  tableConfig.isShowChild = true

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
    return tableConfig.table?.getSelectedRowModel().rows.some((w) => w.original == data) ?? false
  }

  // gridConfig.deleteButton.visibleFn = (data) => {
  //     return data.status == 'Single';
  // }

  // eslint-disable-next-line react/jsx-no-undef
  tableConfig.otherButton.push({
    id: '_row_action_hehe',
    name: 'Hehe',
    iconChild: <Delete className='h-4 w-4' fontSize='inherit' />,
    action: (data) => {}
  })

  // gridConfig.isSelectAllPages = true;
  tableConfig.allowSelectRow = (data) => {
    return data.lastName != 'dirte'
  }

  tableConfig.onSelect = (checked, rowSelectType, data, id) => {
    switch (rowSelectType) {
      case RowSelectType.Row:
        if (data) {
          data.active = !data.active
          data.lastName = 'hehe'
        }
      case RowSelectType.AllPages:
      case RowSelectType.OnePage:
        break
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

  tableConfig.setData(randomPersons)

  return (
    <>
      <BaseTable<PersonEntity> data={tableConfig.getData} tableConfig={tableConfig} />
    </>
  )
}

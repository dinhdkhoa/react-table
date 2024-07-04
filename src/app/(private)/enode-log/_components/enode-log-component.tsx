'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import {} from '@/domain/entities/person-entity'
import { EnodeLogEntity } from '@/domain/entities/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { Guid } from 'guid-typescript'

function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function generateRandomObject() {
  return {
    key: generateRandomString(5),
    value: generateRandomString(10)
  }
}

function generateRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateRecord(): EnodeLogEntity {
  return {
    __id__: Guid.create().toString(),
    id: generateRandomString(10),
    url: `https://api.example.com/${generateRandomString(5)}`,
    method: ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)],
    timestamp: generateRandomDate(new Date(2020, 0, 1), new Date()),
    serviceCode: generateRandomString(8),
    apiCode: generateRandomString(8),
    request: generateRandomString(50),
    payload: generateRandomObject(),
    response: generateRandomObject(),
    originJsonData: generateRandomObject()
  }
}

function generateRecords(count: number) {
  const records = []
  for (let i = 0; i < count; i++) {
    records.push(generateRecord())
  }
  return records
}

const records = generateRecords(1000)
console.log(records)

export default function ENodeLog() {
  const tableConfig = new BaseTableConfig<EnodeLogEntity>()
  tableConfig.cols.push(
    tableConfig.columnHelper.accessor('id', {
      meta: {
        formatColumnType: FormatColumnType.String
      }
    }),
    tableConfig.columnHelper.accessor('url', {}),
    tableConfig.columnHelper.accessor('method', {}),
    tableConfig.columnHelper.accessor('timestamp', {
      meta: {
        formatColumnType: FormatColumnType.DateTime
      }
    }),
    tableConfig.columnHelper.accessor('serviceCode', {}),
    tableConfig.columnHelper.accessor('apiCode', {}),
    tableConfig.columnHelper.accessor('request', {}),
    tableConfig.columnHelper.accessor('payload', {}),
    tableConfig.columnHelper.accessor('response', {})
  )

  tableConfig.init()
  tableConfig.setData(records)
  return <BaseTable<EnodeLogEntity> data={tableConfig.getData} tableConfig={tableConfig} />
}

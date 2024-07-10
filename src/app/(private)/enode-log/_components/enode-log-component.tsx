'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import { } from '@/domain/entities/person-entity'
import { EnodeLogEntity } from '@/domain/entities/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { Guid } from 'guid-typescript'
import { useEffect, useState } from 'react'
import { EnodeLogUsecase } from '@/domain/use-cases/enode-log-usecase'

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

// const records = generateRecords(1000)

export default function ENodeLog({ data }: { data: Array<EnodeLogEntity> }) {
  const [loading, setLoading] = useState(false);
  const [tableConfig] = useState<BaseTableConfig<EnodeLogEntity>>(() => {
    const config = new BaseTableConfig<EnodeLogEntity>();

    config.cols.push(
      config.columnHelper.accessor('id', {
        meta: {
          formatColumnType: FormatColumnType.String
        }
      }),
      config.columnHelper.accessor('serviceCode', {}),
      config.columnHelper.accessor('apiCode', {}),
      config.columnHelper.accessor('httpStatus', {}),
      config.columnHelper.accessor('method', {}),
      config.columnHelper.accessor('timestamp', {
        meta: {
          formatColumnType: FormatColumnType.DateTime
        }
      }),
      config.columnHelper.accessor('url', {}),
      config.columnHelper.accessor('requestId', {}),
      config.columnHelper.accessor('destination', {}),
      config.columnHelper.accessor('request', {}),
      config.columnHelper.accessor('payload', {}),
      config.columnHelper.accessor('response', {}),
      config.columnHelper.accessor('messageId', {}),
    )

    // config.editButton.visibleFn = (data) => true;
    // config.detailButton
    config.isShowActionColumn = false;

    config.init()
    config.setData(data)
    return config;
  });
  

  // useEffect(() => {
  //   setLoading(true);
  //   EnodeLogUsecase.getList({ postPerPage: 100, pageNumber: 0 }).then(handleState => {
  //     if (!handleState.isError) {
  //       handleState.value
  //       tableConfig.setData(handleState.value || [])
  //       setLoading(false);
  //     }
  //   })
  // }, []);

  return <>
    <BaseTable<EnodeLogEntity> loading={loading} data={tableConfig.getData} tableConfig={tableConfig} /></>
}

'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import { EnodeLogEntity } from '@/domain/entities/enode-log/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { useState } from 'react'
import { TableConfigProvider } from '@/components/base-table/table-config-context'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { IBaseData } from '@/core/classes/base-data'
import { UseFormReturn } from 'react-hook-form'

export default function ENodeLogLimit({ data }: { data: Array<EnodeLogEntity> }) {

  const [tableConfig, setTableConfig] = useState<BaseTableConfig<EnodeLogEntity>>(() => {
    const config = new BaseTableConfig<EnodeLogEntity>();
    config.tableName = 'Enode Log';
    config.isShowQuickSearch = false;
    config.showFilterRow = false;
    config.pageOnServer = true;

    config.cols.push(
      config.columnHelper.accessor('id', {}),
      config.columnHelper.accessor('serviceCode', {
        meta: {
          formatColumnType: FormatColumnType.String,
          filterVariant: 'unique',
        }
      }),
      config.columnHelper.accessor('apiCode', {
        meta: {
          formatColumnType: FormatColumnType.String,
          filterVariant: 'unique',
        }
      }),
      config.columnHelper.accessor('httpStatus', {
        meta: {
          formatColumnType: FormatColumnType.String,
          filterVariant: 'unique',
        }
      }),
      config.columnHelper.accessor('method', {
        meta: {
          formatColumnType: FormatColumnType.String,
          filterVariant: 'unique',
        }
      }),
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
    config.filterAction.visibleFn = (data) => true;
    config.showChildButton.visibleFn = (data) => true;
    config.showChildButton.children = (data) => <JsonChild data={data.originJsonData}></JsonChild>
    config.isShowChild = true
    config.isActionColumListType = false;
    config.init();
    config.setData(data);
    return config;
  });

  return (<TableConfigProvider<EnodeLogEntity> initValue={tableConfig} >
    <BaseTable<EnodeLogEntity> loading={false} data={data} />
      
  </TableConfigProvider>)
}


const JsonChild = (props: { data: any }) => {
  return (<div className='break-all max-h-[480px] overflow-y-scroll'>
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      <code>
        {JSON.stringify(props.data, null, 2)}
      </code>
    </pre>

  </div>)
}
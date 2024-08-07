'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import { EnodeLogEntity } from '@/domain/entities/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { useState } from 'react'
import { TableConfigProvider } from '@/components/base-table/table-config-context'

export default function ENodeLogLimit({ data }: { data: Array<EnodeLogEntity> }) {

  const [tableConfig, setTableConfig] = useState<BaseTableConfig<EnodeLogEntity>>(() => {
    const config = new BaseTableConfig<EnodeLogEntity>();
    config.tableName = 'Page On Server';
    config.isShowQuickSearch = true;
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
    config.isShowSelectionColumn = true;


    config.init();
    config.setData(data);
    return config;
  });

  return (<TableConfigProvider<EnodeLogEntity> initValue={tableConfig} >
    <BaseTable<EnodeLogEntity> loading={false} data={data}/>
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
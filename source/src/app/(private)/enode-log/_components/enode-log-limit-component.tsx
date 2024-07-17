'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import { EnodeLogEntity } from '@/domain/entities/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { useState } from 'react'
import { useTablePaginatitonParams } from '@/components/base-table/paginatiton-params-context'

export default function ENodeLogLimit({ data }: { data: Array<EnodeLogEntity> }) {
  // useEffect(() => {
  //   setTableSearchParamsContext(tableSearchParams || defaultTablePaginationSearchParams);
  // }, [tableSearchParams, setTableSearchParamsContext])


  const [tableConfig, setTableConfig] = useState<BaseTableConfig<EnodeLogEntity>>(() => {
    const config = new BaseTableConfig<EnodeLogEntity>();
    config.tableName = '';
    config.isShowQuickSearch = true;
    // config.pageSizeDefault = tableSearchParams?.pageSize ?? pageSizeDefault;
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

  return <BaseTable<EnodeLogEntity> loading={false} data={data} tableConfig={tableConfig} />
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
'use client'

import { BaseTableConfig } from '@/components/base-table/base-table-config'

import { BaseTable } from '@/components/base-table/base-table'
import { EnodeLogEntity, EnodeLogPaginationEntity } from '@/domain/entities/enode-log/enode-log-entity'
import { FormatColumnType } from '@/components/base-table/enums'
import { useState } from 'react'
import { TableConfigProvider } from '@/components/base-table/table-config-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { encode } from 'punycode'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ENodeLogLimit({ entity }: { entity: EnodeLogPaginationEntity | undefined }) {

  const [tableConfig] = useState<BaseTableConfig<EnodeLogEntity>>(() => {
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
    config.showChildButton.children = (data) => <Child data={data}></Child>
    config.isShowChild = true
    config.isActionColumListType = false;
    config.init();
    config.setData(entity?.data || []);
    return config;
  });
  tableConfig.totalPageOnServer = entity?.totalPage ?? 1;
  return (<TableConfigProvider<EnodeLogEntity> initValue={tableConfig} >
    <BaseTable<EnodeLogEntity> loading={false} data={entity?.data || []} />
  </TableConfigProvider>)
}

const CardItem = ({ className, title, data }: { className?: string, title: string, data: any }) => {
  const defaultCopyIcon = <Copy className='w-3.5' />;
  const copiedCopyIcon = <Check className='w-3.5' />;
  const [dataJson] = useState<string>(JSON.stringify(data, null, 2))
  const [icon, setIcon] = useState(defaultCopyIcon);
  async function handleCopyClick(event: any): Promise<void> {
    await navigator.clipboard.writeText(dataJson);
    setIcon(copiedCopyIcon);
    setTimeout(() => {
      setIcon(defaultCopyIcon);
    }, 3000);
  }

  return (
    <Card className={cn('rounded-md shadow-none bg-inherit', className)}>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center'>
            <span>{title}</span>
            <Button onClick={handleCopyClick} title='Copy' className='w-7 h-7 ml-2' variant={'outline'} size={'icon'}>{icon} </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <code>
            {dataJson}
          </code>
        </pre>
      </CardContent>
    </Card>
  )
}

const Child = (props: { data: EnodeLogEntity }) => {
  return (
    <div className='break-all max-h-[480px] overflow-y-scroll'>
      <CardItem key={'request'} title='Request' data={props.data.request || ''} />
      <CardItem key={'response'} className="mt-2" title='Response' data={props.data.response || ''} />
    </div>
  )
}
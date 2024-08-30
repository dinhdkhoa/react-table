"use client";


import BaseForm from "@/components/base-form";
import { usePageSearchParams } from "@/components/base-table/context/search-params-provider";
import { usePagePreventAction } from "@/components/page-prevent-action-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { setSearchParamsToBaseForm } from "@/core/helper/search-param-helper";
import useBaseForm from "@/core/hooks/useBaseForm";
import { defaultEnodeLogSearchEntity, EnodeLogSearchEntity } from "@/domain/entities/enode-log/enode-log-search-entity";
import { cn } from "@/lib/utils";
import { Minus, Plus, RefreshCw, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";


export const EnodeLogSearchComponentSearchButtonName = 'EnodeLogSearchComponent.searchButton';

export const EnodeLogSearchComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const { updateSearchParams, urlSearchParams } = usePageSearchParams();
  const { processingAction, isProcessing, normalAction } = usePagePreventAction();
  // const [loading, setLoading] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const [enodeLogSearchEntity] = useState<EnodeLogSearchEntity>(() => {
    return defaultEnodeLogSearchEntity();
  })
  const { ...props } = useBaseForm<EnodeLogSearchEntity>(enodeLogSearchEntity)

  useEffect(() => {
    setSearchParamsToBaseForm(props.form, urlSearchParams);
  }, [])
  useEffect(() => {
    normalAction(EnodeLogSearchComponentSearchButtonName)
  }, [searchParam])


  const handleToggleAdvance = () => setShowAdvance((prev) => !prev);
  const handleReset = () => { props.form.reset(); };
  const handleSubmit = props.form.handleSubmit((data) => {
    processingAction(EnodeLogSearchComponentSearchButtonName);
    const keys = Object.keys(props.rhf);
    const params = keys.map(w => {
      return JSON.parse(JSON.stringify({ key: (w || '').toString(), value: (data as any)[w] || '' }));
    });
    console.log(data);
    const _searchParams = updateSearchParams(params);
    if (_searchParams.toString() == urlSearchParams.toString()) {
      router.refresh();
    }
    else {
      router.push(`${pathname}?${_searchParams.toString()}`);
    }
  });

  return (
    <Card className="w-full mt-5 rounded-md shadow-none" >
      <CardContent className="pt-6">
        <BaseForm<EnodeLogSearchEntity> {...props}>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <Button className="min-w-9 min-h-6" type="button" onClick={handleToggleAdvance} variant="outline" size="icon">
                {showAdvance ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </Button>
              <div className="grow-[6]">
                <BaseForm.TextInput<EnodeLogSearchEntity> showLabel="hidden" name="quickSearch" />
              </div>
              <div>
                <div className="grid gap-4 grid-cols-2">
                  <div className="max-w-64"> <BaseForm.DateTime<EnodeLogSearchEntity> showLabel="hidden" name="fromTime" /></div>
                  <div className="max-w-64"> <BaseForm.DateTime<EnodeLogSearchEntity> showLabel="hidden" name="toTime" /></div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button type="submit" disabled={isProcessing(EnodeLogSearchComponentSearchButtonName)}>
                  <RefreshCw className={cn("mr-2 h-4 w-4", isProcessing(EnodeLogSearchComponentSearchButtonName) ? " animate-spin" : "")} />
                  Refresh
                </Button>
                <Button className="min-w-9 min-h-6" type="button" onClick={handleReset} variant="default" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div hidden={!showAdvance} className="mt-6">
              <div className="text-lg font-semibold">Advanced Search</div>
              <div className=" mt-2 grid gap-4 grid-cols-6">
                <BaseForm.TextInput<EnodeLogSearchEntity> name="id" />
                <BaseForm.TextInput<EnodeLogSearchEntity> name="serviceCode" />
                <BaseForm.TextInput<EnodeLogSearchEntity> name="apiCode" />
                <BaseForm.TextInput<EnodeLogSearchEntity> name="requestId" />
                <BaseForm.NumberInput<EnodeLogSearchEntity> name="httpStatusCode" />
              </div>
            </div>
          </form>
        </BaseForm>
      </CardContent>
    </Card>
  )
}
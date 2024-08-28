"use client";


import BaseForm from "@/components/base-form";
import { usePageSearchParams } from "@/components/base-table/context/search-params-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { setSearchParamsToBaseForm } from "@/core/helper/search-param-helper";
import useBaseForm from "@/core/hooks/useBaseForm";
import { defaultEnodeLogSearchEntity, EnodeLogSearchEntity, EnodeLogSearchEntityFields } from "@/domain/entities/enode-log/enode-log-search-entity";
import { Minus, Plus, RefreshCcw, RotateCcw } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const EnodeLogSearchComponent = ({ stateId }: { stateId: string }) => {
  const [loading, setLoading] = useState(false);
  const [showAdvance, setShowAdvance] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { updateSearchParams, urlSearchParams } = usePageSearchParams();
  const [enodeLogSearchEntity] = useState<EnodeLogSearchEntity>(() => {
    return defaultEnodeLogSearchEntity();
  })
  const { ...props } = useBaseForm<EnodeLogSearchEntity>(enodeLogSearchEntity)

  useEffect(() => {
    setSearchParamsToBaseForm(props.form, urlSearchParams);
  }, [])

  useEffect(() => {
    setLoading(false);
  }, [stateId]);

  function onRefresh(): void {
    props.form.trigger().then(validate => {
      if (validate) {
        setLoading(true);
        const keys = Object.keys(props.rhf);
        const params = keys.map(w => {
          return { key: (w || '').toString(), value: props.form.getValues(w as any) }
        });
        props.form.handleSubmit((data) => {
          console.log(data);
        })
        const _searchParams = updateSearchParams(params);
        if (_searchParams.toString() == urlSearchParams.toString()) {
          router.refresh();
        }
        else {
          router.push(`${pathname}?${_searchParams.toString()}`);
        }
      }
    })
  }

  const onSubmit = props.form.handleSubmit((data) => {
    setLoading(true);
    const keys = Object.keys(props.rhf);

    const params = keys.map(w => {
      return { key: (w || '').toString(), value: (data as any)[w] }
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

  function resetData(): void {
    props.form.reset();
  }

  return (
    <Card className="w-full mt-5 rounded-md shadow-none" >
      <CardContent className="pt-6">
        <BaseForm<EnodeLogSearchEntity> {...props}>
          <form onSubmit={onSubmit}>
            <div className="flex gap-4">
              <Button className="min-w-9 min-h-6" type="button" onClick={() => setShowAdvance(!showAdvance)} variant="outline" size="icon">
                {!showAdvance && <Plus className="h-4 w-4" />}
                {showAdvance && <Minus className="h-4 w-4" />}

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
                <Button type="submit" disabled={loading}>
                  {loading && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />}
                  {!loading && <RefreshCcw className="mr-2 h-4 w-4" />}
                  Refresh
                </Button>
                <Button className="min-w-9 min-h-6" type="button" onClick={() => { resetData() }} variant="default" size="icon">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div hidden={!showAdvance} className="mt-6">
              <div className="text-lg font-semibold">Advance Search</div>
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
    </Card>)
}
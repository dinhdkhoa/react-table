import { defaultTablePaginatitonParams, pageIndexDefault, pageSizeDefault, pageSizeOptionsDefault } from "@/components/base-table/base-table-config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useCustomSearchParams = () => {
    const searchParams = useSearchParams();
    const [urlSearchParams, setUrlSearchParams] = useState(new URLSearchParams(searchParams));
    const [page, setPage] = useState<number>(pageIndexDefault);
    const [pageSize, setPageSize] = useState<number>(pageSizeDefault);

    useEffect(() => {
        if (urlSearchParams.size == 0) {
            setPage(pageIndexDefault + 1);
            setPageSize(pageSizeDefault);
        }
        else {
            urlSearchParams.forEach((currentValue, currentKey, parent) => {
                if (currentKey.toLowerCase() == 'page'.toLowerCase()) {
                    const num = Number(currentValue);
                    if (currentValue && !isNaN(num)) {
                        setPage(num);
                    }
                } else if (currentKey.toLowerCase() == 'pageSize'.toLowerCase()) {
                    const num = Number(currentValue);
                    if (currentValue && !isNaN(num)) {
                        if (pageSizeOptionsDefault.includes(num)) {
                            setPageSize(num);
                        }
                        else {
                            setPageSize(pageSizeDefault)
                        }
                    }
                }
            });
        }
    }, [urlSearchParams]);

    const updateSearchParams = (values: { key: string, value: string }[]) => {
        const _searchParams = new URLSearchParams(urlSearchParams)
        let copyValues = [...values];
        if (values && values.length > 0) {
            const newParams = new URLSearchParams('');
            if (urlSearchParams.size == 0) {
                values.forEach(p => {
                    if (p.key) {
                        newParams.append(p.key, p.value);
                    }
                });
            }
            else {
                //Update param exist
                urlSearchParams.forEach((currentValue, currentKey, parent) => {
                    const p = copyValues.find(v => v.key.toLowerCase() == currentKey.toLowerCase());
                    if (p) {
                        newParams.append(currentKey, p.value);
                        copyValues = copyValues.filter(w => w.key.toLowerCase() != p.key.toLowerCase());
                    }
                    else {
                        newParams.append(currentKey, currentValue)
                    }
                });

                copyValues.forEach(p => {
                    if (p.key) {
                        newParams.append(p.key, p.value);
                    }
                })
            }

            setUrlSearchParams(newParams);
            return;
        }
        setUrlSearchParams(_searchParams);
    }
    return ({ updateSearchParams, urlSearchParams, setUrlSearchParams, page, pageSize });
}
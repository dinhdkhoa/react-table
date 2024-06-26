import {
    DefaultValues,
    useForm
} from "react-hook-form"
import { useState } from "react"
import { RHF_FIELDS } from "../anotations/rhf-field"


function useBaseForm<TEntity>(entity: TEntity & Object) {
    const [state] = useState(entity)

    const rhf = Reflect.getMetadata(RHF_FIELDS, entity)
    const form = useForm({
        defaultValues: entity as DefaultValues<TEntity>
    })
    return {
        rhf: rhf,
        form,
        entity: state
    }
}

export default useBaseForm
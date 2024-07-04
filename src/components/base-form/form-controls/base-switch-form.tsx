import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn
} from "react-hook-form"
import { BaseFormFieldPropsType } from "./types"
import { Switch } from "../../ui/switch"
import { useBaseFormContext } from ".."
import { SwitchControl } from "@/core/types/control.types"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { SharedVariantProps, SharedVariants } from "./shared-variants"

// Variants
const sideLabelDefault =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

const BaseSwitchVariants = cva(null, {
  variants: {
    switchVariants: {
      "top-label": "",
      "side-label": "",
      "table-item": "place-content-center"
    },
    sideLabel: {
      "label-left": sideLabelDefault,
      "label-right": sideLabelDefault + " flex-row-reverse"
    },
    topLabel: {
      default: ""
    }
  },
  defaultVariants: {
    switchVariants: "top-label",
    sideLabel: "label-left",
    topLabel: "default"
  }
})

// Types & Interface

type BaseSwitchVariantsProps = VariantProps<typeof BaseSwitchVariants>

type BaseSwitchProps<TEntity extends FieldValues = FieldValues> =
  BaseFormFieldPropsType<TEntity> & SharedVariantProps & BaseSwitchVariantsProps

type BaseSwitchItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseSwitchVariantsProps

// Components
const BaseSwitch = <TEntity extends FieldValues = FieldValues>({
  name,
  ...props
}: BaseSwitchProps<TEntity>) => {
  const { form, rhf } = useBaseFormContext<TEntity>()
  const { visibleFn } = rhf[name]

  const [visibled, setVisibled] = useState<boolean>(() => {
    if (visibleFn) {
      return visibleFn(form, form.getValues())
    }
    return true
  })

  useEffect(() => {
    if (visibleFn) {
      setVisibled(visibleFn(form, form.getValues()))
    }
  }, [form.watch()])

  return (
    visibled && (
      <FormField
        control={form.control}
        name={name}
        render={(params) => (
          <BaseSwitchItem visibled={visibled} {...params} {...props} />
        )}
      />
    )
  )
}

const BaseSwitchItem = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends SwitchControl = SwitchControl
>(
  props: BaseSwitchItemsProps<TEntity>
) => {
  const {
    field,
    fieldState,
    formState,
    formVariant,
    sideLabel,
    topLabel,
    switchVariants,
    showLabel,
    visibled = true
  } = props
  const { rhf, setAfterDataChanged, form } = useBaseFormContext<TEntity>()
  const { label, disableFn, validate } = rhf[field.name]

  const [disabled, setDisabled] = useState<boolean>(() => {
    if (disableFn) {
      return disableFn(form, form.getValues())
    }
    return false
  })

  useEffect(() => {
    if (disableFn) {
      setDisabled(disableFn(form, form.getValues()))
    }
  }, [form.watch()])

  useEffect(() => {
    form.register(field.name, {
      validate: !(
        (disableFn ? disableFn(form, form.getValues()) : false) || !visibled
      )
        ? validate
        : undefined
    })
    if (disabled) {
      form.clearErrors(field.name)
    }
  }, [disableFn, disabled, field.name, form, validate, visibled])

  const handleChange = (e: boolean) => {
    form.setValue(field.name, e as any)
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e, form.getValues())
  }

  const showTopLabel = switchVariants == "top-label"
  return (
    <FormItem>
      {showTopLabel && (
        <FormLabel
          className={cn(
            SharedVariants({ showLabel }),
            BaseSwitchVariants({ topLabel })
          )}
        >
          {label}
        </FormLabel>
      )}
      <FormControl>
        <div
          className={cn(
            "flex items-center space-x-2",
            BaseSwitchVariants({ switchVariants })
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 ",
              BaseSwitchVariants({ switchVariants, sideLabel })
            )}
          >
            {!showTopLabel && (
              <label
                htmlFor={field.name}
                className={cn(
                  SharedVariants({ showLabel }),
                  BaseSwitchVariants({ sideLabel })
                )}
              >
                {label}
              </label>
            )}
            <Switch
              id={field.name}
              {...field}
              onCheckedChange={handleChange}
              disabled={disabled}
              checked={form.getValues(field.name)}
            />
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}

export default BaseSwitch

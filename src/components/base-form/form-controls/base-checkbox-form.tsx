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
import { Checkbox } from "../../ui/checkbox"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useBaseFormContext } from ".."
import { CheckboxControl } from "@/core/types/control.types"
import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"
import { SharedVariantProps, SharedVariants } from "./shared-variants"

// Variants

const BaseCheckboxVariants = cva(null, {
  variants: {
    checkBoxVariants: {
      "top-label": "",
      "side-label": "",
      "table-item": ""
    },
    sideLabel: {
      default:
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      "label-right":
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    },
    topLabel: {
      default: ""
    }
  },
  compoundVariants: [
    {
      checkBoxVariants: "table-item",
      className: "place-content-center"
    },
    {
      checkBoxVariants: "side-label",
      sideLabel: "label-right",
      className: "flex-row-reverse"
    }
  ],
  defaultVariants: {
    checkBoxVariants: "top-label",
    sideLabel: "default",
    topLabel: "default"
  }
})

// Types & Interface

type BaseCheckboxVariantsProps = VariantProps<typeof BaseCheckboxVariants>

type BaseCheckboxProps<TEntity extends FieldValues = FieldValues> =
  BaseFormFieldPropsType<TEntity> &
    SharedVariantProps &
    BaseCheckboxVariantsProps

type BaseCheckboxItemsProps<TEntity extends FieldValues = FieldValues> = {
  field: ControllerRenderProps<TEntity, Path<TEntity>>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<TEntity>
  visibled?: boolean
} & SharedVariantProps &
  BaseCheckboxVariantsProps

// Components

const BaseCheckbox = <TEntity extends FieldValues = FieldValues>({
  name,
  ...props
}: BaseCheckboxProps<TEntity>) => {
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
          <BaseCheckboxItem visibled={visibled} {...params} {...props} />
        )}
      />
    )
  )
}

const BaseCheckboxItem = <
  TEntity extends FieldValues = FieldValues,
  TControlType extends CheckboxControl = CheckboxControl
>(
  props: BaseCheckboxItemsProps<TEntity>
) => {
  const {
    field,
    fieldState,
    formState,
    checkBoxVariants,
    formVariant,
    topLabel,
    showLabel,
    sideLabel,
    visibled = true
  } = props
  const { rhf, form, setAfterDataChanged } = useBaseFormContext<TEntity>()
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

  const handleChange = (e: CheckedState) => {
    form.setValue(field.name, e as any)
    if (setAfterDataChanged)
      setAfterDataChanged(form, field.name, e, form.getValues())
  }
  const showTopLabel = checkBoxVariants == "top-label"

  return (
    <FormItem>
      {showTopLabel && (
        <FormLabel
          className={cn(
            SharedVariants({ showLabel }),
            BaseCheckboxVariants({ topLabel })
          )}
        >
          {label}
        </FormLabel>
      )}
      <FormControl>
        <div className="flex items-center space-x-2">
          <div
            className={cn(
              "flex items-center gap-2 ",
              BaseCheckboxVariants({ checkBoxVariants, sideLabel })
            )}
          >
            {!showTopLabel && (
              <label
                htmlFor={field.name}
                className={cn(
                  SharedVariants({ showLabel }),
                  BaseCheckboxVariants({ sideLabel })
                )}
              >
                {label}
              </label>
            )}
            <Checkbox
              id={field.name}
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

export default BaseCheckbox

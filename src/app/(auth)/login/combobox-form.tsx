"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"
import { RHFOptions } from "@/core/anotations/hook-form"
import { onChangeFun } from "@/core/classes/base-entity-form"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ComboboxForm(
  form: UseFormReturn,
  f: { name: string, options: RHFOptions },
  field: ControllerRenderProps,
  onChange?: onChangeFun) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : `Select ${f.options.label}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${f.options.label}`} />
          <CommandList>
            <CommandEmpty>{`No ${f.options.label} found`}</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    form.setValue(f.name, currentValue)
                    setValue(currentValue === value ? "" : currentValue)
                    if (onChange) {

                      onChange(form, f.name, currentValue === value ? "" : currentValue);
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>


    // <FormField
    //   key={f.name}
    //   control={form.control}
    //   name={f.name}
    //   render={({ field }) => (
    //     <FormItem>
    //       <FormLabel>{f.options.label}</FormLabel>
    //       <Popover open={open} onOpenChange={setOpen}>
    //         <PopoverTrigger asChild>
    //           <Button
    //             variant="outline"
    //             role="combobox"
    //             aria-expanded={open}
    //             className="w-[200px] justify-between"
    //           >
    //             {value
    //               ? frameworks.find((framework) => framework.value === value)?.label
    //               : "Select framework..."}
    //             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //           </Button>
    //         </PopoverTrigger>
    //         <PopoverContent className="w-[200px] p-0">
    //           <Command>
    //             <CommandInput placeholder="Search framework..." />
    //             <CommandList>
    //               <CommandEmpty>No framework found.</CommandEmpty>
    //               <CommandGroup>
    //                 {frameworks.map((framework) => (
    //                   <CommandItem
    //                     key={framework.value}
    //                     value={framework.value}
    //                     onSelect={(currentValue) => {

    //                       setValue(currentValue === value ? "" : currentValue)
    //                       setOpen(false)
    //                     }}
    //                   >
    //                     <Check
    //                       className={cn(
    //                         "mr-2 h-4 w-4",
    //                         value === framework.value ? "opacity-100" : "opacity-0"
    //                       )}
    //                     />
    //                     {framework.label}
    //                   </CommandItem>
    //                 ))}
    //               </CommandGroup>
    //             </CommandList>
    //           </Command>
    //         </PopoverContent>
    //       </Popover>
    //     </FormItem>
    //   )}
    // />



  )
}

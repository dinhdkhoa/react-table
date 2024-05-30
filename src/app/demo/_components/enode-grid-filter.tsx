'use client'

// import { Autocomplete, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { Column, Row, RowData } from "@tanstack/react-table"
import { SyntheticEvent, useEffect, useMemo, useState } from "react"
import { BaseGridData, FormatColumnType } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
// import LocalizationProvider from "@mui/lab/LocalizationProvider"
// import AdapterDateFns from "@mui/lab/AdapterDateFns"
// import DatePicker from "@mui/lab/DatePicker"
// import { StyledPopper } from "./styles"

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}

type checkBoxFilterType = string | null | undefined;
type dateFilterType = Date | null | undefined


export function filterOnDate<T extends BaseGridData>(row: Row<T>, columnId: string, filterValue: Date | null | undefined) {
    if (!filterValue) {
        return true;
    }

    if (row.original) {
        if (columnId in row.original) {
            // const valye = (row.original as any)[columnId];
            const value = row.original[columnId as keyof T] as (Date | null | undefined);
            if (!value) return false;
            const result = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime() == new Date(filterValue.getFullYear(), filterValue.getMonth(), filterValue.getDate()).getTime();

            return result;
        }
    }

    return false;
}

export function filterCheckbox<T extends BaseGridData>(row: Row<T>, columnId: string, filterValue: string | null | undefined) {
    if (filterValue == 'any')
        return true;

    if (row.original) {
        if (columnId in row.original) {
            // const valye = (row.original as any)[columnId];
            const filterValueBoolean = filterValue == 'true';
            const value = row.original[columnId as keyof T] as (boolean | null | undefined);

            return (value || false) == filterValueBoolean;
        }
    }

    return false;
}


export function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant, formatColumnType } = column.columnDef.meta ?? {}
    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () =>
            filterVariant === 'range'
                ? []
                : Array.from(column.getFacetedUniqueValues().keys())
                    .sort()
                    .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    )
    if (!formatColumnType) {
        return (<FilterAutocomplete
            options={sortedUniqueValues}
            onChange={value => column.setFilterValue(value)}
        />)
    }

    if ([FormatColumnType.Boolean].includes(formatColumnType)) {
        return (
            <FilterCheckbox
                onChange={value => column.setFilterValue(value)}
            ></FilterCheckbox>
        )
    }

    if ([FormatColumnType.Date, FormatColumnType.DateTime].includes(formatColumnType)) {
        return (<FilterDate
            value={!columnFilterValue ? null : columnFilterValue}
            onChange={value => column.setFilterValue(value)}
        ></FilterDate>)
    }
}


function FilterCheckbox({
    onChange,
}: {
    onChange: (value: checkBoxFilterType) => void
}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<checkBoxFilterType>('any')

    useEffect(() => {
        onChange(value);
    }, [value])

    const checkState = [
        {
            value: 'any',
            label: "Any",
        },
        {
            value: 'true',
            label: 'Checked',
        },
        {
            value: 'false',
            label: "Uncheck",
        }
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? checkState.find((state) => state.value === value)?.label
                        : ""}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0">
                <Command>
                    <CommandGroup>
                        <CommandList>
                            {checkState.map((state) => (
                                <CommandItem
                                    key={state.value}
                                    value={state.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === state.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {state.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>


        // <Select
        //     defaultValue=''
        //     displayEmpty
        //     labelId='controlled-select-label'
        //     onChange={handleChange}
        //     size="small"
        //     placeholder="Filter"
        //     variant='standard'
        // >
        //     <MenuItem value=''>Any</MenuItem>
        //     <MenuItem value='true'>Checked</MenuItem>
        //     <MenuItem value='false'>Uncheck</MenuItem>
        // </Select>

    )

}

function FilterDate({
    value,
    onChange,
}: {
    value: any,
    onChange: (value: dateFilterType) => void

}) {
    const [date, setDate] = useState<dateFilterType>(value)

    useEffect(() => {
        onChange(date);
    }, [date])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className="w-full justify-between"
                    // className={cn(
                    //     "w-full justify-start text-left font-normal",
                    //     !date && "text-muted-foreground"
                    // )}
                >
                    {date ? date.toLocaleDateString() : <span>Filter</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date == null ? undefined : date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )

    // return (
    //     <LocalizationProvider dateAdapter={AdapterDateFns}>
    //         <DatePicker
    //             value={value}
    //             clearable={true}
    //             onChange={(date) => onChange(date)}
    //             renderInput={params => <TextField {...params}
    //                 variant='standard' size='small' placeholder="Filter" />}>
    //         </DatePicker>
    //     </LocalizationProvider>
    // )
}

function FilterAutocomplete({
    options,
    onChange,
}: {
    options: any[]
    onChange: (value: any) => void
}) {

    const [values] = useState(() => {
        return options.map(option => { return { value: option?.toString() as (string | undefined), label: option?.toString() as (string | undefined) } })
    })
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string | undefined>("")

    useEffect(() => {
        onChange(value);
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? values.find((option) => option.value === value)?.label
                        : "Filter"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {values.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )

    // return (
    //     <Autocomplete
    //         {...props}
    //         options={options}
    //         onChange={handleChange}
    //         id='autocomplete-filter-header'
    //         getOptionLabel={getOptionLabel}
    //         PopperComponent={(popperProps) => (
    //             <StyledPopper {...popperProps} />
    //         )}
    //         renderInput={params => <TextField {...params} variant='standard' size="small" placeholder="Filter" />}
    //     />
    // )
}
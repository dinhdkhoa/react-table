'use client'

import { Column, Row, RowData } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { BaseData } from "@/core/classes/base-data";
import { isNumberColumn } from "./base-table-config";
import { FormatColumnType } from "./enums";
import { SelectOption } from "@/core/types/control.types";
import { Input } from "../ui/input";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select',
        staticSelectOption?: SelectOption<any, any>,
    }
}

type CheckBoxFilterType = string | null | undefined;
type DateFilterType = Date | null | undefined;
type StaticComboboxFilterType = string | number | null | undefined;

export function filterOnDate<T extends BaseData>(row: Row<T>, columnId: string, filterValue: Date | null | undefined) {
    if (!filterValue) {
        return true;
    }

    if (row.original && columnId in row.original) {
        const value = row.original[columnId as keyof T] as (Date | null | undefined);
        if (!value) return false;

        const result = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime() ===
            new Date(filterValue.getFullYear(), filterValue.getMonth(), filterValue.getDate()).getTime();

        return result;
    }

    return false;
}

export function filterCheckbox<T extends BaseData>(row: Row<T>, columnId: string, filterValue: string | null | undefined) {
    if (filterValue === 'any') return true;

    if (row.original && columnId in row.original) {
        const filterValueBoolean = filterValue === 'true';
        const value = row.original[columnId as keyof T] as (boolean | null | undefined);

        return (value || false) === filterValueBoolean;
    }

    return false;
}

export function filterNumber<T extends BaseData>(row: Row<T>, columnId: string, filterValue: string | number | null | undefined) {
    if (!filterValue) {
        return true;
    }

    if (row.original && columnId in row.original && !isNaN(Number(filterValue))) {
        const value = row.original[columnId as keyof T] as (number | null | undefined);
        const filterValueNum = Number(filterValue)
        if (!value) return false;

        return value === filterValueNum;
    }

    return false;
}

export function filterStaticCombobox<T extends BaseData>(row: Row<T>, columnId: string, filterValue: StaticComboboxFilterType) {
    if (!filterValue) {
        return true;
    }

    if (row.original && columnId in row.original) {
        const value = row.original[columnId as keyof T] as StaticComboboxFilterType;
        return value === filterValue;
    }

    return false;
}

export function Filter({ column }: { column: Column<any, unknown> }) {
    const { filterVariant, formatColumnType } = column.columnDef.meta ?? {};
    const columnFilterValue = column.getFilterValue();

    const buildWidthPopOver = useMemo(() => {
        return `w-[${column.getSize()}px] max-w-[${column.columnDef.maxSize}px] min-w-[${column.columnDef.minSize}px]`;
    }, [column]);

    const sortedUniqueValues = useMemo(
        () => filterVariant === 'range' ? [] : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
        [column.getFacetedUniqueValues(), filterVariant]
    );

    const isNumberCol = isNumberColumn(formatColumnType);

    if (!formatColumnType || isNumberCol) {
        return (
            
            <Input className="bg-background shadow-sm hover:bg-accent hover:text-accent-foreground" placeholder="Filter" onChange={value => { column.setFilterValue(value.currentTarget.value) }} type={isNumberCol ? 'number' : 'text'} />
        );
    }

    if ([FormatColumnType.StaticCombobox].includes(formatColumnType)) {
        const { staticSelectOption } = column.columnDef.meta ?? {};
        if (staticSelectOption) {
            return <FilterStaticCombobox value={columnFilterValue as StaticComboboxFilterType} selectOption={staticSelectOption}
                onChange={value => { column.setFilterValue(value) }} popOverContentWidth={buildWidthPopOver}
            />
        }
        return null;
    }


    if ([FormatColumnType.Boolean].includes(formatColumnType)) {
        return (
            <FilterCheckbox
                onChange={value => column.setFilterValue(value)}
            />
        );
    }

    if ([FormatColumnType.Date, FormatColumnType.DateTime].includes(formatColumnType)) {
        return (
            <FilterDate
                value={(columnFilterValue ?? null) as DateFilterType}
                onChange={value => column.setFilterValue(value)}
            />
        );
    }
}

function FilterCheckbox({ onChange }: { onChange: (value: CheckBoxFilterType) => void }) {
    const allValue = 'any';
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<CheckBoxFilterType>(allValue);

    useEffect(() => {
        onChange(value);
    }, [value]);

    const checkState = [
        { value: allValue, label: "Any" },
        { value: 'true', label: 'Checked' },
        { value: 'false', label: "Unchecked" },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    <span className="truncate">{value ? checkState.find(state => state.value === value)?.label : "Filter"}</span>
                    {value !== allValue ? clearFilter(() => setValue(allValue)) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0">
                <Command>
                    <CommandGroup>
                        <CommandList>
                            {checkState.map(state => (
                                <CommandItem
                                    key={state.value}
                                    value={state.value}
                                    onSelect={currentValue => {
                                        setValue(currentValue === value ? allValue : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === state.value ? "opacity-100" : "opacity-0")} />
                                    {state.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function FilterDate({ value, onChange }: { value: DateFilterType, onChange: (value: DateFilterType) => void }) {
    const [date, setDate] = useState<DateFilterType>(value);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        onChange(date);
    }, [date]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">{date ? date.toLocaleDateString() : "Filter"}</span>
                    {value ? clearFilter(() => setDate(null)) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date || undefined} onSelect={(e) => { setDate(e); setOpen(false) }} initialFocus />
            </PopoverContent>
        </Popover>
    );
}

const clearFilter = (onClick: () => void) => (
    <X onClick={e => { e.stopPropagation(); onClick(); }} className="ml-2 h-4 w-4 shrink-0" />
);

function FilterAutocomplete({ options, onChange, popOverContentWidth }: { options: any[], onChange: (value: any) => void, popOverContentWidth: string }) {
    const [values] = useState(() => options.map(option => ({ value: option, label: option })));
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<any>(undefined);

    useEffect(() => {
        onChange(value);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    <span className="truncate">{value ? values.find(option => option.value == value)?.label?.toString() : "Filter"}</span>
                    {value ? clearFilter(() => setValue(undefined)) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("max-w-sm p-0", popOverContentWidth)}>
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandEmpty>No data found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {values.map(option => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={currentValue => {
                                        setValue(currentValue == value ? undefined : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn("mr-2 min-h-4 min-w-4 h-4 w-4", value == option.value ? "opacity-100" : "opacity-0")} />
                                    <span>{option.label}</span>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function FilterStaticCombobox({ value, selectOption, onChange, popOverContentWidth }: { value: StaticComboboxFilterType, selectOption: SelectOption<any, any>, onChange: (value: any) => void, popOverContentWidth: string }) {
    const placeholder = 'Filter'
    const [open, setOpen] = useState(false)
    const [currentValue, setCurrentValue] = useState(value);

    const display = useMemo(() => {
        const _value = currentValue;
        if (_value) {
            const findItem = selectOption.data.find((basicItem) => selectOption.value(basicItem) == _value);
            if (findItem) {
                return selectOption.display(findItem) || '';
            }
            return 'N/A';
        }

        return placeholder;
    }, [currentValue, selectOption])


    const getKey = (item: any) => {
        return selectOption!.value(item)?.toString()
    }

    const getValue = (item: any) => {
        const value = selectOption.value(item);
        return value;
    }

    const getItemDisplay = (item: any) => {
        const value = selectOption.display(item);
        return value;
    }

    const handleChange = (e: any) => {
        setCurrentValue(e);
        onChange(e);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "justify-between w-full"
                    )}
                >
                    <span className="truncate">{currentValue
                        ? display
                        : placeholder}</span>
                    {currentValue ? clearFilter(() => {
                        handleChange(undefined);
                    }) : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("max-w-sm p-0", popOverContentWidth)}>
                <Command>
                    <CommandInput placeholder='Search...' />
                    <CommandList>
                        <CommandEmpty>{`No data found`}</CommandEmpty>
                        <CommandGroup>
                            {selectOption.data.map((item) => (
                                <CommandItem
                                    value={getItemDisplay(item)}
                                    key={getKey(item)}
                                    onSelect={() => {
                                        const val = getValue(item);
                                        handleChange(val)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn("mr-2 min-h-4 min-w-4 h-4 w-4",
                                            getValue(item) === currentValue
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {selectOption!.display(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

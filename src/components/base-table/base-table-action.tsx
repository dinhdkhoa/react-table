'use client'

import * as React from 'react';
import { useState } from 'react';
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Toggle } from '@/components/ui/toggle';
import { IBaseData } from '@/core/classes/base-data';
import { BaseRowAction, cancelButtonId, saveButtonId, showChildButtonId } from './base-table-config';
import { ModeType } from './enums';
import { useBaseFormContext } from '../base-form';
// import { ModeType } from './enums';

type ActionStateType = {
    isDisable: boolean | undefined,
    isVisible: boolean | undefined,
    allowAction: boolean | undefined,
}

function ExpandChildIcon<T extends IBaseData<T>>(tableAction: TableActionType<T>, data: T, action?: (data: T) => void, icon?: any) {
    const [expanded, setExpanded] = useState(tableAction.isExpanded);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (action) {
            action(data);
        }
        tableAction.toggleExpandedHandler();
    };

    return (<Toggle
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        className="h-8 w-8 p-0"
    >
        {icon || <ChevronsUpDown className='h-4 w-4' />}
    </Toggle>)
}

function GetActionState<T extends IBaseData<T>>(data: T, action: BaseRowAction<T>): ActionStateType {
    const isDisable = action.disableFn && action.disableFn(data);
    const isVisible = !action.visibleFn || action.visibleFn(data);
    const allowAction = (action.action && !isDisable && isVisible);

    return { isDisable, isVisible, allowAction };
}

export type TableActionType<T extends IBaseData<T>> = {
    isExpanded: boolean,
    toggleExpandedHandler: () => void,
    data: T,
    actions: BaseRowAction<T>[],
}

export default function TableActionColumn<T extends IBaseData<T>>(props: {
    tableAction: TableActionType<T>
    menuList: boolean,
    mode: ModeType
}) {
    const {form} = useBaseFormContext<T>() ?? {}
    if (props.mode == ModeType.Edit) {
        
        let saveAndCancelButton = props.tableAction.actions.filter(w => [saveButtonId, cancelButtonId].includes(w.id));
        return (saveAndCancelButton.map(action => {
            const ac = { ...action };
            const { isDisable, isVisible, allowAction } = GetActionState(props.tableAction.data, ac);
            return (
                isVisible &&
                    <TooltipProvider key={action.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={isDisable}
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        if (allowAction) {
                                            ac.action!(props.tableAction.data, form);
                                        }
                                        if (ac.id == showChildButtonId) {
                                            props.tableAction.toggleExpandedHandler();
                                        }
                                    }}>
                                    {ac.iconChild}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{ac.name || ''}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
            )
        }))
    }

    if (props.menuList) {
        return <TableMenuActionColumn tableAction={props.tableAction} />
    }

    return (
        props.tableAction.actions.map(action => {
            const ac = { ...action };
            const { isDisable, isVisible, allowAction } = GetActionState(props.tableAction.data, ac);

            return (
                isVisible &&
                    <TooltipProvider key={action.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={isDisable}
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                        if (allowAction) {
                                            ac.action!(props.tableAction.data);
                                        }
                                        if (ac.id == showChildButtonId) {
                                            props.tableAction.toggleExpandedHandler();
                                        }
                                    }}>
                                    {ac.iconChild}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{ac.name || ''}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
            )
        })
    )
}


function TableMenuActionColumn<T extends IBaseData<T>>(props: { tableAction: TableActionType<T> }) {
    const showChildButton = props.tableAction.actions.find(w => w.id == showChildButtonId);
    const otherButton = props.tableAction.actions.filter(w => w.id != showChildButtonId);

    const childButton = () => {
        if (showChildButton) {
            const ac = { ...showChildButton };

            return ExpandChildIcon(props.tableAction, props.tableAction.data, ac.action, ac.iconChild);
        }
    }

    return (
        <div>
            {showChildButton ? (childButton() || null) : null}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {
                        otherButton.map(action => {
                            const ac = { ...action };
                            if ([saveButtonId, cancelButtonId].includes(ac.id)) return null
                            const { isDisable, isVisible, allowAction } = GetActionState(props.tableAction.data, ac);
                            return (
                                isVisible &&
                                    <DropdownMenuItem key={action.id} disabled={isDisable}
                                        onClick={() => {
                                            if (allowAction) {
                                                ac.action!(props.tableAction.data)
                                            }
                                        }}>
                                        {ac.iconChild}
                                        <span className="ml-4">{ac.name || ''}</span>
                                    </DropdownMenuItem>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

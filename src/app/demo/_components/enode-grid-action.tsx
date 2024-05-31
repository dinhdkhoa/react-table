'use client'

import * as React from 'react';
import { BaseGridData, BaseRowAction, showChildButtonId } from "./types";
import { useState } from 'react';
import { ChevronsUpDown, MoreHorizontal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Toggle } from '@/components/ui/toggle';

type ActionStateType = {
    isDisable: boolean | undefined,
    isVisible: boolean | undefined,
    allowAction: boolean | undefined,
}


function ExpandChildIcon<T extends BaseGridData>(gridAction: GridActionType<T>, data: T, action?: (data: T) => void, icon?: any) {
    const [expanded, setExpanded] = useState(gridAction.isExpanded);

    const handleExpandClick = () => {
        setExpanded(!expanded);
        if (action) {
            action(data);
        }
        gridAction.toggleExpandedHandler();
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

function GetActionState<T extends BaseGridData>(data: T, action: BaseRowAction<T>): ActionStateType {
    const isDisable = action.disableFn && action.disableFn(data);
    const isVisible = !action.visibleFn || action.visibleFn(data);
    const allowAction = (action.action && !isDisable && isVisible);

    return { isDisable, isVisible, allowAction };
}

export type GridActionType<T extends BaseGridData> = {
    isExpanded: boolean,
    toggleExpandedHandler: () => void,
    data: T,
    actions: BaseRowAction<T>[],
}

export default function GridActionColumn<T extends BaseGridData>(props: {
    gridAction: GridActionType<T>
    menuList: boolean
}) {

    if (props.menuList) {
        return <GridMenuActionColumn gridAction={props.gridAction} />
    }

    return (
        props.gridAction.actions.map(action => {
            const ac = { ...action };
            const { isDisable, isVisible, allowAction } = GetActionState(props.gridAction.data, ac);

            return (
                isVisible ?
                    <TooltipProvider key={action.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    disabled={isDisable}
                                    onClick={() => {
                                        if (allowAction) {
                                            ac.action!(props.gridAction.data);
                                        }
                                        if (ac.id == showChildButtonId) {
                                            props.gridAction.toggleExpandedHandler();
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
                    : <></>
            )
        })
    )
}


function GridMenuActionColumn<T extends BaseGridData>(props: { gridAction: GridActionType<T> }) {
    const showChildButton = props.gridAction.actions.find(w => w.id == showChildButtonId);
    const otherButton = props.gridAction.actions.filter(w => w.id != showChildButtonId);

    const childButton = () => {
        if (showChildButton) {
            const ac = { ...showChildButton };

            return ExpandChildIcon(props.gridAction, props.gridAction.data, ac.action, ac.iconChild);
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
                            const { isDisable, isVisible, allowAction } = GetActionState(props.gridAction.data, ac);

                            return (
                                isVisible ?
                                    <DropdownMenuItem key={action.id} disabled={isDisable}
                                        onClick={() => {
                                            if (allowAction) {
                                                ac.action!(props.gridAction.data)
                                            }
                                        }}>
                                        {ac.iconChild}
                                        <span>{ac.name || ''}</span>
                                    </DropdownMenuItem>
                                    : <></>
                            )
                        })
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

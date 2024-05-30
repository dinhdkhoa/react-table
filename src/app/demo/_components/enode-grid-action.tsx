'use client'

import * as React from 'react';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import { IconButton, IconButtonProps, ListItemIcon, ListItemText, Tooltip, styled } from "@mui/material";
import { BaseGridData, BaseRowAction, showChildButtonId } from "./types";
// import { ChevronDown, DotsHorizontal } from 'mdi-material-ui';
import { useState } from 'react';
import { ChevronDown, ChevronsUpDown, MoreHorizontal, Settings } from 'lucide-react';
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


                    // <Tooltip title={ac.name || ''} arrow>
                    //     <Button 
                    //         key
                    //         variant="ghost">{ac.iconChild}
                    //     </Button>
                    //     {/* <IconButton
                    //         key={action.id}
                    //         size='small'
                    //         disabled={isDisable}
                    //         onClick={() => {
                    //             if (allowAction) {
                    //                 ac.action!(props.gridAction.data);
                    //             }
                    //             if (ac.id == showChildButtonId) {
                    //                 props.gridAction.toggleExpandedHandler();
                    //             }
                    //         }}>
                    //         {ac.iconChild}
                    //     </IconButton> */}
                    // </Tooltip> 
                    : <></>
            )
        })
    )
}


function GridMenuActionColumn<T extends BaseGridData>(props: { gridAction: GridActionType<T> }) {
    const showChildButton = props.gridAction.actions.find(w => w.id == showChildButtonId);
    const otherButton = props.gridAction.actions.filter(w => w.id != showChildButtonId);
    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);
    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

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
                                    // <MenuItem
                                    //     key={action.id}
                                    //     disabled={isDisable}
                                    //     onClick={() => {
                                    //         if (allowAction) {
                                    //             ac.action!(props.gridAction.data)
                                    //         }
                                    //     }}>
                                    //     <ListItemIcon>
                                    //         {ac.iconChild}
                                    //     </ListItemIcon>
                                    //     <ListItemText>{ac.name || ''}</ListItemText>
                                    // </MenuItem> 
                                    : <></>
                            )
                        })
                    }
                    {/* <DropdownMenuItem onClick={() => { }}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>


            {/* <Button
                variant="ghost"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}>
                {ac.iconChild}
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {
                    otherButton.map(action => {
                        const ac = { ...action };
                        const { isDisable, isVisible, allowAction } = GetActionState(props.gridAction.data, ac);

                        return (
                            isVisible ?
                                <MenuItem
                                    key={action.id}
                                    disabled={isDisable}
                                    onClick={() => {
                                        if (allowAction) {
                                            ac.action!(props.gridAction.data)
                                        }
                                    }}>
                                    <ListItemIcon>
                                        {ac.iconChild}
                                    </ListItemIcon>
                                    <ListItemText>{ac.name || ''}</ListItemText>
                                </MenuItem> : <></>
                        )
                    })
                }
            </Menu> */}
        </div>
    );
}

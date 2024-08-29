'use client'

import { createContext, ReactNode, useContext, useState } from "react";


export type ActionState = 'Normal' | 'Processing' | 'Disabled';
export type PagePreventActionContextProps = {
    actionsState: Record<string, ActionState>;
    updateActionState: (actionName: string, state: ActionState) => void;
    normalAction: (actionName: string) => void;
    processingAction: (actionName: string) => void;
    disableAction: (actionName: string) => void;
    isNormal: (actionName: string) => boolean;
    isProcessing: (actionName: string) => boolean;
    isDisabled: (actionName: string) => boolean;
}
const PagePreventActionContext = createContext<PagePreventActionContextProps | undefined>(undefined);

export const PagePreventActionProvider = ({ children }: { children: ReactNode }) => {
    const [actionsState, setActionsState] = useState<Record<string, ActionState>>({})

    const updateActionState = (actionName: string, state: ActionState) => {
        // actionsState[actionName] = state;
        setActionsState((old) => {
           const copy = {...old};
           copy[actionName] = state;
           return copy;
        })
    }
    const normalAction = (actionName: string) => {
        updateActionState(actionName, 'Normal');
    }
    const processingAction = (actionName: string) => {
        updateActionState(actionName, 'Processing');
    }
    const disableAction = (actionName: string) => {
        updateActionState(actionName, 'Disabled');
    }
    const isNormal = (actionName: string) => {
        return actionsState[actionName] == "Normal";
    }
    const isProcessing = (actionName: string) => {
        return actionsState[actionName] == "Processing";
    }
    const isDisabled = (actionName: string) => {
        return actionsState[actionName] == "Disabled";
    }


    return (
        <PagePreventActionContext.Provider value={{
            actionsState: actionsState,
            updateActionState: updateActionState,
            normalAction: normalAction,
            processingAction: processingAction,
            disableAction: disableAction,
            isNormal: isNormal,
            isProcessing: isProcessing,
            isDisabled: isDisabled
        }}>
            {children}
        </PagePreventActionContext.Provider>
    );
};


export const usePagePreventAction = () => {
    const context = useContext(PagePreventActionContext) as PagePreventActionContextProps;
    return context;
};
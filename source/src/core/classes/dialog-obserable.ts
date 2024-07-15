import { Dispatch, SetStateAction } from "react"

type Dialog = {
    data: any
} & DialogOptions

type DialogOptions = {
    title: string
    message: string
    cancelBtnText: string
    confirmBtnText: string,
    closeAfterConfirm: boolean
}

class DialogObservable {
    private setStateObservers: any[] = []
    private data: Dialog
    public confirm: (dataConfirm?: any) => Promise<any> | void

    constructor() {
        this.setStateObservers = []
        this.data = {
            title: 'Are you absolutely sure?',
            message: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
            cancelBtnText: 'Cancel',
            confirmBtnText: 'Continue',
            closeAfterConfirm: true,
            data: null
        }
        this.confirm = () => { };
    }

    subscribe(cb: (value: boolean) => void) {
        this.setStateObservers.push(cb)
    }

    setData(data: any) {
        this.data.data = data
    }
    getData() {
        return this.data
    }

    getDialogConfig(): DialogOptions {
        return this.data
    }


    setDialogConfig(options: DialogOptions) {
        this.data = {
            ...this.data,
            ...options
        }
    }

    getObserver() {
        return this.setStateObservers
    }

    unsubscribe() {
        this.setStateObservers = []
    }

    notify(state: boolean) {
        this.setStateObservers.forEach((setState) => setState(state))
    }
}

const dialogObserver = new DialogObservable()

export type { DialogOptions, Dialog }
export default dialogObserver;
import dialogObserver, { DialogOptions } from "../classes/dialog-obserable"

const DialogService = {
    show: (onConfirm: (dataConfirm?: any) => Promise<any> | void, options?: Partial<DialogOptions>, data?: any) => {
        dialogObserver.notify(true)
        dialogObserver.confirm = () => onConfirm(data)
        Boolean(options) && dialogObserver.setDialogConfig(options as DialogOptions)
        Boolean(data) && dialogObserver.setData(data)
    }
}

export default DialogService
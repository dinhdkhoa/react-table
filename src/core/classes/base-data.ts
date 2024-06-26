import { Guid } from "guid-typescript";

export class BaseData {
    __id__?: string;

    constructor(__id__?: string) {
        this.__id__ = __id__ || (Guid.create().toString());
    }

    getId(keys: string[]) {
        if (keys && keys.length > 0) {
            const data = this as any;
            let keyValues: string[] = [];
            keys.forEach(k => {
                keyValues.push(((data)[k] ?? 'null').toString());
            })
            return keyValues.join('_');
        }
        return this.__id__;
    }

    clonePropToKeepData() {
        const clone = Object.create(Object.getPrototypeOf(this));
        Object.keys(this).forEach(key => {
            if (typeof (this as any)[key] !== 'function') {
                clone[key] = (this as any)[key];
            }
        })
        return clone;
    }

    assignValue<T>(source: T) {
        Object.keys(source as any).forEach(key => {
            if (typeof (source as any)[key] !== 'function') {
                (this as any)[key] = (source as any)[key];
            }
        })
    }
}
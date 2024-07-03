import { Guid } from "guid-typescript";
import { FieldNames } from "../helper/type-helpers";

export type GetIdFn = <TData>(data: TData, keys: string[], defaultKey: string) => string;
export type ClonePropToKeepDataFn = <TData>(data: TData) => TData;
export type AssignValueFn = <TData>(origin: TData, source: TData) => void;

export interface IBaseData<TEntity> {
    __id__: string;
    __keys__?: FieldNames<TEntity>[];
    // __getId__?:  GetIdFn;
    // __clonePropToKeepData__?: ClonePropToKeepDataFn;
    // __assignValue__?: AssignValueFn;
    // getId: GetIdFn,
    // clonePropToKeepData: ClonePropToKeepDataFn,
    // assignValue: AssignValueFn,
}

export function getId<T>(data: T, keys: string[], defaultKey: string) {
    if (keys && keys.length > 0) {
        let keyValues: string[] = [];
        keys.forEach(k => {
            keyValues.push(((data as any)[k] ?? 'null').toString());
        })
        return keyValues.join('_');
    }
    return defaultKey;
}

export function clonePropToKeepData<T>(data: T) {
    const clone = Object.create(Object.getPrototypeOf(data));
    Object.keys(data as any).forEach(key => {
        if (typeof (data as any)[key] !== 'function') {
            clone[key] = (data as any)[key];
        }
    })
    return clone;
}

export function assignValue<T>(origin: T, source: T) {
    Object.keys(source as any).forEach(key => {
        if (typeof (source as any)[key] !== 'function') {
            (origin as any)[key] = (source as any)[key];
        }
    })
}

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
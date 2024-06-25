import { Guid } from "guid-typescript";
import _ from 'lodash';

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
    clone() {
        return _.cloneDeep(this);
    }
}
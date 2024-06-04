export function Key(target: any, propertyKey: string): void {
    if (!target.constructor.keys) {
        target.constructor.keys = [];
    }
    target.constructor.keys.push(propertyKey);
}

export function getKeys(obj: any): string[] {
    return obj.constructor.keys || [];
}
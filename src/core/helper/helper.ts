export type Getters<T, P> = {
    [Property in keyof T as string & Property]?: P
}
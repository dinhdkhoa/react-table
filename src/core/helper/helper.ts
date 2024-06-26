export type Getters<T, P> = {
    [Property in keyof T as string & Property]?: P
}

export type ExcludeMethods<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];


// export type EntityFields<TEntity> = {
//     [P in keyof TEntity]: TEntity[P];
// };


export type EntityFields<TEntity> = Pick<TEntity, ExcludeMethods<TEntity>>;


export type ConvertResponseModelToEntityFieldsFunc<TResModel, TEntity> = (res: TResModel) => EntityFields<TEntity>;
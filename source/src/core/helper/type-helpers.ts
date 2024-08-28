export type Getters<T, P> = {
  [Property in keyof T as string & Property]?: P
}

export type ExcludeMethods<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

// export type EntityFields<TEntity> = {
//     [P in keyof TEntity]: TEntity[P];
// };

export type EntityFields<TEntity> = Pick<TEntity, ExcludeMethods<TEntity>>

// export type WithFieldName<T extends {[K in keyof T] : string }> = {
//     fieldName: T[K];
// };

export type FieldNames<T> = {
  [K in keyof T]: K
}[keyof T]

export type ExcludeKeysWithUnderscore<T> = T extends `__${string}__` ? never : T;
export type  ExcludeKeysWithUnderscoreAndUndefined<T> =  Exclude<ExcludeKeysWithUnderscore<FieldNames<T>>, undefined>

export type ConvertResponseModelToEntityFieldsFunc<TResModel, TEntity> = (res: TResModel) => TEntity
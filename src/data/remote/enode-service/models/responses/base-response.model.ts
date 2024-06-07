export interface BaseResponse<TEntity>{
    toEntity() : TEntity;
}
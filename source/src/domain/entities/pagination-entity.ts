export interface PaginationEntity<T> {
    page: number;
    pageSize: number;
    totalPage: number;
    data: T[]
}
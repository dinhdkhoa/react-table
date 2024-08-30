export interface EnodePaginationResponseModel<T> {
    postPerPage?: number;
    pageNumber?: number;
    totalPage?: number;
    data?: T[]
}
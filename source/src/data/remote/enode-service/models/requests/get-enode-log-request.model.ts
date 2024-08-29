export interface GetEnodeLogRequestModel {
  postPerPage?: number;
  pageNumber?: number;
}

export interface GetEnodeLogLimitRequestModel {
  postPerPage?: number;
  pageNumber?: number;
  totalPage?: number;
  filter?: FilterEnodeLogRequestModel;
}

export interface FilterEnodeLogRequestModel {
  quickSearch?: string;
  id?: string;
  url?: string;
  method?: string;
  fromDate?: string;
  toDate?: string;
  serviceCode?: string;
  apiCode?: string;
  request?: string;
  payload?: object;
  response?: object;
  msgId?: string;
  requestId?: string;
  desc?: string;
  httpStatus?: string;
}
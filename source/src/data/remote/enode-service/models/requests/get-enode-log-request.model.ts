export interface GetEnodeLogRequestModel {
  postPerPage?: number;
  pageNumber?: number;
}

export interface GetEnodeLogLimitRequestModel {
  postPerPage?: number;
  pageNumber?: number;
  totalPage?: number;
  filter?: FilterEnodeLogModel;
}

export interface FilterEnodeLogModel {
  quick_search?: string;
  id?: string;
  url?: string;
  method?: string;
  from_date?: string;
  to_date?: string;
  service_code?: string;
  api_code?: string;
  request?: string;
  payload?: object;
  response?: object;
  msg_id?: string;
  request_id?: string;
  desc?: string;
  http_status?: string;
}
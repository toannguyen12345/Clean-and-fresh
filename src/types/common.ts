export interface IResponseSuccessList<T> {
  total: number;
  per_page: number;
  page: number;
  items: T[];
}

export interface IErrorAPI {
  code: number;
  field: string;
  message: string;
}

export interface IResponseErrorAxios {
  errors: IErrorAPI[];
}

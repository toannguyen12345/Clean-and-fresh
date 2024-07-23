export interface IResponseSuccessAxios {
  message: string;
  data: any;
}

export interface IResponseSuccessList<T> {
  count: number;
  items: T[];
}

export interface IErrorAPI {
  code: number;
  details: string;
}

export interface IResponseErrorAxios {
  message: string;
  errors: IErrorAPI[];
}

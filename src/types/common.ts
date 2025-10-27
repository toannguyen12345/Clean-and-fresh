export type RoleType = 'user' | 'admin' | 'shipper';
export type RoleCode = 1 | 2 | 3;

export interface RoleInfo {
  roleName: RoleType;
  roleCode: RoleCode;
}

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

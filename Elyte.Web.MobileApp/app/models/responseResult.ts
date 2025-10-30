export interface ResponseResult<T> {
  code: number;
  Message: string;
  value: T;
}

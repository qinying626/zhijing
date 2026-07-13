export interface ApiRes<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export function successRes<T>(data: T, message = 'ok'): ApiRes<T> {
  return { code: 0, message, data };
}

export function errorRes(code: number, message: string): ApiRes<null> {
  return { code, message, data: null };
}

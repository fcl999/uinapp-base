import { ecp } from '../../http/http';


export type LoginForm = {
  userno: string,
  pwd: string,
  validCode: string,
  autoLogin: boolean,
  is_phone: 1,
  codeId: string,
  aesCode: string,
  token: string,
};
/**
 * 用户登录
 */ 
export function apiLogin (data: LoginForm) {
	return ecp.post<{
    access_token: string;
    jti: string;
    refresh_token: string;
  }>('/login', { data });
}
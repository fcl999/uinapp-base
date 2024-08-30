import { ecp } from '../../http/http';

/**
 * 获取验证码
 */ 
export function apiUserInitGetSMSCode (data: {
  uname: string,
  codeId: string,
  token: string,
  aesCode: string,
}) {
	return ecp.get('/userInit/getSMSCode', { data });
}

/**
 * 用户注册
 */ 
export function apiUserInitInit (data: {
      uname: string,
      random_code: string,
      company_name: string,
      password: string,
}) {
	return ecp.post('/userInit/init', { data });
}
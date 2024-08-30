import { ecp } from '../../http/http';

/**
* 获取登录 token 和 unionId
*/
export const apiPreIndex = () => ecp.post<{
	token: string,
	unionId: string,
}>('/preIndex.json', {data: {}});



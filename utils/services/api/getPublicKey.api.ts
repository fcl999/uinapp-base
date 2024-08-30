import { ecp } from '../../http/http';

/**
* 获取公钥
*/
export const apiGetPublicKey = () => ecp.get<{
	publicKey: string,
}>('/getPublicKey.json');



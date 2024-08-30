/**
* 验证模块
*/
import { ecp } from '../../http/http';

/**
 * 获取图片验证码
 */
export const apiValidCodeJpgs = (query: {codeId: string, unionId: string}) => ecp.get<{
	image1: string,
	image2: string,
	codeId: string,
	y: number,
}>('/ValidCode/jpgs' + `?codeId=${query.codeId}&unionId=${query.unionId}`);



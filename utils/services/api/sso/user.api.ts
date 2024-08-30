/**
* 用户模块接口管理
*/
import { ecp } from '../../../http/http';

export const apiSsoUserQryOp = (data: any) => {
    return ecp.post('/sso/user/qryOp.json', {
		data,
	});
}
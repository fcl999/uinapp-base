import { useAuthStore } from "../../stores/auth";
import { toast } from "../prompt"

export type RequestOptions = {
  baseURL?: string,
  url: string,
  method?: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined,
  data?: any,
  header?: Object,
  timeout?: number,
  dataType?: "json" | "text" | "arraybuffer" | "blob" ,
  // 错误时弹出toast 默认 'toast'
  errorShow?: "toast" | "model" | "none",
  // 成功时弹出toast 默认 'toast'
  successShow?: "toast" | "model" | "none",
}
interface UploadFileParams {
  url: string;
  baseURL?: string;
  filePath: string;
  name: string;
}
export type ecpResponse<T = any> = {
	status: number,
	success: boolean,
	data: T,
	msg: string,
}
export type erpResponse<T = any> = {
	status: number,
	success: boolean,
	data: T,
	msg: string,
	return_code: number,
	return_msg: string,
}


export const HOST = {
	www: 'https://www.xxx.com',
	req: 'https://req.xxx.com',
	test: 'https://test.xxx.com',
} as const
type HOST = typeof HOST[keyof typeof HOST]
export let currentHost = uni.getStorageSync("current-host") as HOST | null || HOST.www;
export function setCurrentHost(host: HOST) {
  currentHost = host;
  uni.setStorageSync("current-host", host);
}

/**
 * - 超时时  reject -> {errMsg: string}
 * - 请求完成时 resolve -> T, reject -> T
 */
export const request = <T = ecpResponse>(options: RequestOptions): Promise<T> => {
  if (!options.errorShow) options.errorShow = 'toast';
  if (!options.successShow) options.successShow = 'toast';
  return new Promise((resolve, reject) => {
    const header: any = Object.assign({
	  'Content-Type': 'application/json',
	}, options.header || {});
	
	// header['Authorization'] =(useAuthStore().authorization || '')
	
	const url = `${options.baseURL|| currentHost}${options.url}`;
	
    const requestOptions: UniNamespace.RequestOptions = {
      url: url,
      method: options.method || 'GET',
      timeout: options.timeout || 60000,
      dataType: options.dataType || 'json',
      header,
      success: (result) => {
        interceptorSuccess(result, result => { resolve(result.data as T) }, reject, options);
      },
      fail: (err) => {
        interceptorFail(err, err => { reject(err) }, options);
      }
    }
    if (options.data) {
      requestOptions.data = options.data
    }
    uni.request(requestOptions);
  })
}
/**
 * 请求响应完成拦截器
 */
async function interceptorSuccess (
  res:  UniApp.RequestSuccessCallbackResult,
  next: (data: UniApp.RequestSuccessCallbackResult) => void,
  reject: (err: UniApp.RequestSuccessCallbackResult) => void,
  options: RequestOptions,
) {
	if (res.data) {
		const data = <ecpResponse<any>>res.data;
		if (!data.success) {
			// 登录超时 其他地方登录
			if (data.status === 10101 || data.status === 10102) {
				await requestMsgShow('model', data.msg);
				useAuthStore().logout();
			} else {
				await requestMsgShow(options.errorShow, data.msg);
			}
			reject(res);
		} else {
			await requestMsgShow(options.successShow, data.msg);
			next(res);
		}
	} else {
		await requestMsgShow(options.errorShow, '未响应数据');
		reject(res);
	}
}

/**
 * 网络错误拦截器
 */
async function interceptorFail (
  res: UniApp.GeneralCallbackResult,
  next: (data: UniApp.GeneralCallbackResult) => void,
  options: RequestOptions,
) {
	await requestMsgShow(options.errorShow, res.errMsg);
	next(res);
}

function requestMsgShow(type: RequestOptions['successShow'], msg: string): Promise<void> {
	return new Promise((resolve) => {
		if (msg && msg !== 'ok') {
			if(type === 'model') {
				uni.showModal({
					title: '提示',
					content: msg,
					showCancel: false
				}).finally(() => {
					resolve();
				});
				return;
			} else if(type === 'toast') {
				toast(msg);
			}
		}
		resolve();
	});
	
}

/**
 * - 超时时  reject -> {errMsg: string}
 * - 请求完成时 resolve -> T, reject -> T
 */
export const uploadFile = <T = ecpResponse>(options: UploadFileParams) :Promise<T> => {
  return new Promise((resolve, reject) => {
	const url = `${options.baseURL|| currentHost}${options.url}`;
    uni.uploadFile({
      url: url,
      filePath: options.filePath,
      name: options.name || 'file',
      header: {
        'Authorization': useAuthStore().authorization ? useAuthStore().authorization : ''
      },
      success: ({data, statusCode}) => {
        const res = {data:JSON.parse(data), statusCode, header: null, cookies: []}
        interceptorSuccess(res, res => { resolve(res.data as T) }, reject, options)
      },
      fail: (err) => {
        interceptorFail(err, err => {reject(err)}, options)
      }
    })
  })
}


export const ecp = {
  get: <T = any>(url: string, options?: Omit<RequestOptions, 'url'>) => {
	  options = options || {} as RequestOptions;
	  options.header = {'Content-Type': 'application/x-www-form-urlencoded'};
	  return request<ecpResponse<T>>(Object.assign({ url: '/ECP-OPEN' + url }, options));
  },
  post: <T = any>(url: string, options?: Omit<RequestOptions, 'url'>) => {
	  options = options || {} as RequestOptions;
	  options.method = 'POST';
	  options.header = {'Content-Type': 'application/x-www-form-urlencoded'};
	  return request<ecpResponse<T>>(Object.assign({ url: '/ECP-OPEN' + url }, options));
  },
}
export const erp = {
  get: <T = any> (url: string, options?: Omit<RequestOptions, 'url'>) => {
	  options = options || {} as RequestOptions;
	  return request<erpResponse<T>>(Object.assign({ url: '/erp' + url }, options));
  },
  post: <T = any> (url: string, options?: Omit<RequestOptions, 'url'>) => {
	  options = options || {} as RequestOptions;
	  options.method = 'POST';
	  return request<erpResponse<T>>(Object.assign({ url: '/erp' + url }, options));
  },
}

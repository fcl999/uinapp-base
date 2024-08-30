/**
 * 用户相关全局数据
 */
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { LoginForm, apiLogin } from '../utils/services/api/login';

export const useAuthStore = defineStore('auth', () => {
	const _authorization = ref<string | null>(null);
	_authorization.value = uni.getStorageSync("authorization") || null
	
	const setAuthentication = (authorization: string | null) => {
		_authorization.value = authorization
		uni.setStorageSync('authorization', authorization);
	}
	  
	const logout = () => {
		setAuthentication(null);
	    uni.reLaunch({url: '/pages/login/login'});
	}
	const login = async (loginForm: LoginForm) => {
		const res = await apiLogin(loginForm);
		setAuthentication(res.data.access_token);
		return res;
	}
	return {
		authorization: _authorization,
		setAuthentication,
		logout,
		login
	}
});
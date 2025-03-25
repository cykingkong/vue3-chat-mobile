import request from '@/utils/request'

export interface LoginData {
  username: string
  password: string

}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
}

export function kfLogin(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/kfapi/user/kfLogin', data)
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request<UserState>('/kfapi/user/info')
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function resetPassword(): Promise<any> {
  return request.post('/user/reset-password')
}

export function chatLog(params:any): Promise<any> {
  // 该请求用于获取用户聊天日志
  return request.get('/kfapi/chat/chatLog',{params})
}
export function register(): Promise<any> {
  return request.post('/user/register')
}

// @ts-ignore
/* eslint-disable */
import { request } from 'umi';


/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取所有用户信息 GET /api/user/search */
export async function searchUser(options?: { [key: string]: any }) {
  return request<{data: API.CurrentUser[];}>('/api/user/search', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 修改用户信息 POST /api/user/update */
export async function updateUser(body: API.CurrentUser, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 GET /api/user/delete */
export async function deleteUser(id: number, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/delete', {
    method: 'GET',
    params:{
      id: id,
    },
    ...(options || {}),
  });
}

/** 终端websocket连接地址 */
export const terminalWebsocketLocation = '/ws/terminal'

/** 聊天websocket连接地址 */
export const chatWebsocketLocation = '/ws/chat'

/** 获取Minecraft服务器运行状态 GET /api/manage/server/state */
export async function getServerState(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/manage/server/state', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 启动Minecraft服务器 GET /api/manage/server/start */
export async function startServer(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/manage/server/start', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 关闭Minecraft服务器 GET /api/manage/server/stop */
export async function stopServer(options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/manage/server/stop', {
    method: 'GET',
    ...(options || {}),
  });
}


/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

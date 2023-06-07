export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './user/Login' },
      { path: '/user/register', component: './user/Register'},
      { component: './404' }
    ],
  },
  { name: "欢迎", path: '/welcome', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin/user-manage', name: '用户管理',icon: 'solution', component: './admin/UserManage' },
      { path: '/admin/sub-page', icon: 'smile', component: './Welcome' },
      { component: './404' },
    ],
  },
  { name: "终端", path: '/terminal', icon: 'code', component: './Terminal', access: 'canAdmin' },
  { name: "聊天", icon: 'message', path: '/chat', component: './Chat' },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];

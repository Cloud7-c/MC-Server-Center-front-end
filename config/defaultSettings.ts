import { Settings as LayoutSettings } from '@ant-design/pro-components';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Minecraft Server Center',
  pwa: false,
  logo: '/icons/mcsc_square.png',
  // logo: 'https://i.hd-r.cn/b777abe3f6268579864dcd6be1612508.png',
  iconfontUrl: '',
};

export default Settings;

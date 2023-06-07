import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
const Footer: React.FC = () => {
  const defaultMessage = 'by 云迹';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Minecraft Server Center',
          title: 'Minecraft Server Center',
          href: 'https://mcsc.yunjic.cn',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Cloud7-c',
          blankTarget: true,
        }
      ]}
    />
  );
};
export default Footer;

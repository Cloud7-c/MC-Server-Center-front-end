import { PageContainer } from '@ant-design/pro-components';
import { Card, Typography } from 'antd';
import React from 'react';
import {GITHUB_LINK} from "@/constants";

const { Title, Paragraph, Text, Link } = Typography;

const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Typography>
          <Title level={4}>欢迎使用Minecraft Server Center</Title>

          <Paragraph>
            Minecraft Server Center 由 <Link href={GITHUB_LINK}>@云迹</Link> 开发，后端使用<Text code>SpringBoot</Text>+<Text code>Mybatis-Plus</Text>+<Text code>MySQL</Text>，前端使用<Text code>Ant Design Pro(React)</Text>脚手架
          </Paragraph>

          <Paragraph>
            项目地址：<Link href={GITHUB_LINK}>Minecraft Server Center</Link>
          </Paragraph>

          <Title level={5}>功能</Title>
          <ol>
            <li>
              提供基本的登录注册功能（注册功能目前配置为关闭状态）；
            </li>
            <li>
              用户分权管理；
            </li>
            <li>
              管理员可在管理页面对用户进行管理操作；
            </li>
            <li>
              使用 SSH 连接实现无侵入式管理 Minecraft 服务器，项目服务端与 Minecraft 服务端完全分离；
            </li>
            <li>
              目标 SSH 服务器兼容 Windows 和 Linux（需在配置文件中设置）；
            </li>
            <li>
              提供一个仿真终端，直接对接 Minecraft 服务器后台；
            </li>
            <li>
              提供聊天功能，实现游戏内聊天信息与网页端聊天信息互通。
            </li>
          </ol>

          <Title level={5}>关于权限</Title>
          <ul>
            <li>
              管理员用户将能看到所有界面，并进行实际操作；
            </li>
            <li>
              普通用户将不能看到与管理相关的页面，能对可见页面进行实际操作；
            </li>
            <li>
              游客账号仅作演示用，能看到所有界面，但不能进行实际操作。
            </li>
          </ul>
        </Typography>
      </Card>

    </PageContainer>

  );
};
export default Welcome;

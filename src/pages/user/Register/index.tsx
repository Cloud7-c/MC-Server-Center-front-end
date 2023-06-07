import Footer from '@/components/Footer';
import {register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import {MCSC_LOGO_SQUARE} from "@/constants";

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const userNamePattern = new RegExp("^[a-zA-Z]+\\w*$");

  const handleSubmit = async (values: API.RegisterParams) => {
    const {password, checkPassword} = values;
    if(password !== checkPassword){
      message.error("两次输入的密码不一致");
      return;
    }
    try {
      // 注册
      const response = await register(values);
      if (response.data) {
        const successMessage = '注册成功！';
        message.success(successMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname: 'user/login',
          query: query,
        });
        return;
      }
      else {
        message.error(response.message);
      }
    } catch (error) {
      const registerFailureMessage = '注册失败，请重试！';
      message.error(registerFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={MCSC_LOGO_SQUARE} />}
          title="Minecraft Server Center"
          subTitle={'MC服务器交互中心'}
          initialValues={{
            autoLogin: true,
          }}
          submitter={
            {
              searchConfig: {
                submitText: '注册'
              }
            }
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'用户注册'} />
          </Tabs>

          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    min: 4,
                    message: '用户名不得少于4位'
                  },
                  {
                    pattern: userNamePattern,
                    message: '用户名必须以字母开头，只能由字母、下划线和数字组成'
                  }
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入邮箱'}
                rules={[
                  {
                    required: true,
                    message: '邮箱是必填项！',
                  },
                  {
                    type: "email",
                    message: '无效的邮箱'
                  }
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '密码不能少于8位'
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '密码不能少于8位'
                  }
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;

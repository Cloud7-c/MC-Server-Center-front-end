import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable} from '@ant-design/pro-components';
import { useRef } from 'react';
import {searchUser, updateUser, deleteUser} from "@/services/ant-design-pro/api";
import message from "antd/es/message";


const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: '用户id',
    dataIndex: 'id',
    editable: false,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
        {
          type: "number",
          message: "请输入数字",
        }
      ],
    },
  },
  {
    title: '用户名',
    dataIndex: 'userName',
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '用户组',
    dataIndex: 'role',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      0: {
        text: '管理员',
        status: 'Error',
      },
      1: {
        text: '普通用户',
        status: 'Success',
      },
      2: {
        text: '游客',
        status: 'Default'
      }
    },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
        {
          type: "email",
          message: '邮箱格式错误',
        }
      ],
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: true,
    valueType: "dateTime",
    editable: false,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: "dateTime",
    editable: false,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return await searchUser({params});
      }}
      editable={{
        //只能同时修改单行
        type: 'single',
        //保存用户信息修改
        onSave: async (key, record, originRow, newLineConfig) =>{
          const response = await updateUser(record);
          if(!response){
            message.error("修改失败，请稍后再试")
          }

          if(response.code === 0 && response.data === true){
            message.success("修改成功");
          }
          else if(response.code !== 0){
            message.error(response.message);
          }
          else {
            message.error("修改失败，请稍后再试");
          }
        },
        //删除用户
        onDelete: async (key, row) =>{
          const response = await deleteUser(row.id);
          if(!response){
            message.error("删除失败，请稍后再试");
          }
          if(response.code === 0 && response.data === true){
            message.success("删除成功");
          }
          else if(response.code !== 0){
            message.error(response.message);
          }
          else {
            message.error("删除失败，请稍后再试");
          }
        },
        deleteText: '删除用户',
        deletePopconfirmMessage: '确认删除此用户？'
      }}
      columnsState={{
        persistenceKey: 'user-list-table',
        persistenceType: 'localStorage',
        onChange(value) {
          // console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        // onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="用户列表"
    />
  );
};

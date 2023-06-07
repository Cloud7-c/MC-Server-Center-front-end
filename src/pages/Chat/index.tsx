import type {KeyboardEvent} from 'react';
import React, { useEffect, useRef, useState} from 'react';
import type { BadgeProps} from 'antd';
import {Badge, message} from 'antd';
import {chatWebsocketLocation, getServerState} from "@/services/ant-design-pro/api";

interface ChatMessage {
  userName: string;
  time: string;
  data: string;
}

const App: React.FC = () => {
  //拼接终端对应的websocket链接
  const socketUrl = 'ws://' + window.location.host + chatWebsocketLocation;
  //websocket连接
  const socket = useRef<WebSocket>();
  //Minecraft服务器运行状态颜色显示
  const [serverRunningState, setServerState] = useState<BadgeProps["status"]>('error');
  const [serverStateText, setServerStateText] = useState('Minecraft服务器未在运行');

  const [list, setList] = useState<ChatMessage[]>([]);
  const containerRef = useRef(null);

  const [inputValue,setInputValue] = useState('');

  const fetchServerState = async () => {
    const response = await getServerState();
    const data = await response.data;
    if(data){
      setServerState('success');
    }
    else{
      message.info("Minecraft服务器未运行，发送消息只有网页端可见");
    }
  }

  const handleInputChange = (e: any) => {
    const element = e.target as HTMLInputElement;
    setInputValue(element.value);
  };

  const handleInputSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if(inputValue.trim().length > 0){
        socket.current?.send(inputValue);
      }
      setInputValue("");
    }
  };

  useEffect(() => {
    fetchServerState();

    socket.current = new WebSocket(socketUrl);
    socket.current.onopen = () => {
      message.success("已连接到服务器");
    }
    socket.current.onclose = () => {
      message.error("服务器连接已断开");
    };
    socket.current.onerror = () => {
      message.error("服务器连接错误");
    };
    socket.current.onmessage = (e: MessageEvent<any>) => {
      // console.log(e.data);
      if(e.data.indexOf("%COMMAND%") == 0){
        if(e.data === "%COMMAND%SERVER_START"){
          setServerState('success');
        }
        else if(e.data === "%COMMAND%SERVER_STOP"){
          setServerState('error');
        }
        return;
      }
      try {
        const newItem = JSON.parse(e.data);
        setList((prevList) =>[...prevList, newItem]);
      }catch (exception){
        // console.log("exception occur on: "+e.data);
      }
      if(containerRef.current) {
        const container = containerRef.current as HTMLElement;
        container.scrollTop = container.scrollHeight;
      }
    };
  }, []);

  useEffect(() =>{
    if(serverRunningState == 'error'){
      setServerStateText('Minecraft服务器未在运行');
    }
    else if(serverRunningState == 'success'){
      setServerStateText('Minecraft服务器运行中')
    }
  },[serverRunningState])

  return (
    <div>
      <Badge status={serverRunningState} text={serverStateText} style={{marginBottom: 10, color:"gray"}}/>
      <div
        ref={containerRef}
        id="scrollableDiv"
        style={{
          height: 550,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        {list.map((item, index) => (
          <div key={index}>
            <span style={{fontWeight: "bold"}}>{item.userName}</span>
            <span style={{marginLeft:10, color:"gray", fontSize: 13}}>{item.time}</span>
            <div style={{fontSize: 16, marginTop:2, marginBottom:15}}>{item.data}</div>
          </div>
        ))}
      </div>
      <input
        type='text'
        placeholder='> 在此输入信息，回车发送'
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
        value={inputValue}
        style={{
          width: '100%',
          height: 30,
          marginTop: 5,
          border: 0,
          outlineColor: "#1890ff"
        }}
      />
    </div>
  );
};

export default App;

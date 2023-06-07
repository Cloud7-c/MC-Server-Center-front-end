import type {KeyboardEvent} from 'react';
import {useEffect, useRef, useState} from 'react';
import 'xterm/css/xterm.css';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {terminalWebsocketLocation} from "@/services/ant-design-pro/api";
import {Button, message} from 'antd';
import {getServerState, startServer, stopServer} from "@/services/ant-design-pro/api";

export default function MyTerminal(): JSX.Element {
  //拼接终端对应的websocket链接
  const socketUrl = 'ws://' + window.location.host + terminalWebsocketLocation;
  //终端上当前输入的内容
  const currentLine = useRef('');
  //websocket连接
  const socket = useRef<WebSocket>();
  //Minecraft服务器运行状态，true->正在运行，false->未运行
  const [serverRunningState, setServerState] = useState<boolean>(false);
  //启动按钮是否禁用
  const [startDisabled, setStartDisabled] = useState(true);
  //关闭按钮是否禁用
  const [stopDisabled, setStopDisabled] = useState(true);

  const [inputValue,setInputValue] = useState('');

  const fetchServerState = async () => {
    const response = await getServerState();
    return  response?.data;
  }

  //启动服务器
  const start = async () => {
    const response = await startServer();
    if(response?.data){
      setServerState(true);
    }
    else{
      message.error(response.message);
    }
  }
  //关闭服务器
  const stop = async () => {
    const response = await stopServer();
    if(response?.data){
      setServerState(false);
    }
    else{
      message.error(response.message);
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

  //获取字符占据终端的宽度大小，中文字符将占据2位
  const strWidth = (str: string) => {
    if(!str) return 0;
    let strLen = 0;
    for(let i=0;i<str.length;i++){
      if(/^[\u4e00-\u9fa5]/.test(str[i])){
        strLen = strLen + 2;
      }else{
        strLen ++;
      }
    }

    return strLen;
  };

  //todo 修复终端大小不适配
  const insertBeforeInput = (terminal: Terminal, data: string) => {
    //清除已输入内容
    let y = 0;
    let width = 1;
    for(let i = 0; i < currentLine.current.length; i++){
      width += strWidth(currentLine.current[i]);
      if(width >= terminal.cols){
        y++;
        width = width === terminal.cols ? 0 : 2;
      }
    }
    terminal.write('\x1b[2K\x1b[1F'.repeat(y + 1)); //(clear row and up) * y
    terminal.write('\x1b[u'); //回退光标到保存位置

    // console.log(data);
    //todo 鉴别服务器关闭/启动信息
    if(data.length>100){
      for(let i = 0; i < data.length; i++){
        terminal.write(data[i]);
      }
    }
    else terminal.write(data);
    terminal.write('\x1b[s'); //保存光标位置

    //将输入的内容写回终端
    terminal.write('\r\n\x1b[40;33m>\x1b[0m\x1b[33m'+currentLine.current);
  }

  //初始执行一次，初始化终端
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchServerState();
      if(data)
        setServerState(data);
    };
    fetchData();
    currentLine.current = '';
    socket.current = new WebSocket(socketUrl);
    const terminal = new Terminal({
      cursorStyle: 'underline',
      cursorBlink: true,
      theme: {
        foreground: '#dddddd',
        cursor: 'gray'
      },
      windowsMode: true,
    })
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    const terminalDom = document.getElementById('terminal-container');
    terminal.open(terminalDom as HTMLElement);
    fitAddon.fit();

    //定义终端回调方法
    const specialKeycode = [
      '\x1b[OP', //f1-f12
      '\x1b[OQ',
      '\x1b[OR',
      '\x1b[OS',
      '\x1b[15~',
      '\x1b[17~',
      '\x1b[18~',
      '\x1b[19~',
      '\x1b[20~',
      '\x1b[21~',
      '\x1b[23~',
      '\x1b[24~',
      '\x1b[3~', //del
      '\x1b[2~', //ins
      '\x1b[5~', //pageUp
      '\x1b[6~', //pageDown
      '\x1b[H', //home
      '\x1b[67;', //ctrl + c
    ];
    terminal.onData((data) => {
      const cursorX = terminal.buffer.active.cursorX;

      switch (data){
        case '\r':
        case '\n':
          // console.log('回车');
          if (currentLine.current.trim().length > 0) {
            socket.current?.send(currentLine.current);
            currentLine.current = '';
          }
          break;
        case '\x7F': //backspace
          if (currentLine.current.length > 0) {
            const charWidth = strWidth(currentLine.current.slice(-1));
            // console.log('cursorX: ' + cursorX);
            // console.log('data before del: ' + currentLine.current);
            // console.log('to be deleted char: ' + currentLine.current.slice(-1) + ', charWidth: ' + charWidth);
            if(cursorX === 0){
              //回退到上一行的行尾
              terminal.write('\x1B\x5B\x41');
              terminal.write('\x1B\x5B\x43'.repeat(terminal.cols));
              terminal.write(' ');
              if(charWidth > 1){
                let width = 1;
                for(let i = 0; i < currentLine.current.length; i++){
                  width += strWidth(currentLine.current[i]);
                  // console.log("receive " + currentLine.current[i] + ", now width is " + width);
                  if(width === terminal.cols) {
                    width = 0;
                  }
                  else if(width > terminal.cols){
                    width = 2;
                  }
                }
                // console.log("width: " + width);
                if(width === 0){
                  terminal.write('\b');
                }
                else{
                  terminal.write('\b \b\b');
                }

              }
            }
            else {
              terminal.write('\b \b'.repeat(charWidth));
            }
            currentLine.current = currentLine.current.slice(0, currentLine.current.length - 1);
          }
          break;
        case '\t': //tab
        case '\x1B\x5B\x41': // up arrow.
        case '\x1B\x5B\x42': // down arrow.
        case '\x1B\x5B\x43': // right arrow.
        case '\x1B\x5B\x44': // left arrow.
          break;

        default:
          if(specialKeycode.includes(data)) {
            // console.log("特殊字符，不处理");
            break;
          }

          terminal.write(data);
          currentLine.current += data;
          // console.log(currentLine.current);
          // console.log("cursorX: " + terminal.buffer.active.cursorX+", cols: "+terminal.cols);
      }
    });

    terminal.onResize((size) =>{
      // console.log("send: %command%resize:"+size.cols+','+size.rows);
      socket.current?.send("%command%resize:"+size.cols+','+size.rows);
    })

    //定义websocket回调方法
    socket.current.onopen = () => {
      terminal.write('\x1b[1;36mWelcome to terminal!\x1b[0m\r\n\x1b[s\x1b[40;33m>\x1b[0m\x1b[33m');
      // console.log("send: %command%resize:"+terminal.cols+','+terminal.rows);
      socket.current?.send("%command%resize:"+terminal.cols+','+terminal.rows);
    };
    socket.current.onclose = () => {
      insertBeforeInput(terminal, '\r\n\x1b[1;31mConnection closed. Bye!\x1b[0');
      terminal.blur();
    };
    socket.current.onerror = () => {
      insertBeforeInput(terminal, '\r\n\x1b[1;31mSomething errors.\x1b[0');
    };
    socket.current.onmessage = (e: MessageEvent<any>) => {
      if(e.data.indexOf("%COMMAND%") == 0){
        if(e.data === "%COMMAND%SERVER_START"){
          setServerState(true);
        }
        else if(e.data === "%COMMAND%SERVER_STOP"){
          setServerState(false);
        }
        return;
      }
      insertBeforeInput(terminal, e.data);
    };

    terminal.focus();

    return () => {
      socket.current?.close();
      terminal.dispose();
    };
  }, []);

  //服务器状态发生改变时自动修改按钮状态
  useEffect(() => {
    if (serverRunningState) {
      setStartDisabled(true);
      setStopDisabled(false);
    }
    else{
      setStartDisabled(false);
      setStopDisabled(true);
    }
  }, [serverRunningState]);

  return (
    <div>
      <Button disabled={startDisabled} onClick={()=>start()}>启动</Button>
      <Button disabled={stopDisabled} onClick={()=>stop()}>关闭</Button>
      <div style={{height: 550, width: '100%', overflowX: "auto", overflowY: "hidden"}}>
        <div
          id="terminal-container"
          style={{ height: 550, minWidth: 1280}}
        />
      </div>
      <input
        type='text'
        placeholder='> 在此输入命令，回车执行'
        onChange={handleInputChange}
        onKeyDown={handleInputSubmit}
        value={inputValue}
        style={{
          width: '100%',
          height: 30,
          border: 0,
          outlineColor: "#1890ff"
        }}
      />
    </div>

  );
}

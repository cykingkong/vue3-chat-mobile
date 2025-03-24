<script setup lang="ts">
import type { PickerColumn } from 'vant'
import MessageItem from './component/message-item.vue'
import { languageColumns, locale } from '@/utils/i18n'
import { useUserStore } from '@/stores'
import { useRect, useEventListener } from '@vant/use';
const userStore = useUserStore()
const { t } = useI18n()
const navbarRef = ref()
const messageListRef = ref()
const messageContainerRef = ref()
const sendBtnShow = ref(false)
const message = ref('')
const chatHeight = ref(0)
const messageList = ref([])

// socket部分
const isWebSocketConnected = ref(false)
const userLoginInfo = ref({})
const socketFormInline = ref(
  {
    "action": "UserLogin",
    "params": {
        "uuId": "test",
        "nickname": "",
        "avatar": "",
        "channel": ""
    } 
  }
);
const webSocket = ref()
const connectWebSocket = () => {
  socketFormInline.value.params.uuId = localStorage.getItem('uuid') 
  const urlWithParams = import.meta.env.VITE_APP_API_BASE_URL_SOCKET +'?'+ JSON.stringify(socketFormInline.value);
  webSocket.value = new WebSocket(urlWithParams);
  webSocket.value.onopen = () => {
    console.log("socket 连接成功", webSocket.value);

    isWebSocketConnected.value = true;
    // Start the heartbeat
    setTimeout(() => {
    startHeartbeat();
      
    }, 500);
    if(webSocket.value){
      webSocket.value.send(JSON.stringify(socketFormInline.value))
    }
  };

  webSocket.value.onmessage = (messageEvent: any) => {
    console.log("收到消息: ", messageEvent.data);
    const messageData = JSON.parse(messageEvent.data);
    if(messageData.action == 'UserLogin'){
      console.log('登录成功')
      userLoginInfo.value = messageData.data

      if(!messageData.data.sessionId){
        hasKf.value = false
        let linkKfParams = {
          "action": "UserLinkKf",
          "params": {
            "uuId": localStorage.getItem('uuid') || '',
          }
        }
      webSocket.value.send(JSON.stringify(linkKfParams));
      }else{
        hasKf.value = true
      }
    }
     if(messageData.action == 'UserLinkKf'){
      console.log('收到消息')
      setTimeout(() => {
        if (!messageData.data.sessionId) {
          hasKf.value = false
          let linkKfParams = {
            "action": "UserLinkKf",
            "params": {
              "uuId": localStorage.getItem('uuid') || '',
            }
          }
          webSocket.value.send(JSON.stringify(linkKfParams));
        } else {
          hasKf.value = true
        }
      }, 10000);
    
    }

  };
  webSocket.value.onerror = (error: any) => {
    console.error("监听数据 出错: ", error);
  };
  webSocket.value.onclose = () => {
    webSocket.value = null;
    isWebSocketConnected.value = false;
    console.log("结束监听");
    stopHeartbeat(); 
       // Attempt to reconnect
    reconnectWebSocket();
  };
};
let heartbeatTimer = null;
let reconnectTimer = null;
const hasKf =  ref(true)

let pingParams = ref({
  action: "Ping",
  params: {
    uuId: '',
  },
})
// 开始心跳
const startHeartbeat = () => {
  // Send a heartbeat every 30 seconds
  heartbeatTimer = setInterval(() => {
    if (webSocket.value && webSocket.value.readyState === WebSocket.OPEN) {
      pingParams.value.params.uuId  = localStorage.getItem('uuid') ||''
      webSocket.value.send(JSON.stringify(pingParams.value));
    }
  }, 5000);
}
const resetHeartbeat = () => {
  // Reset the heartbeat timer whenever a message is received
  clearInterval(heartbeatTimer);
  startHeartbeat();
}

const stopHeartbeat = () => {
  // Stop the heartbeat when the connection is closed
  clearInterval(heartbeatTimer);
}


const reconnectWebSocket = () => {
  // Attempt to reconnect every 5 seconds
  reconnectTimer = setInterval(() => {
    if (!isWebSocketConnected.value) {
      console.log("Attempting to reconnect...");
      connectWebSocket();
    } else {
      clearInterval(reconnectTimer);
    }
  }, 5000);
}
// socket部分结束

async function login(values: any) {
  try {
    await userStore.login({ username: 'admin', password: '123456' })
  }
  finally {
  }
}
// login()
const sendMessage = ()=>{
//  if(!userLoginInfo.value.sessionId){
//   return
//  }
  let params = {
    "action": "UserSendMsg",
    "params": {
      "uuId": localStorage.getItem('uuid') ,
      "msg": message.value
    }
  }
  messageList.value.unshift({type:'right',content:`${messageList.value.length}----消息${message.value}`})
  // webSocket.value.send(JSON.stringify(params));
//   const messageListRefHeight = useRect(messageListRef).height;
// messageContainerRef.value.scrollTop = messageListRefHeight;
    setTimeout(() => {
    message.value = ''
    sendBtnShow.value=false
    }, 190);

}
const i = ref(1)

onMounted(async () => {
  setTimeout(() => {
    if (navbarRef.value) {
      const navbarHeight = navbarRef.value.$el.offsetHeight
      chatHeight.value = window.innerHeight - navbarHeight
    }
    console.log(localStorage.getItem('uuid'),'sadawdawawe')
connectWebSocket() 

  }, 20)



})
// Onload
</script>
<template>
  <div class="index-content">
    <VanNavBar :title="t('menus.home') " :fixed="true"  :left-arrow="false" 
      ref="navbarRef" />
    <div class="chat-content" :style="{ height: chatHeight + 'px' }">
      <div class="MessageContainer" ref="messageContainerRef">
        <div class="MessageList" ref="messageListRef">
          <MessageItem :hasKf="hasKf" :message="item" :index="index" v-for="(item, index) in messageList" :key="i"></MessageItem>
          <div class="linking-kf" v-if="!hasKf">客服繁忙 正在排队中...</div>

        </div>
      </div>
      <div class="chat-footer">
        <div class="input-box">
          <van-field v-model="message"  @focus="sendBtnShow=true" autosize rows="1" type="textarea" placeholder="请输入消息" />
        </div>
        <div class="send-btn" :class="{'send-btn-show':sendBtnShow}">
          <van-button type="primary" class="sendBtn"  v-if="sendBtnShow" @click="sendMessage">发送</van-button>
          <van-uploader>
            <van-button icon="photo-o" type="primary" :max-size="5 * 1024" :max-count="1"  class="sendBtn" v-if="sendBtnShow"></van-button>
          </van-uploader>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
  {
    name: 'home',
    meta: {
      title: '主页',
      i18n: 'menus.home'
    },
  }
  </route>
<style lang="less" scoped>
.index-content {
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  // 底部安全距离
  padding-bottom: env(safe-area-inset-bottom);

  .chat-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    .MessageContainer {
      width: 100%;
      height: calc(100%  - 60px);
      background-color: var(--van-gray-1);
      overflow-x: auto;
      .MessageList {
        overflow-y: auto;
        padding: var(--van-padding-sm);
        margin-top: 12px;
        display: flex;
        flex-direction: column-reverse;
        gap: 12px;
        .linking-kf{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .Message {
          position: relative;

          .Message-meta {
            display: flex;
            justify-content: center;
            margin-bottom: var(--van-padding-md);
            text-align: center;
          }

          .Message-main {
            align-items: flex-start;
            display: flex;
            gap: 4px;

            .avatar {
              width: 45px;
              height: 45px;
              flex-shrink: 0;
            }

            .Message-inner {
              flex: 1;
              min-width: 0;

              .Message-content {
                align-items: flex-start;
                display: flex;
              }
            }
          }
        }
        
      }
    }
    .chat-footer{
      width: 100%;
      padding:12px;
      background: var(--van-gray-3);
      display: flex;
      align-items: center;
      .input-box{
        flex:1;

        :deep(.van-cell){
          height: 100%;
        }
      }
      .send-btn{
        width: 0;  display: flex;
        justify-content: center;
        transition: all 0.3s;
        gap:8px;
        .sendBtn{
          width: 60px;
          height: 40px;
          border-radius: 40px;
          white-space: nowrap;
        }
      }
      .send-btn-show{
        width: 140px;
      }
    }
  }

 


}

.Bubble {
  background: var(--van-white);
  border-radius: 12px;
  max-width: 42.5rem;
  min-width: .0625rem;
  box-sizing: border-box;
  min-width: 2.5rem;
  overflow-wrap: break-word;
  padding: .75rem;
  -webkit-user-select: text;
  user-select: text;
  white-space: pre-wrap;
}
.Message.right .Bubble {
    background: var(--van-orange);
    border-radius: 12px;
    margin-left: 2.5rem;
}
.Message.left .Bubble {
    margin-right: 3rem;
}

</style>
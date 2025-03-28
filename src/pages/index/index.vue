<script setup lang="ts">
import type { PickerColumn } from 'vant'
import MessageItem from './component/message-item.vue'
import { languageColumns, locale } from '@/utils/i18n'
import { useUserStore } from '@/stores'
import { useRect, useEventListener } from '@vant/use';
import { chatLog } from '@/api/user';
import { uploadFile } from '@/api/upload'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const urlParams = ref()
const userStore = useUserStore()
const { t } = useI18n()
const navbarRef = ref()
const messageListRef = ref()
const historyMessageListRef = ref()
const messageContainerRef = ref()
const sendBtnShow = ref(false)
const message = ref('')
const tipsText = ref('')
const hasKf = ref(true)
const page = ref(1)
const chatHeight = ref(0)
const chatContainerHeight = ref(0)
const messageList = ref([])
const loading = ref(false)
const historyMessageList = ref([])
const historyMessageListStatus = ref('loading')
const uploadImageUrl = ref('')
// socket部分
const isWebSocketConnected = ref(false)
const userLoginInfo = ref({})
const socketFormInline = ref(
  {
    "action": "UserLogin",
    "params": {
      "uuId": "",
      "nickname": "",
      "avatar": "",
      "channel": "" // 项目名称
    }
  }
);
const webSocket = ref()
const connectWebSocket = () => {
  socketFormInline.value.params.uuId = localStorage.getItem('uuid')
  console.log(urlParams.value,urlParams.value.get('nickname'))
  socketFormInline.value.params.nickname = urlParams.value.get('nickname') || 'testnickName';
  socketFormInline.value.params.avatar = urlParams.value.get('avatar') || '';
  socketFormInline.value.params.channel = urlParams.value.get('channel') || 'app_cy';

  const urlWithParams = import.meta.env.VITE_APP_API_BASE_URL_SOCKET + '?' + JSON.stringify(socketFormInline.value);
  webSocket.value = new WebSocket(urlWithParams);
  webSocket.value.onopen = () => {
    console.log("socket 连接成功", webSocket.value);
    tipsText.value = `${t('chat.linkKfSuccess')}`
    isWebSocketConnected.value = true;
    if (webSocket.value) {
      webSocket.value.send(JSON.stringify(socketFormInline.value))
    }
    setTimeout(() => {
      tipsText.value = ``
    }, 1000);
    // Start the heartbeat
    setTimeout(() => {
      startHeartbeat();
    }, 5000);


  };

  webSocket.value.onmessage = (messageEvent: any) => {
    const messageData = JSON.parse(messageEvent.data);
    // 收到信息---msgType
    if (messageData.msgType == 'message.kfMsg') {
      let msgObj = {
        msgType:'',
        msgImgUrl:'',
      }
        // 检查 messageData 对象中的 data 属性的 msg 属性是否包含 '<img' 字符串
        if (messageData.data.msg.indexOf('<img') != -1) {
            // 如果包含 '<img' 字符串，则执行以下代码块
            // 取出img标签内的src
            let src = messageData.data.msg.match(/src="([^"]*)"/)[1];
            msgObj.msgImgUrl = src;
            msgObj.msgType = 'image'
        }else{
            msgObj.msgType = 'text'
        }
      messageList.value.unshift({ type: 'left', content: messageData.data.msg,msgType:msgObj.msgType,msgImgUrl:msgObj.msgImgUrl })
    }
    if (messageData.action == 'UserLogin') {
      console.log('登录成功')
      userLoginInfo.value = messageData.data
      // 如果没有sessionId,则是没有客服，需要重新请求
      if (!messageData.data.sessionId) {
        // 提示正在寻找客服
        tipsText.value = `${t('chat.findingKf')}`
        let linkKfParams = {
          "action": "UserLinkKf",
          "params": {
            "uuId": localStorage.getItem('uuid') || '',
          }
        }
        webSocket.value.send(JSON.stringify(linkKfParams));
      } else {
        fetchChatLog(messageData.data.sessionId)
        hasKf.value = true
      }
    }
    if (messageData.action == 'UserLinkKf') {
      console.log('收到消息')
      setTimeout(() => {
        if (!messageData.data.sessionId) {
          tipsText.value = `${t('chat.findingKf')}`
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
    if(messageData.action == 'UserSendMsg' && messageData.code !== 200){
      
        showToast(messageData.message)
        delMessage()
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
    reconnectTimer = setTimeout(() => {
      reconnectWebSocket();
    }, 5000);
  };
};
const i = ref(0)
let heartbeatTimer = null;
let reconnectTimer = null;

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
      pingParams.value.params.uuId = localStorage.getItem('uuid') || ''
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
  // reconnectTimer = setInterval(() => {
  if (!isWebSocketConnected.value) {
    console.log("Attempting to reconnect...");
    connectWebSocket();
  } else {
    clearInterval(reconnectTimer);
  }
  // }, 5000);
}
// socket部分结束
// 下拉刷新历史记录
const onRefresh = async () => {
  if (historyMessageListStatus.value == 'nomore') {
    showToast(`${t('chat.noMore')}`)
    loading.value = false;

    return
  }
  loading.value = true;
  try {
    page.value++
    await fetchChatLog()
    loading.value = false

  } catch (e) {
    console.log(e)
  } finally {
  }
}
const delMessage =()=>{
  // 删除最近发送的一条信息
  messageList.value.shift()
}
const sendMessage = (type: string = 'text') => {
  if (!userLoginInfo.value.sessionId) {
    return
  }
  if (!message.value && type == 'text') {
    showToast(t('chat.inputMsg'));
    return
  }
  let params = {
    "action": "UserSendMsg",
    "params": {
      "uuId": localStorage.getItem('uuid'),
      "msg": type == 'text' ? message.value : `<img src=${uploadImageUrl.value}/>`
    }
  }
  if (type == 'text') {
    messageList.value.unshift({ type: 'right', content: `${message.value}`, msgType: 'text' })
  } else {
    messageList.value.unshift({ type: 'right', content: `<img src=${uploadImageUrl.value}/>`, msgType: 'image', msgImgUrl: uploadImageUrl.value })
  }

  // ws发送消息
  webSocket.value.send(JSON.stringify(params));
  setTimeout(() => {
    message.value = '';
    uploadImageUrl.value = '';
    const historyMessageListRefHeight = useRect(historyMessageListRef).height || 0;
    const messageListRefHeight = useRect(messageListRef).height || 0;
    messageContainerRef.value.scrollTop = historyMessageListRefHeight + messageListRefHeight
    sendBtnShow.value = false
  }, 190);
}
// 获取用户聊天记录
const fetchChatLog = async () => {
  let params = {
    'user-uuid': localStorage.getItem('uuid'),
    channel: urlParams.value.get('channel')||'app_cy',
    page: page.value,
    page_size: 5
  }
  const { data, code } = await chatLog(params)
  console.log(data, 'data')
  if (code == 200) {
    if (data && !data.rows) {
      historyMessageListStatus.value = 'nomore'
      return
    }

    let chatLogList = data.rows?.map((item: any) => {

      let obj = {
        type: item.chatType == 1 ? 'left' : "right",
        content: item.msg,
        msgType: '',
        msgImgUrl: ''
      }
      // 判断item.msg是否为图片img标签
      if (item.msg.indexOf('<img') != -1) {
        obj.msgType = 'image'
        obj.msgImgUrl = item.msg.match(/src="([^"]*)"/)[1]
      } else {
        obj.msgType = 'text'
      }
      return obj
    })
    historyMessageList.value = [...historyMessageList.value, ...chatLogList]
  }

}
const onOversize = (file) => {
  console.log(file)
  showToast('文件大小不能超过 5Mb');
}
const handleAfterRead = async (file: any) => {
  console.log(file, 'flie')
    NProgress.start()

  queryUploadFile(file);
}
const queryUploadFile = async (file: any) => {
  file.status = 'uploading'; // 显示上传状态
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('file', file.file);
  // 发起上传请求
  try {
    const { data } = await uploadFile(formData);
    uploadImageUrl.value = data.url ||''
    NProgress.done()


    showToast('文件上传成功');

    sendMessage('image')

  } catch (error) {
    showToast('文件上传失败');
  }

}
onMounted(async () => {
  tipsText.value = `${t('chat.linkingKf')}`
      // 获取浏览器地址上的参数
      const {search} = window.location
    urlParams.value = new URLSearchParams(search)
    console.log(window.location, urlParams.value)
  setTimeout(() => {
    if (navbarRef.value) {
      const navbarHeight = navbarRef.value.$el.offsetHeight
      chatHeight.value = window.innerHeight - navbarHeight
    }





    connectWebSocket()

  }, 20)



})

// Onload
</script>
<template>
  <div class="index-content">
    <VanNavBar :title="t('menus.home')" :fixed="true" :left-arrow="false" ref="navbarRef" />
    <van-pull-refresh :disabled="true" v-model="loading" @refresh="onRefresh"
      class="chat-content" :style="{ height: chatHeight + 'px' }">
      <div class="MessageContainer" ref="messageContainerRef">
        <!-- 暂时关闭历史记录 开放了的话:disabled要改为拿historyMessageListStatus判断 -->
        <!-- <div class="historyMessageList" ref="historyMessageListRef">
          <div class="divider" v-if="historyMessageList && historyMessageList.length">历史记录</div>
          <MessageItem :hasKf="hasKf" :message="item" :index="index" v-for="(item, index) in historyMessageList"
            :key="i"></MessageItem>
        </div> -->
        <div class="MessageList" ref="messageListRef">
          <MessageItem :hasKf="hasKf"  :message="item" :index="index" :msgKey="i" v-for="(item, index) in messageList"
            :key="i">
          </MessageItem>
          <div class="linking-kf" v-if="hasKf">{{ tipsText }}</div>
        </div>
      </div>
      <div class="chat-footer">
        <div class="input-box">
          <van-field v-model="message" @focus="sendBtnShow = true" autosize rows="1" type="textarea"
            placeholder="请输入消息" />
        </div>
        <div class="send-btn" :class="{ 'send-btn-show': sendBtnShow }">
          <van-button type="primary" class="sendBtn" v-if="sendBtnShow" @click="sendMessage('text')">发送</van-button>
          <van-uploader @oversize="onOversize" :after-read="handleAfterRead" :max-size="5 * 1024 * 1024">
            <van-button icon="photo-o" type="primary" :max-count="1" class="sendBtn" v-if="sendBtnShow"></van-button>
          </van-uploader>
        </div>
      </div>
    </van-pull-refresh>
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
.divider {
  width: 100%;
  // height: 1px;
  position: relative;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0%, -50%);
    width: 140px;
    height: 1px;
    background: var(--van-gray-4);
  }

  &::after {
    content: '';
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translate(0%, -50%);
    width: 140px;
    height: 1px;
    background: var(--van-gray-4);


  }
}

.index-content {
  width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  gap: 12px;
  // 底部安全距离
  padding-bottom: env(safe-area-inset-bottom);
  padding-top: var(--van-nav-bar-height);

  .chat-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    .MessageContainer {
      width: 100%;
      height: 100%;
      flex: 1;
      background-color: var(--van-background-1);
      overflow-x: auto;
      padding: var(--van-padding-sm);

      .historyMessageList {
        display: flex;
        flex-direction: column-reverse;
        gap: 12px;
      }

      .MessageList {
        overflow-y: auto;
        // padding: var(--van-padding-sm);
        // margin-top: 12px;
        display: flex;
        flex-direction: column-reverse;
        gap: 12px;

        .linking-kf {
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

    .footer-image-box {
      background: var(--van-background-3);
      flex-shrink: 0;
      padding: 12px 12px 0;
      display: flex;
      align-items: center;

    }

    .chat-footer {
      width: 100%;
      padding: 12px;
      background: var(--van-background-3);
      display: flex;
      align-items: center;
      flex-shrink: 0;

      .input-box {
        flex: 1;

        :deep(.van-cell) {
          height: 100%;
        }
      }

      .send-btn {
        width: 0;
        display: flex;
        justify-content: center;
        transition: all 0.3s;
        gap: 8px;

        .sendBtn {
          width: 60px;
          height: 40px;
          border-radius: 40px;
          white-space: nowrap;
        }
      }

      .send-btn-show {
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

:deep(.van-pull-refresh__track) {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <div class="login" v-if="!joined">
    <form class="login-form" @submit.prevent="enterRoom">
      <div class="group">
        <input type="text" required v-model="name">
        <span class=" highlight"></span>
        <span class="bar"></span>
        <label>Name</label>
      </div>
      <button class="button">ENTER ROOM</button>
    </form>
  </div>

  <div class="chat" v-else>
    <div class="chat-title">
      <!-- <h1>David</h1>
      <h2>Supah</h2>
      <figure class="avatar">
        <img src="./assets/imgs/default-icon2.png" />
      </figure> -->
    </div>
    <div class="messages" ref="messages">
      <div class="messages-box" ref="messagesContent">
        <div class="messages-content">
          <div v-for="(message, index) in messagesArray" :key="index" :class="message.className">
            <figure class="avatar" v-if="message.className !== 'message message-personal new'">
              <img src="./assets/imgs/default-icon2.png" />
            </figure>
            <span>{{ message.text }}</span>
            <div class="timestamp">
              <i>{{ message.name }}/</i>
              <i> {{ message.timestamp }}</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="message-box">
      <textarea v-model="newMessage" type="text" class="message-input" placeholder="Type message..."
        @input="emitTyping"></textarea>
      <button type="submit" class="message-submit" @click="sendMessage">
        Send
      </button>
    </div>
  </div>
  <div class="bg"></div>
</template>
<script setup lang="ts">
import { ref, onUnmounted, watch, nextTick } from "vue";
import BScroll from '@better-scroll/core';
import MouseWheel from '@better-scroll/mouse-wheel';
import Scrollbar from '@better-scroll/scroll-bar';
import { io } from "socket.io-client";

const socket = io('http://localhost:3001');


const joined = ref<boolean>(false);
const name = ref<string>("");
const userId = ref<string>("");
//进入房间
const enterRoom = () => {
  socket.emit('join', { name: name.value }, (id) => {
    joined.value = true;
    userId.value = id
  })
}

let timeout
const emitTyping = () => {
  socket.emit('typing', { isTyping: true })
  if (newMessage.value.trim() === '') {
    socket.emit('typing', { isTyping: false })
  }

}

BScroll.use(MouseWheel);
BScroll.use(Scrollbar);

const bs = ref(null);
const messagesContent = ref(null);
const initializeScroll = async () => {
  nextTick(() => {
    if (messagesContent.value) {
      bs.value = new BScroll(messagesContent.value, {
        scrollY: true,
        mouseWheel: {
          speed: 6,
          invert: false,
          easeTime: 800
        },
        scrollbar: {
          interactive: true, // 允许交互
          fade: true, // 滚动条淡入淡出
        },
        click: true,
        bounce: false
      });
    }
  })
};

const updateScroll = () => {
  nextTick(() => {
    if (bs.value) {
      bs.value.refresh();
      // 获取最后一个消息元素
      const lastMessage = messagesContent.value.querySelector('.message:last-child');
      if (lastMessage) {
        // 使用 scrollToElement 方法滚动到最后一个消息
        bs.value.scrollToElement(lastMessage, 100); // 100ms 滚动时间
      }
    }
  })
};

const initScroll = () => {
  nextTick(() => {
    if (bs.value) {
      bs.value.refresh();
      bs.value.scrollTo(0, bs.value.minScrollX, 100); // 100ms 滚动时间
    }

  })
};

interface Message {
  text: string;
  timestamp: string;
  className?: string;
  name?: string;
  id: string;
}

const messagesArray = ref<Message[]>([
]); //消息数据

const newMessage = ref(""); //新建消息
const messages = ref(null);
// 发送消息
const sendMessage = () => {
  const msg = newMessage.value.trim();
  if (!msg) return;
  const text = { text: newMessage.value, timestamp: getTimestamp(), id: userId.value }
  socket.emit('createMessage', text, (res) => {
    newMessage.value = '';
    socket.emit('typing', { isTyping: false })
    updateScroll();
  })
};

const getTimestamp = () => {
  const d = new Date();
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0'); // 确保分钟是两位数
  return `${hours}:${minutes}`;
};

watch(() => joined.value, (val) => {
  if (val) {
    initializeScroll();
    socket.emit('findAllMessages', {}, (res) => {
      for (const item of res) {
        if (item.id === userId.value) {
          item.className = 'message message-personal new'
        } else {
          if (res.isTyping) {
            item.className = 'message loading new'
          } else {
            item.className = 'message new'
          }
        }
      }
      messagesArray.value = res
      initScroll()
    })

    socket.on('message', (message) => {
      if (message.id === userId.value) {
        message.className = 'message message-personal new'
      } else {
        message.className = 'message new'
      }
      messagesArray.value.push(message)
      updateScroll()
    })

    socket.on('typing', ({ name, isTyping, id }) => {
      const one = messagesArray.value.find(item => item.id === id && item.text === '')
      if (id !== userId.value && isTyping && !one) {
        messagesArray.value.push({ id, text: '', name, className: 'message loading new', timestamp: getTimestamp() })
      }
      if (id !== userId.value && !isTyping) {
        const index = messagesArray.value.findIndex(item => item.id === id && item.text === '');
        if (index !== -1) {
          messagesArray.value.splice(index, 1);  // 删除匹配的元素
        }
      }
      updateScroll()
    })

    nextTick(() => {
      const content = messagesContent.value;
      // 添加鼠标进入和离开事件监听
      content?.addEventListener('mouseenter', () => {
        const scrollbar = content.querySelector('.bscroll-vertical-scrollbar');
        if (scrollbar) {
          scrollbar.style.opacity = '1'; // 显示滚动条
        }
      });
      content?.addEventListener('mouseleave', () => {
        const scrollbar = content.querySelector('.bscroll-vertical-scrollbar');
        if (scrollbar) {
          scrollbar.style.opacity = '0'; // 隐藏滚动条
        }
      });
    })
  }
})

onUnmounted(() => {
  // 移除事件监听
  const content = messagesContent.value;
  content?.removeEventListener('mouseenter', () => { });
  content?.removeEventListener('mouseleave', () => { });
});


</script>
<style scoped lang="scss">
@import "./style.scss";
</style>

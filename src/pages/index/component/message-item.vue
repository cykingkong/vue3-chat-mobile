<template>
    <div class="Message" :class="message.type">
        
        <div class="Message-main">
            <!-- 头像 -->
            <div class="avatar">
<div class="avatar-icon" >
    <van-icon name="service" v-if="message.type == 'left'"/>
                <van-icon name="manager" v-else/>
</div>
<!-- <div class="avatar-icon" v-else>
<img :src="avatar" alt="" v-if="message.type == 'left'"/>
    <van-icon name="manager" v-else/>
</div>           -->
            </div>
            <!-- Message-inner -->
            <div class="Message-inner">
                <div class="Message-content">
                    <div class="Bubble">
                        <p   v-if="message.msgType == 'text'">{{ message.content }}{{ avatar }}</p>
                        <div v-else>
                            <van-image fit="cover"  :key="msgKey"  :src="message.msgImgUrl" alt=""/>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script setup lang="ts">
import { Lazyload } from 'vant';
const props = defineProps({
    message: {
        type: Object,
        default: () => ({})
    },
    index:{
        type: Number,
    },
    hasKf:{
        type: Boolean,
        default: false
    },
    msgKey:{
        type:Number,
    },
    avatar:{
        type:String,
    }
})
</script>
<style lang="less" scoped>
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
        gap: 8px;

        .avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: var(--van-gray-4);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
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


.Bubble {
    background: var(--van-background-3);
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
    p{
        margin:0;
    }
}

.Message.right .Message-main {
    flex-direction: row-reverse;
}
.Message.right .Message-content, .Message.right .Message-main {
    flex-direction: row-reverse;
}
.Message.right .Bubble {
    margin-left: 3rem;
    background:var(--van-orange);
}

.Message.left .Bubble {
    margin-right: 3rem;
}
</style>

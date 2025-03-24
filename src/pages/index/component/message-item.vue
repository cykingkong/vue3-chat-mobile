<template>
    <div class="Message" :class="message.type">
        
        <div class="Message-main">
            <!-- 头像 -->
            <img round class="avatar"  src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
            <!-- Message-inner -->
            <div class="Message-inner">
                <div class="Message-content">
                    <div class="Bubble">{{ message.content }}</div>
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
        gap: 4px;

        .avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
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


.Bubble {

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

.Message.right .Message-main {
    flex-direction: row-reverse;
}
.Message.right .Message-content, .Message.right .Message-main {
    flex-direction: row-reverse;
}
.Message.right .Bubble {
    margin-left: 3rem;
    background:#fff9eb
}

.Message.left .Bubble {
    margin-right: 3rem;
}
</style>

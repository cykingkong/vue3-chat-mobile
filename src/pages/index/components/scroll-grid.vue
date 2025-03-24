<template>
    <div class="grid" v-if="skeleton && list.length > 0">
        <div class="grid-item" v-for="(item,index) in list" :key="item.id">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-price " :class="index % 2 === 0 ? 'up' : 'down'">$1234</div>
            <div class="item-bottom">{{ item.name }}</div>
        </div>
    </div>
    <div class="grid-skeleton" v-else>
        <div class="skeleton-item skeleton-animation" v-for="i in 3"></div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface IGridItem {
    id: number,
    name: string
}
const props = defineProps({
    list: {
        type: Array<IGridItem>,
        default: () => []
    },
    skeleton: {
        type: Boolean,
        default: true
    }
})
</script>
<style lang="less" scoped>
.grid {
    width: 100%;
    min-height: 80px;
    display: flex;
    padding: 0 12px;
    overflow-y: auto;
    gap:12px;
    // 隐藏导航栏
    &::-webkit-scrollbar {
        display: none;
    }

    .grid-item {
        flex-shrink: 0;
        width: 113px;
        height: 83.5px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        align-items: center;

        background: var(--van-background-3);
        .item-image {
            width: 41px;
            height: 32px;
        }
        .item-title{
            font-size: 12px;
        }
        .item-price{
            font-size: 14px;
            font-weight: 500;
            color:red;
        }
        .up{
            color:red
        }
        .down{
            color:green
        }
        .item-bottom {
            font-size: 11px;
            color: var(--van-text-color);
            line-height: 16px;
        }
    }
}

.grid-skeleton {
    width: 100%;
    min-height: 80px;
    display: flex;
    padding: 0 12px;
    gap: 12px;

    .skeleton-item {
        flex: 1;
        height: 83.5px;
        border-radius: 5px;
        background: #EEEEEE;

    }
}
</style>
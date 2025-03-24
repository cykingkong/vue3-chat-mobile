<template>
    <div class="grid" v-if="skeleton && list.length >0">
        <div class="grid-item" v-for="item in list" :key="item.id">
            <div class="item-image"></div>
            <div class="item-name">{{ item.name }}</div>
        </div>
    </div>
    <div class="grid-skeleton" v-else-if="list.length ==0">
        <div class="skeleton-item skeleton-animation" v-for="i in 4"></div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
interface IGridItem{
    id:number,
    name:string
}
const props = defineProps({
    list:{
        type:Array<IGridItem>,
        default:()=>[]
    },
    skeleton:{
        type:Boolean,
        default:true
    }
})
</script>
<style lang="less" scoped>
.grid{
    width: 100%;
    min-height: 80px;
    display: flex;
    padding:0 12px;
    .grid-item{
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap:4px;
        align-items: center;
        .item-image{
            width: 41px;
            height: 32px;
        }
        .item-name{
            font-size: 12px;
            color:var(--van-text-color);
            line-height: 16px;
        }
    }
}
.grid-skeleton{
    width: 100%;
    min-height: 80px;
    display: flex;
    padding:0 12px;
    gap:12px;
    .skeleton-item{
        flex:1    ;
        height: 60px;
        border-radius: 5px;
		background: #EEEEEE;

    }
}
</style>
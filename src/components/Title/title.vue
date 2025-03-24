<template>
    <div class="title-box">
        <div class="flag"></div>
        {{ title }}
    </div>
</template>
<script setup lang="ts">
import { ref, reactive,computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '标题'
    },
    gap:{
        type:Number,
        default: 4
    },

})
const gapStyle = computed(()=>{
    if(!props.gap){
        return ''
    }else{
        return `gap:${props.gap}px`

    }
})
</script>
<style lang="less" scoped>
.title-box{
    width: 100%;
    display: flex;
    font-size: 21px;
    padding:0 11px;
    gap:4px;
    align-items: center;
    .flag{
        width: 4px;
        height: 16px;
        border-radius: 16px;
        background: linear-gradient(171deg,#f3d9c0 7%,#d1a07e 87%);
    }
}
</style>
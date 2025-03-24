<template>
    <div class="banner" v-if="skeleton ">

    </div>
    <div class="banner-skeleton" v-else>
        <div class="skeleton-item skeleton-animation"></div>
    </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    bannerInfo: {
        type: Object,
        default: () => {}
    },
    skeleton: {
        type: Boolean,
        default: false,
    }
})
</script>
<style lang="less" scoped>
.banner {
    width: 100%;
    min-height: 70px;
    padding: 0 12px;
    .banner-image{
        width: 100%;
        height: 70px;
        border-radius: 10px;
    }
}

.banner-skeleton {
    width: 100%;
    min-height: 80px;
    display: flex;
    padding: 0 12px;
    gap: 12px;

    .skeleton-item {
       width: 100%;
       height: 70px;
       border-radius: 10px;
       background: #EEEEEE;

    }
}
</style>
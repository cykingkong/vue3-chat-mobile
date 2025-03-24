<script lang="ts" setup>
import { ref } from 'vue'

const { t } = useI18n();
const dark = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)
const tabList = ref([
  {
    label: 'Name',
    key: 1,
  },
  {
    label: 'Latest price',
    key: 2,
  },
  {
    label: 'Rise and fall',
    key: 3,
  },
 
])
</script>

<template>
  <div class="price-content" >
    <Gtitle :title="t('menus.price')" :gap="4" class="Gtitle" :class="dark?'dark-bg':'white-bg'"/>
    <div class="tab-box" :class="dark?'dark-bg':'white-bg'">
      <div v-for="(item, index) in tabList" :key="index" class="tab-item">
        {{ item.label }}
      </div>
    </div>
    <div class="data-scroll-content">
      <div class="data-item" v-for="el in 40">
        <div class="data-name item-box">
          <div class="name">NFLX <div class="desc">/USDT</div></div>
          <div class="ft22">ft2123123123122</div>
        </div>
        <div class="data-latest-price item-box">
          <div class="price">39123.42</div>
        </div>
        <div class="data-rise-and-fall item-box"></div>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.Gtitle{
  position: fixed;
  top: 0;
    z-index: 9;
    height: 57px;
}
.price-content {
  .tab-box {
    position: fixed;
    top: 57px;
    z-index: 9;
    width: 100%;
    display: flex;
    height: 45px;
    padding:0 25px;
    .tab-item {
      flex: 1;
      height: 45px;
      line-height: 45px;
      text-align: center;
      &:first-child {
      flex:1.5 1 0%;
      text-align: left;
     
      }
      &:last-child {
        text-align: right;
      }
    }
   
  }
.dark-bg{
  background-color: #1F1F1F;
}
.white-bg{
  background-color: #fff;
}
  .data-scroll-content {
    height: 100vh;
    overflow-y: scroll;
    padding:  calc(57px + 45px + 10px) 25px 0;
    display: flex;
    flex-direction: column;
    gap:12px;
    &::-webkit-scrollbar {
      display: none;
    }
    .data-item{
      height: 80px;
      width: 100%;
      display: flex;
      .item-box {
      flex: 1;
      height: 80px;
      line-height: 80px;
      text-align: center;
      .price{
        font-size: 12px;
        opacity: .6;
      }
      &:first-child {
      flex:1.5 1 0%;
      text-align: left;

      .name{
        display: flex;
        align-items:baseline;
        font-size: 16px;
        font-weight: 600;
        line-height: 1;
        margin-bottom:3px;
        .desc{
          font-size: 12px;
        font-weight: 500;
          opacity: .6;
        }
     
      }
      .ft22{
          font-size: 12px;
        line-height: 1;
        font-weight: 400;

        }
      }
      &:last-child {
        text-align: right;
      }
    }
    }
  }
}
</style>

<route lang="json5">
{
  name: 'price',
  meta: {
    title: 'price',
    i18n: 'menus.price'
  },
}
</route>

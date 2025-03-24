<script setup lang="ts">
import type { PickerColumn } from 'vant'
import { languageColumns, locale } from '@/utils/i18n'
// 引入Swiper核心和所需模块
// 引入Swiper核心和所需模块
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
// 引入Swiper样式
import 'swiper/swiper-bundle.css';
import Grid from './components/grid.vue'
import ScrollGrid from './components/scroll-grid.vue';
import Banner from './components/banner.vue'
const { t } = useI18n()
const gridList = ref([
  { id: 0, name: 'NFLX' }, { id: 1, name: 'ATL' },
  { id: 0, name: 'NFLX' }, { id: 1, name: 'ATL' },
])
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
const menuItems = computed(() => ([
  { title: t('menus.mockGuide'), route: 'mock' },
  { title: t('menus.echartsDemo'), route: 'charts' },
  { title: t('menus.unocssExample'), route: 'unocss' },
  { title: t('menus.persistPiniaState'), route: 'counter' },
  { title: t('menus.keepAlive'), route: 'keepalive' },
  { title: t('menus.404Demo'), route: 'unknown' },
  { title: `${t('menus.price')}1231231`, route: 'price' },
]))
// 定义Swiper所需模块
const modules = [Pagination];
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}

const checked = ref<boolean>(isDark.value)

watchEffect(() => {
  checked.value = isDark.value
})

function toggle(val: boolean) {
  checked.value = val
  toggleDark()
}
</script>

<template>
  <div class="index-content">
    <swiper :modules="modules" :slides-per-view="1">
      <swiper-slide v-for="i in 4">
        <div class="swiper-item">{{ i }}</div>
      </swiper-slide>
    </swiper>
    <ScrollGrid :list="[...gridList, ...gridList]"></ScrollGrid>
    <Grid :list="gridList"></Grid>
    <Banner></Banner>
    <Gtitle :title="'USTD'"></Gtitle>
    <div class="tab-box">
      <div v-for="(item, index) in tabList" :key="index" class="tab-item">
        {{ item.label }}
      </div>
    </div>
    <div class="data-scroll-content">
      <div class="data-item" v-for="el in 40">
        <div class="data-name item-box">
          <div class="name">NFLX <div class="desc">/USDT</div>
          </div>
          <div class="ft22">ft2123123123122</div>
        </div>
        <div class="data-latest-price item-box">
          <div class="price">39123.42</div>
        </div>
        <div class="data-rise-and-fall item-box"></div>

      </div>
    </div>
    <van-cell-group :title="t('menus.basicSettings')" :border="false" :inset="true">
      <van-cell center :title="t('menus.darkMode')">
        <template #right-icon>
          <van-switch v-model="checked" size="20px" aria-label="on/off Dark Mode" @change="toggle" />
        </template>
      </van-cell>

      <van-cell is-link :title="t('menus.language')" :value="language" @click="showLanguagePicker = true" />
    </van-cell-group>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .tab-box {

    width: 100%;
    display: flex;
    height: 45px;
    padding: 0 25px;

    .tab-item {
      flex: 1;
      height: 45px;
      line-height: 45px;
      text-align: center;

      &:first-child {
        flex: 1.5 1 0%;
        text-align: left;

      }

      &:last-child {
        text-align: right;
      }
    }

  }

  .data-scroll-content {
    padding: 0 25px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    .data-item {
      height: 80px;
      width: 100%;
      display: flex;

      .item-box {
        flex: 1;
        height: 80px;
        line-height: 80px;
        text-align: center;

        .price {
          font-size: 12px;
          opacity: .6;
        }

        &:first-child {
          flex: 1.5 1 0%;
          text-align: left;

          .name {
            display: flex;
            align-items: baseline;
            font-size: 16px;
            font-weight: 600;
            line-height: 1;
            margin-bottom: 3px;

            .desc {
              font-size: 12px;
              font-weight: 500;
              opacity: .6;
            }

          }

          .ft22 {
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

.swiper-item {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const { t } = useI18n()
const active = ref(0)
const route = useRoute()
const tabIconEnum = {
  home: 'i-carbon:home',
  profile: 'i-carbon:user',
  price :''
}
const show = computed(() => route.name && routeWhiteList.includes(route.name))
const tabList = computed(() => {
  const routeArr = routeWhiteList.map((item) => {
  return {
      name: item,
      path: `/${item}`,
      icon:tabIconEnum[item]
  }
})
return routeArr
})
</script>

<template>
  <van-tabbar v-if="show" v-model="active" placeholder route>
    <van-tabbar-item replace :to="item" v-for="(item,e) in tabList" :key="e" >
      {{ t(`layouts.${item.name}`) }}
      <template #icon>
        <div :class="item.icon" />
      </template>
    </van-tabbar-item>
    <!-- <van-tabbar-item replace to="/profile">
      {{ t('layouts.profile') }}
      <template #icon>
        <div class="i-carbon:user" />
      </template>
    </van-tabbar-item> -->
  </van-tabbar>
</template>

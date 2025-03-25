<script setup lang="ts">
import { routeWhiteList } from '@/config/routes'

const route = useRoute()
const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const { t } = useI18n()

const title = computed(() => {
  if (!route.meta)
    return ''

  return route.meta.i18n ? t(route.meta.i18n) : (route.meta.title || '')
})
// 若是在tab页 则不显示顶部导航栏
const show = computed(() => route.name && ['price','home'].includes(route.name))

const showLeftArrow = computed(() =>  route.name && routeWhiteList.includes(route.name))

</script>

<template>
  <VanNavBar
    :title="title"
    :fixed="true"
    clickable placeholder
    :left-arrow="false"
    @click-left="onBack"
    v-show="!show"
  />
</template>

import { computed, ref } from 'vue'

export function useLists() {
  const lists = ref([
    {
      title: '攻击次数',
      value: 62,
      suffix: '次',
      img: new URL('./assets/dev-1.png', import.meta.url).href,
    },
    {
      title: '阻断次数',
      value: 4,
      suffix: '次',
      img: new URL('./assets/dev-3.png', import.meta.url).href,
    },
  ])

  const listsSpan = computed(() => 24 / lists.value.length)

  return {
    lists,
    listsSpan,
  }
}

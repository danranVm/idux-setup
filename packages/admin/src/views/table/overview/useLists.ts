import { computed, h, ref } from 'vue'

import { IxButton, IxSpace, IxTag } from '@idux/components'

export function useLists() {
  const lists = ref([
    {
      title: '本地镜像',
      value: 62,
      suffix: '个',
      img: new URL('./assets/dev-1.png', import.meta.url).href,
    },
    {
      customTitle: h(
        IxSpace,
        { align: 'center', style: { 'line-height': 0 } },
        {
          default: () => [
            h('span', null, { default: () => '可信镜像' }),
            h(IxButton, { mode: 'link', icon: 'info-circle' }),
          ],
        },
      ),
      value: 1,
      suffix: '个',
      img: new URL('./assets/dev-2.png', import.meta.url).href,
    },
    {
      title: '已扫描镜像',
      value: 60,
      suffix: '个',
      img: new URL('./assets/dev-3.png', import.meta.url).href,
    },
    {
      customTitle: h(IxSpace, null, {
        default: () => [
          h('span', null, { default: () => '未扫描镜像' }),
          h(
            IxTag,
            {
              color: 'error',
              style: {
                'border-color': 'transparent',
                'background-color': '#fae7e8',
                color: ' #cf171d',
              },
            },
            {
              default: () => '扫描失败 2',
            },
          ),
        ],
      }),
      value: 4,
      suffix: '个',
      img: new URL('./assets/dev-4.png', import.meta.url).href,
    },
  ])

  const listsSpan = computed(() => 24 / lists.value.length)

  return {
    lists,
    listsSpan,
  }
}

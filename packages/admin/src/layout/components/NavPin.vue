<script lang="ts" setup>
import { computed, watch } from 'vue'

import { useState } from '@idux/cdk/utils'

const props = defineProps<{
  pined: boolean
}>()
const prefixCls = 'layout-nav-pin'

const [animating, setAnimating] = useState<boolean>(false)

const pinClasses = computed(() => ({
  [prefixCls]: true,
  [`${prefixCls}--animating`]: animating.value,
  [`${prefixCls}--pined`]: !!props.pined,
  [`${prefixCls}--unpined`]: !props.pined,
}))

let tmr: number

watch(
  () => props.pined,
  () => {
    clearTimeout(tmr)
    setAnimating(true)
    tmr = setTimeout(() => {
      setAnimating(false)
    }, 1000)
  },
)
</script>

<template>
  <span :class="pinClasses">
    <svg viewBox="0 0 16 16" focusable="false">
      <g :class="`${prefixCls}__filled`" style="mix-blend-mode: passthrough">
        <path
          fill-rule="evenodd"
          d="M8.095 3.853a.2.2 0 0 0-.22-.042L4.04 5.455l-.006.002-.713.305a.2.2 0 0 0-.063.326L6.232 9.06l-2.687 2.687a.2.2 0 0 0 0 .283l.425.425a.2.2 0 0 0 .282 0L6.94 9.769l2.973 2.972c.1.1.27.067.325-.063l.306-.713.002-.005 1.644-3.835a.2.2 0 0 0-.043-.22l-.611-.612 1.98-1.98a.2.2 0 0 0 0-.283l-2.546-2.545a.2.2 0 0 0-.283 0l-1.98 1.98-.61-.612Z"
          style="mix-blend-mode: passthrough"
        />
      </g>
      <g :class="`${prefixCls}__lined`" style="mix-blend-mode: passthrough">
        <path
          fill-rule="evenodd"
          d="M10.63 3.415a.2.2 0 0 1 .185-.126h.865V.49c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2v2.8h.864a.2.2 0 0 1 .186.126l1.55 3.874.002.006.288.72a.2.2 0 0 1-.186.274h-4.203v3.8a.2.2 0 0 1-.2.2h-.6a.2.2 0 0 1-.2-.2v-3.8H8.975a.2.2 0 0 1-.186-.274l.289-.72.002-.006 1.55-3.874Zm2.55 3.874h4.023l-1.2-3H14.68v-3h-2v3h-1.323l-1.2 3h3.024Z"
          style="mix-blend-mode: passthrough"
          transform="rotate(45 8.774 .29)"
        />
      </g>
    </svg>
  </span>
</template>

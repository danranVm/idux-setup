<script setup lang="ts">
import Part1 from './Part1.vue'
import Part2 from './Part2.vue'
import Part3 from './Part3.vue'
import Part4 from './Part4.vue'
import Part5 from './Part5.vue'
import Part6 from './Part6.vue'
import Part7 from './Part7.vue'
import Part8 from './Part8.vue'
</script>
<template>
  <section class="dashboard-page mt-4">
    <IxSpace vertical :size="8" block>
      <Part1 />
      <Part2 />
      <IxRow :gutter="8">
        <IxCol :span="12">
          <Part3 />
        </IxCol>
        <IxCol :span="12">
          <Part4 />
        </IxCol>
      </IxRow>
      <IxRow :gutter="8">
        <IxCol :span="12">
          <Part5 />
        </IxCol>
        <IxCol :span="12">
          <Part6 />
        </IxCol>
      </IxRow>
      <IxRow :gutter="8">
        <IxCol :span="12">
          <Part7 />
        </IxCol>
        <IxCol :span="12">
          <Part8 />
        </IxCol>
      </IxRow>
    </IxSpace>
  </section>
</template>
<style lang="less">
@import url('./index.less');
</style>

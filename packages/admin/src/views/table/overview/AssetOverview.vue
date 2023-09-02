<template>
  <div class="asset-overview-page">
    <IxHeader class="dark:text-gray-300 asset-overview-page__header"> 资产总览 </IxHeader>
    <div class="asset-overview-page__container">
      <div class="asset-overview-page__statistics">
        <MousePopover v-for="item in statisticsMap" :key="item.key" :content="item.content">
          <div class="statistics-item">
            <div class="statistics-item__header">{{ item.title }}</div>
            <div class="statistics-item__container">
              <div class="statistics-item__container--total">{{ item.total }}</div>
              <div class="statistics-item__container--icon">
                <img :src="item.icon" :alt="item.title" />
              </div>
            </div>
          </div>
        </MousePopover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, type VNode } from 'vue'

import { MousePopover } from '@idux/setup-shared'

import dataAccuracyIcon from './assets/data_accuracy.webp'
import LinkedAssetIcon from './assets/linked_asset.webp'
import PortOpenIcon from './assets/port_open.webp'
import RecentlyIcon from './assets/recently_asset.webp'

enum StatisticsKey {
  'high',
  'port',
  'recently',
  'linked',
}

interface StatisticsData {
  title: string
  key: StatisticsKey
  content: string | VNode
  total: number
  icon: string
}

const statisticsMap: StatisticsData[] = [
  {
    title: '数据准确性较高',
    key: StatisticsKey.high,
    content: h('div', [
      h('span', '准确性较高的数据源上报的资产，您可以在“'),
      h(
        'span',
        {
          style: {
            color: 'var(--ix-color-primary)',
            cursor: 'pointer',
          },
          onClick: () => {
            //...
          },
        },
        '未知资产分析',
      ),
      h('span', '”中更新“数据源准确性”'),
    ]),
    total: 88,
    icon: dataAccuracyIcon,
  },
  {
    title: '存在端口开放',
    key: StatisticsKey.port,
    content: '存在端口开放的资产',
    total: 123,
    icon: PortOpenIcon,
  },
  {
    title: '最近活跃资产',
    key: StatisticsKey.recently,
    content: h('div', [
      h('span', '最近一段时间内发现的资产，您可以在“'),
      h(
        'span',
        {
          style: {
            color: 'var(--ix-color-primary)',
            cursor: 'pointer',
          },
          onClick: () => {
            //...
          },
        },
        '未知资产分析',
      ),
      h('span', '”中更新“活跃度”相关信息'),
    ]),
    total: 6,
    icon: RecentlyIcon,
  },
  {
    title: '已关联资产组',
    key: StatisticsKey.linked,
    content: '所属资产组非空的资产',
    total: 99,
    icon: LinkedAssetIcon,
  },
]
</script>

<style lang="less">
@import url('./styles/assetOverview.less');
</style>

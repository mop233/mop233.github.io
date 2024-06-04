<script setup lang="ts">
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import { data as posts } from '../data/posts.data.ts'

const icons = [
  'eclipse',
  'globe-snow',
  'alarm-clock',
  'alicorn',
  'grill-fire',
  'moped'
]

const features = posts
  .map((post, index) => ({
    icon: `<i class="fad fa-${icons[index]}"></i>`,
    title: post.title,
    details: post.detail,
    link: post.url
  }))
  .slice(0, 6)
</script>

<template>
  <VPFeatures v-if="features" class="VPHomeFeatures" :features />
</template>

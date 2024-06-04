<script lang="ts" setup>
import { computed } from 'vue'
import formatPosts from '../utils/formatPosts'

const props = defineProps({
  posts: {
    type: Object,
    default: () => []
  }
})

const groups = computed(() => formatPosts(props.posts))
</script>

<template>
  <div class="timeline" v-for="group in groups">
    <div class="timeline-dot">
      <span class="timeline-dot-title">{{ group.year }}</span>
      <ul>
        <li v-for="post in group.posts">
          <span>
            {{ (post.month + '').padStart(2, '0') }} -
            {{ (post.day + '').padStart(2, '0') }}
          </span>
          <a :href="post.url">{{ post.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  ul {
    li {
      list-style: none;

      span {
        display: inline-block;
        width: 70px;
      }
    }
  }
}
</style>

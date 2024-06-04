<script lang="ts" setup>
import { computed, ref } from 'vue'
import { data } from '../data/posts.data'

const props = defineProps({
  view: {
    type: String,
    defaulu: ''
  }
})

const labelsSet: Set<string | undefined> = new Set()
let labelName: string
if (props.view === 'categories') {
  labelName = '分类'
  data.forEach(post => labelsSet.add(post.category))
} else if (props.view === 'tags') {
  labelName = '标签'
  data.forEach(post => post.tags?.forEach(tag => labelsSet.add(tag)))
}

const labelsArray = Array.from(labelsSet)
const labelsGroup = {}
labelsArray.forEach(label => {
  let group = labelsGroup[label!]
  if (!group) {
    group = []
    labelsGroup[label!] = group
  }

  data.forEach(post => {
    if (
      (props.view === 'categories' && post.category === label) ||
      (props.view === 'tags' && post.tags?.includes(label!))
    ) {
      group.push(post)
    }
  })
})

const currentIndex = ref(0)
const posts = computed(() => labelsGroup[labelsArray[currentIndex.value]!])
</script>

<template>
  <div class="label-view">
    <h1>共有 {{ labelsArray.length }} 个{{ labelName }}</h1>
    <div class="labels">
      <a
        v-for="(value, key, index) in labelsGroup"
        class="button"
        :class="{ active: currentIndex === index }"
        @click="currentIndex = index"
      >
        {{ key }} ( {{ value.length }} )
      </a>
    </div>
    <hr />
    <Timeline :posts />
  </div>
</template>

<style scoped>
.label-view {
  .labels {
    margin: 20px 0;
    display: flex;
    flex-wrap: wrap;

    .button {
      display: inline-block;
      margin: 0 20px 20px 0;
      padding: 5px 15px;
      color: var(--vp-button-alt-text);
      font-size: 14px;
      text-decoration: none;
      white-space: nowrap;
      background: var(--vp-button-alt-bg);
      border-radius: 20px;
      border: 1px solid var(--vp-button-alt-border);
      transition: color 0.25s, border-color 0.25s, background-color 0.25s;
      cursor: pointer;

      &:hover {
        color: var(--vp-button-alt-hover-text);
        background-color: var(--vp-button-alt-hover-bg);
        border-color: var(--vp-button-alt-hover-border);
      }

      &.active {
        border-color: var(--vp-button-brand-border);
        color: var(--vp-button-brand-text);
        background-color: var(--vp-button-brand-bg);
      }
    }
  }
}
</style>

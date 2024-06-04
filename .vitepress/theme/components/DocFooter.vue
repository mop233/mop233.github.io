<script setup lang="ts">
import { computed, watch, ComputedRef } from 'vue'
import { useData, useRoute } from 'vitepress'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import { data as posts } from '../data/posts.data'

const { theme, frontmatter } = useData()

let currentIndex: ComputedRef<number>,
  control: ComputedRef<{
    prev: { text: string; link: string }
    next: { text: string; link: string }
  }>

const route = useRoute()
watch(
  route,
  () => {
    currentIndex = computed(() =>
      posts.findIndex(post => post.title === frontmatter.value.title)
    )
    control = usePrevNext(currentIndex)
  },
  { immediate: true }
)

function usePrevNext(currentIndex: ComputedRef<number>) {
  let next: any = posts[currentIndex.value - 1] || -1
  let prev: any = posts[currentIndex.value + 1] || -1

  if (
    frontmatter.value.title === '归档' ||
    frontmatter.value.title === '分类' ||
    frontmatter.value.title === '标签' ||
    frontmatter.value.title === '关于'
  ) {
    next = -1
    prev = -1
  }

  return computed(() => ({
    prev: { link: prev.url, text: prev.title },
    next: { link: next.url, text: next.title }
  }))
}

const showFooter = computed(() => control.value.prev || control.value.next)
</script>

<template>
  <footer v-if="showFooter" class="VPDocFooter">
    <slot name="doc-footer-before" />

    <nav
      v-if="control.prev?.link || control.next?.link"
      class="prev-next"
      aria-labelledby="doc-footer-aria-label"
    >
      <span class="visually-hidden" id="doc-footer-aria-label">Pager</span>

      <div class="pager">
        <VPLink
          v-if="control.prev?.link"
          class="pager-link prev"
          :href="control.prev.link"
        >
          <span
            class="desc"
            v-html="theme.docFooter?.prev || 'Previous page'"
          ></span>
          <span class="title" v-html="control.prev.text"></span>
        </VPLink>
      </div>
      <div class="pager">
        <VPLink
          v-if="control.next?.link"
          class="pager-link next"
          :href="control.next.link"
        >
          <span
            class="desc"
            v-html="theme.docFooter?.next || 'Next page'"
          ></span>
          <span class="title" v-html="control.next.text"></span>
        </VPLink>
      </div>
    </nav>
  </footer>
</template>

<style scoped>
.VPDocFooter {
  margin-top: 64px;
}

.edit-info {
  padding-bottom: 18px;
}

@media (min-width: 640px) {
  .edit-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
  }
}

.edit-link-button {
  display: flex;
  align-items: center;
  border: 0;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.edit-link-button:hover {
  color: var(--vp-c-brand-2);
}

.edit-link-icon {
  margin-right: 8px;
}

.prev-next {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  display: grid;
  grid-row-gap: 8px;
}

@media (min-width: 640px) {
  .prev-next {
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 16px;
  }
}

.pager-link {
  display: block;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 11px 16px 13px;
  width: 100%;
  height: 100%;
  transition: border-color 0.25s;
}

.pager-link:hover {
  border-color: var(--vp-c-brand-1);
}

.pager-link.next {
  margin-left: auto;
  text-align: right;
}

.desc {
  display: block;
  line-height: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}
</style>

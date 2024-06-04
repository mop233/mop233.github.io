import { createContentLoader } from 'vitepress'

interface Post {
  url: string
  title?: string
  category?: string
  tags?: string[]
  date?: string | number
  detail?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('/posts/*.md', {
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title || '文章标题',
        category: frontmatter.category || '无分类',
        tags: frontmatter.tags || ['无标签'],
        date: frontmatter.date || +new Date(),
        detail: frontmatter.detail || ''
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }
})

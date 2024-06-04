import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import timeline from 'vitepress-markdown-timeline'

const year = new Date().getFullYear()

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Hello World',
  description: 'A blog of Paul',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/gh/xlovet/assets/fontawesome/v6/js/fontawesome.js'
      }
    ],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/gh/xlovet/assets/fontawesome/v6/js/duotone.js'
      }
    ]
  ],
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: {
    config: (md: any) => {
      md.use(timeline)
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',

    outline: { label: '本页目录', level: [2, 3] },
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    docFooter: { prev: '上一篇', next: '下一篇' },
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                displayDetails: '显示详细列表',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    footer: {
      message:
        'Powered by <a href="https://vitepress.dev/zh" target="_blank">VitePress</a>',
      copyright: `© 2021 - ${year} <span style="color: red; padding: 0 2px;"><i class="fad fa-swap-opacity fa-heart fa-beat"></i></span> <a href="mailto:37662788@qq.com">猛吃雪糕</a>`
    },

    nav: [
      { text: '归档', link: '/views/archives' },
      { text: '分类', link: '/views/categories' },
      { text: '标签', link: '/views/tags' },
      { text: '关于', link: '/views/about' }
    ],
    sidebar: [{ text: 'Home', link: '/' }],

    socialLinks: [{ icon: 'github', link: 'https://github.com/mopsite' }]
  },

  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHomeFeatures\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/HomeFeatures.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/Sidebar.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPDocFooter\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/DocFooter.vue', import.meta.url)
          )
        }
      ]
    }
  }
})

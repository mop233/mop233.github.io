---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 'Hello World'
  text: 'A blog of Paul'
  tagline: 帅到无边心是岸，拽临绝顶我为峰
  image:
    src: /logo.svg
  actions:
    - theme: brand
      text: 在 GitHub 上查看
      link: https://github.com/mop233/mop233.github.io
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(-20deg, var(--vp-c-brand-next) 0%, var(--vp-c-brand-1) 100%);
  --vp-home-hero-image-background-image: linear-gradient(-20deg, var(--vp-c-brand-next) 0%, var(--vp-c-brand-1) 100%);
  --vp-home-hero-image-filter: blur(80px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(120px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(120px);
  }
}
</style>

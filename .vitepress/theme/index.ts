import DefaultTheme from 'vitepress/theme'
import 'vitepress-markdown-timeline/dist/theme/index.css'
import './styles/vars.css'
import Timeline from './components/Timeline.vue'
import Labels from './components/Labels.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Timeline', Timeline)
    app.component('Labels', Labels)
  }
}

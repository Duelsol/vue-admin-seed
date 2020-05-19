import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zhCN from './messages/zh_CN'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'zh_CN',
  messages: {
    'zh_CN': zhCN
  }
})

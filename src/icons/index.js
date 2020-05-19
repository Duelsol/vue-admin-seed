import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg组件
import { importAll } from '../utils/operation'

// register globally
Vue.component('SvgIcon', SvgIcon)

importAll(require.context('./svg', false, /\.svg$/))

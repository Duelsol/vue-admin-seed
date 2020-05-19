import Vue from 'vue'
import ElementUI, { Message, MessageBox } from 'element-ui'
import i18n from '@/i18n'

Vue.use(ElementUI, { size: 'small' })

const messages = i18n.messages[i18n.locale]
const defaultTitle = messages.global.title.prompt
const defaultType = 'warning'

/**
 * $msgbox
 */
const msgbox = (options = {}) => {
  options.title = options.title || defaultTitle
  options.type = options.type || defaultType
  return MessageBox(options)
}
Vue.prototype.$msgbox = msgbox

/**
 * $confirm
 */
const confirm = (message, title = defaultTitle, options = {}) => {
  let _title = title
  let _options = options
  if (typeof title === 'object' && typeof options === 'object') {
    _title = defaultTitle
    _options = title
  }
  _options.type = _options.type || defaultType
  return MessageBox.confirm(message, _title, _options)
}
Vue.prototype.$confirm = confirm

/**
 * $alert
 */
const alert = (message, title = defaultTitle, options = {}) => {
  let _title = title
  let _options = options
  if (typeof title === 'object' && typeof options === 'object') {
    _title = defaultTitle
    _options = title
  }
  _options.showClose = _options.showClose || false
  return MessageBox.alert(message, _title, _options)
}
Vue.prototype.$alert = alert

/**
 * $message
 */
const message = options => {
  return Message(options)
}
Object.keys(Message).forEach(key => {
  message[key] = Message[key]
})
Vue.prototype.$message = message

/**
 * private
 */
const generateMethod = (catalog, type, prototype, isMessage, key) => {
  if (isMessage === true) {
    return options => {
      let _options = {}
      if (typeof options === 'object') {
        _options = options
      }
      _options.message = i18n.t(`${catalog}.${type}.${key}`, _options)
      if (key.endsWith('WithSuccess')) {
        return prototype.success(_options)
      } else if (key.endsWith('WithWarning')) {
        return prototype.warning(_options)
      } else if (key.endsWith('WithError')) {
        return prototype.error(_options)
      } else if (key.endsWith('WithInfo')) {
        return prototype.info(_options)
      } else {
        return prototype(_options)
      }
    }
  } else {
    return options => {
      return prototype(i18n.t(`${catalog}.${type}.${key}`, options), undefined, options)
    }
  }
}
const dispatchMethods = (catalog, type, prototype, isMessage) => {
  const object = messages[catalog][type]
  if (object) {
    if (catalog === 'global') {
      Object.keys(object).forEach(key => {
        prototype[key] = generateMethod(catalog, type, prototype, isMessage, key)
      })
    } else {
      const child = {}
      Object.keys(object).forEach(key => {
        child[key] = generateMethod(catalog, type, prototype, isMessage, key)
      })
      prototype[catalog] = child
    }
  }
}
Object.keys(messages).forEach(catalog => {
  dispatchMethods(catalog, 'confirm', confirm)
  dispatchMethods(catalog, 'alert', alert)
  dispatchMethods(catalog, 'alert', message, true)
})

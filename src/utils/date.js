/**
 * 将日期字符串转为Date
 *
 * @param str 日期字符串
 * @returns {Date}
 */
export function toDate(str) {
  return new Date(str.replace(/(\d{4})-(\d{2})-(\d{2})T(.*)?\.(.*)/, '$1/$2/$3 $4'))
}

/**
 * 格式化Date
 *
 * @param date 日期
 * @param fmt 格式化字符串
 * @returns {*}
 */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

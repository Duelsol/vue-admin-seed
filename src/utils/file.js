/**
 * 根据传入的文件大小选择合适的单元输出
 *
 * @param size 大小数值，单位是B
 * @returns {string}
 */
export function formatFileSize (size) {
  let rank = ['B', 'K', 'M', 'G']
  let c
  for (c = 0; size > 1024.0; ++c) {
    size /= 1024.0
  }
  return keep2point(size) + (c > rank.length ? rank[rank.length - 1] : rank[c])
}

function keep2point (value) {
  let f = parseFloat(value)
  if (isNaN(f)) {
    return false
  }
  f = Math.round(value * 100) / 100
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

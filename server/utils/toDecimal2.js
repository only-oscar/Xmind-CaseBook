module.exports = function toDecimal2(x) {
  let f = parseFloat(x)
  if (isNaN(f)) {
    return ''
  }
  f = Math.round(x * 100) / 100 // 数字过大会出现问题
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

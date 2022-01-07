// 防抖
export function debounce(fn, delay = 500) {
  let timer = null
  debugger
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this,arguments)
      timer = null
    }, delay)
  }
}
let timer2 = null
export function debounce2(fn, delay = 500) {
    if (timer2) {
      clearTimeout(timer2)
    }
    timer2 = setTimeout(() => {
      fn.apply(this,arguments)
      timer2 = null
    }, delay)
}
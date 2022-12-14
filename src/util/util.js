/* eslint-disable */
// 轮循函数
// usage: wait(fn.bind(ctx, ...args), 10000)
const wait = (fn, timeout, tick) => {
  timeout = timeout || 5000
  tick = tick || 250
  let timeoutTimer = null
  let execTimer = null

  return new Promise((resolve, reject) => {

    timeoutTimer = setTimeout(() => {
      clearTimeout(execTimer)
      reject(new Error('polling fail because timeout'))
    }, timeout)

    tickHandler(fn)

    function tickHandler (fn) {
      const ret = fn()
      if (!ret) {
        execTimer = setTimeout(() => {
          tickHandler(fn)
        }, tick)
      } else {
        clearTimeout(timeoutTimer)
        resolve()
      }
    }
  })
}

export {
  wait
}

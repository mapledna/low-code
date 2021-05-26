import ProgressBar from './Index'

export default {
  install(Vue, options = {}) {
    // 注册组件
    Vue.component(ProgressBar.name, ProgressBar)

    // 创建一个 Vue 子类
    const Component = Vue.extend(ProgressBar)
    // 拿到自定义的属性
    const { autoFinish, ...res } = options
    // 创建组件实例
    const vm = new Component({
      data: {
        autoFinish: typeof autoFinish === 'boolean' ? autoFinish : true
      }
    })
    // 将 ProgressBar 的默认 options 与 自定义的 options 合并
    options = Object.assign(vm.$props.options, { ...res })
    // 合并新的props
    vm.$propsData = options
    // 手动挂载
    // console.log('ProgressBar', vm)
    vm.$mount()
    // 如果是服务端渲染则不继续执行
    if (!vm.$isServer) {
      document.body.appendChild(vm.$el)
    }

    const timer = null
    const progress = {
      start(getData) {
        if (Vue.$isServer) return
        // 每次调用 start 都重新初始化一次，比如多次点击某个按钮连续请求，那么每次都从0开始
        vm.percent = 0
        vm.show = true
        vm.canSuccess = true
        // 定义一个增量，这个值可以改成参数，也可以按照使用经验来设定
        // const CUT_SCALE = 4
        // // 定义每 100 秒来执行一次动画

        // timer = setInterval(() => {
        //   // 每次执行增量动画
        //   this.increase((CUT_SCALE - 1) * Math.random() + 1)
        //   // 如果进度大于 95%，并且设置了自动完成，那么执行结束动作
        //   if (vm.percent > 98 && vm.autoFinish) {
        //     this.finish()
        //   }
        // }, 1300)

        const self = this

        if (getData && typeof (getData) === 'function') {
          getData({
            handleOpen(result) {
              console.log(result)
              // this.$progress.start()
            },
            handleMessage(result) {
              // console.log(result},
              if (result && result.percentage) {
                self.increase(result.percentage)
                if (vm.percent >= 100) {
                  self.finish()
                }
              }
            },
            handleClose() {}
          })
        }
      },
      increase(num) {
        vm.percent = Math.min(100, parseInt(JSON.parse(num), 10))
      },
      hide() {
        clearInterval(timer)
        setTimeout(() => {
          vm.show = false
        }, 1500)
      },
      // 只需要完成进度，然后执行隐藏即可
      finish() {
        if (Vue.$isServer) return
        vm.percent = 100
        this.hide()
      },
      fail() {
        if (Vue.$isServer) return
        // 修改未成功的状态，实际效果就是改变最后的颜色
        vm.canSuccess = false
        vm.percent = 100
        this.hide()
      }

    }

    // 最后挂在到全局
    Vue.prototype.$progress = progress
  }

}


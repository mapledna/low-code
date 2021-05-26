<script>
export default {
  data() {
    return {
      nextRelateComponents: []
    }
  },
  methods: {
    // 注册上级联动组件
    basicRegisterPrevRelateComponent(prevComponet) {
      prevComponet.basicRegisterNextRelateComponent(this)
    },
    // 注册下级联动控件
    basicRegisterNextRelateComponent(nextComponent) {
      this.nextRelateComponents.push(nextComponent)
    },
    // 加载数据
    basicLoadData(params) {
      console.log('加载数据，传递参数', params)
    },
    // 数据变化
    basicDataChange(value) {
      console.log('触发联动', this.nextRelateComponents)
      this.nextRelateComponents.forEach(nextComponent => {
        // console.log('对象联动', nextComponent)
        nextComponent.loadData(value)
      })
    }

  }

}
</script>


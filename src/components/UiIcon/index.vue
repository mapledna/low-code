<template>
  <div class="ui-icon-warp">
    <i :class="iconName" />
  </div>
</template>

<script>
export default {
  name: 'UiIcon',
  components: {},
  props: {
    iconName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
</style>

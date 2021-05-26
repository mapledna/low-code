<template>
  <div class="richtext-editor">
    <div v-if="readonly" v-html="content" />
    <editor
      v-else
      v-model="content"
      tinymce-script-src="libs/tinymce/tinymce.min.js"
      :init="init"
    />
  </div>
</template>

<script>
// WARN: 不兼容IE10及以下的浏览器
// https://www.tiny.cloud/docs/general-configuration-guide/system-requirements/
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'RichtextEditor',
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 300
    },
    toolbar: {
      type: [String, Array],
      default: () => [
        'undo redo removeformat | fontselect | fontsizeselect | bold italic underline strikethrough superscript subscript forecolor backcolor | formatselect | ',
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink table image media | code fullscreen'
      ]
    },
    plugins: {
      type: [String, Array],
      default: () => [
        'link image media table lists fullscreen code'
        // 'advlist autolink lists link image charmap print preview anchor',
        // 'searchreplace visualblocks code fullscreen',
        // 'insertdatetime media table paste code help wordcount'
      ]
    }
  },
  data() {
    return {
      // 初始化配置
      init: {
        height: 300,
        menubar: false,
        toolbar: this.toolbar,
        toolbar_drawer: 'sliding',
        quickbars_selection_toolbar:
          'removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor',
        plugins: this.plugins,
        branding: false,
        language: 'zh_CN',
        invalid_elements: 'iframe',
        images_upload_handler: (blobInfo, success, failure) => {
          const img = `data:image/jpeg;base64,${blobInfo.base64()}`
          success(img)
        }
      },
      content: this.value
    }
  },
  watch: {
    value(newValue) {
      this.content = newValue
    },
    content(newValue) {
      this.$emit('input', newValue)
    }
  },
  created() {},
  mounted() {
    // window.tinymce.on('click', e => { console.log(e) })
  },
  methods: {}
}
</script>
<style scoped></style>

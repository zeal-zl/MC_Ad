
// 模板
Vue.component('desc-wrap', {
  template: '#descWrap',
  props: {
    info: Object,
    index: Number,
    len: Number
  },
  data () {
    return {}
  },
  filters: {
    filterSrc (type, info) {
      if (type === 'video') {
        return info.poster
      } else {
        if (info.src) {
          return info.src
        } else {
          return './images/text.png'
        }
      }
    }
  },
  methods: {
    editTem (type, temType) {
      console.log(type, 'pppp')
      if (temType !== 'video' && temType !== 'link') {
        const obj = {
          type,
          isCreated: false,
          content: ''
        }
        if (type === 'text') {
          obj.content = this.info.content
        }
        if (type === 'link') {
          obj.content = this.info.content
          obj.src = this.info.src
        }
        this.$emit('change-add-desc', obj)
      }
    },

    // 删除
    delTem () {
      this.$emit('del-desc-tem', this.index)
    },

    moveTem (type, index) {
      console.log(type, index, 'ppppp')
      this.$emit('move-tem', type, index)
    }
  }
})


// 添加组件
Vue.component('add-tem', {
  template: '#addTem',
  props: ['curTemIndex', 'index'],
  data () {
    return {
      showList: false
    }
  },
  methods: {
    addTem (type) {
      const obj = {
        type,
        isCreated: true,
        content: ''
      }
      this.$emit('change-add', obj)
    }
  }
})


// 标题
Vue.component('add-title', {
  template: '#addTitle',
  props: {
    isSetTitle: Boolean,
    adTitle: String
  },
  data () {
    return {
      title: ''
    }
  },
  computed: {
    isSetTitleMd: {
      get () {
        if (this.isSetTitle && this.adTitle) {
          this.title = this.adTitle
        }
        return this.isSetTitle
      },
      set (val) {
        this.$emit('update:isSetTitle', val)
      }
    }
  },
  methods: {
    confirmBtn () {
      // console.log(this.title, 'opopopop')
      this.$emit('change-title', this.title)
      this.isSetTitleMd = false
    }
  }
})



// 文案
Vue.component('add-text', {
  template: '#addText',
  props: {
    isSetText: Boolean,
    curAdText: String
  },
  data () {
    return {
      // text: '',
      // 编辑器
      content: '',
    }
  },
  computed: {
    isSetTextMd: {
      get () {
        console.log(this.curAdText, 'olololoolo')
        if (this.isSetText && this.curAdText) {
          this.content = this.curAdText
        }
        return this.isSetText
      },
      set (val) {
        this.$emit('update:isSetText', val)
        this.text = ''
      }
    }
  },
  methods: {
    updateData (data) {
      console.log(data)
      this.content = data
    },
    confirmBtn () {
      console.log(this.content, 'this.content')
      this.$emit('change-text', this.content)
      this.isSetTextMd = false
    }
  }
})


// 链接
Vue.component('add-link', {
  template: '#addLink',
  props: {
    isSetLink: Boolean,
    curLinkUrl: String,
    curLinkText: String
  },
  data () {
    return {
      linkUrl: '',
      linkText: ''
    }
  },
  computed: {
    isSetLinkMd: {
      get () {
        console.log(this.isSetLink, this.curLinkUrl, this.curLinkText, 'olololoolo')
        if (this.isSetLink && this.curLinkUrl && this.curLinkText) {
          this.linkUrl = this.curLinkUrl
          this.linkText = this.curLinkText
        }
        return this.isSetLink
      },
      set (val) {
        this.$emit('update:isSetLink', val)
        this.linkUrl = ''
        this.linkText = ''
      }
    }
  },
  methods: {
    confirmBtn () {
      console.log(this.linkUrl, this.linkText)
      this.$emit('change-link', { url: this.linkUrl, text: this.linkText })
      this.isSetLinkMd = false
    }
  }
})



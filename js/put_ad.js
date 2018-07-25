Vue.use(VueHtml5Editor, {
  language: "zh-cn",
  hiddenModules: [
    "image",
    "info",
    "tabulation",
    "full-screen"
  ]
})

new Vue({
  el: '#app',
  data: {
    hiddenInput: null,
    curHidInpInfo: null,

    curLoadType: 'text',

    curTemIndex: -1,

    qiniuBaseUrl: 'http://p9f83pjwn.bkt.clouddn.com/',

    // 广告标题
    isSetTitle: false,
    adTitle: '',
    cover: '',

    // 文案
    isSetText: false,
    curAdText: '',
    createTem: '',

    // 链接
    isSetLink: false,
    curLinkUrl: '',
    curLinkText: '',

    infoList: []
  },

  methods: {

    // 更换图片
    editCover () {
      this.hiddenInput.click()
      this.curLoadType = 'img'
      this.curTemIndex = -2
    },

    // 添加详细内容的类型
    addDescType ({ type, isCreated, content, src }) {
      console.log('类型 ==>', type, isCreated, content, src)
      this.curLoadType = type
      this.curAdText = content
      this.createTem = isCreated

      switch (type) {
        case 'text':
          this.isSetText = true
          break
        case 'img':
        case 'video':
          this.hiddenInput.click()
          break
        case 'link':
          this.isSetLink = true
          this.curLinkUrl = src
          this.curLinkText = content
          break
        default:
          break;
      }

    },

    // 上传至七牛
    uploadQiniu (file) {
      axios.post('http://api.bvcio.com/api/admin/get_qn_token', {
        api_token: '9mfKjmgpS8dkrwz5XV2IycEBtiGYEwgeAJm51xJiKnKqTpOQodMHdBV2Ybzc'
      })
        .then(res => {
          const token = res.data.data
          const params = new FormData()
          params.append('token', token)
          params.append('file', file)

          axios.post('https://upload-z1.qiniup.com', params)
            .then(data => {
              const url = this.qiniuBaseUrl + data.data.key
              console.log('上传七牛返回结果', url)
              const i = this.curTemIndex
              // 清空 上传input的值 否则不能重复上传 
              this.hiddenInput.value = ''
              if (i === -2) {
                // 封面图
                this.cover = url
              } else {
                // 详情图
                this.creatTem(url)
              }
            })
        })
    },

    // 创建 编辑 文字 模板
    addTextInfo (text) {
      const i = this.curTemIndex
      const createTem = this.createTem
      console.log(text, i, 'iiiiiiiiiiii')
      if (!createTem) {
        this.infoList[i].content = text
      } else {
        if (i === -1) {
          this.infoList.unshift({ type: 'text', content: text, src: '' })
        } else {
          this.infoList.splice(i + 1, 0, { type: 'text', content: text, src: '' })
        }
      }

      console.log(this.infoList)
    },

    // 创建图片 视频 模板
    creatTem (url) {
      const i = this.curTemIndex
      const type = this.curLoadType
      const createTem = this.createTem
      if (createTem) {
        if (type === 'img') {
          this.infoList.splice(i + 1, 0, { type, content: '', src: url })
        }
        if (type === 'video') {
          this.infoList.splice(i + 1, 0, { type, content: '', src: url, poster: url + '?vframe/jpg/offset/0' })
        }
      } else {
        this.infoList[i].src = url
      }
    },

    // 创建 链接模板
    addLinkTem ({ url, text }) {
      console.log(url, text, 'infoinfoinfofniof')
      const i = this.curTemIndex
      const createTem = this.createTem
      if (!createTem) {
        this.infoList[i].content = text
        this.infoList[i].src = url
      } else {
        if (i === -1) {
          this.infoList.unshift({ type: 'link', content: text, src: url })
        } else {
          this.infoList.splice(i + 1, 0, { type: 'link', content: text, src: url })
        }
      }
    },


    // 删除模板
    delDescTem (i) {
      this.infoList.splice(i, 1)
    },

    // 移动
    moveTem (type, i) {
      const moveTem = this.infoList[i]
      console.log(moveTem)
      if (type === 'up') {
        console.log(i, moveTem)
        this.infoList.splice(i, 1)
        this.infoList.splice(i - 1, 0, moveTem)

      } else {
        this.infoList.splice(i + 2, 0, moveTem)
        this.infoList.splice(i, 1)
      }
    },

    // 下一步
    nextBtn () {
      let obj = {
        title: this.adTitle,
        cover: this.cover,
        list: this.infoList
      }
      window.localStorage.setItem('curAd', JSON.stringify(obj))
      console.log(obj)
      window.location.href = './view.html'
    }
  },
  created () {
    const info = JSON.parse(window.localStorage.getItem('curAd'))
    this.adTitle = info.title
    this.cover = info.cover
    this.infoList = info.list
  },
  mounted () {
    // layer.msg('222', { time: 5000 });
    this.hiddenInput = this.$refs.hiddenInput

    this.hiddenInput.onchange = () => {
      console.log(222)
      const file = this.hiddenInput.files[0]
      const type = this.curLoadType
      this.curHidInpInfo = file
      console.log('触发', type, file)

      if (type === 'img' && !/\/(jpg|jpeg|png|JPG|PNG)$/.test(file.type)) {
        console.log('图片类型必须是.jpeg,jpg,png中的一种')
        return false
      }

      if (type === 'video' && !/\/(mp4|avi|dat|mpg|mpeg|vob|mkv|mov|wmv|asf|rm|rmvb|ram|flv|3gp|dv|qt|divx|cpk|fli|flc|m4v)$/.test(file.type)) {
        console.log('视频类型必须是.mp4,avi,dat,mpg,mpeg,vob,mkv,mov,wmv,asf,rm,rmvb,ram,flv,3gp,dv,qt,divx,cpk,fli,flc,m4v中的一种')
        return false
      }
      console.log(1111)
      if (file) {
        this.uploadQiniu(file)
      }
    }
   
  }
})
import weCropper from '../../dist/weCropper.js'
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const resolution = 256

Page({
  data: {
  	cropperOpt: {
			id: 'cropper',
			//width: device.windowWidth,
			//height: device.windowWidth,
      width,
      height,
			scale: 5.0, //original: 2.5
			zoom: 8, //original: 8
      cut: {
        x: (width - resolution) / 2,
        y: (height - resolution) / 2,
        width: resolution,
        height: resolution
      }
		}
	},
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((src) => {
      getApp().globalData.editedImgSrc = src
      /*wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [src] // 需要预览的图片http链接列表
      })*/
      wx.navigateTo({
        url: '../preview/preview'
      })
    })
  },
  uploadTap () {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
      }
    })
  },
  gobackTap() {
    wx.navigateBack({})
  },
  onLoad (option) {
    const { cropperOpt } = this.data

		new weCropper(cropperOpt)
			.on('ready', function (ctx) {
				//console.log(`wecropper is ready for work!`)
			})
			.on('beforeImageLoad', (ctx) => {
				//console.log(`before picture loaded, i can do something`)
				//console.log(`current canvas context:`, ctx)
				wx.showToast({
					title: '上传中',
					icon: 'loading',
					duration: 20000
				})
			})
			.on('imageLoad', (ctx) => {
				//console.log(`picture loaded`)
				//console.log(`current canvas context:`, ctx)
				wx.hideToast()
			})
      .on('beforeDraw', (ctx, instance) => {
        //console.log(`before canvas draw,i can do something`)
        //console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    this.wecropper.pushOrign(getApp().globalData.selectedImgSrc)
  }
})

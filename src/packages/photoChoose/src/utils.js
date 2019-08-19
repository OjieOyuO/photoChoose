// 读取图片EXIF信息
function getImgExif (file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      reader.onload = function (e) {
        var view = new DataView(this.result)
        if (view.getUint16(0, false) !== 0xFFD8) resolve(-2)
        var length = view.byteLength
        var offset = 2
        while (offset < length) {
          var marker = view.getUint16(offset, false)
          offset += 2
          if (marker === 0xFFE1) {
            if (view.getUint32(offset += 2, false) !== 0x45786966) resolve(-1)
            var little = view.getUint16(offset += 6, false) === 0x4949
            offset += view.getUint32(offset + 4, little)
            var tags = view.getUint16(offset, little)
            offset += 2
            for (var i = 0; i < tags; i++) {
              if (view.getUint16(offset + (i * 12), little) === 0x0112) { resolve(view.getUint16(offset + (i * 12) + 8, little)) }
            }
          } else if ((marker & 0xFF00) !== 0xFF00) break
          else offset += view.getUint16(offset, false)
        }
        resolve(-1)
      }
      reader.readAsArrayBuffer(file)
    })
  }
  
  // 对图片旋转处理并返回base64
  function selectFileImage (file) {
    return new Promise((resolve, reject) => {
      // 图片方向角 added by lzk
      var Orientation = null
      if (file) {
        var rFilter = /^(image\/jpeg|image\/png|image\/jpg|image\/gif|image\/BMP)$/i // 检查图片格式
        if (!rFilter.test(file.type)) {
          console.log('图片格式不正确')
          return
        }
        // var URL = URL || webkitURL;
        // 获取照片方向角属性，用户旋转控制
        getImgExif(file).then(data => {
          Orientation = data
          var oReader = new FileReader()
          oReader.onload = function (e) {
            // var blob = URL.createObjectURL(file);
            // _compress(blob, file, basePath);
            var image = new Image()
            image.src = e.target.result
            image.onload = function () {
              var expectWidth = this.naturalWidth
              var expectHeight = this.naturalHeight
  
              if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                expectWidth = 800
                expectHeight = expectWidth * this.naturalHeight / this.naturalWidth
              } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                expectHeight = 1200
                expectWidth = expectHeight * this.naturalWidth / this.naturalHeight
              }
              let canvas = document.createElement('canvas')
              var ctx = canvas.getContext('2d')
              canvas.width = expectWidth
              canvas.height = expectHeight
              ctx.drawImage(this, 0, 0, expectWidth, expectHeight)
              var base64 = null
  
              // alert(expectWidth + ',' + expectHeight);
              // 如果方向角不为1，都需要进行旋转 added by lzk
              if (Orientation !== '' && Orientation !== 1) {
                switch (Orientation) {
                  case 6:// 需要顺时针（向左）90度旋转
                    // console.log('需要顺时针（向左）90度旋转')
                    rotateImg(this, 'left', canvas, 1)
                    break
                  case 8:// 需要逆时针（向右）90度旋转
                    // console.log('需要顺时针（向右）90度旋转')
                    rotateImg(this, 'right', canvas, 1)
                    break
                  case 3:// 需要180度旋转
                    // console.log('需要180度旋转')
                    rotateImg(this, 'right', canvas, 2)// 转两次
                    break
                }
                base64 = canvas.toDataURL('image/jpeg', 1)
              }
              // uploadImage(base64);
              resolve(base64)
            }
          }
          oReader.readAsDataURL(file)
        })
      }
    })
  }
  
  // 对图片旋转处理 added by lzk
  function rotateImg (img, direction, canvas, num) {
    // alert(img);
    // 最小与最大旋转方向，图片旋转4次后回到原方向
    var minStep = 0
    var maxStep = 4
    // var img = document.getElementById(pid);
    if (img == null) return
    // img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height
    var width = img.width
    // var step = img.getAttribute('step');
    var step = 2
    if (step == null) {
      step = minStep
    }
    if (direction === 'right') {
      step += num
      // 旋转到原位置，即超过最大值
      step > maxStep && (step = minStep)
    } else {
      step--
      step < minStep && (step = maxStep)
    }
  
    // 旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180
    var ctx = canvas.getContext('2d')
    switch (step) {
      case 0:
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0)
        break
      case 1:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, 0, -height)
        break
      case 2:
        canvas.width = width
        canvas.height = height
        ctx.rotate(degree)
        ctx.drawImage(img, -width, -height)
        break
      case 3:
        canvas.width = height
        canvas.height = width
        ctx.rotate(degree)
        ctx.drawImage(img, -width, 0)
        break
      case 4:
        canvas.width = width
        canvas.height = height
        ctx.rotate(degree + Math.PI)
        ctx.drawImage(img, -width, -height)
        break
    }
  }
  
  // base64转成file文件
  function base64ToFile (base, name, type) {
    let arr = base.split(',')
    let mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }
  

  export {selectFileImage, getImgExif, base64ToFile}
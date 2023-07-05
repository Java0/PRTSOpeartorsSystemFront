//压缩方法
export function dealImage(name, base64, w, callback) {
  var newImage = new Image();
  var quality = 0.5;    //压缩系数0-1之间，值越小，压缩力度越大，则越不清晰
  newImage.src = base64;
  newImage.setAttribute("crossOrigin", 'Anonymous'); //url为外域时需要
  var imgWidth, imgHeight;
  newImage.onload = function () {
    imgWidth = this.width;
    imgHeight = this.height;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if (Math.max(imgWidth, imgHeight) > w) {
      if (imgWidth > imgHeight) {
        canvas.width = w;
        canvas.height = w * imgHeight / imgWidth;
      } else {
        canvas.height = w;
        canvas.width = w * imgWidth / imgHeight;
      }
    } else {
      canvas.width = imgWidth;
      canvas.height = imgHeight;
      quality = 0.5;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    var base64 = canvas.toDataURL("image/png", quality); //压缩语句  jpg 相对jpeg清晰
    let obj = {
      name: name,
      value: base64
    }
    callback(obj);//必须通过回调函数返回，否则无法及时拿到该值
  }
}
//多个base64  进行循环，单个则不需要
let list = {
  fileNum: '',
  fileSize: '',
  fileLine: ''
}
for (let i in list) {
  dealImage(i, list[i], 500, useImg)
}
let p = {
  fileNum: '',
  fileSize: '',
  fileLine: ''
}
function useImg(o) {
  for (let i in p) {
    if (i === o.name) {
      p[i] = o.value
    }
  }
}
// setTimeout(() => {
//   console.log(p)
// })

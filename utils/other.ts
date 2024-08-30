// @ts-ignore
import {weAtob} from "./weapp-jwt";
import {RSAKey} from "./rsa";
import { apiGetPublicKey } from "./services/api/getPublicKey.api";

export function copyText(v: string) {
  uni.setClipboardData({
    data: v,
    showToast: true,
  })
}
export function parseScene(queryScene: string) {
  let result: {[key in string]: any} = {}
  try {
    const scene = decodeURIComponent(queryScene)
    const rows = scene.split('&')
    rows.forEach(row => {
      let temp = row.split('=')
      result[temp[0]] = temp[1]
    })
  }catch(e) {}
  return result
}

export function dataURItoBlob(dataURI: string) {
  let byteString = weAtob(dataURI.split(',')[1]);
  let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}


// uni request 不支持树结构表单转换 手动转换
export function object2FormData(object: AnyObject): string {
  // jquery 处理表单方式
  return jQueryParam(object)
}


function jQueryParam( a: any, traditional=undefined ) {
  let prefix: string,
      s: string[] = [],
      add = function (key:string, value: any) {
        value = value == null ? "" : value;
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
      };
  if ( Array.isArray( a )) {
    a.forEach(i => add(i.name, i.value))
  } else {
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( /%20/g, "+" );

  function buildParams(
      prefix: string,
      obj: any,
      traditional: undefined,
      add: (key: string, value: any) => void
  ) {
    let name: string;

    if ( Array.isArray( obj ) ) {
      // Serialize array item.
      obj.forEach((v, i)=> {
        if ( traditional || /\[\]$/.test( prefix ) ) {
          // Treat each array item as a scalar.
          add( prefix, v );

        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
        }
      })

    } else if ( !traditional && obj instanceof Object ) {
      // Serialize object item.
      for ( name in obj ) {
        buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
      }

    } else {
      // Serialize scalar item.
      add( prefix, obj );
    }
  }
}


export async function encryptEcpPassword (pwd: string) {
  let publicKey = uni.getStorageSync('publicKeyECPLogin');
  if (!publicKey) {
    const e = await apiGetPublicKey()
    publicKey = e.data.publicKey;
    uni.setStorageSync('publicKeyECPLogin', publicKey)
  }
  const rsa = new RSAKey()
  rsa.setPublic(publicKey, '10001')
  const res = rsa.encrypt(pwd)
  return res || pwd
}
// 下载图片 授权
export function handleDownload(url: string) {
  const type = 'img';
  uni.getSetting({
    success(res) {
      if(!res.authSetting['scope.writePhotosAlbum']) {
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            savaToLocal(url,type)
          },
          fail() {
            uni.showToast({
              title: '授权失败',
              duration: 2000
            });
          }
        })
      }
      else {
        savaToLocal(url,type)
      }
    }
  })
}
// 下载图片保存
function savaToLocal(url: string,type: 'img' | 'video') {
  uni.downloadFile({
    url: url,
    success: (res) => {
      if (res.statusCode === 200) {
        if(type == 'img') {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              uni.showToast({
                title: '保存成功',
                duration: 2000
              });
            },
            fail: function(err) {
              console.log('fail============',err);
              uni.showToast({
                title: '保存失败',
                duration: 2000
              });
            }
          });
        }
        else {
          uni.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function () {
              uni.showToast({
                title: '保存成功',
                duration: 2000
              });
            },
            fail: function(err) {
              console.log('fail============',err);
              uni.showToast({
                title: '保存失败',
                duration: 2000
              });
            }
          });
        }
      }
    },
    fail(err) {
      console.log('fail==========',err);
      uni.showToast({
        title: '保存失败',
        duration: 2000
      });
    }
  });
}
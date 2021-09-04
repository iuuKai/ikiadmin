import _Base64 from 'crypto-js/enc-base64'
import _encUTF8 from 'crypto-js/enc-utf8'
import _MD5 from 'crypto-js/md5'

export class Base64 {
  // 编码
  static enc (content) {
    return _Base64.stringify(_encUTF8.parse(content))
  }

  // 解码
  static dec (content) {
    return _Base64.parse(content).toString(_encUTF8)
  }
}

export class MD5 {
  static enc (content) {
    return _MD5(content).toString()
  }
}

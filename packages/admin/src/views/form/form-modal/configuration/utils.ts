import { ValidateErrors } from '@idux/cdk/forms'
/* eslint-disable no-useless-escape */
const ADDRESS_REG = /^(https|http):\/\/+[-A-Za-z0-9+&@#/%?=~_|!:,.;]+\.git$/

// url校验
const HTTP_PREFIX = /(http|https):\/\//
export function addressUrl(value: string): ValidateErrors | undefined {
  if (!HTTP_PREFIX.test(value)) {
    return {
      httpPrefix: {
        message: '请以http://或https://开头',
      },
    }
  } else if (!ADDRESS_REG.test(value)) {
    return {
      httpUrl: {
        message: '请输入有效的url',
      },
    }
  }
}

// 端口校验
const PORT_REG = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
export function port(value: string): ValidateErrors | undefined {
  if (!PORT_REG.test(value)) {
    return {
      port: {
        message: '端口格式不正确',
      },
    }
  }
}

// 中文校验
const ZH_REG = /^[\u4e00-\u9fa5]+$/
export function notZh(value: string): ValidateErrors | undefined {
  if (ZH_REG.test(value)) {
    return {
      notZh: {
        message: '不允许输入中文',
      },
    }
  }
}

// 分支校验
const SLASH_REG = /[\/]{2,}/
const DOT_REG = /[\.]{2,}/
export function checkBranch(value: string): ValidateErrors | undefined {
  if (value.startsWith('/') || value.endsWith('/') || SLASH_REG.test(value)) {
    return {
      slash: {
        message: '不能以 / 开始或结束，不能包含多个连续的 /',
      },
    }
  } else if (value.startsWith('.') || value.endsWith('.') || DOT_REG.test(value)) {
    return {
      dot: {
        message: '不能以点开头或结尾且不能有连续的点',
      },
    }
  }
}

const matchFn = function (match: string): string {
  if (match === '\\\\') {
    // 如果正则禁止掉的是\，要提示用户\，这里去掉转义符
    return '\\'
  }
  if (match === '\\/') {
    // 如果正则禁止掉的是/，要提示用户/，这里去掉转义符
    return '/'
  }
  return '' // 其他匹配上的转义符直接替换为空串
}

// xss校验
// 用于动态将 正在表达式转为字符串 提醒用户（常作用于提醒非法字符）
const ILLEGAL_FORMAT = /^(\/\^?\[?\^?)|(\\\\)|(\\\/)|(\]?\*?\$?\/)$/g
const ILLEGAL_CHARACTER = /^[^`~!#$%^&*+\\|{};:"',/<>?]*$/
const ILLEGAL_CHARACTER_TEXT = ILLEGAL_CHARACTER.toString().replace(ILLEGAL_FORMAT, matchFn)
export function checkXss(value: string): ValidateErrors | undefined {
  if (!ILLEGAL_CHARACTER.test(value)) {
    return {
      xss: {
        message: `不能输入${ILLEGAL_CHARACTER_TEXT}等特殊字符`,
      },
    }
  }
}

const spaceReg = /\s/
export function checkSpace(value: string): ValidateErrors | undefined {
  if (spaceReg.test(value)) {
    return {
      space: {
        message: '不能输入空格',
      },
    }
  }
}

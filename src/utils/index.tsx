import { message } from 'antd'
import enUS from 'antd/es/locale/en_US'
import koKR from 'antd/es/locale/ko_KR'
import zhCN from 'antd/es/locale/zh_CN'
import { AxiosError } from 'axios'
import i18n, { TFunctionResult } from 'i18next'
import _get from 'lodash/get'
import React from 'react'
import { JsonObject } from '@/type'

export interface BaseJson {
  key: React.Key
  name?: React.Key
}

export const DEFAULT_PLACEMENT: React.ReactNode = '--'
export function disableOsDefault(e: React.MouseEvent<any> | KeyboardEvent) {
  if (e) {
    e.stopPropagation()
    e.preventDefault()
  }
}

export const isMobile = () => {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone|MiuiBrowser)/i,
  )
  return flag
}

export const routeIsAccess = (path: string, auth: any) => {
  for (let i = 0; i < auth.length; i++) {
    if (auth[i].page_path === path) return auth[i].can_access
  }
  return false
}

export const getHrefParam = (): JsonObject => {
  const location = decodeURIComponent(window.location.href)
  if (location.indexOf('?') < 0) {
    return {}
  }
  const paramStr = location.split('?')[1]
  const res: JsonObject = {}
  if (paramStr) {
    paramStr.split('&').forEach((item) => {
      const [key, value] = item.split('=')
      res[key] = value
    })
  }
  return res
}

export type FunctionVariadic = (...args: any[]) => any

export interface FormMoneyOptions {
  needSeparate: boolean // 是否开启千分位, 默认开启
  separator: string // 分割符，默认空格
  exportUnit: 'CN_FEN' | 'CN_JIAO' | 'CN_YUAN' // 输出数的单位，默认元
  exact: number // 保留小数位，默认2
}

/**
 * 金额格式化工具方法
 * @param money 金额
 * @param inputUnit 输入的单位
 * @param options 配置项，详见FormMoneyOptions
 * @returns 格式化后的金额 <string>
 */
export const formMoney = (
  money: number,
  inputUnit: 'CN_FEN' | 'CN_JIAO' | 'CN_YUAN',
  options: FormMoneyOptions = {
    needSeparate: true,
    separator: ' ',
    exportUnit: 'CN_YUAN',
    exact: 2,
  },
): string => {
  const divisorMap = {
    CN_FEN: {
      CN_FEN: 1,
      CN_JIAO: 10,
      CN_YUAN: 100,
    },
    CN_JIAO: {
      CN_FEN: 1 / 10,
      CN_JIAO: 1,
      CN_YUAN: 10,
    },
    CN_YUAN: {
      CN_FEN: 1 / 100,
      CN_JIAO: 1 / 10,
      CN_YUAN: 1,
    },
  }
  const divisor = divisorMap[inputUnit][options.exportUnit]
  const result = (money / divisor).toFixed(options.exact)
  if (options.needSeparate) {
    return String(result).replace(
      /(\d)(?=(\d{3})+\b)/g,
      `$1${options.separator}`,
    )
  }
  return String(result)
}

interface ChangeMessageProps {
  message: string | React.ReactNode | TFunctionResult
}

/**
 * message过长时，展开和收起
 * @param {ChangeMessageProps} props
 * @returns {any}
 * @constructor
 */
export function ChangeMessage(props: ChangeMessageProps) {
  const [showAll, setShowAll] = React.useState(false)
  const { message: propMessage = '' } = props
  let needCut = false
  if (typeof message === 'string') {
    needCut = (propMessage as string).length > 70
  }

  return typeof propMessage === 'string' ? (
    <span>
      {needCut ? (
        showAll ? (
          <span>
            {`${propMessage} `}
            <a onClick={() => setShowAll(false)} title={i18n.t('Collapse')}>
              {String(i18n.t('Collapse'))}
            </a>
          </span>
        ) : (
          <span>
            {`${propMessage.slice(0, 70)}... `}
            <a onClick={() => setShowAll(true)} title={i18n.t('Show all')}>
              {String(i18n.t('Show all'))}
            </a>
          </span>
        )
      ) : (
        <span>{propMessage}</span>
      )}
    </span>
  ) : (
    <>{propMessage}</>
  )
}

export function defaultGetErrorMsg(
  error: AxiosError,
): string | React.ReactNode | TFunctionResult {
  const err: any = error
  let detail = false
  if (err.stackTrace) {
    // 丰富错误显示
    detail = true
  }
  let code = (_get(error, 'response.data.code') || error.code || '').toString()
  code = code.toLowerCase()
  const backendDefinedMsg = _get(error, 'response.data.msg')
    || _get(error, 'response.data.errorMessage', '')
    || _get(error, 'response.data.message', '')
  const msg = _get(error, 'message')
  const status = _get(error, 'response.status')
  let errMsg: string | React.ReactNode | TFunctionResult = ''
  if (status === 401) {
    errMsg = i18n.t('Token expired')
  } else if (status === 403) {
    errMsg = i18n.t('Permission denied')
  } else if (status === 404) {
    errMsg = i18n.t('Api service not available', { service: err.config.url })
  } else if (status === 504 || status === 503) {
    errMsg = i18n.t('Server is down')
  } else if (code === 'econnaborted' && msg.indexOf('timeout') !== -1) {
    errMsg = i18n.t('Request timeout')
  }
  if (!errMsg) {
    errMsg = backendDefinedMsg || msg || i18n.t('Api error not defined')
  }
  if (detail) {
    errMsg = (
      <span>
        <>
          {errMsg}
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {String(i18n.t('Show detail'))}
          </span>
        </>
      </span>
    )
  }
  return errMsg
}

export function showError(
  s: string | React.ReactNode | TFunctionResult,
  duration = 4,
  toBottom = 70,
) {
  message.destroy()
  message.config({
    top: window.innerHeight - toBottom,
    duration,
  })
  console.error(s)
  message.error(<ChangeMessage message={s} />)
}

export function showMessage(
  s: string | React.ReactNode,
  duration = 2,
  toBottom = 70,
) {
  message.destroy()
  message.config({
    top: window.innerHeight - toBottom,
    duration,
  })
  message.success(<ChangeMessage message={s} />)
}

export function showInfo(
  s: string | React.ReactNode,
  duration = 2,
  toBottom = 70,
) {
  message.config({
    top: window.innerHeight - toBottom,
    duration,
  })
  message.info(<ChangeMessage message={s} />)
}

export const languageMap = {
  zh: {
    name: '简体中文',
    antd: zhCN,
  },
  en: {
    name: 'English',
    antd: enUS,
  },
  kr: {
    name: '한국어',
    antd: koKR,
  },
}

export const deepClone = (obj: any) => new Promise((resolve) => {
  const { port1, port2 } = new MessageChannel()
  port2.onmessage = (v) => resolve(v.data)
  port1.postMessage(obj)
})

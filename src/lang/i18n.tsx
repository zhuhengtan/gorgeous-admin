import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enUsTrans from './en-us.json'
import zhCnTrans from './zh-cn.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
  type TFunctionResult = string
}

i18n
  .use(LanguageDetector) // 嗅探当前浏览器语言
  .use(initReactI18next) // init i18next
  .init({
    // 引入资源文件
    resources: {
      en: {
        translation: enUsTrans,
      },
      zh: {
        translation: zhCnTrans,
      },
    },
    // 选择默认语言，选择内容为上述配置中的key，即en/zh
    fallbackLng: 'zh',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    returnNull: false,
  })

export default i18n

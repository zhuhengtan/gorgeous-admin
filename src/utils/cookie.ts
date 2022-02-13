import cookie from 'react-cookies'

export const getCookie = (key: string): string | number => cookie.load(key)

export const setCookie = (key: string, value: string | number): any => {
  cookie.save(key, value, { path: '/' })
}

export const deleteCookie = (key: string): void => cookie.remove(key)

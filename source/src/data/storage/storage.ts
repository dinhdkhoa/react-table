import KEY_STORAGE from './consts/storage.const'

const get = <T>(key: string): T | undefined => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  }
}
const set = <T>(key: string, data: T): void => {
  localStorage.removeItem(key)
  localStorage.setItem(key, JSON.stringify(data))
}

const deleteKeyFromLS = (key: string): void => {
  localStorage.removeItem(key)
}

export const LocalStorageEventTarget = new EventTarget()

const clearAuthDataFromLS = (): void => {
  deleteKeyFromLS(KEY_STORAGE.ACCESS_TOKEN)
  deleteKeyFromLS(KEY_STORAGE.USER_ACCOUNT)
  const clearLSEvent = new Event('clearAuthDataFromLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

const getAccessToken = () => {
  return get<string>(KEY_STORAGE.ACCESS_TOKEN)
}

const saveAccessToken = (token: string) => {
  set<string>(KEY_STORAGE.ACCESS_TOKEN, token)
}

//TODO : Update saveUser, getUser generics when model is available

const saveUser = (user: any) => {
  set<any>(KEY_STORAGE.USER_ACCOUNT, user)
}

const getUser = () => {
  return get<any>(KEY_STORAGE.USER_ACCOUNT)
}

const saveLanguage = (language: any) => {
  set<any>(KEY_STORAGE.LANGUAGE, language)
}

const getLanguage = () => {
  return get<any>(KEY_STORAGE.LANGUAGE)
}

const storageService = {
  get,
  set,
  deleteKeyFromLS,
  clearAuthDataFromLS,
  saveAccessToken,
  getAccessToken,
  saveUser,
  getUser,
  saveLanguage,
  getLanguage
}
export default storageService

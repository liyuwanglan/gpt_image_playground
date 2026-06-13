import { useState, useEffect } from 'react'

const STORAGE_KEY = 'gpt-image-playground.auth-key'

let currentKey: string = (() => {
  try { return localStorage.getItem(STORAGE_KEY) ?? '' } catch { return '' }
})()

const listeners = new Set<(key: string) => void>()

function notifyListeners(key: string) {
  currentKey = key
  listeners.forEach((fn) => fn(key))
}

export function useAuthKey(): string {
  const [key, setKey] = useState(currentKey)
  useEffect(() => {
    setKey(currentKey)
    listeners.add(setKey)
    return () => { listeners.delete(setKey) }
  }, [])
  return key
}

export function loginAuth(key: string, remember: boolean): void {
  if (remember) {
    try { localStorage.setItem(STORAGE_KEY, key) } catch {}
  }
  notifyListeners(key)
}

export function logoutAuth(): void {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
  notifyListeners('')
}

export function maskApiKey(key: string): string {
  if (key.length <= 10) return key
  return `${key.slice(0, 6)}...${key.slice(-4)}`
}

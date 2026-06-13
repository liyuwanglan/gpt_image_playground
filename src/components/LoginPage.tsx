import { useState } from 'react'
import { loginAuth } from '../lib/auth'
import '../styles/axiom-login.css'

interface LoginPageProps {
  onLogin: (key: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [apiKey, setApiKey] = useState('')
  const [remember, setRemember] = useState(true)
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState('')
  const [errorShake, setErrorShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = apiKey.trim()
    if (!trimmed) {
      setError('请输入 API Key')
      setErrorShake(true)
      setTimeout(() => setErrorShake(false), 400)
      return
    }
    loginAuth(trimmed, remember)
    onLogin(trimmed)
  }

  const fieldClass = [
    'ax-field ax-field--pwd',
    error ? 'ax-has-error' : '',
    errorShake ? 'ax-is-error' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="axiom-login-page" data-lang="zh">
      {/* Corner registration marks */}
      <div className="ax-cm ax-cm-tl" />
      <div className="ax-cm ax-cm-tr" />
      <div className="ax-cm ax-cm-bl" />
      <div className="ax-cm ax-cm-br" />

      {/* ── Left: editorial plate ── */}
      <aside className="ax-plate">
        <div className="ax-plate-binding" />

        <header className="ax-plate__head">
          <span className="ax-plate__brand">
            <span className="ax-plate__brand-mark" aria-hidden="true" />
            <span>GPT Image</span>
          </span>
          <span className="ax-plate__meta">Vol.&thinsp;I · Issue 01</span>
        </header>
        <div className="ax-plate__rule" />

        <div className="ax-plate__body">
          <div className="ax-plate__inner">
            <div>
              <p className="ax-plate__sec-label">§ The Tool</p>
              <h1 className="ax-plate__hero">
                一把钥匙，<br />
                开启所有值得 <span className="ax-plate__hero-mark">生成的图像</span>
              </h1>
              <p className="ax-plate__sub">
                基于 OpenAI <strong>gpt-image-2</strong> 的图片生成与编辑工具。支持文本生图、参考图与遮罩编辑，<em>数据纯本地化存储</em>。
              </p>
            </div>
          </div>
        </div>

        <footer className="ax-plate__foot">
          <span>
            <span className="ax-s-key">模型</span>
            <span className="ax-s-dot" />
            <span className="ax-s-val">gpt-image-2</span>
          </span>
          <span>
            <span className="ax-s-key">存储</span>
            <span className="ax-s-val">本地</span>
          </span>
          <span className="ax-plate__foot-spacer" />
          <span>
            <span className="ax-s-key">版本</span>
            <span className="ax-s-val">v0.6.4</span>
          </span>
        </footer>
      </aside>

      {/* ── Right: login form ── */}
      <main className="ax-form-wrap">
        <div className="ax-form-card-wrap">
          <div className="ax-form-card">
            <p className="ax-form__eyebrow">§ 登录</p>
            <h2 className="ax-form__title">
              欢迎<em>回来</em>。
            </h2>
            <p className="ax-form__lede">输入你的凭证，进入工作台。</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* API Key field */}
              <div className={fieldClass}>
                <label className="ax-field__label" htmlFor="ax-apikey">
                  <span className="ax-field__num" data-num="01">
                    <span>API Key</span>
                  </span>
                </label>
                <input
                  className="ax-field__input"
                  id="ax-apikey"
                  name="apikey"
                  type={showKey ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                    setError('')
                  }}
                  autoFocus
                  required
                />
                <button
                  type="button"
                  className="ax-field__pwd-toggle"
                  onClick={() => setShowKey((v) => !v)}
                  tabIndex={-1}
                  aria-label="Toggle key visibility"
                >
                  {showKey ? '隐藏' : '显示'}
                </button>
                <span className="ax-field__underline" />
                {error && <span className="ax-field__sublabel">{error}</span>}
              </div>

              {/* Remember checkbox */}
              <div className="ax-options-row">
                <label className="ax-checkbox">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="ax-checkbox__box" />
                  <span>保持登录状态</span>
                </label>
              </div>

              {/* Submit */}
              <button className="ax-submit-btn" type="submit">
                <span className="ax-corner ax-tl" aria-hidden="true" />
                <span className="ax-corner ax-br" aria-hidden="true" />
                <span className="ax-submit-btn__ornament" aria-hidden="true" />
                <span>登录工作台</span>
                <svg width="24" height="10" viewBox="0 0 24 10" fill="none" aria-hidden="true">
                  <line x1="0.5" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
                  <polyline points="16,1.4 20.2,5 16,8.6" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Trust strip */}
        <div className="ax-trust-strip">
          <div className="ax-trust-strip__item">
            <span className="ax-trust-strip__sym">§</span>
            <span>数据本地存储</span>
          </div>
          <div className="ax-trust-strip__item">
            <span className="ax-trust-strip__sym">¶</span>
            <span>无服务器中转</span>
          </div>
          <div className="ax-trust-strip__item">
            <span className="ax-trust-strip__sym">†</span>
            <span>隐私优先</span>
          </div>
        </div>

        {/* Colophon */}
        <div className="ax-colophon">
          <span className="ax-colophon__seal">GPT IMAGE PLAYGROUND</span>
          <span className="ax-colophon__center">Text-to-image · Edit · Variation</span>
          <span>MMXXV</span>
        </div>
      </main>
    </div>
  )
}

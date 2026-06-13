# GPT Image Playground — 定制进度记录

> 基于官方仓库 `gpt_image_playground` 的本地二次开发记录。
> 目标：最小化改动，方便随时 `git pull` 拉取上游更新。

---

## 一、已完成功能

### ✅ 1. 登录页（API Key 密码门）

- **新增文件** `src/lib/auth.ts`：自包含的认证状态管理，使用模块级 pub/sub + localStorage 持久化，无需修改 Zustand store
- **新增文件** `src/components/LoginPage.tsx`：全屏登录页组件
- **新增文件** `src/styles/axiom-login.css`：从 Axiom UI 源码提取的完整 CSS，包含字体、动画、布局
- **复制字体** `public/fonts/`（9 个 WOFF2 文件）：Geist、Geist Mono、Newsreader

**登录页功能：**
- 输入 API Key 作为"密码"，支持显示/隐藏切换
- "保持登录状态"勾选框，勾选则写入 localStorage
- 登录成功后自动填充到 Settings 的 active profile API Key
- 空值提交触发字段抖动动画 + 错误提示

**Axiom 风格还原（与 axiomcode.top 完全一致）：**
- 字体：Newsreader（展示/标题）、Geist（正文）、Geist Mono（等宽/标签）
- 布局：左右两栏 grid，`minmax(0, 0.72fr) minmax(0, 1fr)`
- 左侧：品牌标记 ◆（旋转方块）、红色 1px 分割线 + 菱形装饰、英雄文字 + 刷子笔触下划线动画
- 右侧：红色 eyebrow 线条、展示字体大标题（em 朱砂印章动画）、字段底部红线 sweep 动画、焦点时左侧菱形指示点、墨色提交按钮（hover 时红色 sweep）、trust strip（§ ¶ †）、colophon 收尾行
- 四角套准标记（印刷风格）
- 入场动画编排（ax-enter / ax-paper-soak / ax-verm-stamp 等）
- 响应式：≤880px 切换为单列，≤480px 收缩标题字号

---

### ✅ 2. 右上角已登录状态显示

**修改文件** `src/components/Header.tsx`：
- 显示已脱敏的 API Key（`sk-abc1...ef89` 格式）
- "退出"按钮点击后清除认证、返回登录页

---

### ✅ 3. API URL 改为下拉选择

**修改文件** `src/components/SettingsModal.tsx`：
- 仅当 `provider === 'openai'` 时显示预设下拉
- 四个预设地址：
  - `https://axiomcode.top/v1`（默认）
  - `https://api.axiomcode.top/v1`
  - `https://cn-api.axiomcode.top/v1`
  - `https://global.axiomcode.top/v1`
- 其他 provider 保持原始文本输入框不变

---

### ✅ 4. 登录状态注入到 Zustand store

**修改文件** `src/App.tsx`：
- `handleLogin` 函数在登录时将 API Key 同步写入当前 active profile 的 `apiKey` 字段
- 未登录时渲染 `<LoginPage />`，已登录时渲染主应用

---

## 二、关键文件清单

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/lib/auth.ts` | **新增** | 认证状态：pub/sub + localStorage |
| `src/components/LoginPage.tsx` | **新增** | Axiom 风格登录页 |
| `src/styles/axiom-login.css` | **新增** | 从 axiom-ui 提取的完整样式 |
| `public/fonts/*.woff2` (×9) | **新增** | Geist / Geist Mono / Newsreader |
| `src/App.tsx` | **修改** | 新增登录拦截 + handleLogin |
| `src/components/Header.tsx` | **修改** | 已登录状态展示 + 退出按钮 |
| `src/components/SettingsModal.tsx` | **修改** | API URL 改为预设下拉 |

---

## 三、手动修改记录

### 本次对话中用户手动调整（src/components/LoginPage.tsx）

| 行 | 修改内容 |
|----|---------|
| 62 | 英雄文字排版：去掉 `<br />` 换行，改为 `开启所有值得 <span class="ax-plate__hero-mark">生成的图像</span>`，三行缩减为两行 |
| 84 | footer 版本号：`v0.6` → `v0.6.4`（对齐当前实际版本） |

---

## 四、未完成 / 可优化项

| 优先级 | 任务 |
|--------|------|
| 低 | 左侧 plate 暂无插图（原版有 mascot.webp），可留空或用 SVG 占位 |
| 低 | 英语模式（`data-lang="en"`）的字体切换逻辑已写入 CSS，但组件固定为中文 |
| 低 | 若上游更新了 `App.tsx` / `Header.tsx` / `SettingsModal.tsx`，合并时注意三处改动点 |

---

## 五、如何拉取上游更新（最小冲突策略）

```bash
git fetch upstream
git merge upstream/main
```

**预期冲突文件（仅 3 个，改动量极小）：**
- `src/App.tsx`：保留 `useAuthKey` 导入、`authKey` 变量、`handleLogin` 函数、`if (!authKey) return <LoginPage .../>` 这四处
- `src/components/Header.tsx`：保留 auth 导入和 `{authKey && (...)}` 块
- `src/components/SettingsModal.tsx`：保留 `PRESET_API_URLS` 常量和 `Select` 条件渲染

**完全无冲突的新增文件：**
- `src/lib/auth.ts`
- `src/components/LoginPage.tsx`
- `src/styles/axiom-login.css`
- `public/fonts/*.woff2`

---

*最后更新：2026-06-13*

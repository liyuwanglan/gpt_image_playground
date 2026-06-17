# 部署文档 — GPT Image Playground

> **目标环境：** Ubuntu 20.04 + 宝塔面板（BT Panel）  
> **项目性质：** 纯前端静态网站（React + Vite），**无后端服务**，无需数据库  
> **数据存储：** 完全在用户浏览器本地（IndexedDB + localStorage），服务器只做静态文件托管

---

## 一、选择部署方式

| 方式 | 适合场景 | 难度 |
|------|---------|------|
| [方式 A：本地构建 + 上传](#方式-a本地构建--宝塔上传推荐) | 已有项目源码的电脑 | ⭐ 最简单 |
| [方式 B：服务器上直接构建](#方式-b服务器端构建宝塔终端) | 直接在服务器拉代码 | ⭐⭐ 中等 |

---

## 方式 A：本地构建 + 宝塔上传（推荐）

### 步骤 1 — 本地构建项目

在**本地电脑**的项目目录中执行：

```bash
# 安装依赖（如果还没安装过）
npm install

# 构建生产版本
npm run build
```

构建成功后会生成 `dist/` 文件夹，内容如下：
```
dist/
├── index.html
├── assets/          ← JS、CSS 打包文件
├── fonts/           ← Geist、Newsreader 等 Web 字体
├── manifest.webmanifest
├── pwa-icon.svg
└── sw.js
```

> ⚠️ **常见错误：** 如果提示 `tsc` 不认识，先运行 `npm install` 再重试。

---

### 步骤 2 — 宝塔面板创建网站

1. 打开宝塔面板，点击左侧 **「网站」**
2. 点击 **「添加站点」**
3. 填写信息：
   - **域名：** 填入你的域名（如 `image.example.com`）；无域名可先填服务器 IP
   - **根目录：** 默认即可（如 `/www/wwwroot/image.example.com`），记住这个路径
   - **PHP版本：** 选 **「纯静态」**（不需要 PHP）
   - **数据库：** 不创建
4. 点击 **「提交」**，站点创建完成

---

### 步骤 3 — 上传构建产物

**方法 1：宝塔文件管理器（网页操作）**

1. 宝塔面板 → **「文件」** → 导航到站点根目录（如 `/www/wwwroot/image.example.com/`）
2. 删除默认生成的 `index.html`（宝塔自动创建的占位文件）
3. 点击 **「上传」** → 选择本地 `dist/` 文件夹内的**所有文件和文件夹**上传
4. 等待上传完成

**方法 2：FTP/SFTP（推荐大文件）**

使用 FileZilla 或 VS Code 的 SFTP 插件：
```
主机:   你的服务器IP
用户名: root（或宝塔面板账号）
密码:   服务器密码
端口:   22（SFTP）
路径:   /www/wwwroot/image.example.com/
```
将本地 `dist/` 内所有内容上传到该路径（注意是 `dist/` **内部内容**，不是 `dist` 文件夹本身）。

---

### 步骤 4 — 配置 Nginx（必须）

宝塔面板 → 「网站」→ 找到刚建的站点 → 点击 **「设置」** → 点击 **「配置文件」**

找到 `location / { ... }` 这一段，替换为：

```nginx
location / {
    root   /www/wwwroot/image.example.com;
    index  index.html;
    try_files $uri $uri/ /index.html;
}

# 字体文件允许跨域（PWA 需要）
location ~* \.(woff2|woff|ttf|eot)$ {
    add_header Access-Control-Allow-Origin *;
    expires 1y;
    access_log off;
}

# 静态资源长期缓存
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

> 路径 `/www/wwwroot/image.example.com` 替换成你实际的站点根目录路径

保存后点击 **「保存」**，Nginx 会自动重载。

---

### 步骤 5 — 验证部署

打开浏览器访问你的域名或服务器 IP，应看到登录页（Axiom 风格的左右两栏布局）。

输入任意有效的 OpenAI 格式 API Key（`sk-...`）即可进入主界面。

---

## 方式 B：服务器端构建（宝塔终端）

### 步骤 1 — 安装 Node.js

1. 宝塔面板 → **「软件商店」** → 搜索 **「Node.js 版本管理器」** → 安装
2. 安装完成后进入 Node.js 管理器，安装版本 **18.x LTS** 或 **20.x LTS**
3. 设置为默认版本

验证安装：
```bash
node -v    # 应显示 v18.x 或 v20.x
npm -v     # 应显示 9.x 或 10.x
```

---

### 步骤 2 — 拉取代码

```bash
# 切到网站目录（替换为实际路径）
cd /www/wwwroot

# 方式 2a：从 GitHub 克隆（如果代码已推送到 GitHub）
git clone https://github.com/你的用户名/gpt_image_playground.git image.example.com

# 方式 2b：或者手动上传整个项目源码（含 PROGRESS.md 等定制文件）
# 使用 FTP 把整个项目源码上传到 /www/wwwroot/image.example.com/
```

---

### 步骤 3 — 安装依赖并构建

```bash
cd /www/wwwroot/image.example.com

# 安装依赖
npm install

# 构建（会生成 dist/ 文件夹）
npm run build
```

> ⚠️ 构建时内存不足（1G 小内存服务器易出现）：
> ```bash
> NODE_OPTIONS="--max-old-space-size=512" npm run build
> ```

---

### 步骤 4 — 创建网站并指向 dist/

1. 宝塔面板 → **「网站」** → **「添加站点」**
2. 域名填入你的域名
3. **根目录**填：`/www/wwwroot/image.example.com/dist`（注意加 `/dist`）
4. PHP 选**纯静态**，不建数据库

然后同样按照 [步骤 4 的 Nginx 配置](#步骤-4--配置-nginx必须)，将路径改为 `dist/` 对应的绝对路径。

---

## 三、配置 HTTPS（推荐）

1. 宝塔面板 → 「网站」→ 站点设置 → **「SSL」**
2. 选 **「Let's Encrypt」** 免费证书
3. 勾选你的域名，点击 **「申请」**
4. 申请成功后开启 **「强制 HTTPS」**

> 前提：域名已正确解析到服务器 IP（DNS A 记录）

---

## 四、常见问题排查

### ❓ 页面空白 / 资源 404

检查 Nginx 根目录路径是否正确，确认 `index.html` 在该目录下：
```bash
ls /www/wwwroot/image.example.com/
# 应看到 index.html、assets/、fonts/ 等
```

### ❓ 字体加载失败（登录页排版错乱）

确认 `fonts/` 文件夹已上传，共 9 个 `.woff2` 文件：
```bash
ls /www/wwwroot/image.example.com/fonts/ | wc -l
# 应输出 9
```

### ❓ 刷新页面返回 404

Nginx 的 `try_files $uri $uri/ /index.html;` 未配置，参考步骤 4 重新添加。

### ❓ npm run build 报错 TypeScript 错误

```bash
# 单独跑类型检查看详细报错
npx tsc --noEmit
```

### ❓ 服务器构建时 npm install 很慢

切换淘宝镜像：
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 五、项目定制说明（给 AI Agent 的注意事项）

本项目在官方开源版本基础上增加了以下改动，**无需额外配置**，构建后自动生效：

| 功能 | 说明 |
|------|------|
| 登录页 | 访问时需先输入 OpenAI API Key 才能进入主界面 |
| API Key 存储 | 勾选"保持登录状态"则存 localStorage，否则仅内存 |
| 预设 API URL | 设置 → API 配置 → API URL 为下拉选择，默认 `https://axiomcode.dev/v1` |
| 字体资源 | `public/fonts/` 内含 9 个 WOFF2 文件，构建后位于 `dist/fonts/`，**必须一起上传** |

---

## 六、目录结构速查

```
项目根目录/
├── src/                    ← 源码
│   ├── lib/auth.ts         ← 登录认证逻辑（新增）
│   ├── components/
│   │   ├── LoginPage.tsx   ← 登录页组件（新增）
│   │   ├── Header.tsx      ← 含退出登录按钮（已改）
│   │   └── SettingsModal.tsx ← API URL 下拉（已改）
│   ├── styles/
│   │   └── axiom-login.css ← 登录页样式（新增）
│   └── App.tsx             ← 登录拦截（已改）
├── public/
│   └── fonts/              ← 9 个 WOFF2 字体文件（新增）
├── dist/                   ← 构建产物（npm run build 后生成）
├── PROGRESS.md             ← 开发进度记录
└── DEPLOY.md               ← 本文件
```

---

*文档版本：2026-06-13 | 项目版本：v0.6.4*

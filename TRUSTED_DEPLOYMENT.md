# 可信企业展示页面部署指南

## 功能说明

可信企业展示页面是一个移动端友好的单页应用，用于展示已认证的可信企业信息。页面包含：

- 🏅 金色认证徽章
- 📋 企业基本信息
- 📄 主体证件信息
- 📝 企业认定说明
- 🔗 分享链接功能

## 部署步骤

### 1. 配置后端API

确保后端API `api/get_trusted_enterprise.php` 已部署并可访问。

### 2. 配置GitHub Pages

1. 将 `github-pages-frontend` 目录内容推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 复制 `config.example.js` 为 `config.js`
4. 修改 `config.js` 中的 `API_BASE_URL` 为你的后端API地址

```javascript
const CONFIG = {
    API_BASE_URL: 'https://你的域名.com',
    // ... 其他配置
};
```

### 3. 在manage后台配置GitHub Pages域名

1. 登录manage后台（SaaS平台管理后台）
2. 进入「系统配置」页面
3. 找到「GitHub Pages 域名（可信企业展示）」配置项
4. 输入你的GitHub Pages地址，例如：`https://your-company.github.io/trusted-enterprises`
5. 点击「保存配置」

> 💡 **重要**：配置保存后，系统会自动使用此域名生成可信企业的分享链接。

### 4. 无需手动修改JS文件

~~之前需要手动编辑 `assets/js/trusted_enterprises.js`，现在不需要了！~~

系统会自动从mange后台的系统配置中读取GitHub Pages域名，并生成分享链接。

## URL访问格式

支持三种URL格式访问可信企业页面：

### 1. Hash模式（推荐用于GitHub Pages）
```
https://your-domain.github.io/trusted.html#/TE68329CA7AE70877B5189A51
```

### 2. 查询参数模式
```
https://your-domain.github.io/trusted.html?chain_id=TE68329CA7AE70877B5189A51
```

### 3. 路径模式（需要服务器配置URL重写）
```
https://your-domain.com/trusted/TE68329CA7AE70877B5189A51
```

## 后台管理功能

在admin后台的"可信企业"菜单中：

1. **查看详情**：点击"详情"按钮查看企业完整信息
2. **复制分享链接**：在详情弹窗中点击"复制"按钮，获取可信企业展示页面链接
3. **分享链接**：将链接分享给客户或在官网、公众号等渠道展示

## 页面特性

### 移动端优化
- 响应式设计，完美适配手机、平板
- 触摸友好的交互体验
- 优雅的加载和错误状态

### 视觉设计
- 金色徽章彰显企业认证身份
- 清晰的信息层次结构
- 专业的配色方案

### 性能优化
- 轻量级设计，快速加载
- 使用Vue.js实现动态数据渲染
- 支持跨域API调用

## 自定义配置

### 修改主题色

编辑 `trusted.html` 中的CSS变量：

```css
/* 主题蓝色 */
color: #1a73e8;

/* 认证绿色 */
background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
```

### 修改徽章样式

在 `trusted.html` 中的SVG图标部分，可以自定义徽章的颜色、形状等。

### 修改认定说明

在后台管理中编辑可信企业时，可以自定义"企业认定说明"内容。

## 注意事项

1. **CORS配置**：确保后端API允许GitHub Pages域名的跨域请求
2. **HTTPS**：GitHub Pages强制使用HTTPS，请确保API也支持HTTPS
3. **企业链ID**：每个可信企业都有唯一的企业链ID（30位字符）
4. **状态检查**：只有状态为"active"的企业信息才能被访问

## 常见问题

### Q: 页面显示"加载失败"？
A: 检查：
- config.js中的API_BASE_URL是否正确
- 后端API是否正常运行
- 浏览器控制台是否有CORS错误

### Q: 如何修改分享链接格式？
A: 编辑 `assets/js/trusted_enterprises.js` 中的 `viewDetail` 函数，修改 `shareLink` 的生成逻辑。

### Q: 能否自定义域名？
A: 可以。在GitHub仓库根目录添加CNAME文件，配置你的自定义域名。

## 技术栈

- **前端框架**：Vue.js 2.x
- **样式**：原生CSS
- **图标**：内联SVG
- **API通信**：Fetch API

## 更新日志

### v1.0.0 (2025-10-27)
- ✅ 初始版本发布
- ✅ 支持可信企业信息展示
- ✅ 支持多种URL访问格式
- ✅ 移动端优化
- ✅ 分享链接功能

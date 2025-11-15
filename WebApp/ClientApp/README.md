# HelloContainer React TypeScript 项目

这是一个集成了 React TypeScript 前端的 ASP.NET Core 项目。

## 项目结构

```
HelloContainer.WebApp/
├── Controllers/
│   └── SpaController.cs          # SPA 控制器
├── ClientApp/                    # React 前端项目
│   ├── src/
│   │   ├── components/
│   │   │   └── ContainerList.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── webpack.config.js
└── Program.cs                    # ASP.NET Core 配置
```

## 启动方式

### 方法1：开发环境（推荐）

1. **启动 ASP.NET Core 后端**：
   ```bash
   cd c:\MySolutions\HelloContainer\WebApp
   dotnet run
   ```

2. **在新终端中启动 React 前端**：
   ```bash
   cd c:\MySolutions\HelloContainer\WebApp\ClientApp
   npm install
   npm start
   ```

3. **访问应用**：
   - React 开发服务器：http://localhost:3000
   - ASP.NET Core SPA 入口：https://localhost:7054/Spa

### 方法2：通过 SpaController 访问

1. **启动 ASP.NET Core**：
   ```bash
   dotnet run
   ```

2. **访问 SPA 控制器**：
   - 开发模式：https://localhost:7054/Spa/Index
   - 会显示引导信息，提示如何启动 React 开发服务器

### 方法3：生产构建

1. **构建 React 应用**：
   ```bash
   cd ClientApp
   npm install
   npm run build
   ```

2. **启动 ASP.NET Core**：
   ```bash
   cd ..
   dotnet run --environment Production
   ```

3. **访问应用**：
   - https://localhost:7054/Spa

## 功能特性

- ✅ React 18 + TypeScript
- ✅ 现代化的 UI 界面
- ✅ 集成 ASP.NET Core 后端 API
- ✅ 开发环境热重载
- ✅ Webpack 5 构建系统
- ✅ 容器管理展示（模拟数据）
- ✅ 错误处理和加载状态

## API 集成

React 应用会尝试调用后端 API：
- `GET /api/containers` - 获取容器列表

如果 API 不可用，会显示模拟数据。

## 开发说明

### 添加新的 React 组件
在 `ClientApp/src/components/` 目录下创建 `.tsx` 文件。

### 修改样式
编辑 `ClientApp/src/index.css` 文件。

### 配置 API 代理
在 `ClientApp/webpack.config.js` 的 `devServer.proxy` 部分配置。

### 构建优化
生产构建会自动进行代码分割和优化。

## 故障排除

1. **React 依赖问题**：
   ```bash
   cd ClientApp
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **端口冲突**：
   - React 开发服务器默认端口：3000
   - ASP.NET Core 默认端口：7054

3. **构建失败**：
   确保已安装 Node.js 16+ 和 npm。
# WebReact

最简的 Next.js React 应用 - 包含最佳实践

## 🚀 技术栈

- **Next.js 15** - React 框架
- **React 19** - 最新版本
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **ESLint** - 代码检查

## 📁 项目结构

```
WebReact/
├── src/
│   ├── app/
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # 可复用组件
│   │   ├── Button.tsx      # 按钮组件
│   │   └── index.ts        # 组件导出
│   └── styles/            # 样式结构
│       ├── variables.css   # CSS 变量
│       ├── components.css  # 组件样式
│       └── utilities.css   # 工具类
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript 配置
├── tailwind.config.js     # Tailwind 配置
└── next.config.js         # Next.js 配置
```

## 🛠️ 快速开始

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 访问 [http://localhost:3000](http://localhost:3000)

## 📜 可用命令

- `npm run dev` - 开发模式
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 代码检查

## 🎯 最佳实践

✅ **已包含的最佳实践：**
- TypeScript 严格模式
- ESLint 代码规范
- Tailwind CSS 样式系统
- Next.js App Router
- 组件化架构
- 样式结构化管理
- 路径别名配置
- 响应式设计
- 现代字体加载

## 🧩 组件使用

```tsx
import { Button } from '@/components'

// 基础用法
<Button>Click me</Button>

// 不同变体
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// 不同尺寸
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

---

简洁、现代、可扩展的 React 应用模板 🎉

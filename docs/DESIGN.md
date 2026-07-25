# Book Echoes 首页设计方案

## 设计理念:杂志封面式布局

采用**最新期突出 + 年份归档**的双层结构,既能吸引访客关注最新内容,又能优雅地组织历史数据。

---

## 页面结构

```
┌─────────────────────────────────────────────────┐
│  📚 Book Echoes Header (Header.tsx)              │
├─────────────────────────────────────────────────┤
│                                                 │
│       [全屏首图轮播区] (HomeHero)                  │
│                                                 │
│      ╔═══════════╗                               │
│      ║   最新期刊  ║ (单张封面或书籍拼贴背景)        │
│      ║   大幅轮播  ║ 每 6 秒自动切换              │
│      ╚═══════════╝                               │
│                                                 │
│           书海回响 (动态书法标题)                    │
│           二零二五年 八月 (期号副标题)              │
│                                                 │
│          [ Enter Issue ] (CTA 按钮)              │
│                                                 │
│                                                 │
│                  关于 / 往期回顾                    │
│                (固定右下角导航)                     │
│                                                 │
│  @ XXX 图书馆                                    │
└─────────────────────────────────────────────────┘
```

**核心组件路径**:
- 首页: `HomeHero` + `HomeNavigation`
- 归档页: `ArchiveContent` + `MagazineCard` + `ArchiveYearNav`

---

## 核心组件

### 1. HomeHero.tsx
**功能**: 全屏首图轮播 + 动态书法标题 + 进入按钮

**特点**:
- 背景: 全屏轮播最新期内的书籍封面图 (每 6 秒自动切换)
- 模糊过渡: 切换时带有 blur(10px) -> blur(0px) 的进出动画
- 封面图叠加: 背景层 `blur-3xl scale-110 opacity-40` + 主体层 `object-contain`
- 书法标题: "书海回响" 四字，使用 `font-hero-title` (青柳隶书)，逐字大小差异排版 (书.响大, 海.回小)
- 副标题: 显示最新期 label (如 "二零二五年 八月")
- CTA 按钮: "Enter Issue" 点击跳转最新期详情页
- 抽象线条背景: 使用 `#C9A063` 的正弦波/垂直线条作为装饰

**样式特征**:
- 背景: `bg-[#1a1a1a]` (墨岩黑)
- 主文字: `#E8E6DC` (宣纸白)
- 交互金: `#C9A063` (流光金)

---

### 2. HomeNavigation.tsx
**功能**: 固定右下角导航

**入口点**:
- 往期回顾 → `/archive`
- 关于 → 打开 AboutOverlay 弹窗
- 底部小字: "书海回响 — 那些被悄悄归还的一本好书" / "@ XXX 图书馆"

**交互**:
- Hover 时文字变为 `#D4A574` (琥珀金) + drop-shadow 光晕
- 进场动画: `delay: 1s` 从下飞入

---

### 3. MagazineCover.tsx (未使用 / Legacy)
**状态**: 组件已实现但未被任何页面引用，属于遗留代码。

**功能**: 根据 1/2/3 期数据智能切换布局
- 单卡片 (1期): 3:4 比例居中，Hover 放大 1.02 倍
- 双卡片 (2期): 网格并排，3D 鼠标跟随 (±5°)
- 三卡片 (3期): 扇形布局，中间 `scale: 1.05`，两侧 `scale: 0.88` + `±8°` + `translateX(±20)`，3D 透视 `1500px`，非焦点卡片 `blur(1px)`

**与 DESIGN 原稿差异**:
- 中心卡片缩放: 实际 `1.05`，原稿设计 `1.2`
- 弹簧动画: `delay: index * 0.15`，`stiffness: 100`

---

### 4. ArchiveTimeline.tsx (未使用 / Legacy)
**状态**: 组件已实现但未被任何页面引用，属于遗留代码。

**原设计功能**: 月份卡片网格 + 年份切换器
- 当年份切换时通过 `router.push(..., { scroll: false })` 无刷新
- 卡片使用 `aspect-[3/4]` + 多图拼贴

---

### 5. ArchiveContent.tsx + MagazineCard.tsx (归档页)
**功能**: 实际归档页主界面 (路由 `/archive`)

**布局**:
- 左侧边栏: `ArchiveYearNav` (年份字盘导航)
- 右侧内容: 顶部 Tabs 切换 → [月份牌 / 睡美人 / 主题卡 / 文学FM]
- 卡片网格: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

**卡片样式 (ArchiveContent 内联)**:
- 暗底 (`#1a1a1a/50`) + `#C9A063` 边框
- 悬停: 边框加粗 + 背景变亮 + 角标外扩
- 右下角大号繁体汉字水印 (如 "捌"、"拾")
- 悬停时水印放大 + 旋转

**MagazineCard 子组件**:
- 封面图用 `object-contain` 展示 (不裁剪)
- 底部信息: Vol 编号 + 书籍数量
- 最新期带 "Latest" 标签 (金色边框)

---

## 数据流设计

### 自动化数据读取
所有数据来自 `public/content/` 文件夹,无需手动配置:

```
public/content/
├── 2025/
│   ├── 2025-09/
│   │   ├── metadata.json      # 书籍列表
│   │   └── {书目条码}/
│   │       └── {书目条码}_thumb.jpg
│   ├── 2025-08/
│   └── ...
├── 2024/
│   └── 2024-12/
├── subject/             # 可选: 主题卡
├── new/                 # 可选: 睡美人 (映射为 sleeping_beauty)
└── literature/          # 可选: 文学FM
```

### getMonths() 函数
位于 [lib/content.ts](lib/content.ts:273-291)

**功能**:
1. 调用 `getArchiveData()` 读取所有年份数据
2. 展平所有月份 (不 incl. 主题卡 / 睡美人 / 文学FM)
3. 按 ID (日期) 倒序排列
4. 自动计算 Vol 编号: 最新期刊 = `Vol. {totalMonths}`，越旧越小

**关键代码**:
```typescript
export async function getMonths(): Promise<MonthData[]> {
  const archiveData = await getArchiveData();
  let allMonths: ArchiveItem[] = [];
  archiveData.forEach(yearData => {
    allMonths.push(...yearData.months);
  });
  allMonths.sort((a, b) => b.id.localeCompare(a.id));
  const totalMonths = allMonths.length;
  return allMonths.map((item, index) => ({
    ...item,
    vol: `Vol. ${totalMonths - index}`
  }));
}
```

**首页数据分配**:
```typescript
const latestMonth = months.length > 0 ? months[0] : null; // 仅取最新一期
// 不使用 archiveMonths，归档内容在 /archive 路由展示
```

---

## 扩展性设计

### 处理几十个月份的策略

| 页面 | 策略 |
|---------|-----|
| 首页 | 仅展示最新一期轮播,无需分页 |
| 归档页 `/archive` | 按年份分类 + 类型 Tabs (月份牌 / 睡美人 / 主题卡 / 文学FM) |

### 归档页数据分页
- **按年筛选**: 左侧垂直年份字盘导航，仅加载当前年份数据
- **按类型筛选**: Tabs 切换当前年份下的月份、主题卡、睡美人、文学FM
- **懒加载图片**: Next.js Image 组件自动优化

## 用户体验细节

### 视觉层次
1. **首页首图**: 全屏书籍轮播,动态书法标题 (最高优先级)
2. **归档页年份导航**: 垂直字盘,激活年份放大 + 金色指示线
3. **归档卡片**: 暗底金框,大号繁体水印,统一尺寸网格

### 交互反馈
- 首页首图自动轮播 (6s/张),进出带 blur 动画
- 归档卡 Hover 时角标外扩、背景变亮、水印缩放旋转
- 年份字盘随滚轮/点击切换,非激活年份模糊过渡

### 信息密度
- 首页: 仅展示期 label + Enter 按钮
- 归档卡片: 期号、Vol 编号、书籍数量、技术标签
- 归档页底部统计: 当前年份总期数、总书籍数

---

## 添加新数据的流程

### 操作步骤
1. 在 `public/content/` 下找到对应年份文件夹,如 `2025/`
2. 在年份文件夹内创建新期数文件夹,如 `2025-10`
3. 添加 `metadata.json` 和书籍文件夹 (每个书籍需包含图片)
4. 刷新首页即可在轮播中看到新内容; 归档页会自动识别新年份

### 自动化行为
- ✅ 自动识别新年份
- ✅ 自动添加到归档页年份选择器
- ✅ 自动计算 Vol 编号 (全局倒序)
- ✅ 自动提取预览图 (多图拼贴)
- ✅ 最新一期自动置顶轮播

---

## 技术栈

- **框架**: Next.js 15 (App Router)
- **动画**: Framer Motion
- **样式**: Tailwind CSS + CSS Variables
- **类型**: TypeScript
- **数据源**: 文件系统(Node.js fs API)

---

## 未来可选增强

- [ ] 搜索功能(按书名/作者/年份)
- [ ] 卡片视图 / 列表视图切换
- [ ] 月份详情页预加载(Link prefetch)
- [ ] 深色模式主题切换
- [ ] 年份范围筛选器(如 2020-2023)
- [ ] VR 卡片查看模式(利用现有 3D 效果)
- [ ] 触摸设备陀螺仪联动(移动端倾斜卡片)
- [ ] 卡片翻转效果(显示背面统计信息)

---

## 实现记录

### 2025-01-22: 三卡片布局升级 (未并入主页面)
- 实现了智能1-3卡片自适应布局 (1/2/3期)
- 新增 `SingleCard`/`DoubleCard`/`TripleCard` 子组件
- 实现高级 3D 动效:
  - 鼠标跟随倾斜
  - 扇形布局 (中间放大 1.05 倍,两侧倾斜 ±8°)
  - 深度模糊 (非焦点卡片 blur(1px))
  - 弹簧动画进场 (stiffness: 100)
- **注意**: 该组件 (`MagazineCover.tsx`) 目前未被首页或归档页使用,属于遗留代码

### 2025-xx: 首页重构为 HomeHero 全屏轮播
- 首页改由 `HomeHero` 主导: 全屏背景轮播 + 动态书法标题 + CTA 按钮
- 不再使用 MagazineCover 展示最新期刊
- 底部导航拆分为 `HomeNavigation` (固定右下角)

### 归档页重构
- 归档页(`/archive`) 采用 `ArchiveContent` + `MagazineCard` + `ArchiveYearNav`
- 支持多类型 Tabs: 月份牌 / 睡美人 / 主题卡 / 文学FM
- 大号繁体汉字水印 + 暗底金框卡片

### 配色迁移
- 页面主体大面积结构色由暗红 (`#8B3A3A`) 迁移为金色 (`#C9A063`)
- 归档页、About 弹窗、按钮等交互色统一为黑金体系
- 印泥红 (`#8B3A3A`) 现仅保留为 MagazineCover "最新期" 标签等窄小语义使用

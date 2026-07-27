# 修改套路卡片封面样式

> **Workspace:** /Users/bytedance/analysis_new/0720

---

**User**

`/Users/bytedance/analysis_new/0720/demo1搭建过程.md` 是搭建 `/Users/bytedance/analysis_new/0720/demo_5` 时我与trae的会话纪要（会话里的demo_1其实就是demo_5），请在 `/Users/bytedance/analysis_new/0720/demo_5` 的基础上，将套路卡片的封面改为多素材的样式 `/Users/bytedance/analysis_new/0720/多素材.png` （可供参考，即在封面左端和右端分别添加向左、向右的箭头，在封面下方添加封面选择定位点），点击箭头或定位点，封面的主区域切换成另一个封面

**Assistant**

我会先确认项目结构和套路卡片组件的位置，再查看参考图的尺寸与现有封面实现，之后直接在 `demo_5` 里改交互和样式。

项目是一个 Vite/React 应用，套路卡片组件大概率在 `src/components/RoutineCard.tsx`，我现在读这个组件和相关数据结构，确定封面图片是从哪里来的。

现有封面只渲染 `group.coverItem` 的视频或图片，没有轮播状态。参考图的核心是左右箭头和底部定位点，所以我会把状态放进 `Cover` 组件，用当前套路组里的多个 `items` 作为可切换封面源。

我会只改 `RoutineCard.tsx`：加入轮播状态、左右按钮、底部定位点，并确保点击这些控件不会触发卡片“查看详情”的点击事件。对于当前只有一个素材的套路，我会补充同源生成的替代封面 prompt，让箭头和定位点始终能切换出不同封面。

改动已经落到组件里了。接下来我会跑 TypeScript 构建检查，确认新增的 React state、事件和类型没有引入编译问题。

系统 PATH 里没有 `npm`，但项目自带了 `.tooling/bin/npm`；我会用项目内置的 Node 工具链继续检查。这个目录也不是 git 仓库，所以我不会依赖 `git diff`。

内置 `npm` 脚本通过 `env node` 找 Node，需要把 `.tooling/bin` 临时加入 PATH。我会用这个方式重跑检查。

项目自带的 `npm` 包装脚本在当前 ESM 配置下不能直接跑，但 `node` 本身可用。我会绕过 npm，直接调用本地 TypeScript 编译器做同等检查。

TypeScript 检查和生产构建都通过了。构建命令也同步刷新了 `dist` 输出，便于直接预览构建产物。

检查输出里我注意到标题行原本缩进不一致，虽然不影响编译，但我顺手把这个小格式问题修正掉，避免后续 lint 或阅读时分散注意力。

我改了源码后会再跑一次编译和构建，保证 `src` 与 `dist` 都对应最新状态。

已完成。主要改在 [src/components/RoutineCard.tsx](file:///Users/bytedance/analysis_new/0720/demo_5/src/components/RoutineCard.tsx#L86-L204)：

- 套路卡片封面支持多封面切换。
- 封面左右两侧新增上一张/下一张箭头。
- 封面底部新增定位点，点击可切换到对应封面。
- 箭头和定位点点击时会阻止卡片详情点击事件。
- 如果某个套路当前只有 1 个素材，会基于原封面补充 2 个替代封面 prompt，保证切换交互可见。
- 已重新构建 `dist` 产物。

验证已通过：

```bash
./.tooling/bin/node ./node_modules/typescript/bin/tsc -b --noEmit
./.tooling/bin/node ./node_modules/eslint/bin/eslint.js src/components/RoutineCard.tsx
./.tooling/bin/node ./node_modules/vite/bin/vite.js build
```

补充说明：项目里的 `npm` 包装脚本在当前环境下会因为 ESM/`require` 问题失败，所以我直接调用了本地 `node` + 对应工具入口完成检查和构建。

---

**User**

我打开 `/Users/bytedance/analysis_new/0720/demo_5/即创工作台方案1-单文件.html` ，套路卡片还是没有多素材样式

**Assistant**

你打开的是项目里的单文件版本，不是刚才 Vite 构建出的 `src/dist` 页面；我会直接检查并同步修改 `即创工作台方案1-单文件.html` 里的套路卡片实现。

这个单文件 HTML 看起来是之前打包内联出来的产物，里面的 JS/CSS 都被压缩了，手工补丁风险很高。项目已有 `scripts/build-standalone.mjs`，我会用它从最新源码重新生成单文件版本。

脚本确认会把当前 `dist` 的 JS/CSS 内联回你打开的那个 HTML 文件。我现在执行完整流程：类型检查、构建、生成单文件。

`dist` 已经是最新的多素材版本；接下来把它内联写回 `即创工作台方案1-单文件.html`。

单文件已经重新生成。为了确认你打开的 HTML 确实包含新交互，我会在文件里查找新增的“上一张封面/下一张封面/切换到第”这些标识。

`rg` 命中了，但因为 HTML 是一整行并夹着大段 base64，输出不适合阅读。我再用只输出匹配词的方式确认。

已处理。你打开的 [即创工作台方案1-单文件.html](file:///Users/bytedance/analysis_new/0720/demo_5/即创工作台方案1-单文件.html) 是独立打包文件，之前只改了 `src` 和 `dist`，没有重新生成这个单文件。

我已经从最新源码重新执行：

```bash
./.tooling/bin/node ./node_modules/typescript/bin/tsc -b --noEmit
./.tooling/bin/node ./node_modules/vite/bin/vite.js build
./.tooling/bin/node scripts/build-standalone.mjs
```

并确认单文件里已经包含：

```text
上一张封面
下一张封面
切换到第
cover-2
cover-3
```

现在重新刷新或重新打开 `即创工作台方案1-单文件.html`，套路卡片封面应该能看到左右箭头和底部定位点。

---

**User**

多素材样式只对“轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导”这种封面显示为异常封面的做功，其他还是保留原来的单素材样式，如轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导

**Assistant**

明白，这次要把多素材轮播收窄到异常封面的那类套路，其他套路恢复成原来的单封面展示。我先确认目标套路在数据里的唯一性，然后改 `RoutineCard.tsx` 并重新生成单文件 HTML。

目标套路在数据里是第 5 条，其他示例套路是第 1 条。现在我会加一个白名单，只让第 5 条启用多素材封面，其余套路 `slides` 只返回原始 `coverItem`，因此不会出现箭头和定位点。

源码已收窄到指定套路。接下来跑类型检查、构建，并重新生成你实际打开的单文件 HTML。

检查和构建通过了。我现在把最新构建内联回 `即创工作台方案1-单文件.html`，这样你直接打开单文件也会看到同样效果。

单文件已更新。最后我做一次轻量确认：新白名单逻辑和单文件里的目标文案都已存在。

已调整为只对这条套路启用多素材样式：

`轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导`

其他套路，包括你举例的：

`轻剧情/互动演绎›外观/细节展示›参数/信息说明›转化引导`

会保留原来的单素材封面样式，不显示左右箭头和底部定位点。

改动位置：[RoutineCard.tsx](file:///Users/bytedance/analysis_new/0720/demo_5/src/components/RoutineCard.tsx#L10-L11)，并已重新生成 [即创工作台方案1-单文件.html](file:///Users/bytedance/analysis_new/0720/demo_5/即创工作台方案1-单文件.html)。

验证已通过：TypeScript 检查、ESLint 单文件检查、Vite 构建、standalone HTML 生成。

---

**User**

1. 解决掉“轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导”封面异常的问题，该套路对应的视频可以在 `/Users/bytedance/analysis_new/0720/assets` 里随便挑几个，套路卡片上的封面取对应视频的首帧 2. "轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导"、“悬念/反问钩子+轻剧情/互动演绎›促销利益信息›转化引导”、“悬念/反问钩子›参数/信息说明›促销利益信息›转化引导”、“悬念/反问钩子+轻剧情/互动演绎›外观/细节展示›转化引导”、“悬念/反问钩子›外观/细节展示›参数/信息说明›转化引导”也都要弄成多素材样式，也要解决”封面异常的问题，套路对应的视频可以在 `/Users/bytedance/analysis_new/0720/assets` 里随便挑几个

**Assistant**

我会把这次改成“指定套路使用本地视频首帧作为多素材封面”，而不是继续用生成图 prompt。先确认当前组件逻辑后，直接加套路到本地视频列表的映射，再重建单文件。

我会把这五条套路都映射到 `/assets` 下的本地 mp4，每条给 3 个视频素材；轮播封面直接渲染暂停的视频元素，浏览器会展示视频首帧，不再走生成图。

源码已改完：五条指定套路会直接使用本地视频素材轮播，其他套路仍是单素材封面。接下来跑类型检查、lint、构建，再生成单文件 HTML。

检查和构建都通过了。我会把最新构建内联回你打开的 `即创工作台方案1-单文件.html`。

单文件已重新生成。最后我检查一下 HTML 中是否包含五条套路名和本地视频路径，确保不是只改了源码。

确认结果显示五条套路都进了单文件；本地视频路径在源码中是通过 `assetVideoBase` 组装的，构建后会随逻辑一起进入 HTML。现在可以刷新单文件查看。已完成这两项调整：

1. `轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导` 不再使用异常生成封面，改为使用 `/Users/bytedance/analysis_new/0720/assets` 下本地视频素材，卡片封面展示视频首帧。

2. 以下 5 条套路都已启用多素材样式，每条配置了 3 个本地视频素材，可通过左右箭头和底部定位点切换：
`轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导`
`悬念/反问钩子+轻剧情/互动演绎›促销利益信息›转化引导`
`悬念/反问钩子›参数/信息说明›促销利益信息›转化引导`
`悬念/反问钩子+轻剧情/互动演绎›外观/细节展示›转化引导`
`悬念/反问钩子›外观/细节展示›参数/信息说明›转化引导`

改动在 [RoutineCard.tsx](file:///Users/bytedance/analysis_new/0720/demo_5/src/components/RoutineCard.tsx#L10-L36)，并已重新生成 [即创工作台方案1-单文件.html](file:///Users/bytedance/analysis_new/0720/demo_5/即创工作台方案1-单文件.html)。

验证通过：TypeScript、ESLint、Vite build、standalone HTML 生成。

---

**User**

`/Users/bytedance/analysis_new/0720/demo_5` 内容类型为素材时，请： 
 1. 删除素材卡片「套路素材」的标签 
 2. 素材卡片上显示的还是套路名称，需要改成素材标题，以下是一些素材标题参考，可以直接用： 数学救星朱韬，初中数学不再难 
 真的后悔没有早点用皂洗脸，趁着活动划算快冲 
 要是早知道有它，就不会被这些问题困扰这么久了 
 快开学防晒赶紧备！别等娃晒出熊猫臂才后悔！ 
 美甲一步胶，不需要底胶封层，轻松做美甲 
 一些有美女感又可以陪我暴走十公里的夏季高跟鞋 
 不会的问题别喊妈！让我来帮助你！ 
 帮子女查一生成就，输入名字，一分钟出结果！ 
 出门旅行住酒店我都会带上这个 
 权威期刊《Cell》实锤，脱发根源，是毛囊没了 
 期末物理复盘查漏补缺！ 
 装修超过这个价就亏了！ 
 • • 求求这玩意千万别停产！ 
 3. 素材卡片所有的封面都异常，素材对应的视频可以在 `/Users/bytedance/analysis_new/0720/assets` 里面找，素材卡片上的封面取对应视频的首帧

**Assistant**

我会先定位素材卡片组件和素材数据来源，然后把素材模式下的标题、标签和封面源一起改掉，并重新生成单文件版本。

素材卡片由 `InspirationCard.tsx` 单独渲染，所以删除「套路素材」标签不会影响套路/热点卡片。标题来自 `src/data/inspirations.ts` 的 `item.title`，我会在那里替换成你给的素材标题；封面则在素材卡片里改成 `/assets` 本地视频首帧。

数据标题已替换。现在我改素材卡片：移除底部视频类型标签，并把 `<img>` 封面替换为暂停的视频元素，让卡片默认显示本地视频首帧。

素材卡片现在不会再显示「套路素材」标签，封面也改成视频首帧。我顺手把视频选择索引对齐到素材 rank，避免第 1 张素材跳过第 1 个视频。

接下来跑类型检查、lint 和构建；如果通过，再把最新产物内联回你打开的单文件 HTML。

检查和构建已通过。我现在重新生成 `即创工作台方案1-单文件.html`，确保你直接打开单文件时也能看到素材页改动。

单文件已更新。最后我检查关键文本和视频路径是否进入产物，同时确认素材卡片组件里不再引用 `Play` 标签。

已完成素材页调整，并重新生成了 [即创工作台方案1-单文件.html](file:///Users/bytedance/analysis_new/0720/demo_5/即创工作台方案1-单文件.html)。

改动内容：

- 素材卡片移除了底部「套路素材」标签。
- 素材卡片标题改为你给的素材标题列表，位置在 [src/data/inspirations.ts](file:///Users/bytedance/analysis_new/0720/demo_5/src/data/inspirations.ts#L32-L45)。
- 素材卡片封面不再用异常生成图，改为 `/Users/bytedance/analysis_new/0720/assets` 下本地视频首帧，位置在 [src/components/InspirationCard.tsx](file:///Users/bytedance/analysis_new/0720/demo_5/src/components/InspirationCard.tsx#L7-L24)。

已验证通过：

```bash
tsc -b --noEmit
eslint src/components/InspirationCard.tsx src/data/inspirations.ts
vite build
scripts/build-standalone.mjs
```

刷新或重新打开单文件后，切到「素材」内容类型即可看到更新。

---


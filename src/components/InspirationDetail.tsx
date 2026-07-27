import { ArrowLeft, BarChart3, ChevronRight, Clock3, Copy, Film, Heart, Play, ShieldCheck, WandSparkles, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { InspirationItem } from '@/types'

function imageUrl(prompt: string) {
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`
}

const progressSegments = [
  { label: '钩子开场', color: '#7657ff', start: 0 },
  { label: '卖点验证', color: '#9a67ff', start: 3 },
  { label: '使用动作', color: '#3b82f6', start: 6 },
  { label: '社会证明', color: '#10b981', start: 9 },
  { label: '促销利益', color: '#f59e0b', start: 12 },
]

const timeline = [
  { label: '点击分布', value: '180.36k' },
  { label: '点赞分布', value: '7.02k' },
  { label: '评论分布', value: '611' },
  { label: '转发分布', value: '616' },
  { label: '关注分布', value: '3.24k' },
  { label: '流失分布', value: '13,444.70k' },
]

const storyboardSegments = [
  { title: '镜头1：专家背书', time: '0~13s', desc: '借权威身份或专业口吻建立信任，快速说明问题背景。' },
  { title: '镜头2：痛点放大', time: '13~27s', desc: '呈现用户高频困扰，强化继续观看的动机。' },
  { title: '镜头3：产品入场', time: '27~39s', desc: '展示商品主体和核心使用动作，建立素材记忆点。' },
  { title: '镜头4：卖点验证', time: '39~52s', desc: '围绕参数、效果和便利性说明解决方案。' },
  { title: '镜头5：转化引导', time: '52~60s', desc: '用活动、稀缺和行动号召完成点击转化。' },
]

export function InspirationDetail() {
  const selectedItemId = useWorkbenchStore((state) => state.selectedItemId)
  const items = useWorkbenchStore((state) => state.items)
  const contentType = useWorkbenchStore((state) => state.filters.contentType)
  const closeDetail = useWorkbenchStore((state) => state.closeDetail)
  const openGeneratedVideo = useWorkbenchStore((state) => state.openGeneratedVideo)
  const toggleLike = useWorkbenchStore((state) => state.toggleLike)
  const setToast = useWorkbenchStore((state) => state.setToast)
  const initialItem = items.find((entry) => entry.id === selectedItemId)
  const routineItems = useMemo(
    () => (initialItem ? items.filter((item) => item.routineName === initialItem.routineName).sort((a, b) => b.heat - a.heat) : []),
    [initialItem, items],
  )
  const [activeId, setActiveId] = useState(selectedItemId)
  const activeItem = routineItems.find((item) => item.id === activeId) ?? routineItems[0]
  const tertiaryTitle = initialItem?.tertiaryRoutineName ?? initialItem?.routineName ?? ''
  const secondaryTitle = initialItem?.secondaryRoutineName ?? initialItem?.routineName ?? ''

  useEffect(() => {
    setActiveId(selectedItemId)
  }, [selectedItemId])

  if (!initialItem || !activeItem) return null
  const isRoutineView = contentType === 'routine'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#080610]/70 backdrop-blur-sm" onWheel={(event) => event.stopPropagation()}>
      <div className="absolute inset-x-5 bottom-5 top-5 flex min-h-0 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#171220]/96 shadow-[0_34px_120px_rgba(0,0,0,0.55)]">
        {isRoutineView && (
          <TopTrendPanel
            tertiaryTitle={tertiaryTitle}
            secondaryTitle={secondaryTitle}
            item={activeItem}
            routineItems={routineItems}
            detailTitle="套路详情"
            onClose={closeDetail}
          />
        )}

        <div className="grid min-h-0 flex-1 grid-cols-[260px_300px_1fr] overflow-hidden">
          {isRoutineView ? (
            <MaterialList items={routineItems} activeId={activeItem.id} onSelect={setActiveId} />
          ) : (
            <StoryboardList item={activeItem} />
          )}
          <PreviewPane item={activeItem} />
          <DetailContent
            item={activeItem}
            tertiaryTitle={tertiaryTitle}
            secondaryTitle={secondaryTitle}
            routineItems={routineItems}
            isRoutineView={isRoutineView}
            onMoved={() => setToast(`已标记「${activeItem.audience}」素材被搬运`)}
            onLike={() => toggleLike(activeItem.id)}
            onOpenGenerated={() => openGeneratedVideo(activeItem.id)}
          />
        </div>
      </div>
    </div>
  )
}

function MaterialList({ items, activeId, onSelect }: { items: InspirationItem[]; activeId: string; onSelect: (id: string) => void }) {
  return (
    <aside className="min-h-0 overflow-y-auto border-r border-white/8 bg-[#100c19]/86 p-4">
      <div className="mb-3 text-xs font-bold text-[#9a91aa]">相关素材</div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={`grid w-full grid-cols-[64px_1fr] gap-3 rounded-2xl border p-2 text-left transition ${
              activeId === item.id ? 'border-[#7657ff]/70 bg-[#332452]' : 'border-white/8 bg-white/[0.035] hover:bg-white/8'
            }`}
            onClick={() => onSelect(item.id)}
          >
            <img src={imageUrl(item.imagePrompt)} alt={item.audience} className="h-[82px] w-16 rounded-xl object-cover" />
            <div className="min-w-0">
              <div className="mb-1 text-[11px] text-[#8f86a7]">素材 {index + 1}</div>
              <div className="line-clamp-2 text-xs font-semibold leading-5 text-white">{item.tertiaryRoutineName ?? item.title}</div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#bfb7d2]">{item.secondaryRoutineName}</div>
              <div className="mt-2 text-[11px] text-[#9d94ad]">热度 {item.heat}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

function StoryboardList({ item }: { item: InspirationItem }) {
  return (
    <aside className="min-h-0 overflow-y-auto border-r border-white/8 bg-[#100c19]/86 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-black text-white">分镜列表</div>
          <div className="mt-1 text-xs text-[#8f86a7]">按视频结构拆解素材片段</div>
        </div>
        <span className="rounded-full bg-[#7657ff]/18 px-2.5 py-1 text-[11px] font-bold text-[#cfc6ff]">{storyboardSegments.length} 段</span>
      </div>
      <div className="space-y-2.5">
        {storyboardSegments.map((segment, index) => (
          <button
            key={segment.title}
            className={`group w-full rounded-2xl border p-3 text-left transition ${
              index === 0 ? 'border-[#7657ff]/70 bg-[#332452]' : 'border-white/8 bg-white/[0.035] hover:border-[#7657ff]/45 hover:bg-white/8'
            }`}
          >
            <div className="flex gap-3">
              <div className="relative h-[74px] w-[58px] shrink-0 overflow-hidden rounded-xl bg-black">
                {item.videoSrc ?? item.detailVideoSrc ? (
                  <video src={item.videoSrc ?? item.detailVideoSrc} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img src={imageUrl(item.imagePrompt)} alt={segment.title} className="h-full w-full object-cover" />
                )}
                <span className="absolute left-1 top-1 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-black text-white">{index + 1}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="text-xs font-black leading-5 text-white">{segment.title}</div>
                <div className="mt-2 inline-flex w-fit rounded-lg bg-[#7657ff]/18 px-2 py-1 text-[11px] font-bold leading-4 text-[#cfc6ff]">
                  {segment.time}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

function PreviewPane({ item }: { item: InspirationItem }) {
  const videoSrc = item.videoSrc ?? item.detailVideoSrc
  const videoRef = useRef<HTMLVideoElement>(null)

  const seekTo = (seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = seconds
    video.play().catch(() => undefined)
  }

  return (
    <aside className="min-h-0 overflow-y-auto border-r border-white/8 bg-[#100c19]/70 p-5">
      <div className="relative mx-auto aspect-[9/16] max-h-[390px] overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_22px_70px_rgba(0,0,0,0.45)]">
        {videoSrc ? (
          <video ref={videoRef} src={videoSrc} className="h-full w-full object-cover" controls muted playsInline preload="metadata" />
        ) : (
          <img src={imageUrl(item.imagePrompt)} alt={item.audience} className="h-full w-full object-cover" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/18" />
        {!videoSrc && (
          <button className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/18 text-white backdrop-blur transition hover:bg-[#7657ff]">
            <Play size={26} className="ml-1 fill-white" />
          </button>
        )}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4">
          <span className="rounded-lg bg-black/55 px-2.5 py-1 text-xs font-bold text-white">视频名称：{item.materialName ?? item.audience}</span>
          <p className="mt-3 line-clamp-3 text-sm font-semibold leading-5 text-white">{item.tertiaryRoutineName ?? item.secondaryRoutineName ?? item.title}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-[#171220] p-3">
        <div className="mb-3 flex items-center justify-between text-xs text-[#9188a6]">
          <span>素材-套路进度条</span>
          <span>点击色块定位视频</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-white/8">
          {progressSegments.map((segment) => (
            <button
              key={segment.label}
              className="h-full flex-1 transition hover:brightness-125"
              style={{ backgroundColor: segment.color }}
              onClick={() => seekTo(segment.start)}
              aria-label={`定位到${segment.label}`}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2 text-[10px] text-[#a69db6]">
          {progressSegments.map((segment) => (
            <span key={segment.label} className="flex items-center gap-1">
              <i className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

function TopTrendPanel({
  tertiaryTitle,
  secondaryTitle,
  item,
  routineItems,
  detailTitle,
  onClose,
}: {
  tertiaryTitle: string
  secondaryTitle: string
  item: InspirationItem
  routineItems: InspirationItem[]
  detailTitle: string
  onClose: () => void
}) {
  const aggregate = getRoutineAggregate(routineItems)

  return (
    <section className="h-[29%] min-h-[230px] flex-none overflow-hidden border-b border-white/8 bg-[#100c19]/58 px-5 py-3">
      <div className="mb-3 flex h-9 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button className="detail-icon-button h-9 w-9" onClick={onClose} aria-label="返回灵感广场">
            <ArrowLeft size={17} />
          </button>
          <span className="text-base font-bold text-[#d8d1e8]">{detailTitle}</span>
        </div>
        <button className="detail-icon-button h-9 w-9" onClick={onClose} aria-label="关闭详情">
          <X size={17} />
        </button>
      </div>
      <div className="grid h-[calc(100%-48px)] grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-3">
        <div className="min-h-0 rounded-2xl border border-white/8 bg-[#100c19]/74 p-3">
          <div className="flex h-full content-start gap-2 overflow-y-auto">
            <div className="flex min-w-0 flex-1 flex-wrap content-start gap-2">
              <InlineMetric label="三级套路" value={tertiaryTitle} wide />
              <InlineMetric label="二级套路" value={secondaryTitle} wide />
              <InlineMetric label="热度" value={aggregate.heat.toString()} />
              <InlineMetric label="使用商家数" value={aggregate.merchantCount.toString()} />
              <InlineMetric label="消耗" value={aggregate.spend.toString()} />
              <InlineMetric label="点击率" value={`${aggregate.ctr.toFixed(2)}%`} />
              <InlineMetric label="转化率" value={`${aggregate.conversion.toFixed(2)}%`} />
              <InlineMetric label="3s完播率" value={`${aggregate.completion.toFixed(2)}%`} />
            </div>
          </div>
        </div>
        <TrendChart item={item} routineItems={routineItems} compact />
      </div>
    </section>
  )
}

function DetailContent({
  item,
  tertiaryTitle,
  secondaryTitle,
  routineItems,
  isRoutineView,
  onMoved,
  onLike,
  onOpenGenerated,
}: {
  item: InspirationItem
  tertiaryTitle: string
  secondaryTitle: string
  routineItems: InspirationItem[]
  isRoutineView: boolean
  onMoved: () => void
  onLike: () => void
  onOpenGenerated: () => void
}) {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7 py-5">
        {isRoutineView ? (
          <div className="mb-5">
            <h2 className="max-w-[920px] text-2xl font-black leading-9 text-white">视频名称：{item.materialName ?? item.title}</h2>
            <TagRow item={item} />
          </div>
        ) : (
          <MaterialTitleSection item={item} />
        )}

        {!isRoutineView && <MaterialDataOverview item={item} />}
        {!isRoutineView && <MaterialRoutineSection tertiaryTitle={tertiaryTitle} secondaryTitle={secondaryTitle} item={item} routineItems={routineItems} />}
        <VideoContentSection item={item} />
        {isRoutineView && <MaterialDataOverview item={item} />}

        <section className="detail-section">
          <div className="flex items-center justify-between">
            <SectionTitle icon={<Clock3 size={17} />} title="素材互动时序分布" />
            <button className="flex items-center gap-1 text-xs text-[#9d88ff] hover:text-white">
              查看更多 <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {timeline.map((entry) => (
              <div key={entry.label} className="rounded-xl bg-white/[0.05] p-3">
                <div className="text-[11px] text-[#8f86a7]">{entry.label}</div>
                <div className="mt-1 text-sm font-black text-white">{entry.value}</div>
              </div>
            ))}
          </div>
        </section>
        {!isRoutineView && <StoryboardFragmentSection item={item} />}
      </div>

      <footer className="flex h-[72px] flex-none items-center justify-end gap-3 border-t border-white/8 bg-[#120d1d]/96 px-7">
        <button className="detail-secondary-button" onClick={onMoved}>
          <ShieldCheck size={16} />
          素材被搬运
        </button>
        <button className="detail-secondary-button" onClick={onLike}>
          <Heart size={16} />
          收藏
        </button>
        <button className="detail-secondary-button">
          <Copy size={16} />
          参考生成脚本
        </button>
        <button className="detail-primary-button" onClick={onOpenGenerated}>
          <WandSparkles size={16} />
          参考套路成片
        </button>
      </footer>
    </section>
  )
}

function StoryboardFragmentSection({ item }: { item: InspirationItem }) {
  return (
    <section className="detail-section">
      <div className="mb-3 flex items-center justify-between">
        <SectionTitle icon={<Film size={17} />} title="分镜片段" />
        <button className="flex items-center gap-1 text-xs font-bold text-[#9d88ff] hover:text-white">
          查看完整分镜 <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {storyboardSegments.map((segment, index) => (
          <div key={segment.title} className="overflow-hidden rounded-2xl border border-white/8 bg-[#100c19]/74">
            <div className="relative aspect-[9/12] bg-black">
              {item.videoSrc ?? item.detailVideoSrc ? (
                <video src={item.videoSrc ?? item.detailVideoSrc} className="h-full w-full object-cover" muted playsInline preload="metadata" />
              ) : (
                <img src={imageUrl(item.imagePrompt)} alt={segment.title} className="h-full w-full object-cover" />
              )}
              <span className="absolute left-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-black text-white">分镜 {index + 1}</span>
              <span className="absolute bottom-2 right-2 rounded-lg bg-[#7657ff]/90 px-2 py-1 text-[10px] font-bold text-white">{segment.time}</span>
            </div>
            <div className="p-3">
              <div className="text-xs font-black text-white">{segment.title}</div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#bfb7d2]">{segment.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TagRow({ item }: { item: InspirationItem }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#bfb7d2]">
      {[item.industry, item.videoType, item.source, item.hotNode].map((tag) => (
        <span key={tag} className="rounded-full bg-white/7 px-3 py-1">
          {tag}
        </span>
      ))}
    </div>
  )
}

function MaterialTitleSection({ item }: { item: InspirationItem }) {
  return (
    <section className="detail-section">
      <SectionTitle icon={<Film size={17} />} title="素材标题" />
      <div className="rounded-2xl bg-[#100c19]/74 p-4">
        <h2 className="max-w-[920px] text-2xl font-black leading-9 text-white">视频名称：{item.materialName ?? item.title}</h2>
        <TagRow item={item} />
      </div>
    </section>
  )
}

function MaterialDataOverview({ item }: { item: InspirationItem }) {
  return (
    <section className="detail-section">
      <SectionTitle icon={<BarChart3 size={17} />} title="素材数据概览" />
      <div className="grid grid-cols-4 gap-3">
        <DataCard label="热度" value={item.heat.toString()} delta="+65.20%" />
        <DataCard label="点击率" value={`${item.ctr.toFixed(2)}%`} />
        <DataCard label="转化率" value={`${(item.conversionRate ?? 1.87).toFixed(2)}%`} />
        <DataCard label="3s完播率" value={`${(item.completionRate ?? 35.84).toFixed(2)}%`} />
      </div>
    </section>
  )
}

function MaterialRoutineSection({
  tertiaryTitle,
  secondaryTitle,
  item,
  routineItems,
}: {
  tertiaryTitle: string
  secondaryTitle: string
  item: InspirationItem
  routineItems: InspirationItem[]
}) {
  const aggregate = getRoutineAggregate(routineItems)

  return (
    <section className="detail-section">
      <SectionTitle icon={<Film size={17} />} title="素材套路" />
      <div className="rounded-2xl border border-white/8 bg-[#100c19]/74 p-4">
        <div className="text-sm font-black leading-6 text-white">{tertiaryTitle}</div>
        <div className="mt-1 text-xs leading-5 text-[#bfb7d2]">{secondaryTitle}</div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          <DataCard compact label="总热度" value={aggregate.heat.toString()} />
          <DataCard compact label="使用商家数" value={aggregate.merchantCount.toString()} />
          <DataCard compact label="平均点击率" value={`${aggregate.ctr.toFixed(2)}%`} />
          <DataCard compact label="平均转化率" value={`${aggregate.conversion.toFixed(2)}%`} />
        </div>
        <div className="mt-4">
          <TrendChart item={item} routineItems={routineItems} />
        </div>
      </div>
    </section>
  )
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
      {icon}
      {title}
    </h3>
  )
}

function DataCard({ label, value, delta, compact = false }: { label: string; value: string; delta?: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-[#100c19]/74 ${compact ? 'p-3' : 'p-4'}`}>
      <div className="text-xs text-[#9188a6]">{label}</div>
      <div className={`${compact ? 'mt-1 text-xl' : 'mt-2 text-2xl'} font-black text-white`}>{value}</div>
      {delta && <div className="mt-1 text-xs font-semibold text-[#71f0b0]">{delta}</div>}
    </div>
  )
}

function InlineMetric({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`${wide ? 'basis-full' : 'basis-[calc(50%-4px)]'} min-w-0 rounded-xl border border-white/8 bg-[#171220]/88 px-3 py-2`}>
      <span className="text-[11px] font-semibold text-[#9188a6]">{label}：</span>
      <span className="text-[12px] font-black leading-5 text-white">{value}</span>
    </div>
  )
}

const trendMetrics = ['热度', '使用商家数', '消耗', '点击率', '转化率', '3s完播率'] as const
const trendRanges = ['近7天', '近14天', '近30天'] as const

function VideoContentSection({ item }: { item: InspirationItem }) {
  const blocks = [
    { title: '开场钩子', desc: '用限时问题切入，快速点明用户痛点，引导继续观看。' },
    { title: '卖点展开', desc: '围绕外观、参数、使用场景做连续展示，突出商品核心利益。' },
    { title: '信任证明', desc: '加入真实体验、评论反馈和前后对比，增强种草可信度。' },
    { title: '转化引导', desc: '以福利、库存和行动号召收束，推动点击与下单。' },
  ]

  return (
    <section className="detail-section">
      <SectionTitle icon={<Film size={17} />} title="视频内容" />
      <div className="rounded-2xl border border-white/8 bg-[#100c19]/74 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-white">视频名称：{item.materialName ?? item.title}</div>
            <div className="mt-1 text-xs text-[#9188a6]">AI 拆解该素材内容结构，以下内容为 mock 示例</div>
          </div>
          <span className="rounded-full bg-[#7657ff]/18 px-3 py-1 text-xs font-bold text-[#cfc6ff]">结构拆解</span>
        </div>
        <div className="grid gap-3">
          {blocks.map((block, index) => (
            <div key={block.title} className="grid grid-cols-[82px_1fr] gap-3 rounded-2xl bg-white/[0.045] p-3">
              <div className="rounded-xl bg-[#7657ff]/18 px-3 py-2 text-center text-xs font-black text-[#d8d0ff]">
                片段 {index + 1}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{block.title}</div>
                <div className="mt-1 text-xs leading-5 text-[#bfb7d2]">{block.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrendChart({ item, routineItems, compact = false }: { item: InspirationItem; routineItems: InspirationItem[]; compact?: boolean }) {
  const [metric, setMetric] = useState<(typeof trendMetrics)[number]>('热度')
  const [range, setRange] = useState<(typeof trendRanges)[number]>('近7天')
  const aggregate = getRoutineAggregate(routineItems)
  const days = Number(range.match(/\d+/)?.[0] ?? 7)
  const values = buildTrendValues(metric, days, aggregate, item)
  const max = Math.max(...values) || 1
  const min = Math.min(...values)
  const span = Math.max(1, max - min)
  const points = values
    .map((value, index) => {
      const x = 28 + (index * 584) / Math.max(1, values.length - 1)
      const y = 176 - ((value - min) / span) * 128
      return `${x},${y}`
    })
    .join(' ')
  const dateLabels = buildDateLabels(days)

  if (compact) {
    return (
      <div className="grid h-full min-h-0 grid-cols-[330px_1fr] gap-3 rounded-2xl border border-white/8 bg-[#100c19]/74 p-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-base font-bold text-white">
            <BarChart3 size={17} />
            套路趋势曲线
          </h3>
          <div className="mt-1 text-xs text-[#9188a6]">纵轴：{metric} · 横轴：日期</div>
          <div className="mt-3 grid gap-2">
            <SegmentedControl compact title="纵轴" options={trendMetrics} value={metric} onChange={(nextMetric) => setMetric(nextMetric)} />
            <SegmentedControl compact title="横轴" options={trendRanges} value={range} onChange={(nextRange) => setRange(nextRange)} />
          </div>
        </div>
        <TrendSvg metric={metric} values={values} max={max} min={min} span={span} points={points} dateLabels={dateLabels} compact />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-[#100c19]/74 p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <BarChart3 size={16} />
          套路趋势曲线
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl title="纵轴指标" options={trendMetrics} value={metric} onChange={(nextMetric) => setMetric(nextMetric)} />
          <SegmentedControl title="横轴范围" options={trendRanges} value={range} onChange={(nextRange) => setRange(nextRange)} />
        </div>
      </div>
      <TrendSvg metric={metric} values={values} max={max} min={min} span={span} points={points} dateLabels={dateLabels} />
    </div>
  )
}

function TrendSvg({
  metric,
  values,
  max,
  min,
  span,
  points,
  dateLabels,
  compact = false,
}: {
  metric: (typeof trendMetrics)[number]
  values: number[]
  max: number
  min: number
  span: number
  points: string
  dateLabels: string[]
  compact?: boolean
}) {
  return (
    <div className={`${compact ? 'h-full min-h-0 p-2' : 'p-3'} rounded-2xl bg-[#171220]/78`}>
      <div className="mb-2 flex items-center justify-between text-xs text-[#9d94ad]">
        <span>{metric}</span>
        <span>{dateLabels[0]} - {dateLabels[dateLabels.length - 1]}</span>
      </div>
      <svg viewBox="0 0 640 220" className={`${compact ? 'h-[132px]' : 'h-[220px]'} w-full`}>
        {[48, 80, 112, 144, 176].map((y) => (
          <line key={y} x1="28" x2="612" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
        ))}
        <polyline points={points} fill="none" stroke="#8f6bff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {values.map((value, index) => {
          const x = 28 + (index * 584) / Math.max(1, values.length - 1)
          const y = 176 - ((value - min) / span) * 128
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#ffffff" stroke="#8f6bff" strokeWidth="3" />
        })}
        <text x="28" y="27" fill="#b8afc8" fontSize="11">
          {formatTrendValue(max, metric)}
        </text>
        <text x="28" y="200" fill="#b8afc8" fontSize="11">
          {formatTrendValue(min, metric)}
        </text>
      </svg>
      <div className="-mt-1 grid grid-cols-3 gap-2 text-[11px] text-[#8f86a7]">
        <span>{dateLabels[0]}</span>
        <span className="text-center">{dateLabels[Math.floor(dateLabels.length / 2)]}</span>
        <span className="text-right">{dateLabels[dateLabels.length - 1]}</span>
      </div>
    </div>
  )
}

function SegmentedControl<T extends string>({
  title,
  options,
  value,
  onChange,
  compact = false,
}: {
  title: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  compact?: boolean
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-xl border border-white/8 bg-white/[0.04] p-1">
      <span className="shrink-0 px-1.5 text-[11px] font-bold text-[#8f86a7]">{title}</span>
      <div className={`${compact ? 'flex-nowrap overflow-x-auto' : 'flex-wrap'} flex min-w-0 gap-1`}>
        {options.map((option) => (
          <button
            key={option}
            className={`${compact ? 'shrink-0 px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px]'} rounded-lg font-bold transition ${
              value === option ? 'bg-[#7657ff] text-white' : 'text-[#a69db6] hover:bg-white/8 hover:text-white'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function buildTrendValues(
  metric: (typeof trendMetrics)[number],
  days: number,
  aggregate: ReturnType<typeof getRoutineAggregate>,
  item: InspirationItem,
) {
  const base =
    metric === '热度'
      ? aggregate.heat
      : metric === '使用商家数'
        ? aggregate.merchantCount
        : metric === '消耗'
          ? aggregate.spend
          : metric === '点击率'
            ? aggregate.ctr
            : metric === '转化率'
              ? aggregate.conversion
              : aggregate.completion
  const multiplier = metric.includes('率') ? 0.025 : 0.035

  return Array.from({ length: days }, (_, index) => {
    const wave = Math.sin((index + (item.rank ?? 1)) * 0.72) * base * multiplier
    const lift = base * (0.82 + (index / Math.max(1, days - 1)) * 0.28)
    return Math.max(metric.includes('率') ? 0.1 : 1, lift + wave)
  })
}

function buildDateLabels(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const day = 26 - days + index + 1
    return `07/${String(day).padStart(2, '0')}`
  })
}

function formatTrendValue(value: number, metric: (typeof trendMetrics)[number]) {
  return metric.includes('率') ? `${value.toFixed(2)}%` : Math.round(value).toLocaleString('zh-CN')
}

function getRoutineAggregate(items: InspirationItem[]) {
  const count = Math.max(1, items.length)
  const heat = items.reduce((total, current) => total + current.heat, 0)
  const merchantCount = items.reduce((total, current) => total + current.merchantCount, 0)
  const ctr = items.reduce((total, current) => total + current.ctr, 0) / count

  return {
    heat,
    merchantCount,
    spend: Math.round(heat * 1.8 + merchantCount * 24),
    ctr,
    conversion: 1.87 + count * 0.08,
    completion: 35.84 + count * 0.6,
  }
}

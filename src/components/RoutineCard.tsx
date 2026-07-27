import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Heart, WandSparkles } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { RoutineGroup, ViewMode } from '@/types'

function imageUrl(prompt: string) {
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`
}

const assetVideoBase = 'file:///Users/bytedance/analysis_new/0720/assets'

const multiCoverRoutineVideos: Record<string, string[]> = {
  '轻剧情/互动演绎›社会证明›参数/信息说明›促销利益信息›转化引导': [
    `${assetVideoBase}/hot-pack/routine-top1-1.mp4`,
    `${assetVideoBase}/hot-pack/routine-top1-2.mp4`,
    `${assetVideoBase}/hot-pack/routine-top1-3.mp4`,
  ],
  '悬念/反问钩子+轻剧情/互动演绎›促销利益信息›转化引导': [
    `${assetVideoBase}/hot-pack/routine-top2-1.mp4`,
    `${assetVideoBase}/hot-pack/routine-top2-2.mp4`,
    `${assetVideoBase}/hot-pack/shot-top1-1.mp4`,
  ],
  '悬念/反问钩子›参数/信息说明›促销利益信息›转化引导': [
    `${assetVideoBase}/hot-pack/shot-top1-2.mp4`,
    `${assetVideoBase}/hot-pack/shot-top1-3.mp4`,
    `${assetVideoBase}/hot-pack/shot-top2-1.mp4`,
  ],
  '悬念/反问钩子+轻剧情/互动演绎›外观/细节展示›转化引导': [
    `${assetVideoBase}/hot-pack/shot-top3-1.mp4`,
    `${assetVideoBase}/hot-pack/top1-1.mp4`,
    `${assetVideoBase}/hot-pack/top1-2.mp4`,
  ],
  '悬念/反问钩子›外观/细节展示›参数/信息说明›转化引导': [
    `${assetVideoBase}/hot-pack/top1-3.mp4`,
    `${assetVideoBase}/inspiration-pack/carpet-cleaning.mp4`,
    `${assetVideoBase}/inspiration-pack/girl-drinking-milk.mp4`,
  ],
}

export function RoutineCard({ group, viewMode }: { group: RoutineGroup; viewMode: ViewMode }) {
  const openDetail = useWorkbenchStore((state) => state.openDetail)
  const openGeneratedVideo = useWorkbenchStore((state) => state.openGeneratedVideo)
  const toggleLike = useWorkbenchStore((state) => state.toggleLike)
  const isList = viewMode === 'list'
  const favorited = group.items.some((item) => item.liked)
  const tertiaryTitle = group.tertiaryRoutineName ?? group.routineName
  const secondaryTitle = group.secondaryRoutineName ?? group.routineName

  if (isList) {
    return (
      <article className="grid grid-cols-[190px_1fr_130px_120px_140px_auto] items-center gap-4 rounded-[22px] border border-white/10 bg-[#21192f]/82 p-3 shadow-[0_14px_36px_rgba(0,0,0,0.22)]">
        <Cover group={group} compact />
        <div className="min-w-0">
          <h2 className="text-xl font-black text-white">{tertiaryTitle}</h2>
          <div className="mt-2 line-clamp-2 text-xs leading-5 text-[#bfb7d2]">{secondaryTitle}</div>
        </div>
        <Metric label="热度" value={group.heat.toString()} />
        <Metric label="素材数" value={`${group.materialCount}`} />
        <Metric label="使用商家数" value={`${group.merchantCount}`} />
        <div className="flex min-w-[276px] items-center justify-end gap-3">
          <button className="detail-secondary-button" onClick={() => openDetail(group.coverItem.id)}>
            查看详情
          </button>
          <button className="detail-primary-button" onClick={() => openGeneratedVideo(group.coverItem.id)}>
            <WandSparkles size={15} />
            参考套路成片
          </button>
        </div>
      </article>
    )
  }

  return (
    <article
      className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#21192f]/82 shadow-[0_14px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#7a5dff]/55 hover:shadow-[0_20px_58px_rgba(72,48,160,0.26)]"
      role="button"
      tabIndex={0}
      onClick={() => openDetail(group.coverItem.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') openDetail(group.coverItem.id)
      }}
    >
      <div className="p-3 pb-2">
        <h2 className="line-clamp-1 text-[15px] font-black leading-5 text-white">{tertiaryTitle}</h2>
        <div className="mt-1 line-clamp-2 min-h-[38px] text-[11px] leading-[18px] text-[#bfb7d2]">{secondaryTitle}</div>
      </div>
      <Cover group={group} />
      <div className="grid grid-cols-3 gap-1.5 p-3">
        <Metric label="热度" value={group.heat.toString()} />
        <Metric label="素材数" value={`${group.materialCount}`} />
        <Metric label="使用商家数" value={`${group.merchantCount}`} />
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-[88px] flex translate-y-2 items-center justify-between opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[#7657ff]"
          aria-label="收藏套路"
          onClick={(event) => {
            event.stopPropagation()
            toggleLike(group.coverItem.id)
          }}
        >
          <Heart size={16} className={favorited ? 'fill-[#ff6aa9] text-[#ff6aa9]' : ''} />
        </button>
        <button
          className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#7657ff] to-[#9a67ff] px-3 text-xs font-bold text-white shadow-[0_12px_28px_rgba(118,87,255,0.32)]"
          onClick={(event) => {
            event.stopPropagation()
            openGeneratedVideo(group.coverItem.id)
          }}
        >
          <WandSparkles size={14} />
          参考套路成片
        </button>
      </div>
    </article>
  )
}

interface CoverSlide {
  key: string
  title: string
  imagePrompt?: string
  videoSrc?: string
}

function buildCoverSlides(group: RoutineGroup): CoverSlide[] {
  const title = group.tertiaryRoutineName ?? group.routineName
  const baseItem = group.coverItem
  const originalCover = {
    key: baseItem.id,
    title,
    imagePrompt: baseItem.imagePrompt,
    videoSrc: baseItem.videoSrc,
  }

  const videoSources = multiCoverRoutineVideos[group.routineName]
  if (!videoSources) return [originalCover]

  return videoSources.map((videoSrc, index) => ({
    key: `${baseItem.id}-asset-cover-${index + 1}`,
    title: `${title} 封面 ${index + 1}`,
    videoSrc,
  }))
}

function Cover({ group, compact = false }: { group: RoutineGroup; compact?: boolean }) {
  const title = group.tertiaryRoutineName ?? group.routineName
  const slides = useMemo(() => buildCoverSlides(group), [group])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeSlide = slides[activeIndex] ?? slides[0]
  const hasMultipleSlides = slides.length > 1

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length)
  }

  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-black ${compact ? 'h-[132px]' : 'aspect-[1.05]'}`}>
      {activeSlide.videoSrc ? (
        <video
          key={activeSlide.key}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          src={activeSlide.videoSrc}
          muted
          playsInline
          preload="auto"
          onLoadedData={(event) => {
            event.currentTarget.pause()
          }}
          onMouseEnter={(event) => {
            event.currentTarget.play().catch(() => undefined)
          }}
          onMouseLeave={(event) => {
            event.currentTarget.pause()
            event.currentTarget.currentTime = 0
          }}
        />
      ) : (
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={imageUrl(activeSlide.imagePrompt ?? group.coverItem.imagePrompt)} alt={activeSlide.title || title} />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140f20]/82 via-transparent to-black/15" />
      {hasMultipleSlides && (
        <>
          <button
            className={`absolute left-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-black/65 ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
            aria-label="上一张封面"
            onClick={(event) => {
              event.stopPropagation()
              goToSlide(activeIndex - 1)
            }}
          >
            <ChevronLeft size={compact ? 16 : 18} />
          </button>
          <button
            className={`absolute right-2 top-1/2 grid -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-black/65 ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}
            aria-label="下一张封面"
            onClick={(event) => {
              event.stopPropagation()
              goToSlide(activeIndex + 1)
            }}
          >
            <ChevronRight size={compact ? 16 : 18} />
          </button>
          <div
            className={`absolute inset-x-0 bottom-2 flex items-center justify-center ${compact ? 'gap-1' : 'gap-1.5'}`}
            onClick={(event) => event.stopPropagation()}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                className={`rounded-full transition ${
                  index === activeIndex
                    ? compact
                      ? 'h-1.5 w-4 bg-white'
                      : 'h-1.5 w-5 bg-white'
                    : 'h-1.5 w-1.5 bg-white/45 hover:bg-white/75'
                }`}
                aria-label={`切换到第 ${index + 1} 张封面`}
                aria-current={index === activeIndex}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#15101f]/80 px-1.5 py-2">
      <div className="text-[14px] font-black leading-5 text-white">{value}</div>
      <div className="whitespace-nowrap text-[9px] leading-4 text-[#8e86a4]">{label === '热度' ? '🔥 热度' : label}</div>
    </div>
  )
}

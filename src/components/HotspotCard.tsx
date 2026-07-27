import { Heart, WandSparkles } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbenchStore'
import type { HotspotGroup, ViewMode } from '@/types'

function imageUrl(prompt: string) {
  return `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=portrait_4_3`
}

export function HotspotCard({ group, viewMode }: { group: HotspotGroup; viewMode: ViewMode }) {
  const openDetail = useWorkbenchStore((state) => state.openDetail)
  const openGeneratedVideo = useWorkbenchStore((state) => state.openGeneratedVideo)
  const toggleLike = useWorkbenchStore((state) => state.toggleLike)
  const isList = viewMode === 'list'
  const favorited = group.items.some((item) => item.liked)

  if (isList) {
    return (
      <article className="grid grid-cols-[190px_1fr_150px_120px_auto] items-center gap-4 rounded-[22px] border border-white/10 bg-[#21192f]/82 p-3 shadow-[0_14px_36px_rgba(0,0,0,0.22)]">
        <Cover group={group} compact />
        <div className="min-w-0">
          <div className="mb-2 text-xs font-semibold text-[#9d88ff]">热点名称｜接口提供</div>
          <h2 className="text-xl font-black text-white">{group.hotspotName}</h2>
        </div>
        <Metric label="热度" value={group.heat.toString()} />
        <Metric label="素材个数" value={`${group.materialCount}`} />
        <div className="flex min-w-[176px] flex-col justify-center gap-3">
          <button className="detail-secondary-button" onClick={() => openDetail(group.coverItem.id)}>
            查看详情
          </button>
          <button className="detail-primary-button" onClick={() => openGeneratedVideo(group.coverItem.id)}>
            <WandSparkles size={15} />
            参考热点成片
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
        <div className="mb-2 text-[11px] font-semibold text-[#9d88ff]">热点名称｜接口提供</div>
        <h2 className="line-clamp-2 min-h-[42px] text-[15px] font-black leading-5 text-white">{group.hotspotName}</h2>
      </div>
      <Cover group={group} />
      <div className="grid grid-cols-2 gap-2 p-3">
        <Metric label="热度" value={group.heat.toString()} />
        <Metric label="素材个数" value={`${group.materialCount}`} />
      </div>
      <div className="pointer-events-none absolute inset-x-3 bottom-[88px] flex translate-y-2 items-center justify-between opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[#7657ff]"
          aria-label="收藏热点"
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
          参考热点成片
        </button>
      </div>
    </article>
  )
}

function Cover({ group, compact = false }: { group: HotspotGroup; compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-black ${compact ? 'h-[132px]' : 'aspect-[1.05]'}`}>
      <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={imageUrl(group.coverItem.imagePrompt)} alt={group.hotspotName} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#140f20]/82 via-transparent to-black/15" />
      <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
        关联素材封面
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#15101f]/80 px-2.5 py-2">
      <div className="text-[15px] font-black leading-5 text-white">{value}</div>
      <div className="text-[10px] text-[#8e86a4]">{label}</div>
    </div>
  )
}
